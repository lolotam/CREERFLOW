import { getDatabase, generateId, formatDateForDB, stringifyJSON, parseJSON } from '../database';
import type { 
  Job, 
  CreateJobInput, 
  UpdateJobInput, 
  JobFilters, 
  PaginationOptions, 
  PaginatedResult 
} from './types';

export class JobModel {
  private db = getDatabase();

  /**
   * Create a new job
   */
  create(input: CreateJobInput): Job {
    const id = generateId('JOB');
    const now = formatDateForDB();
    
    const stmt = this.db.prepare(`
      INSERT INTO jobs (
        id, title, company, location, country, salary, type, category, 
        experience, description, requirements, benefits, status, featured, 
        applicants_count, posted, match_percentage, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      input.title,
      input.company,
      input.location,
      input.country,
      input.salary || null,
      input.type || 'full-time',
      input.category || null,
      input.experience || null,
      input.description || null,
      input.requirements ? stringifyJSON(input.requirements) : null,
      input.benefits ? stringifyJSON(input.benefits) : null,
      input.status || 'active',
      input.featured ? 1 : 0,
      0, // applicants_count starts at 0
      input.posted || 'Just posted',
      input.match_percentage || null,
      now,
      now
    );
    
    return this.findById(id)!;
  }

  /**
   * Find job by ID
   */
  findById(id: string): Job | null {
    const stmt = this.db.prepare('SELECT * FROM jobs WHERE id = ?');
    const row = stmt.get(id) as Job | undefined;
    
    if (!row) return null;
    
    return this.transformRow(row);
  }

  /**
   * Find all jobs with optional filters and pagination
   */
  findAll(filters: JobFilters = {}, pagination: PaginationOptions = {}): PaginatedResult<Job> {
    const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'DESC' } = pagination;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    
    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }
    
    if (filters.type) {
      conditions.push('type = ?');
      params.push(filters.type);
    }
    
    if (filters.featured !== undefined) {
      conditions.push('featured = ?');
      params.push(filters.featured ? 1 : 0);
    }
    
    if (filters.company) {
      conditions.push('company LIKE ?');
      params.push(`%${filters.company}%`);
    }
    
    if (filters.location) {
      conditions.push('location LIKE ?');
      params.push(`%${filters.location}%`);
    }
    
    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM jobs ${whereClause}`);
    const { count: total } = countStmt.get(...params) as { count: number };
    
    // Get paginated results
    const dataStmt = this.db.prepare(`
      SELECT * FROM jobs 
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `);
    
    const rows = dataStmt.all(...params, limit, offset) as Job[];
    const data = rows.map(row => this.transformRow(row));
    
    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * Update job by ID
   */
  update(input: UpdateJobInput): Job | null {
    const { id, ...updates } = input;
    
    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }
    
    const setClause: string[] = [];
    const params: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'requirements' || key === 'benefits') {
          setClause.push(`${key} = ?`);
          params.push(Array.isArray(value) ? stringifyJSON(value) : value);
        } else if (key === 'featured') {
          setClause.push(`${key} = ?`);
          params.push(value ? 1 : 0);
        } else {
          setClause.push(`${key} = ?`);
          params.push(value);
        }
      }
    });
    
    if (setClause.length === 0) {
      return this.findById(id);
    }
    
    setClause.push('updated_at = ?');
    params.push(formatDateForDB());
    params.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE jobs 
      SET ${setClause.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...params);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  /**
   * Delete job by ID
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM jobs WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Increment applicants count for a job
   */
  incrementApplicantsCount(jobId: string): void {
    const stmt = this.db.prepare(`
      UPDATE jobs 
      SET applicants_count = applicants_count + 1, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(formatDateForDB(), jobId);
  }

  /**
   * Get jobs by status
   */
  findByStatus(status: 'active' | 'paused' | 'closed'): Job[] {
    const stmt = this.db.prepare('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC');
    const rows = stmt.all(status) as Job[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Get featured jobs
   */
  findFeatured(limit: number = 10): Job[] {
    const stmt = this.db.prepare(`
      SELECT * FROM jobs 
      WHERE featured = 1 AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    const rows = stmt.all(limit) as Job[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Search jobs by title or description
   */
  search(query: string, limit: number = 20): Job[] {
    const stmt = this.db.prepare(`
      SELECT * FROM jobs 
      WHERE (title LIKE ? OR description LIKE ?) AND status = 'active'
      ORDER BY 
        CASE 
          WHEN title LIKE ? THEN 1 
          ELSE 2 
        END,
        created_at DESC
      LIMIT ?
    `);
    
    const searchTerm = `%${query}%`;
    const titleMatch = `%${query}%`;
    const rows = stmt.all(searchTerm, searchTerm, titleMatch, limit) as Job[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Transform database row to Job object with parsed JSON fields
   */
  private transformRow(row: Job): Job {
    return {
      ...row,
      featured: Boolean(row.featured),
      requirements: row.requirements || undefined,
      benefits: row.benefits || undefined
    };
  }
}

// Export singleton instance
export const jobModel = new JobModel();

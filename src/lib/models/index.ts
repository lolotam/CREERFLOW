// Export all models and types
export * from './types';

import { getDatabase, generateId, formatDateForDB, stringifyJSON, parseJSON } from '../database';
import type {
  Job,
  CreateJobInput,
  UpdateJobInput,
  JobFilters,
  PaginationOptions,
  PaginatedResult,
  ContentSection,
  CreateContentSectionInput
} from './types';

// ============================================================================
// JOB MODEL
// ============================================================================
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

    if (filters.experience) {
      conditions.push('experience = ?');
      params.push(filters.experience);
    }

    if (filters.country) {
      conditions.push('country = ?');
      params.push(filters.country);
    }

    if (filters.featured !== undefined) {
      conditions.push('featured = ?');
      params.push(filters.featured ? 1 : 0);
    }

    if (filters.search) {
      conditions.push('(title LIKE ? OR description LIKE ? OR company LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
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
          params.push(value as string | number);
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

// ============================================================================
// CONTENT SECTION MODEL
// ============================================================================
export class ContentSectionModel {
  private db = getDatabase();

  /**
   * Create or update content section
   */
  upsert(input: CreateContentSectionInput): ContentSection {
    const now = formatDateForDB();
    
    // Check if content section exists
    const existing = this.findById(input.id);
    
    if (existing) {
      // Update existing
      const stmt = this.db.prepare(`
        UPDATE content_sections 
        SET title = ?, type = ?, content = ?, is_active = ?, updated_at = ?
        WHERE id = ?
      `);
      
      stmt.run(
        input.title,
        input.type,
        input.content,
        input.is_active !== undefined ? (input.is_active ? 1 : 0) : 1,
        now,
        input.id
      );
    } else {
      // Create new
      const stmt = this.db.prepare(`
        INSERT INTO content_sections (id, title, type, content, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        input.id,
        input.title,
        input.type,
        input.content,
        input.is_active !== undefined ? (input.is_active ? 1 : 0) : 1,
        now,
        now
      );
    }
    
    return this.findById(input.id)!;
  }

  /**
   * Find content section by ID
   */
  findById(id: string): ContentSection | null {
    const stmt = this.db.prepare('SELECT * FROM content_sections WHERE id = ?');
    const row = stmt.get(id) as ContentSection | undefined;
    
    if (!row) return null;
    
    return {
      ...row,
      is_active: Boolean(row.is_active)
    };
  }
}

// Export singleton instances
export const jobModel = new JobModel();
export const contentSectionModel = new ContentSectionModel();

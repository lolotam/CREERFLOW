import { getDatabase, generateId, formatDateForDB, stringifyJSON, parseJSON } from '../database';
import type { 
  Application, 
  CreateApplicationInput, 
  UpdateApplicationInput, 
  ApplicationFilters, 
  PaginationOptions, 
  PaginatedResult 
} from './types';

export class ApplicationModel {
  private db = getDatabase();

  /**
   * Create a new application
   */
  create(input: CreateApplicationInput): Application {
    const id = generateId('CF');
    const now = formatDateForDB();
    
    const stmt = this.db.prepare(`
      INSERT INTO applications (
        id, applicant_id, job_id, status, match_score, additional_info,
        applied_at, submitted_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      input.applicant_id,
      input.job_id,
      input.status || 'pending',
      input.match_score || null,
      input.additional_info || null,
      now,
      input.submitted_data ? stringifyJSON(input.submitted_data) : null
    );
    
    return this.findById(id)!;
  }

  /**
   * Find application by ID
   */
  findById(id: string): Application | null {
    const stmt = this.db.prepare('SELECT * FROM applications WHERE id = ?');
    const row = stmt.get(id) as Application | undefined;
    
    if (!row) return null;
    
    return this.transformRow(row);
  }

  /**
   * Find all applications with optional filters and pagination
   */
  findAll(filters: ApplicationFilters = {}, pagination: PaginationOptions = {}): PaginatedResult<Application> {
    const { page = 1, limit = 20, sort_by = 'applied_at', sort_order = 'DESC' } = pagination;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    
    if (filters.job_id) {
      conditions.push('job_id = ?');
      params.push(filters.job_id);
    }
    
    if (filters.applicant_id) {
      conditions.push('applicant_id = ?');
      params.push(filters.applicant_id);
    }
    
    if (filters.min_match_score) {
      conditions.push('match_score >= ?');
      params.push(filters.min_match_score);
    }
    
    if (filters.date_from) {
      conditions.push('applied_at >= ?');
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      conditions.push('applied_at <= ?');
      params.push(filters.date_to);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM applications ${whereClause}`);
    const { count: total } = countStmt.get(...params) as { count: number };
    
    // Get paginated results
    const dataStmt = this.db.prepare(`
      SELECT * FROM applications 
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `);
    
    const rows = dataStmt.all(...params, limit, offset) as Application[];
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
   * Find applications with applicant and job details
   */
  findWithDetails(filters: ApplicationFilters = {}, pagination: PaginationOptions = {}): PaginatedResult<any> {
    const { page = 1, limit = 20, sort_by = 'applied_at', sort_order = 'DESC' } = pagination;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (filters.status) {
      conditions.push('a.status = ?');
      params.push(filters.status);
    }
    
    if (filters.job_id) {
      conditions.push('a.job_id = ?');
      params.push(filters.job_id);
    }
    
    if (filters.applicant_id) {
      conditions.push('a.applicant_id = ?');
      params.push(filters.applicant_id);
    }
    
    if (filters.min_match_score) {
      conditions.push('a.match_score >= ?');
      params.push(filters.min_match_score);
    }
    
    if (filters.date_from) {
      conditions.push('a.applied_at >= ?');
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      conditions.push('a.applied_at <= ?');
      params.push(filters.date_to);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM applications a
      JOIN applicants ap ON a.applicant_id = ap.id
      JOIN jobs j ON a.job_id = j.id
      ${whereClause}
    `);
    const { count: total } = countStmt.get(...params) as { count: number };
    
    // Get paginated results with details
    const dataStmt = this.db.prepare(`
      SELECT 
        a.*,
        ap.first_name, ap.last_name, ap.email, ap.phone, ap.current_position,
        j.title as job_title, j.company, j.location
      FROM applications a
      JOIN applicants ap ON a.applicant_id = ap.id
      JOIN jobs j ON a.job_id = j.id
      ${whereClause}
      ORDER BY a.${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `);
    
    const rows = dataStmt.all(...params, limit, offset);
    const data = rows.map(row => this.transformRowWithDetails(row));
    
    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * Update application by ID
   */
  update(input: UpdateApplicationInput): Application | null {
    const { id, ...updates } = input;
    
    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }
    
    const setClause: string[] = [];
    const params: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'submitted_data') {
          setClause.push(`${key} = ?`);
          params.push(typeof value === 'object' ? stringifyJSON(value) : value);
        } else {
          setClause.push(`${key} = ?`);
          params.push(value);
        }
      }
    });
    
    if (setClause.length === 0) {
      return this.findById(id);
    }
    
    // Add reviewed_at timestamp if status is being updated to reviewed/accepted/rejected
    if (updates.status && ['reviewed', 'accepted', 'rejected'].includes(updates.status)) {
      setClause.push('reviewed_at = ?');
      params.push(formatDateForDB());
    }
    
    params.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE applications 
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
   * Delete application by ID
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM applications WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Find applications by applicant ID
   */
  findByApplicantId(applicantId: string): Application[] {
    const stmt = this.db.prepare(`
      SELECT * FROM applications 
      WHERE applicant_id = ? 
      ORDER BY applied_at DESC
    `);
    const rows = stmt.all(applicantId) as Application[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Find applications by job ID
   */
  findByJobId(jobId: string): Application[] {
    const stmt = this.db.prepare(`
      SELECT * FROM applications 
      WHERE job_id = ? 
      ORDER BY applied_at DESC
    `);
    const rows = stmt.all(jobId) as Application[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Check if applicant already applied for a job
   */
  hasApplied(applicantId: string, jobId: string): boolean {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count 
      FROM applications 
      WHERE applicant_id = ? AND job_id = ?
    `);
    const { count } = stmt.get(applicantId, jobId) as { count: number };
    return count > 0;
  }

  /**
   * Get application statistics
   */
  getStats(): {
    total: number;
    by_status: Array<{ status: string; count: number }>;
    this_month: number;
    avg_match_score: number;
  } {
    // Total count
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM applications');
    const { count: total } = totalStmt.get() as { count: number };
    
    // By status
    const statusStmt = this.db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status 
      ORDER BY count DESC
    `);
    const by_status = statusStmt.all() as Array<{ status: string; count: number }>;
    
    // This month count
    const thisMonthStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM applications 
      WHERE applied_at >= date('now', 'start of month')
    `);
    const { count: this_month } = thisMonthStmt.get() as { count: number };
    
    // Average match score
    const avgScoreStmt = this.db.prepare(`
      SELECT AVG(match_score) as avg_score 
      FROM applications 
      WHERE match_score IS NOT NULL
    `);
    const { avg_score } = avgScoreStmt.get() as { avg_score: number };
    
    return {
      total,
      by_status,
      this_month,
      avg_match_score: Math.round(avg_score || 0)
    };
  }

  /**
   * Transform database row to Application object with parsed JSON fields
   */
  private transformRow(row: Application): Application {
    return {
      ...row,
      submitted_data: row.submitted_data || undefined
    };
  }

  /**
   * Transform database row with applicant and job details
   */
  private transformRowWithDetails(row: any): any {
    return {
      ...this.transformRow(row),
      applicant_name: `${row.first_name} ${row.last_name}`,
      applicant_email: row.email,
      applicant_phone: row.phone,
      applicant_position: row.current_position,
      job_title: row.job_title,
      company: row.company,
      location: row.location
    };
  }
}

// Export singleton instance
export const applicationModel = new ApplicationModel();

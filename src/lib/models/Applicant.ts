import { getDatabase, generateId, formatDateForDB, stringifyJSON, parseJSON } from '../database';
import type { 
  Applicant, 
  CreateApplicantInput, 
  UpdateApplicantInput, 
  ApplicantFilters, 
  PaginationOptions, 
  PaginatedResult 
} from './types';

export class ApplicantModel {
  private db = getDatabase();

  /**
   * Create a new applicant
   */
  create(input: CreateApplicantInput): Applicant {
    const id = generateId('APP');
    const now = formatDateForDB();
    
    const stmt = this.db.prepare(`
      INSERT INTO applicants (
        id, first_name, last_name, email, phone, phone_country_code,
        address_line1, address_line2, city, state, zip_code, country,
        current_position, current_company, years_experience, education,
        skills, certifications, available_start_date, salary_expectation,
        additional_info, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      input.first_name,
      input.last_name,
      input.email,
      input.phone || null,
      input.phone_country_code || null,
      input.address_line1 || null,
      input.address_line2 || null,
      input.city || null,
      input.state || null,
      input.zip_code || null,
      input.country || null,
      input.current_position || null,
      input.current_company || null,
      input.years_experience || null,
      input.education || null,
      input.skills ? stringifyJSON(input.skills) : null,
      input.certifications ? stringifyJSON(input.certifications) : null,
      input.available_start_date || null,
      input.salary_expectation || null,
      input.additional_info || null,
      now,
      now
    );
    
    return this.findById(id)!;
  }

  /**
   * Find applicant by ID
   */
  findById(id: string): Applicant | null {
    const stmt = this.db.prepare('SELECT * FROM applicants WHERE id = ?');
    const row = stmt.get(id) as Applicant | undefined;
    
    if (!row) return null;
    
    return this.transformRow(row);
  }

  /**
   * Find applicant by email
   */
  findByEmail(email: string): Applicant | null {
    const stmt = this.db.prepare('SELECT * FROM applicants WHERE email = ?');
    const row = stmt.get(email) as Applicant | undefined;
    
    if (!row) return null;
    
    return this.transformRow(row);
  }

  /**
   * Find all applicants with optional filters and pagination
   */
  findAll(filters: ApplicantFilters = {}, pagination: PaginationOptions = {}): PaginatedResult<Applicant> {
    const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'DESC' } = pagination;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (filters.search) {
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (filters.years_experience) {
      conditions.push('years_experience = ?');
      params.push(filters.years_experience);
    }
    
    if (filters.country) {
      conditions.push('country = ?');
      params.push(filters.country);
    }
    
    if (filters.date_from) {
      conditions.push('created_at >= ?');
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      conditions.push('created_at <= ?');
      params.push(filters.date_to);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM applicants ${whereClause}`);
    const { count: total } = countStmt.get(...params) as { count: number };
    
    // Get paginated results
    const dataStmt = this.db.prepare(`
      SELECT * FROM applicants 
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `);
    
    const rows = dataStmt.all(...params, limit, offset) as Applicant[];
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
   * Update applicant by ID
   */
  update(input: UpdateApplicantInput): Applicant | null {
    const { id, ...updates } = input;
    
    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }
    
    const setClause: string[] = [];
    const params: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'skills' || key === 'certifications') {
          setClause.push(`${key} = ?`);
          params.push(Array.isArray(value) ? stringifyJSON(value) : value);
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
      UPDATE applicants 
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
   * Delete applicant by ID
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM applicants WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Check if email already exists
   */
  emailExists(email: string, excludeId?: string): boolean {
    let stmt;
    let params: any[];
    
    if (excludeId) {
      stmt = this.db.prepare('SELECT COUNT(*) as count FROM applicants WHERE email = ? AND id != ?');
      params = [email, excludeId];
    } else {
      stmt = this.db.prepare('SELECT COUNT(*) as count FROM applicants WHERE email = ?');
      params = [email];
    }
    
    const { count } = stmt.get(...params) as { count: number };
    return count > 0;
  }

  /**
   * Get applicants by skills
   */
  findBySkills(skills: string[]): Applicant[] {
    if (skills.length === 0) return [];
    
    const conditions = skills.map(() => 'skills LIKE ?').join(' OR ');
    const params = skills.map(skill => `%"${skill}"%`);
    
    const stmt = this.db.prepare(`
      SELECT * FROM applicants 
      WHERE ${conditions}
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all(...params) as Applicant[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Get recent applicants
   */
  findRecent(limit: number = 10): Applicant[] {
    const stmt = this.db.prepare(`
      SELECT * FROM applicants 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    
    const rows = stmt.all(limit) as Applicant[];
    return rows.map(row => this.transformRow(row));
  }

  /**
   * Get applicant statistics
   */
  getStats(): {
    total: number;
    this_month: number;
    by_country: Array<{ country: string; count: number }>;
    by_experience: Array<{ experience: string; count: number }>;
  } {
    // Total count
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM applicants');
    const { count: total } = totalStmt.get() as { count: number };
    
    // This month count
    const thisMonthStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM applicants 
      WHERE created_at >= date('now', 'start of month')
    `);
    const { count: this_month } = thisMonthStmt.get() as { count: number };
    
    // By country
    const countryStmt = this.db.prepare(`
      SELECT country, COUNT(*) as count 
      FROM applicants 
      WHERE country IS NOT NULL 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `);
    const by_country = countryStmt.all() as Array<{ country: string; count: number }>;
    
    // By experience
    const experienceStmt = this.db.prepare(`
      SELECT years_experience as experience, COUNT(*) as count 
      FROM applicants 
      WHERE years_experience IS NOT NULL 
      GROUP BY years_experience 
      ORDER BY count DESC
    `);
    const by_experience = experienceStmt.all() as Array<{ experience: string; count: number }>;
    
    return {
      total,
      this_month,
      by_country,
      by_experience
    };
  }

  /**
   * Transform database row to Applicant object with parsed JSON fields
   */
  private transformRow(row: Applicant): Applicant {
    return {
      ...row,
      skills: row.skills || undefined,
      certifications: row.certifications || undefined
    };
  }
}

// Export singleton instance
export const applicantModel = new ApplicantModel();

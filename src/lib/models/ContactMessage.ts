import { getDatabase, generateId, formatDateForDB } from '../database';
import type { 
  ContactMessage, 
  CreateContactMessageInput, 
  UpdateContactMessageInput, 
  PaginationOptions, 
  PaginatedResult 
} from './types';

export class ContactMessageModel {
  private db = getDatabase();

  /**
   * Create a new contact message
   */
  create(input: CreateContactMessageInput): ContactMessage {
    const id = generateId('CM');
    const now = formatDateForDB();
    
    const stmt = this.db.prepare(`
      INSERT INTO contact_messages (
        id, name, email, phone, subject, message, user_agent, 
        ip_address, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      input.name,
      input.email,
      input.phone || null,
      input.subject || null,
      input.message,
      input.user_agent || null,
      input.ip_address || null,
      'new',
      now
    );
    
    return this.findById(id)!;
  }

  /**
   * Find contact message by ID
   */
  findById(id: string): ContactMessage | null {
    const stmt = this.db.prepare('SELECT * FROM contact_messages WHERE id = ?');
    const row = stmt.get(id) as ContactMessage | undefined;
    
    return row || null;
  }

  /**
   * Find all contact messages with optional filters and pagination
   */
  findAll(filters: { status?: string; search?: string } = {}, pagination: PaginationOptions = {}): PaginatedResult<ContactMessage> {
    const { page = 1, limit = 20, sort_by = 'submitted_at', sort_order = 'DESC' } = pagination;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    
    if (filters.search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM contact_messages ${whereClause}`);
    const { count: total } = countStmt.get(...params) as { count: number };
    
    // Get paginated results
    const dataStmt = this.db.prepare(`
      SELECT * FROM contact_messages 
      ${whereClause}
      ORDER BY ${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `);
    
    const rows = dataStmt.all(...params, limit, offset) as ContactMessage[];
    
    return {
      data: rows,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    };
  }

  /**
   * Update contact message by ID
   */
  update(input: UpdateContactMessageInput): ContactMessage | null {
    const { id, ...updates } = input;
    
    if (Object.keys(updates).length === 0) {
      return this.findById(id);
    }
    
    const setClause: string[] = [];
    const params: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setClause.push(`${key} = ?`);
        params.push(value);
      }
    });
    
    if (setClause.length === 0) {
      return this.findById(id);
    }
    
    // Add responded_at timestamp if status is being updated to replied
    if (updates.status === 'replied') {
      setClause.push('responded_at = ?');
      params.push(formatDateForDB());
    }
    
    params.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE contact_messages 
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
   * Delete contact message by ID
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM contact_messages WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Get recent contact messages
   */
  findRecent(limit: number = 10): ContactMessage[] {
    const stmt = this.db.prepare(`
      SELECT * FROM contact_messages 
      ORDER BY submitted_at DESC 
      LIMIT ?
    `);
    
    return stmt.all(limit) as ContactMessage[];
  }

  /**
   * Get contact message statistics
   */
  getStats(): {
    total: number;
    by_status: Array<{ status: string; count: number }>;
    this_month: number;
    unread: number;
  } {
    // Total count
    const totalStmt = this.db.prepare('SELECT COUNT(*) as count FROM contact_messages');
    const { count: total } = totalStmt.get() as { count: number };
    
    // By status
    const statusStmt = this.db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM contact_messages 
      GROUP BY status 
      ORDER BY count DESC
    `);
    const by_status = statusStmt.all() as Array<{ status: string; count: number }>;
    
    // This month count
    const thisMonthStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM contact_messages 
      WHERE submitted_at >= date('now', 'start of month')
    `);
    const { count: this_month } = thisMonthStmt.get() as { count: number };
    
    // Unread count
    const unreadStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM contact_messages 
      WHERE status = 'new'
    `);
    const { count: unread } = unreadStmt.get() as { count: number };
    
    return {
      total,
      by_status,
      this_month,
      unread
    };
  }
}

// Export singleton instance
export const contactMessageModel = new ContactMessageModel();
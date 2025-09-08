// Export all models and types
export * from './types';

// Import and re-export model instances from separate files
export { jobModel } from './Job';
export { applicantModel } from './Applicant';
export { applicationModel } from './Application';
export { contactMessageModel } from './ContactMessage';

import { getDatabase, generateId, formatDateForDB } from '../database';
import type {
  ContentSection,
  CreateContentSectionInput
} from './types';

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
export const contentSectionModel = new ContentSectionModel();
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDatabase() {
  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'data', 'careerflow.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Initialize database schema
  await initializeSchema();
  
  return db;
}

async function initializeSchema() {
  if (!db) return;

  // Create jobs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      location VARCHAR(100) NOT NULL,
      country VARCHAR(50) NOT NULL,
      city VARCHAR(100),
      job_type VARCHAR(50) NOT NULL,
      experience_level VARCHAR(50) NOT NULL,
      min_salary INTEGER,
      max_salary INTEGER,
      currency VARCHAR(10) DEFAULT 'KWD',
      description TEXT,
      requirements TEXT,
      benefits TEXT,
      company_name VARCHAR(255),
      posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      application_deadline DATETIME,
      is_active BOOLEAN DEFAULT 1,
      is_remote BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for efficient filtering
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
    CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
    CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
    CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
    CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
    CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date);
  `);

  // Create applications table for tracking job applications
  await db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      applicant_name VARCHAR(255) NOT NULL,
      applicant_email VARCHAR(255) NOT NULL,
      applicant_phone VARCHAR(50),
      cv_file_path VARCHAR(500),
      cover_letter TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
    CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
    CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date);
  `);

  // Create email_subscribers table for newsletter subscriptions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS email_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'active',
      subscription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
    CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
    CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscription_date ON email_subscribers(subscription_date);
  `);

  // Create contact_messages table for contact form submissions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'new',
      submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_submission_date ON contact_messages(submission_date);
  `);
}

export interface Job {
  id?: number;
  title: string;
  category: string;
  location: string;
  country: string;
  city?: string;
  job_type: string;
  experience_level: string;
  min_salary?: number;
  max_salary?: number;
  currency?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  company_name?: string;
  posted_date?: string;
  application_deadline?: string;
  is_active?: boolean;
  is_remote?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id?: number;
  job_id: number;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  cv_file_path?: string;
  cover_letter?: string;
  status?: string;
  applied_date?: string;
}

export interface EmailSubscriber {
  id?: number;
  email: string;
  status?: string;
  subscription_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  submission_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobFilters {
  category?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  min_salary?: number;
  max_salary?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

// Email Subscribers Functions
export async function createEmailSubscriber(email: string): Promise<EmailSubscriber | null> {
  const database = await getDatabase();
  if (!database) return null;

  try {
    const result = await database.run(`
      INSERT INTO email_subscribers (email, status, subscription_date)
      VALUES (?, 'active', CURRENT_TIMESTAMP)
    `, email);

    if (result.lastID) {
      return getEmailSubscriberById(Number(result.lastID));
    }

    return null;
  } catch (error) {
    console.error('Error creating email subscriber:', error);
    return null;
  }
}

export async function getEmailSubscriberById(id: number): Promise<EmailSubscriber | null> {
  const database = await getDatabase();
  if (!database) return null;

  try {
    const subscriber = await database.get('SELECT * FROM email_subscribers WHERE id = ?', id) as EmailSubscriber;
    return subscriber || null;
  } catch (error) {
    console.error('Error getting email subscriber:', error);
    return null;
  }
}

export async function getAllEmailSubscribers(filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ subscribers: EmailSubscriber[]; total: number }> {
  try {
    const database = await getDatabase();
    if (!database) {
      console.error('Database connection not available');
      return { subscribers: [], total: 0 };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (filters?.search) {
      whereClause += ' WHERE email LIKE ?';
      params.push(`%${filters.search}%`);
    }

    if (filters?.status) {
      whereClause += whereClause ? ' AND status = ?' : ' WHERE status = ?';
      params.push(filters.status);
    }

    // Get total count with better error handling
    const countResult = await database.get(
      `SELECT COUNT(*) as count FROM email_subscribers${whereClause}`, 
      ...params
    ) as { count: number };
    
    if (!countResult) {
      console.error('Failed to get subscriber count');
      return { subscribers: [], total: 0 };
    }
    
    const total = countResult.count || 0;

    // Get paginated results with better error handling
    const subscribers = await database.all(`
      SELECT * FROM email_subscribers${whereClause}
      ORDER BY subscription_date DESC
      LIMIT ? OFFSET ?
    `, ...params, limit, offset) as EmailSubscriber[];

    return { 
      subscribers: subscribers || [], 
      total 
    };
  } catch (error) {
    console.error('Error getting email subscribers:', error);
    // Return empty results instead of throwing to prevent API crashes
    return { subscribers: [], total: 0 };
  }
}

export async function updateEmailSubscriberStatus(id: number, status: string): Promise<boolean> {
  try {
    const database = await getDatabase();
    if (!database) {
      console.error('Database connection not available');
      return false;
    }

    const stmt = await database.prepare(`
      UPDATE email_subscribers
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = await stmt.run(status, id);
    return result.changes ? result.changes > 0 : false;
  } catch (error) {
    console.error('Error updating email subscriber status:', error);
    return false;
  }
}

export async function deleteEmailSubscriber(id: number): Promise<boolean> {
  try {
    const database = await getDatabase();
    if (!database) {
      console.error('Database connection not available');
      return false;
    }

    const stmt = await database.prepare('DELETE FROM email_subscribers WHERE id = ?');
    const result = await stmt.run(id);
    return result.changes ? result.changes > 0 : false;
  } catch (error) {
    console.error('Error deleting email subscriber:', error);
    return false;
  }
}

// Contact Messages Functions
export async function createContactMessage(contactData: Omit<ContactMessage, 'id' | 'status' | 'submission_date' | 'created_at' | 'updated_at'>): Promise<ContactMessage | null> {
  const database = await getDatabase();
  if (!database) return null;

  try {
    const result = await database.run(`
      INSERT INTO contact_messages (name, email, subject, message, status, submission_date)
      VALUES (?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)
    `, contactData.name, contactData.email, contactData.subject, contactData.message);

    if (result.lastID) {
      return getContactMessageById(Number(result.lastID));
    }

    return null;
  } catch (error) {
    console.error('Error creating contact message:', error);
    return null;
  }
}

export async function getContactMessageById(id: number): Promise<ContactMessage | null> {
  const database = await getDatabase();
  if (!database) return null;

  try {
    const message = await database.get('SELECT * FROM contact_messages WHERE id = ?', id) as ContactMessage;
    return message || null;
  } catch (error) {
    console.error('Error getting contact message:', error);
    return null;
  }
}

export async function getAllContactMessages(filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ messages: ContactMessage[]; total: number }> {
  const database = await getDatabase();
  if (!database) return { messages: [], total: 0 };

  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (filters?.search) {
      whereClause += ' WHERE (name LIKE ? OR email LIKE ? OR subject LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters?.status) {
      whereClause += whereClause ? ' AND status = ?' : ' WHERE status = ?';
      params.push(filters.status);
    }

    // Get total count
    const countResult = await database.get(`SELECT COUNT(*) as count FROM contact_messages${whereClause}`, ...params) as { count: number };
    const total = countResult.count;

    // Get paginated results
    const messages = await database.all(`
      SELECT * FROM contact_messages${whereClause}
      ORDER BY submission_date DESC
      LIMIT ? OFFSET ?
    `, ...params, limit, offset) as ContactMessage[];

    return { messages, total };
  } catch (error) {
    console.error('Error getting contact messages:', error);
    return { messages: [], total: 0 };
  }
}

export async function updateContactMessageStatus(id: number, status: string): Promise<boolean> {
  const database = await getDatabase();
  if (!database) return false;

  try {
    const result = await database.run(`
      UPDATE contact_messages
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, status, id);

    return result.changes ? result.changes > 0 : false;
  } catch (error) {
    console.error('Error updating contact message status:', error);
    return false;
  }
}

export async function deleteContactMessage(id: number): Promise<boolean> {
  const database = await getDatabase();
  if (!database) return false;

  try {
    const result = await database.run('DELETE FROM contact_messages WHERE id = ?', id);
    return result.changes ? result.changes > 0 : false;
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return false;
  }
}

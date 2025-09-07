import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Database configuration
const DB_PATH = path.join(process.cwd(), 'data', 'careerflow.db');
const SCHEMA_PATH = path.join(process.cwd(), 'database', 'schema.sql');

// Singleton database instance
let db: Database.Database | null = null;

/**
 * Get database instance (singleton pattern)
 */
export function getDatabase(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    // Create database connection
    db = new Database(DB_PATH);
    
    // Enable foreign key constraints
    db.pragma('foreign_keys = ON');
    
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    
    console.log(`Database connected: ${DB_PATH}`);
  }
  
  return db;
}

/**
 * Initialize database with schema if it doesn't exist
 */
export function initializeDatabase(): void {
  try {
    const database = getDatabase();
    
    // Check if database is already initialized
    const tables = database.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    if (tables.length === 0) {
      console.log('Initializing database schema...');
      
      // Read and execute schema
      if (!existsSync(SCHEMA_PATH)) {
        throw new Error(`Schema file not found: ${SCHEMA_PATH}`);
      }
      
      const schema = readFileSync(SCHEMA_PATH, 'utf-8');
      
      // Clean and split schema into individual statements
      const cleanedSchema = schema
        .replace(/--.*$/gm, '') // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      const statements = cleanedSchema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      console.log(`Found ${statements.length} SQL statements to execute`);

      database.transaction(() => {
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i].trim();
          if (statement) {
            console.log(`Executing statement ${i + 1}: ${statement.substring(0, 80)}...`);
            try {
              database.exec(statement + ';');
            } catch (error) {
              console.error(`Error executing statement ${i + 1}:`, statement);
              throw error;
            }
          }
        }
      })();
      
      // Insert admin credentials with proper password hash
      insertAdminCredentials();
      
      console.log('Database schema initialized successfully');
    } else {
      console.log('Database already initialized');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Insert admin credentials with proper bcrypt hash
 */
function insertAdminCredentials(): void {
  try {
    const database = getDatabase();
    
    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || 'info@careerflow.com';
    const adminPhone = process.env.ADMIN_PHONE || '+96555683677';
    
    if (!adminPassword) {
      console.warn('⚠️  WARNING: ADMIN_PASSWORD environment variable is not set. Skipping admin credentials insertion.');
      return;
    }
    
    // Check if admin already exists
    const existingAdmin = database.prepare('SELECT id FROM admins WHERE username = ?').get(adminUsername);
    
    if (!existingAdmin) {
      // Hash the admin password
      const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = bcrypt.hashSync(adminPassword, bcryptRounds);
      
      // Insert admin user
      const insertAdmin = database.prepare(`
        INSERT INTO admins (username, password_hash, email, phone, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      insertAdmin.run(adminUsername, passwordHash, adminEmail, adminPhone, 'admin', 1);
      
      console.log(`Admin credentials inserted successfully for user: ${adminUsername}`);
    } else {
      console.log(`Admin user ${adminUsername} already exists`);
    }
  } catch (error) {
    console.error('Error inserting admin credentials:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

/**
 * Execute a transaction with automatic rollback on error
 */
export function executeTransaction<T>(callback: (db: Database.Database) => T): T {
  const database = getDatabase();
  const transaction = database.transaction(callback);
  return transaction(database);
}

/**
 * Backup database to a file
 */
export function backupDatabase(backupPath: string): void {
  try {
    const database = getDatabase();
    database.backup(backupPath);
    console.log(`Database backed up to: ${backupPath}`);
  } catch (error) {
    console.error('Error backing up database:', error);
    throw error;
  }
}

/**
 * Get database statistics
 */
export function getDatabaseStats(): {
  tables: Array<{ name: string; count: number }>;
  size: number;
  path: string;
} {
  const database = getDatabase();
  
  // Get table names and row counts
  const tables = database.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all() as Array<{ name: string }>;
  
  const tableStats = tables.map(table => {
    const count = database.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
    return {
      name: table.name,
      count: count.count
    };
  });
  
  // Get database file size
  const { statSync } = require('fs');
  const stats = statSync(DB_PATH);
  
  return {
    tables: tableStats,
    size: stats.size,
    path: DB_PATH
  };
}

/**
 * Utility function to generate unique IDs
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Utility function to format dates for SQLite
 */
export function formatDateForDB(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Utility function to parse JSON safely
 */
export function parseJSON<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

/**
 * Utility function to stringify JSON safely
 */
export function stringifyJSON(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '[]';
  }
}

// Note: Database initialization is now handled manually via scripts
// This prevents auto-initialization issues during module loading

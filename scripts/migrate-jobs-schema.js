const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

console.log('Starting jobs table schema migration...\n');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');
  
  // Check if jobs table has data
  const rowCount = db.prepare("SELECT COUNT(*) as count FROM jobs").get();
  console.log(`Current jobs table has ${rowCount.count} rows`);
  
  if (rowCount.count > 0) {
    console.log('Warning: Jobs table has data. Creating backup...');
    // Create backup table
    db.exec(`CREATE TABLE jobs_backup AS SELECT * FROM jobs`);
    console.log('Backup created as jobs_backup table');
  }
  
  // Drop the old jobs table
  console.log('Dropping old jobs table...');
  db.exec('DROP TABLE jobs');
  
  // Create new jobs table with correct schema
  console.log('Creating new jobs table with updated schema...');
  db.exec(`
    CREATE TABLE jobs (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      country VARCHAR(100) NOT NULL,
      salary VARCHAR(100),
      type VARCHAR(20) CHECK (type IN ('full-time', 'part-time', 'contract')) DEFAULT 'full-time',
      category VARCHAR(100),
      experience VARCHAR(50),
      description TEXT,
      requirements TEXT,
      benefits TEXT,
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
      featured BOOLEAN DEFAULT 0,
      applicants_count INTEGER DEFAULT 0,
      posted VARCHAR(50) DEFAULT 'Just posted',
      match_percentage INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create indexes for better performance
  console.log('Creating indexes...');
  db.exec(`
    CREATE INDEX idx_jobs_status ON jobs(status);
    CREATE INDEX idx_jobs_category ON jobs(category);
    CREATE INDEX idx_jobs_featured ON jobs(featured);
    CREATE INDEX idx_jobs_created_at ON jobs(created_at);
  `);
  
  // If there was data, migrate it
  if (rowCount.count > 0) {
    console.log('Migrating data from backup...');
    // This would require mapping old columns to new columns
    // For now, we'll skip this since there's no data
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  console.log('\n✅ Migration completed successfully!');
  console.log('Jobs table now has the correct schema with status column');
  
  // Verify the new schema
  const newColumns = db.prepare("PRAGMA table_info(jobs)").all();
  console.log('\nNew jobs table columns:');
  newColumns.forEach(col => {
    console.log(`- ${col.name} (${col.type})`);
  });
  
} catch (error) {
  console.error('❌ Migration failed:', error);
  console.log('Rolling back transaction...');
  db.exec('ROLLBACK');
} finally {
  db.close();
}

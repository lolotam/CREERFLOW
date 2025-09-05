const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

console.log('Checking database schema...\n');

try {
  // Get the schema for the jobs table
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='jobs'").get();
  
  if (schema) {
    console.log('Jobs table schema:');
    console.log(schema.sql);
    console.log('\n');
  } else {
    console.log('Jobs table not found!');
  }
  
  // Get all column names from the jobs table
  const columns = db.prepare("PRAGMA table_info(jobs)").all();
  
  if (columns.length > 0) {
    console.log('Jobs table columns:');
    columns.forEach(col => {
      console.log(`- ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
    });
    console.log('\n');
  }
  
  // Check if status column exists
  const hasStatusColumn = columns.some(col => col.name === 'status');
  const hasIsActiveColumn = columns.some(col => col.name === 'is_active');
  
  console.log('Column analysis:');
  console.log(`- Has 'status' column: ${hasStatusColumn}`);
  console.log(`- Has 'is_active' column: ${hasIsActiveColumn}`);
  
  // Get a sample row to see the actual data structure
  const sampleRow = db.prepare("SELECT * FROM jobs LIMIT 1").get();
  if (sampleRow) {
    console.log('\nSample row structure:');
    console.log(Object.keys(sampleRow));
  } else {
    console.log('\nNo data in jobs table');
  }
  
} catch (error) {
  console.error('Error checking database schema:', error);
} finally {
  db.close();
}

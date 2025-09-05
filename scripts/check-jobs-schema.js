const Database = require('better-sqlite3');

try {
  const db = new Database('./data/careerflow.db');
  
  // Get jobs table schema
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='jobs'").get();
  console.log('Jobs table schema:');
  console.log(schema.sql);
  
  // Get sample job from database
  const sampleJob = db.prepare('SELECT * FROM jobs LIMIT 1').get();
  console.log('\nSample job from database:');
  console.log(JSON.stringify(sampleJob, null, 2));
  
  // Get job count
  const count = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
  console.log(`\nTotal jobs in database: ${count.count}`);
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
}

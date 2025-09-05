const fs = require('fs');
const Database = require('better-sqlite3');

console.log('🚀 Starting Job Data Migration from JSON to SQLite Database');

try {
  // Read JSON file
  console.log('📖 Reading jobs from JSON file...');
  const jobsData = fs.readFileSync('./data/jobs.json', 'utf8');
  const jsonJobs = JSON.parse(jobsData);
  console.log(`✅ Found ${jsonJobs.length} jobs in JSON file`);

  // Connect to database
  console.log('🔌 Connecting to SQLite database...');
  const db = new Database('./data/careerflow.db');

  // Check current job count in database
  const currentCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
  console.log(`📊 Current jobs in database: ${currentCount.count}`);

  // Prepare insert statement
  const insertJob = db.prepare(`
    INSERT OR REPLACE INTO jobs (
      id, title, company, location, country, salary, type, category, experience,
      description, requirements, benefits, status, featured, applicants_count,
      posted, match_percentage, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  // Start transaction for better performance
  const insertMany = db.transaction((jobs) => {
    let inserted = 0;
    let updated = 0;
    
    for (const job of jobs) {
      try {
        // Check if job already exists
        const existing = db.prepare('SELECT id FROM jobs WHERE id = ?').get(job.id);
        
        // Map JSON structure to database structure
        const dbJob = {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          country: job.country,
          salary: job.salary,
          type: job.type || 'full-time',
          category: job.category,
          experience: job.experience,
          description: job.description,
          requirements: JSON.stringify(job.requirements || []),
          benefits: JSON.stringify(job.benefits || []),
          status: job.status || 'active',
          featured: job.featured ? 1 : 0,
          applicants_count: job.applicants || 0,
          posted: job.posted || 'Just posted',
          match_percentage: job.matchPercentage || null,
          created_at: job.createdAt || new Date().toISOString(),
          updated_at: job.updatedAt || new Date().toISOString()
        };

        // Insert job
        insertJob.run(
          dbJob.id, dbJob.title, dbJob.company, dbJob.location, dbJob.country,
          dbJob.salary, dbJob.type, dbJob.category, dbJob.experience,
          dbJob.description, dbJob.requirements, dbJob.benefits, dbJob.status,
          dbJob.featured, dbJob.applicants_count, dbJob.posted, dbJob.match_percentage,
          dbJob.created_at, dbJob.updated_at
        );

        if (existing) {
          updated++;
        } else {
          inserted++;
        }

      } catch (error) {
        console.error(`❌ Error processing job ${job.id}:`, error.message);
      }
    }
    
    return { inserted, updated };
  });

  // Execute migration
  console.log('🔄 Migrating jobs to database...');
  const result = insertMany(jsonJobs);
  
  // Verify final count
  const finalCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get();
  console.log(`✅ Migration completed!`);
  console.log(`📊 Jobs inserted: ${result.inserted}`);
  console.log(`📊 Jobs updated: ${result.updated}`);
  console.log(`📊 Total jobs in database: ${finalCount.count}`);
  
  // Close database connection
  db.close();
  
  console.log('🎉 Job migration completed successfully!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

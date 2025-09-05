const { jobModel } = require('../lib/database');

console.log('🔍 Checking database for Administration jobs...');

try {
  // Get all jobs
  const allJobs = jobModel.findAll({}, { limit: 1000 });
  console.log(`📊 Total jobs in database: ${allJobs.total}`);
  
  // Get categories breakdown
  const categories = {};
  allJobs.data.forEach(job => {
    const category = job.category || 'uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  });
  
  console.log('📋 Categories breakdown:');
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count} jobs`);
  });
  
  // Check for administration specifically
  const adminJobs = jobModel.findAll({ category: 'administration' });
  console.log(`\n🏛️ Administration jobs: ${adminJobs.total}`);
  
  if (adminJobs.total > 0) {
    adminJobs.data.forEach(job => {
      console.log(`  - ${job.title} at ${job.company} (ID: ${job.id})`);
    });
  } else {
    console.log('❌ No administration jobs found in database');
  }
  
} catch (error) {
  console.error('❌ Error checking database:', error);
}
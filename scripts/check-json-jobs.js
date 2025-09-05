const fs = require('fs');

try {
  // Read JSON file
  const jobsData = fs.readFileSync('./data/jobs.json', 'utf8');
  const jobs = JSON.parse(jobsData);
  
  console.log(`Total jobs in JSON: ${jobs.length}`);
  console.log('\nSample job from JSON:');
  console.log(JSON.stringify(jobs[0], null, 2));
  
  // Check if any jobs have the same ID as database jobs
  const sampleDbIds = [
    "JOB_1757013147394_xiybzb",
    "JOB_1757013147394_qm6in3", 
    "JOB_1757013147394_06fqh1",
    "JOB_1757013147394_j1xrwg",
    "JOB_1757013147394_mseju3"
  ];
  
  console.log('\nChecking for ID conflicts:');
  jobs.forEach((job, index) => {
    if (sampleDbIds.includes(job.id)) {
      console.log(`⚠️  Conflict found: Job ${index} has ID ${job.id} which exists in database`);
    }
  });
  
  console.log('\nFirst 5 job IDs from JSON:');
  jobs.slice(0, 5).forEach((job, index) => {
    console.log(`${index + 1}. ${job.id}`);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}

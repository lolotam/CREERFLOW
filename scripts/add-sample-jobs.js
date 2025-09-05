const Database = require('better-sqlite3');
const path = require('path');

// Simple ID generator
function generateJobId() {
  return `JOB_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

console.log('🌱 Adding sample jobs to the database...\n');

// Sample jobs data
const sampleJobs = [
  {
    id: generateJobId(),
    title: 'Senior Registered Nurse - ICU',
    company: 'Dubai Healthcare City',
    location: 'Dubai, United Arab Emirates',
    country: 'United Arab Emirates',
    salary: '15,000 - 20,000 AED',
    type: 'full-time',
    category: 'nursing',
    experience: 'senior',
    description: 'We are seeking an experienced Senior Registered Nurse to join our dynamic ICU team in Dubai Healthcare City. The ideal candidate will have extensive experience in critical care and patient management.',
    requirements: JSON.stringify([
      'Bachelor\'s degree in Nursing (BSN)',
      'Valid nursing license (DHA/MOH)',
      '5+ years of ICU experience',
      'BLS and ACLS certification',
      'Excellent communication skills in English and Arabic'
    ]),
    benefits: JSON.stringify([
      'Competitive salary package',
      'Health insurance for family',
      'Housing allowance',
      'Transportation allowance',
      'Annual leave (30 days)',
      'Professional development opportunities'
    ]),
    status: 'active',
    featured: 1,
    applicants_count: 12,
    posted: 'Just posted',
    match_percentage: null
  },
  {
    id: generateJobId(),
    title: 'Medical Laboratory Technician',
    company: 'Al Zahra Hospital',
    location: 'Sharjah, United Arab Emirates',
    country: 'United Arab Emirates',
    salary: '8,000 - 12,000 AED',
    type: 'full-time',
    category: 'laboratory',
    experience: 'mid',
    description: 'Join our state-of-the-art laboratory team as a Medical Laboratory Technician. You will be responsible for conducting various laboratory tests and maintaining quality standards.',
    requirements: JSON.stringify([
      'Diploma in Medical Laboratory Technology',
      'DHA/MOH license',
      '2+ years of laboratory experience',
      'Knowledge of laboratory equipment and procedures',
      'Attention to detail and accuracy'
    ]),
    benefits: JSON.stringify([
      'Competitive salary',
      'Medical insurance',
      'Transportation allowance',
      'Annual bonus',
      'Training and development'
    ]),
    status: 'active',
    featured: 0,
    applicants_count: 8,
    posted: '2 days ago',
    match_percentage: null
  },
  {
    id: generateJobId(),
    title: 'Physiotherapist',
    company: 'American Hospital Dubai',
    location: 'Dubai, United Arab Emirates',
    country: 'United Arab Emirates',
    salary: '12,000 - 16,000 AED',
    type: 'full-time',
    category: 'therapy',
    experience: 'mid',
    description: 'We are looking for a qualified Physiotherapist to join our rehabilitation team. The successful candidate will provide high-quality physiotherapy services to patients.',
    requirements: JSON.stringify([
      'Bachelor\'s degree in Physiotherapy',
      'Valid DHA license',
      '3+ years of clinical experience',
      'Specialization in orthopedic or sports therapy preferred',
      'Strong interpersonal skills'
    ]),
    benefits: JSON.stringify([
      'Attractive salary package',
      'Health insurance',
      'Professional development',
      'Flexible working hours',
      'Annual leave'
    ]),
    status: 'active',
    featured: 1,
    applicants_count: 15,
    posted: '1 week ago',
    match_percentage: null
  },
  {
    id: generateJobId(),
    title: 'Pharmacist',
    company: 'Aster Hospital',
    location: 'Abu Dhabi, United Arab Emirates',
    country: 'United Arab Emirates',
    salary: '10,000 - 14,000 AED',
    type: 'full-time',
    category: 'pharmacy',
    experience: 'mid',
    description: 'We are seeking a licensed Pharmacist to join our hospital pharmacy team. The role involves dispensing medications and providing pharmaceutical care to patients.',
    requirements: JSON.stringify([
      'Bachelor\'s degree in Pharmacy',
      'Valid pharmacy license (DHA/MOH)',
      '2+ years of hospital pharmacy experience',
      'Knowledge of pharmaceutical regulations',
      'Computer literacy'
    ]),
    benefits: JSON.stringify([
      'Competitive salary',
      'Medical insurance',
      'Housing allowance',
      'Annual leave',
      'Career advancement opportunities'
    ]),
    status: 'active',
    featured: 0,
    applicants_count: 6,
    posted: '3 days ago',
    match_percentage: null
  },
  {
    id: generateJobId(),
    title: 'Radiologic Technologist',
    company: 'Cleveland Clinic Abu Dhabi',
    location: 'Abu Dhabi, United Arab Emirates',
    country: 'United Arab Emirates',
    salary: '9,000 - 13,000 AED',
    type: 'full-time',
    category: 'radiology',
    experience: 'junior',
    description: 'Join our radiology department as a Radiologic Technologist. You will operate imaging equipment and assist in diagnostic procedures.',
    requirements: JSON.stringify([
      'Associate degree in Radiologic Technology',
      'Valid DHA license',
      '1+ years of experience',
      'Knowledge of imaging equipment',
      'Radiation safety certification'
    ]),
    benefits: JSON.stringify([
      'Competitive salary',
      'Health insurance',
      'Training programs',
      'Transportation allowance',
      'Annual leave'
    ]),
    status: 'active',
    featured: 0,
    applicants_count: 4,
    posted: '5 days ago',
    match_percentage: null
  }
];

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');
  
  // Check current job count
  const currentCount = db.prepare("SELECT COUNT(*) as count FROM jobs").get();
  console.log(`Current jobs in database: ${currentCount.count}`);
  
  // Insert sample jobs
  const insertStmt = db.prepare(`
    INSERT INTO jobs (
      id, title, company, location, country, salary, type, category, 
      experience, description, requirements, benefits, status, featured, 
      applicants_count, posted, match_percentage, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  
  let successCount = 0;
  for (const job of sampleJobs) {
    try {
      insertStmt.run(
        job.id,
        job.title,
        job.company,
        job.location,
        job.country,
        job.salary,
        job.type,
        job.category,
        job.experience,
        job.description,
        job.requirements,
        job.benefits,
        job.status,
        job.featured,
        job.applicants_count,
        job.posted,
        job.match_percentage
      );
      successCount++;
      console.log(`✅ Added: ${job.title} at ${job.company}`);
    } catch (error) {
      console.error(`❌ Error adding ${job.title}:`, error.message);
    }
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  // Verify final count
  const finalCount = db.prepare("SELECT COUNT(*) as count FROM jobs").get();
  
  console.log(`\n🎉 Sample jobs added successfully!`);
  console.log(`   ✅ Successfully inserted: ${successCount} jobs`);
  console.log(`   📊 Total jobs in database: ${finalCount.count}`);
  
} catch (error) {
  console.error('❌ Error adding sample jobs:', error);
  db.exec('ROLLBACK');
} finally {
  db.close();
}

import { initializeDatabase, generateId } from '../src/lib/database';
import { jobModel } from '../src/lib/models';
import type { CreateJobInput } from '../src/lib/models/types';

const jobTitles = {
  nursing: [
    'Registered Nurse - ICU', 'Staff Nurse - Emergency', 'Charge Nurse - Pediatrics',
    'Clinical Nurse Specialist', 'Nurse Manager', 'Operating Room Nurse',
    'Cardiac Care Nurse', 'Oncology Nurse', 'Psychiatric Nurse',
    'Community Health Nurse', 'Infection Control Nurse', 'Nurse Educator',
    'Critical Care Nurse', 'Dialysis Nurse', 'Recovery Room Nurse',
    'Neonatal Nurse', 'Geriatric Nurse', 'Surgical Nurse', 'Trauma Nurse',
    'Intensive Care Nurse', 'Maternity Nurse', 'Pediatric Nurse'
  ],
  medical: [
    'General Practitioner', 'Internal Medicine Physician', 'Cardiologist',
    'Neurologist', 'Orthopedic Surgeon', 'Pediatrician',
    'Emergency Medicine Doctor', 'Anesthesiologist', 'Psychiatrist',
    'Dermatologist', 'Ophthalmologist', 'ENT Specialist',
    'Gastroenterologist', 'Pulmonologist', 'Endocrinologist',
    'Radiologist', 'Pathologist', 'Urologist', 'Rheumatologist'
  ],
  radiology: [
    'Radiologist', 'CT Technologist', 'MRI Technologist',
    'X-Ray Technician', 'Ultrasound Technologist', 'Nuclear Medicine Technologist',
    'Mammography Technologist', 'Interventional Radiology Technologist',
    'Radiation Therapist', 'Medical Imaging Specialist', 'PET Scan Technologist',
    'Bone Densitometry Technologist'
  ],
  pharmacy: [
    'Clinical Pharmacist', 'Hospital Pharmacist', 'Retail Pharmacist',
    'Pharmacy Manager', 'Pharmaceutical Sales Representative', 'Drug Safety Specialist',
    'Pharmacy Technician', 'Compounding Pharmacist', 'Oncology Pharmacist',
    'Pediatric Pharmacist', 'Pharmacy Supervisor', 'Quality Assurance Pharmacist',
    'Nuclear Pharmacist', 'Ambulatory Care Pharmacist'
  ],
  dental: [
    'General Dentist', 'Orthodontist', 'Oral Surgeon',
    'Periodontist', 'Endodontist', 'Pediatric Dentist',
    'Dental Hygienist', 'Dental Assistant', 'Dental Technician',
    'Prosthodontist', 'Oral Pathologist'
  ],
  therapy: [
    'Physical Therapist', 'Occupational Therapist', 'Speech Therapist',
    'Respiratory Therapist', 'Rehabilitation Therapist', 'Sports Therapist',
    'Music Therapist', 'Art Therapist'
  ],
  administration: [
    'Healthcare Administrator', 'Hospital Manager', 'Medical Records Coordinator',
    'Health Information Manager', 'Patient Services Manager', 'Quality Assurance Manager',
    'Healthcare Operations Manager', 'Medical Office Manager', 'Clinical Operations Director',
    'Healthcare Finance Manager', 'Patient Registration Coordinator', 'Medical Billing Manager',
    'Healthcare Compliance Officer', 'Hospital Administrator', 'Medical Practice Manager',
    'Healthcare Project Manager', 'Patient Care Coordinator', 'Medical Staff Coordinator'
  ]
};

const companies = [
  'Kuwait Hospital', 'Al-Sabah Medical Center', 'Dar Al Shifa Hospital',
  'King Faisal Specialist Hospital', 'Saudi German Hospital', 'National Guard Hospital',
  'Cleveland Clinic Abu Dhabi', 'Sheikh Khalifa Medical City', 'Mediclinic Middle East',
  'Hamad Medical Corporation', 'Sidra Medicine', 'Qatar Foundation Medical',
  'American Hospital Dubai', 'Burjeel Hospital', 'Aster Hospitals',
  'Apollo Hospitals', 'NMC Healthcare', 'Thumbay Group'
];

const locations = [
  { country: 'Kuwait', city: 'Kuwait City', currency: 'KWD', location: 'Kuwait City, Kuwait' },
  { country: 'Kuwait', city: 'Hawalli', currency: 'KWD', location: 'Hawalli, Kuwait' },
  { country: 'Kuwait', city: 'Salmiya', currency: 'KWD', location: 'Salmiya, Kuwait' },
  { country: 'Saudi Arabia', city: 'Riyadh', currency: 'SAR', location: 'Riyadh, Saudi Arabia' },
  { country: 'Saudi Arabia', city: 'Jeddah', currency: 'SAR', location: 'Jeddah, Saudi Arabia' },
  { country: 'Saudi Arabia', city: 'Dammam', currency: 'SAR', location: 'Dammam, Saudi Arabia' },
  { country: 'United Arab Emirates', city: 'Dubai', currency: 'AED', location: 'Dubai, UAE' },
  { country: 'United Arab Emirates', city: 'Abu Dhabi', currency: 'AED', location: 'Abu Dhabi, UAE' },
  { country: 'United Arab Emirates', city: 'Sharjah', currency: 'AED', location: 'Sharjah, UAE' },
  { country: 'Qatar', city: 'Doha', currency: 'QAR', location: 'Doha, Qatar' },
  { country: 'Qatar', city: 'Al Rayyan', currency: 'QAR', location: 'Al Rayyan, Qatar' }
];

const jobTypes = ['full-time', 'part-time', 'contract'];
const experienceLevels = ['entry', 'mid', 'senior'];

function getSalaryRange(category: string, experience: string, currency: string): string {
  const baseSalaries = {
    KWD: { entry: [400, 800], mid: [800, 1500], senior: [1500, 3000] },
    SAR: { entry: [4000, 8000], mid: [8000, 15000], senior: [15000, 30000] },
    AED: { entry: [5000, 10000], mid: [10000, 20000], senior: [20000, 40000] },
    QAR: { entry: [5000, 10000], mid: [10000, 20000], senior: [20000, 40000] }
  };

  const multipliers = {
    medical: 1.5,
    nursing: 1.0,
    radiology: 1.2,
    pharmacy: 1.1,
    dental: 1.3,
    therapy: 1.0,
    administration: 1.1
  };

  const [min, max] = baseSalaries[currency as keyof typeof baseSalaries][experience as keyof typeof baseSalaries.KWD];
  const multiplier = multipliers[category as keyof typeof multipliers];

  const minSalary = Math.round(min * multiplier);
  const maxSalary = Math.round(max * multiplier);

  return `${minSalary.toLocaleString()} - ${maxSalary.toLocaleString()} ${currency}`;
}

function generateJobDescription(title: string, category: string): string {
  const descriptions = {
    nursing: `We are seeking a dedicated ${title} to join our healthcare team. The successful candidate will provide high-quality patient care, collaborate with medical staff, and ensure patient safety and comfort.`,
    medical: `We are looking for an experienced ${title} to provide excellent medical care to our patients. The role involves diagnosis, treatment, and ongoing patient management in a modern healthcare facility.`,
    radiology: `Join our imaging department as a ${title}. You will be responsible for performing diagnostic imaging procedures, ensuring patient safety, and maintaining equipment standards.`,
    pharmacy: `We need a qualified ${title} to manage pharmaceutical services, provide medication counseling, and ensure safe medication practices in our healthcare facility.`,
    dental: `Our dental practice is seeking a skilled ${title} to provide comprehensive dental care, maintain patient records, and ensure a comfortable patient experience.`,
    therapy: `We are hiring a ${title} to provide rehabilitation services, develop treatment plans, and help patients achieve their recovery goals.`,
    administration: `We are seeking an experienced ${title} to oversee healthcare operations, manage administrative processes, and ensure efficient delivery of healthcare services. The role involves strategic planning, staff coordination, and maintaining regulatory compliance.`
  };

  return descriptions[category as keyof typeof descriptions] || `Join our team as a ${title} and contribute to excellent healthcare delivery.`;
}

function generateRequirements(category: string, experience: string): string[] {
  const baseReqs = {
    nursing: ['Valid nursing license', 'BScN or equivalent degree', 'CPR certification'],
    medical: ['Medical degree (MD/MBBS)', 'Valid medical license', 'Board certification'],
    radiology: ['Degree in Medical Imaging/Radiology', 'Professional certification', 'Equipment operation experience'],
    pharmacy: ['PharmD or equivalent degree', 'Valid pharmacy license', 'Knowledge of pharmaceutical regulations'],
    dental: ['DDS/DMD degree', 'Valid dental license', 'Clinical experience'],
    therapy: ['Degree in relevant therapy field', 'Professional certification', 'Clinical experience'],
    administration: ['Bachelor\'s degree in Healthcare Administration or related field', 'Healthcare management experience', 'Knowledge of healthcare regulations']
  };

  const experienceReqs = {
    entry: ['0-2 years of experience', 'Willingness to learn', 'Strong communication skills'],
    mid: ['3-5 years of experience', 'Proven track record', 'Leadership potential'],
    senior: ['6+ years of experience', 'Management experience', 'Mentoring abilities']
  };

  return [
    ...baseReqs[category as keyof typeof baseReqs],
    ...experienceReqs[experience as keyof typeof experienceReqs]
  ];
}

async function seedJobs() {
  // Prevent automatic execution during imports
  if (process.env.NODE_ENV === 'development' && !process.env.FORCE_SEED) {
    console.log('🚫 Seed script execution prevented during development. Use FORCE_SEED=true to run.');
    return;
  }

  console.log('🌱 Starting comprehensive job seeding...');

  // Initialize database first
  initializeDatabase();

  // Distribution: Nursing: 45, Medical: 32, Radiology: 24, Pharmacy: 24, Dental: 15, Therapy: 12, Administration: 15
  const distribution = {
    nursing: 45,
    medical: 32,
    radiology: 24,
    pharmacy: 24,
    dental: 15,
    therapy: 12,
    administration: 15
  };

  const jobs: CreateJobInput[] = [];
  let jobIndex = 0;

  for (const [category, count] of Object.entries(distribution)) {
    const titles = jobTitles[category as keyof typeof jobTitles];

    for (let i = 0; i < count; i++) {
      const title = titles[i % titles.length];
      const location = locations[jobIndex % locations.length];
      const jobType = jobTypes[jobIndex % jobTypes.length];
      const experience = experienceLevels[jobIndex % experienceLevels.length];
      const company = companies[jobIndex % companies.length];

      const salary = getSalaryRange(category, experience, location.currency);

      const job: CreateJobInput = {
        title,
        company,
        location: location.location,
        country: location.country,
        salary,
        type: jobType as 'full-time' | 'part-time' | 'contract',
        category,
        experience,
        description: generateJobDescription(title, category),
        requirements: generateRequirements(category, experience),
        benefits: [
          'Competitive salary package',
          'Health insurance for family',
          'Annual leave (30 days)',
          'Professional development opportunities',
          'Housing allowance',
          'Transportation allowance',
          'End of service benefits'
        ],
        status: 'active',
        featured: Math.random() < 0.15, // 15% featured jobs
        posted: getRandomPostedTime()
      };

      jobs.push(job);
      jobIndex++;
    }
  }

  // Insert all jobs using the model
  let successCount = 0;
  let errorCount = 0;

  console.log(`📝 Inserting ${jobs.length} jobs...`);

  for (const job of jobs) {
    try {
      jobModel.create(job);
      successCount++;
      if (successCount % 20 === 0) {
        console.log(`   ✅ Inserted ${successCount}/${jobs.length} jobs...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Error inserting job "${job.title}":`, error);
    }
  }

  console.log(`\n🎉 Job seeding completed!`);
  console.log(`   ✅ Successfully inserted: ${successCount} jobs`);
  if (errorCount > 0) {
    console.log(`   ❌ Failed to insert: ${errorCount} jobs`);
  }

  // Print distribution statistics
  console.log('\n📊 Job Distribution by Category:');
  for (const [category, expectedCount] of Object.entries(distribution)) {
    console.log(`   ${getCategoryEmoji(category)} ${category}: ${expectedCount} jobs`);
  }

  console.log('\n📍 Job Distribution by Location:');
  const locationCounts: Record<string, number> = {};
  jobs.forEach(job => {
    locationCounts[job.country] = (locationCounts[job.country] || 0) + 1;
  });

  Object.entries(locationCounts).forEach(([country, count]) => {
    console.log(`   🏢 ${country}: ${count} jobs`);
  });

  console.log('\n💼 Job Distribution by Type:');
  const typeCounts: Record<string, number> = {};
  jobs.forEach(job => {
    if (job.type) {
      typeCounts[job.type] = (typeCounts[job.type] || 0) + 1;
    }
  });

  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`   📋 ${type}: ${count} jobs`);
  });

  console.log('\n🎯 Job Distribution by Experience:');
  const expCounts: Record<string, number> = {};
  jobs.forEach(job => {
    expCounts[job.experience || 'unknown'] = (expCounts[job.experience || 'unknown'] || 0) + 1;
  });

  Object.entries(expCounts).forEach(([exp, count]) => {
    console.log(`   📈 ${exp}: ${count} jobs`);
  });
}

function getRandomPostedTime(): string {
  const options = [
    'Just posted',
    '1 day ago',
    '2 days ago',
    '3 days ago',
    '1 week ago',
    '2 weeks ago'
  ];
  return options[Math.floor(Math.random() * options.length)];
}

function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    nursing: '👩‍⚕️',
    medical: '🩺',
    radiology: '🔬',
    pharmacy: '💊',
    dental: '🦷',
    therapy: '🏥'
  };
  return emojiMap[category] || '💼';
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedJobs().catch(console.error);
}

export { seedJobs };

#!/usr/bin/env tsx

/**
 * Sample Data Insertion Script for CareerFlow
 * Inserts sample data for testing the database functionality
 */

import { initializeDatabase } from '../src/lib/database';
import { 
  jobModel, 
  applicantModel, 
  applicationModel, 
  contactMessageModel, 
  contentSectionModel 
} from '../src/lib/models';

/**
 * Insert sample jobs
 */
function insertSampleJobs(): void {
  console.log('Inserting sample jobs...');

  const sampleJobs = [
    {
      title: 'Senior Registered Nurse',
      company: 'Dubai Healthcare City',
      location: 'Dubai, United Arab Emirates',
      country: 'United Arab Emirates',
      salary: '15,000 - 20,000 AED',
      type: 'full-time' as const,
      category: 'nursing',
      experience: 'senior',
      description: 'We are seeking an experienced Senior Registered Nurse to join our dynamic healthcare team in Dubai Healthcare City. The ideal candidate will have extensive experience in patient care and team leadership.',
      requirements: [
        'Bachelor\'s degree in Nursing (BSN)',
        'Valid nursing license',
        '5+ years of clinical experience',
        'Leadership experience preferred',
        'Excellent communication skills in English and Arabic'
      ],
      benefits: [
        'Competitive salary package',
        'Health insurance for family',
        'Housing allowance',
        'Annual flight tickets',
        'Professional development opportunities'
      ],
      status: 'active' as const,
      featured: true,
      posted: 'Just posted'
    },
    {
      title: 'Medical Laboratory Technician',
      company: 'Al Zahra Hospital',
      location: 'Sharjah, United Arab Emirates',
      country: 'United Arab Emirates',
      salary: '8,000 - 12,000 AED',
      type: 'full-time' as const,
      category: 'laboratory',
      experience: 'mid',
      description: 'Join our state-of-the-art laboratory team as a Medical Laboratory Technician. You will be responsible for conducting various laboratory tests and maintaining quality standards.',
      requirements: [
        'Diploma in Medical Laboratory Technology',
        'DHA/MOH license',
        '2+ years of laboratory experience',
        'Knowledge of laboratory equipment',
        'Attention to detail'
      ],
      benefits: [
        'Competitive salary',
        'Medical insurance',
        'Transportation allowance',
        'Training opportunities'
      ],
      status: 'active' as const,
      featured: false,
      posted: '2 days ago'
    },
    {
      title: 'Physiotherapist',
      company: 'Rehabilitation Center Dubai',
      location: 'Dubai, United Arab Emirates',
      country: 'United Arab Emirates',
      salary: '12,000 - 16,000 AED',
      type: 'full-time' as const,
      category: 'therapy',
      experience: 'mid',
      description: 'We are looking for a dedicated Physiotherapist to help patients recover from injuries and improve their physical well-being through therapeutic exercises and treatments.',
      requirements: [
        'Bachelor\'s degree in Physiotherapy',
        'Valid DHA license',
        '3+ years of experience',
        'Specialization in sports therapy preferred',
        'Good communication skills'
      ],
      benefits: [
        'Attractive salary package',
        'Health insurance',
        'Professional development',
        'Flexible working hours'
      ],
      status: 'active' as const,
      featured: true,
      posted: '1 week ago'
    }
  ];

  let inserted = 0;
  for (const job of sampleJobs) {
    try {
      jobModel.create(job);
      inserted++;
    } catch (error) {
      console.error('Error inserting job:', error);
    }
  }

  console.log(`Inserted ${inserted} sample jobs`);
}

/**
 * Insert sample applicants
 */
function insertSampleApplicants(): void {
  console.log('Inserting sample applicants...');

  const sampleApplicants = [
    {
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@email.com',
      phone: '971501234567',
      phone_country_code: '+971',
      address_line1: 'Al Barsha 1',
      city: 'Dubai',
      country: 'United Arab Emirates',
      current_position: 'Staff Nurse',
      current_company: 'American Hospital Dubai',
      years_experience: '5-7 years',
      education: 'Bachelor of Science in Nursing',
      skills: ['Patient Care', 'Emergency Medicine', 'ICU', 'Arabic Language'],
      certifications: ['BLS', 'ACLS', 'DHA License'],
      available_start_date: '2024-09-01',
      salary_expectation: '18,000 AED'
    },
    {
      first_name: 'Ahmed',
      last_name: 'Al-Rashid',
      email: 'ahmed.alrashid@email.com',
      phone: '971502345678',
      phone_country_code: '+971',
      address_line1: 'Jumeirah 2',
      city: 'Dubai',
      country: 'United Arab Emirates',
      current_position: 'Lab Technician',
      current_company: 'Dubai Hospital',
      years_experience: '3-5 years',
      education: 'Diploma in Medical Laboratory Technology',
      skills: ['Hematology', 'Clinical Chemistry', 'Microbiology', 'Quality Control'],
      certifications: ['MOH License', 'ISO 15189'],
      available_start_date: '2024-08-15',
      salary_expectation: '10,000 AED'
    },
    {
      first_name: 'Maria',
      last_name: 'Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '971503456789',
      phone_country_code: '+971',
      address_line1: 'Marina Walk',
      city: 'Dubai',
      country: 'United Arab Emirates',
      current_position: 'Senior Physiotherapist',
      current_company: 'Medcare Hospital',
      years_experience: '7+ years',
      education: 'Master of Physiotherapy',
      skills: ['Sports Therapy', 'Orthopedic Rehabilitation', 'Manual Therapy', 'Exercise Prescription'],
      certifications: ['DHA License', 'Sports Therapy Certification'],
      available_start_date: '2024-09-15',
      salary_expectation: '15,000 AED'
    }
  ];

  let inserted = 0;
  for (const applicant of sampleApplicants) {
    try {
      applicantModel.create(applicant);
      inserted++;
    } catch (error) {
      console.error('Error inserting applicant:', error);
    }
  }

  console.log(`Inserted ${inserted} sample applicants`);
}

/**
 * Insert sample applications
 */
function insertSampleApplications(): void {
  console.log('Inserting sample applications...');

  // Get some jobs and applicants to create applications
  const jobs = jobModel.findAll({}, { limit: 3 }).data;
  const applicants = applicantModel.findAll({}, { limit: 3 }).data;

  if (jobs.length === 0 || applicants.length === 0) {
    console.log('No jobs or applicants found, skipping application creation');
    return;
  }

  const sampleApplications = [
    {
      applicant_id: applicants[0]?.id,
      job_id: jobs[0]?.id,
      status: 'pending' as const,
      match_score: 92,
      additional_info: 'Very interested in this position. Available for immediate interview.'
    },
    {
      applicant_id: applicants[1]?.id,
      job_id: jobs[1]?.id,
      status: 'reviewed' as const,
      match_score: 88,
      additional_info: 'Strong background in laboratory work with excellent references.'
    },
    {
      applicant_id: applicants[2]?.id,
      job_id: jobs[2]?.id,
      status: 'accepted' as const,
      match_score: 95,
      additional_info: 'Exceptional candidate with specialized sports therapy experience.'
    }
  ];

  let inserted = 0;
  for (const application of sampleApplications) {
    try {
      if (application.applicant_id && application.job_id) {
        applicationModel.create(application);
        inserted++;
      }
    } catch (error) {
      console.error('Error inserting application:', error);
    }
  }

  console.log(`Inserted ${inserted} sample applications`);
}

/**
 * Insert sample content sections
 */
function insertSampleContent(): void {
  console.log('Inserting sample content sections...');

  const sampleContent = [
    {
      id: 'hero-title',
      title: 'Hero Section Title',
      type: 'hero',
      content: 'CareerFlow'
    },
    {
      id: 'hero-subtitle',
      title: 'Hero Section Subtitle',
      type: 'text',
      content: 'Transform your career with CareerFlow - the next-generation animated job recruitment platform'
    },
    {
      id: 'hero-cta',
      title: 'Hero CTA Button Text',
      type: 'text',
      content: 'Start Your Journey'
    },
    {
      id: 'jobs-header',
      title: 'Jobs Page Header',
      type: 'text',
      content: 'Find Your Dream Job'
    },
    {
      id: 'jobs-subtitle',
      title: 'Jobs Page Subtitle',
      type: 'text',
      content: 'Discover thousands of opportunities from top healthcare employers'
    },
    {
      id: 'about-title',
      title: 'About Section Title',
      type: 'text',
      content: 'About CareerFlow'
    },
    {
      id: 'about-description',
      title: 'About Section Description',
      type: 'text',
      content: 'CareerFlow is a cutting-edge recruitment platform designed specifically for healthcare professionals in the Middle East. We connect talented individuals with leading healthcare institutions.'
    }
  ];

  let inserted = 0;
  for (const content of sampleContent) {
    try {
      contentSectionModel.upsert(content);
      inserted++;
    } catch (error) {
      console.error('Error inserting content:', error);
    }
  }

  console.log(`Inserted ${inserted} sample content sections`);
}

/**
 * Insert sample contact messages
 */
function insertSampleContacts(): void {
  console.log('Inserting sample contact messages...');

  const sampleContacts = [
    {
      name: 'Dr. Hassan Al-Mahmoud',
      email: 'hassan.mahmoud@hospital.ae',
      phone: '+971504567890',
      subject: 'Partnership Inquiry',
      message: 'We are interested in partnering with CareerFlow to recruit qualified healthcare professionals for our hospital network.',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ip_address: '192.168.1.100'
    },
    {
      name: 'Jennifer Smith',
      email: 'jennifer.smith@nurse.com',
      phone: '+971505678901',
      subject: 'Job Application Support',
      message: 'I need assistance with my job application. Could someone please contact me regarding the nursing positions available?',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      ip_address: '192.168.1.101'
    }
  ];

  let inserted = 0;
  for (const contact of sampleContacts) {
    try {
      contactMessageModel.create(contact);
      inserted++;
    } catch (error) {
      console.error('Error inserting contact:', error);
    }
  }

  console.log(`Inserted ${inserted} sample contact messages`);
}

/**
 * Main function to insert all sample data
 */
async function main(): Promise<void> {
  console.log('Starting sample data insertion...');
  console.log('===================================');

  try {
    // Initialize database first
    console.log('Initializing database...');
    initializeDatabase();
    console.log('Database initialized successfully');

    // Insert sample data
    insertSampleJobs();
    insertSampleApplicants();
    insertSampleApplications();
    insertSampleContent();
    insertSampleContacts();

    console.log('===================================');
    console.log('Sample data insertion completed!');
    
    // Show database stats
    const { getDatabaseStats } = await import('../src/lib/database');
    const stats = getDatabaseStats();
    console.log('\nDatabase Statistics:');
    stats.tables.forEach(table => {
      console.log(`  ${table.name}: ${table.count} records`);
    });
    console.log(`  Database size: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('Sample data insertion failed:', error);
    process.exit(1);
  }
}

// Run insertion if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as insertSampleData };

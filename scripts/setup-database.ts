#!/usr/bin/env tsx

/**
 * Database Setup Script for CareerFlow
 * Initializes SQLite database, runs migrations, and inserts sample data
 */

import { initializeDatabase, getDatabaseStats } from '../src/lib/database';

/**
 * Insert sample data for testing
 */
async function insertSampleData(): Promise<void> {
  console.log('Inserting sample data...');

  const {
    jobModel,
    contentSectionModel
  } = await import('../src/lib/models');

  // Insert sample jobs
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
      description: 'We are seeking an experienced Senior Registered Nurse to join our dynamic healthcare team.',
      requirements: ['Bachelor\'s degree in Nursing (BSN)', 'Valid nursing license', '5+ years of clinical experience'],
      benefits: ['Competitive salary package', 'Health insurance for family', 'Housing allowance'],
      status: 'active' as const,
      featured: true
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
      description: 'Join our state-of-the-art laboratory team as a Medical Laboratory Technician.',
      requirements: ['Diploma in Medical Laboratory Technology', 'DHA/MOH license', '2+ years of laboratory experience'],
      benefits: ['Competitive salary', 'Medical insurance', 'Transportation allowance'],
      status: 'active' as const,
      featured: false
    }
  ];

  let jobsInserted = 0;
  for (const job of sampleJobs) {
    try {
      jobModel.create(job);
      jobsInserted++;
    } catch (error) {
      console.error('Error inserting job:', error);
    }
  }

  // Insert sample content
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
      id: 'jobs-header',
      title: 'Jobs Page Header',
      type: 'text',
      content: 'Find Your Dream Job'
    }
  ];

  let contentInserted = 0;
  for (const content of sampleContent) {
    try {
      contentSectionModel.upsert(content);
      contentInserted++;
    } catch (error) {
      console.error('Error inserting content:', error);
    }
  }

  console.log(`✅ Inserted ${jobsInserted} sample jobs and ${contentInserted} content sections`);
}

/**
 * Main setup function
 */
async function main(): Promise<void> {
  console.log('🚀 CareerFlow Database Setup');
  console.log('============================');

  try {
    // Step 1: Initialize database with schema
    console.log('\n📋 Step 1: Initializing database schema...');
    initializeDatabase();
    console.log('✅ Database schema initialized successfully');

    // Step 2: Insert sample data
    console.log('\n🎯 Step 2: Inserting sample data...');
    await insertSampleData();
    console.log('✅ Sample data inserted');

    // Step 3: Show final database statistics
    console.log('\n📊 Database Statistics:');
    console.log('======================');
    const stats = getDatabaseStats();
    
    console.log(`📍 Database Location: ${stats.path}`);
    console.log(`💾 Database Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('\n📋 Table Statistics:');
    
    stats.tables.forEach(table => {
      const emoji = getTableEmoji(table.name);
      console.log(`  ${emoji} ${table.name}: ${table.count} records`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('  1. Start the development server: npm run dev');
    console.log('  2. Visit http://localhost:3000 to test the application');
    console.log('  3. Admin login: username="admin", password="@Ww55683677wW@"');
    console.log('  4. Contact: info@careerflow.com, +96555683677');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

/**
 * Get emoji for table name
 */
function getTableEmoji(tableName: string): string {
  const emojiMap: Record<string, string> = {
    'admins': '👤',
    'jobs': '💼',
    'applicants': '👥',
    'applications': '📝',
    'documents': '📄',
    'contact_messages': '💬',
    'content_sections': '📰'
  };
  
  return emojiMap[tableName] || '📊';
}

// Run setup if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as setupDatabase };

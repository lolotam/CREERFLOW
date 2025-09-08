#!/usr/bin/env tsx

/**
 * Data Migration Script for CareerFlow
 * Migrates existing JSON data to SQLite database
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { initializeDatabase, getDatabase } from '../src/lib/database';
import { jobModel, applicantModel, applicationModel, contactMessageModel, contentSectionModel } from '../src/lib/models';

// Paths to existing JSON files
const DATA_DIR = path.join(process.cwd(), 'data');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');

interface LegacyJob {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
  matchPercentage?: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LegacyApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  appliedDate: string;
  status: string;
  matchScore: number;
  data: any;
  submittedAt: string;
}

interface LegacyContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  userAgent: string | null;
  ipAddress: string | null;
}

interface LegacyContent {
  id: string;
  title: string;
  type: string;
  content: string;
}

/**
 * Migrate jobs from jobs.json
 */
async function migrateJobs(): Promise<void> {
  if (!existsSync(JOBS_FILE)) {
    console.log('No jobs.json file found, skipping job migration');
    return;
  }

  try {
    const jobsData = JSON.parse(readFileSync(JOBS_FILE, 'utf-8')) as LegacyJob[];
    console.log(`Found ${jobsData.length} jobs to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const legacyJob of jobsData) {
      try {
        // Check if job already exists
        const existing = jobModel.findById(legacyJob.id);
        if (existing) {
          skipped++;
          continue;
        }

        // Create job in database
        jobModel.create({
          title: legacyJob.title,
          company: legacyJob.company,
          location: legacyJob.location,
          country: legacyJob.country,
          salary: legacyJob.salary,
          type: legacyJob.type,
          category: legacyJob.category,
          experience: legacyJob.experience,
          description: legacyJob.description,
          requirements: legacyJob.requirements,
          benefits: legacyJob.benefits,
          status: legacyJob.status,
          featured: legacyJob.featured,
          posted: legacyJob.posted,
          match_percentage: legacyJob.matchPercentage
        });

        // Update the job with original ID and timestamps
        const db = getDatabase();
        const updateStmt = db.prepare(`
          UPDATE jobs 
          SET id = ?, applicants_count = ?, created_at = ?, updated_at = ?
          WHERE id = (SELECT id FROM jobs ORDER BY created_at DESC LIMIT 1)
        `);
        
        updateStmt.run(
          legacyJob.id,
          legacyJob.applicants || 0,
          legacyJob.createdAt,
          legacyJob.updatedAt
        );

        migrated++;
      } catch (error) {
        console.error(`Error migrating job ${legacyJob.id}:`, error);
      }
    }

    console.log(`Jobs migration completed: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('Error reading jobs.json:', error);
  }
}

/**
 * Migrate applications from applications.json
 */
async function migrateApplications(): Promise<void> {
  if (!existsSync(APPLICATIONS_FILE)) {
    console.log('No applications.json file found, skipping application migration');
    return;
  }

  try {
    const applicationsData = JSON.parse(readFileSync(APPLICATIONS_FILE, 'utf-8')) as LegacyApplication[];
    console.log(`Found ${applicationsData.length} applications to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const legacyApp of applicationsData) {
      try {
        // Check if application already exists
        const existing = applicationModel.findById(legacyApp.id);
        if (existing) {
          skipped++;
          continue;
        }

        // Extract applicant data from legacy application
        const applicantData = legacyApp.data || {};
        
        // Create or find applicant first
        let applicantId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Try to find existing applicant by email
        const existingApplicant = applicantModel.findByEmail(legacyApp.email);
        if (existingApplicant) {
          applicantId = existingApplicant.id;
        } else {
          // Create new applicant
          const newApplicant = applicantModel.create({
            first_name: applicantData.firstName || legacyApp.name.split(' ')[0] || 'Unknown',
            last_name: applicantData.lastName || legacyApp.name.split(' ').slice(1).join(' ') || 'User',
            email: legacyApp.email,
            phone: legacyApp.phone,
            phone_country_code: applicantData.phoneCountryCode,
            address_line1: applicantData.addressLine1,
            address_line2: applicantData.addressLine2,
            country: applicantData.country,
            current_position: legacyApp.position || applicantData.currentPosition,
            current_company: applicantData.currentCompany,
            years_experience: applicantData.yearsExperience,
            education: applicantData.education,
            skills: applicantData.skills,
            certifications: applicantData.certifications,
            available_start_date: applicantData.availableStartDate,
            salary_expectation: applicantData.salaryExpectation,
            additional_info: applicantData.additionalInfo
          });
          applicantId = newApplicant.id;
        }

        // Create application
        applicationModel.create({
          applicant_id: applicantId,
          job_id: 'JOB-DEFAULT', // Default job ID, update manually if needed
          status: legacyApp.status === 'pending' ? 'pending' : 'reviewed',
          match_score: legacyApp.matchScore,
          submitted_data: legacyApp.data
        });

        // Update with original ID and timestamp
        const db = getDatabase();
        const updateStmt = db.prepare(`
          UPDATE applications 
          SET id = ?, applied_at = ?
          WHERE id = (SELECT id FROM applications ORDER BY applied_at DESC LIMIT 1)
        `);
        
        updateStmt.run(legacyApp.id, legacyApp.submittedAt || legacyApp.appliedDate);

        migrated++;
      } catch (error) {
        console.error(`Error migrating application ${legacyApp.id}:`, error);
      }
    }

    console.log(`Applications migration completed: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('Error reading applications.json:', error);
  }
}

/**
 * Migrate contact messages from contacts.json
 */
async function migrateContacts(): Promise<void> {
  if (!existsSync(CONTACTS_FILE)) {
    console.log('No contacts.json file found, skipping contact migration');
    return;
  }

  try {
    const contactsData = JSON.parse(readFileSync(CONTACTS_FILE, 'utf-8')) as LegacyContact[];
    console.log(`Found ${contactsData.length} contacts to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const legacyContact of contactsData) {
      try {
        // Check if contact already exists
        const existing = contactMessageModel.findById(legacyContact.id);
        if (existing) {
          skipped++;
          continue;
        }

        // Create contact message
        contactMessageModel.create({
          name: legacyContact.name,
          email: legacyContact.email,
          phone: legacyContact.phone,
          subject: legacyContact.subject,
          message: legacyContact.message,
          user_agent: legacyContact.userAgent || undefined,
          ip_address: legacyContact.ipAddress || undefined
        });

        // Update with original ID and timestamp
        const db = getDatabase();
        const updateStmt = db.prepare(`
          UPDATE contact_messages 
          SET id = ?, submitted_at = ?
          WHERE id = (SELECT id FROM contact_messages ORDER BY submitted_at DESC LIMIT 1)
        `);
        
        updateStmt.run(legacyContact.id, legacyContact.submittedAt);

        migrated++;
      } catch (error) {
        console.error(`Error migrating contact ${legacyContact.id}:`, error);
      }
    }

    console.log(`Contacts migration completed: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('Error reading contacts.json:', error);
  }
}

/**
 * Migrate content sections from content.json
 */
async function migrateContent(): Promise<void> {
  if (!existsSync(CONTENT_FILE)) {
    console.log('No content.json file found, skipping content migration');
    return;
  }

  try {
    const contentData = JSON.parse(readFileSync(CONTENT_FILE, 'utf-8')) as LegacyContent[];
    console.log(`Found ${contentData.length} content sections to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const legacyContent of contentData) {
      try {
        // Check if content already exists
        const existing = contentSectionModel.findById(legacyContent.id);
        if (existing) {
          skipped++;
          continue;
        }

        // Create content section
        contentSectionModel.upsert({
          id: legacyContent.id,
          title: legacyContent.title,
          type: legacyContent.type,
          content: legacyContent.content,
          is_active: true
        });

        migrated++;
      } catch (error) {
        console.error(`Error migrating content ${legacyContent.id}:`, error);
      }
    }

    console.log(`Content migration completed: ${migrated} migrated, ${skipped} skipped`);
  } catch (error) {
    console.error('Error reading content.json:', error);
  }
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  console.log('Starting CareerFlow data migration...');
  console.log('=====================================');

  try {
    // Initialize database first
    console.log('Initializing database...');
    initializeDatabase();
    console.log('Database initialized successfully');

    // Run migrations
    await migrateJobs();
    await migrateApplications();
    await migrateContacts();
    await migrateContent();

    console.log('=====================================');
    console.log('Migration completed successfully!');
    
    // Show database stats
    const { getDatabaseStats } = await import('../src/lib/database');
    const stats = getDatabaseStats();
    console.log('\nDatabase Statistics:');
    stats.tables.forEach(table => {
      console.log(`  ${table.name}: ${table.count} records`);
    });
    console.log(`  Database size: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { main as runMigration };

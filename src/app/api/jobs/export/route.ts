import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { jobModel } from '@/lib/models';

// Force Node.js runtime for better-sqlite3 compatibility
export const runtime = 'nodejs';

interface Job {
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
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Convert JSON data to CSV format
function jsonToCSV(jobs: Job[]): string {
  if (jobs.length === 0) return '';

  // CSV headers
  const headers = [
    'ID',
    'Title',
    'Company',
    'Location',
    'Country',
    'Salary',
    'Type',
    'Category',
    'Experience',
    'Description',
    'Requirements',
    'Benefits',
    'Posted',
    'Status',
    'Applicants',
    'Featured',
    'Created Date',
    'Updated Date'
  ];

  // CSV rows
  const rows = jobs.map(job => [
    job.id,
    `"${job.title.replace(/"/g, '""')}"`,
    `"${job.company.replace(/"/g, '""')}"`,
    `"${job.location.replace(/"/g, '""')}"`,
    job.country,
    `"${job.salary.replace(/"/g, '""')}"`,
    job.type,
    job.category,
    job.experience,
    `"${job.description.replace(/"/g, '""')}"`,
    `"${job.requirements.join('; ').replace(/"/g, '""')}"`,
    `"${job.benefits.join('; ').replace(/"/g, '""')}"`,
    job.posted,
    job.status,
    job.applicants,
    job.featured ? 'Yes' : 'No',
    new Date(job.createdAt).toLocaleDateString(),
    new Date(job.updatedAt).toLocaleDateString()
  ]);

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

// Convert CSV to JSON
function csvToJSON(csvContent: string): Job[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const jobs: Job[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const job: Job = {
      id: values[0] || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: values[1]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '',
      company: values[2]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '',
      location: values[3]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '',
      country: values[4] || '',
      salary: values[5]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '',
      type: (values[6] as 'full-time' | 'part-time' | 'contract') || 'full-time',
      category: values[7] || 'medical',
      experience: values[8] || 'mid',
      description: values[9]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '',
      requirements: values[10]?.replace(/^"|"$/g, '').replace(/""/g, '"').split('; ').filter(req => req.trim()) || [],
      benefits: values[11]?.replace(/^"|"$/g, '').replace(/""/g, '"').split('; ').filter(ben => ben.trim()) || [],
      posted: values[12] || 'Just posted',
      status: (values[13] as 'active' | 'paused' | 'closed') || 'active',
      applicants: parseInt(values[14]) || 0,
      featured: values[15] === 'Yes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    jobs.push(job);
  }

  return jobs;
}

// Helper function to parse CSV line with proper quote handling
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  result.push(current);
  return result;
}

// Generate CSV template
function generateTemplate(): string {
  const headers = [
    'ID',
    'Title',
    'Company',
    'Location',
    'Country',
    'Salary',
    'Type',
    'Category',
    'Experience',
    'Description',
    'Requirements',
    'Benefits',
    'Posted',
    'Status',
    'Applicants',
    'Featured',
    'Created Date',
    'Updated Date'
  ];

  const sampleRow = [
    'job-001',
    '"Senior Registered Nurse"',
    '"City General Hospital"',
    '"Kuwait City, Kuwait"',
    'Kuwait',
    '"3,500 - 4,500 KWD"',
    'full-time',
    'nursing',
    'senior',
    '"Join our dynamic nursing team..."',
    '"BSN degree; 5+ years experience; Valid RN license"',
    '"Health insurance; Housing allowance; Annual leave"',
    'Just posted',
    'active',
    '0',
    'No',
    '2025-01-15',
    '2025-01-15'
  ];

  return [headers.join(','), sampleRow.join(',')].join('\n');
}

// Export jobs to CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'template') {
      const template = generateTemplate();
      
      return new NextResponse(template, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="jobs-template.csv"',
        },
      });
    }

    // Get jobs from database (same source as admin dashboard)
    const result = jobModel.findAll({ status: 'active' }, { page: 1, limit: 1000 });
    const jobs = result.data;

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No jobs found to export'
      }, { status: 404 });
    }
    
    const csvContent = jsonToCSV(jobs);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `jobs-export-${timestamp}.csv`;
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error('Error exporting jobs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to export jobs',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Import jobs from CSV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 });
    }
    
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({
        success: false,
        message: 'File must be a CSV file'
      }, { status: 400 });
    }
    
    const csvContent = await file.text();
    const importedJobs = csvToJSON(csvContent);
    
    if (importedJobs.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid jobs found in CSV file'
      }, { status: 400 });
    }
    
    // Read existing jobs
    const dataDir = path.join(process.cwd(), 'data');
    const jobsFile = path.join(dataDir, 'jobs.json');
    
    // Create data directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    let existingJobs: Job[] = [];
    if (existsSync(jobsFile)) {
      try {
        const fileContent = await readFile(jobsFile, 'utf-8');
        existingJobs = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Could not read existing jobs file, starting fresh');
        existingJobs = [];
      }
    }
    
    // Add imported jobs to existing jobs
    const allJobs = [...existingJobs, ...importedJobs];
    
    // Save all jobs
    await writeFile(jobsFile, JSON.stringify(allJobs, null, 2));
    
    console.log(`Imported ${importedJobs.length} jobs successfully`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedJobs.length} jobs`,
      data: {
        imported: importedJobs.length,
        total: allJobs.length
      }
    });
    
  } catch (error) {
    console.error('Error importing jobs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to import jobs',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
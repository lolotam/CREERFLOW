import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  appliedDate: string;
  status: string;
  matchScore: number;
  data: any;
}

// Convert applications to CSV format
function applicationsToCSV(applications: Application[]): string {
  if (applications.length === 0) return '';

  // CSV headers
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Position',
    'Applied Date',
    'Status',
    'Match Score',
    'Current Position',
    'Current Company',
    'Years Experience',
    'Education',
    'Skills',
    'Address',
    'Country',
    'Available Start Date',
    'Salary Expectation',
    'Additional Info'
  ];

  // CSV rows
  const rows = applications.map(app => [
    app.id,
    `"${app.name.replace(/"/g, '""')}"`,
    app.email,
    app.phone,
    `"${app.position.replace(/"/g, '""')}"`,
    new Date(app.appliedDate).toLocaleDateString(),
    app.status,
    app.matchScore,
    `"${(app.data?.currentPosition || '').replace(/"/g, '""')}"`,
    `"${(app.data?.currentCompany || '').replace(/"/g, '""')}"`,
    app.data?.yearsExperience || '',
    `"${(app.data?.education || '').replace(/"/g, '""')}"`,
    `"${(app.data?.skills || []).join('; ').replace(/"/g, '""')}"`,
    `"${(app.data?.addressLine1 || '').replace(/"/g, '""')} ${(app.data?.addressLine2 || '').replace(/"/g, '""')}"`,
    app.data?.country || '',
    app.data?.availableStartDate || '',
    app.data?.salaryExpectation || '',
    `"${(app.data?.additionalInfo || '').replace(/"/g, '""')}"`
  ]);

  // Combine headers and rows
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

// Export applications to CSV
export async function GET(request: NextRequest) {
  try {
    // Read applications from file
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    if (!existsSync(applicationsFile)) {
      return NextResponse.json({
        success: false,
        message: 'No applications found to export'
      }, { status: 404 });
    }
    
    const fileContent = await readFile(applicationsFile, 'utf-8');
    const applications: Application[] = JSON.parse(fileContent);
    
    if (applications.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No applications found to export'
      }, { status: 404 });
    }
    
    const csvContent = applicationsToCSV(applications);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `applications-export-${timestamp}.csv`;
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
    
  } catch (error) {
    console.error('Error exporting applications:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to export applications',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
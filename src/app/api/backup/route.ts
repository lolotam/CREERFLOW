import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir, readdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import JSZip from 'jszip';

interface BackupData {
  applications: any[];
  jobs: any[];
  content: any[];
  credentials: any[];
  metadata: {
    backupDate: string;
    version: string;
    totalRecords: number;
  };
}

interface BackupFile {
  id: string;
  filename: string;
  size: number;
  createdDate: string;
  records: number;
}

// Get all backup files
async function getBackupFiles(): Promise<BackupFile[]> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const backupDir = path.join(dataDir, 'backups');
    
    if (!existsSync(backupDir)) {
      return [];
    }
    
    const files = await readdir(backupDir);
    const backupFiles = files.filter(file => file.endsWith('.zip'));
    
    const backupList: BackupFile[] = [];
    
    for (const file of backupFiles) {
      const filePath = path.join(backupDir, file);
      const stats = await readFile(filePath);
      
      // Extract metadata from filename
      const match = file.match(/backup-(\d{4}-\d{2}-\d{2})-(\d+)-records\.zip/);
      if (match) {
        backupList.push({
          id: file.replace('.zip', ''),
          filename: file,
          size: stats.length,
          createdDate: match[1],
          records: parseInt(match[2])
        });
      }
    }
    
    return backupList.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  } catch (error) {
    console.error('Error getting backup files:', error);
    return [];
  }
}

// Create comprehensive backup
async function createBackup(): Promise<{ success: boolean; filename?: string; error?: string }> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const backupDir = path.join(dataDir, 'backups');
    
    // Create backup directory if it doesn't exist
    if (!existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true });
    }
    
    const backupData: BackupData = {
      applications: [],
      jobs: [],
      content: [],
      credentials: [],
      metadata: {
        backupDate: new Date().toISOString(),
        version: '1.0.0',
        totalRecords: 0
      }
    };
    
    // Read applications data
    const applicationsFile = path.join(dataDir, 'applications.json');
    if (existsSync(applicationsFile)) {
      try {
        const applicationsContent = await readFile(applicationsFile, 'utf-8');
        backupData.applications = JSON.parse(applicationsContent);
      } catch (error) {
        console.warn('Could not read applications file');
      }
    }
    
    // Read jobs data
    const jobsFile = path.join(dataDir, 'jobs.json');
    if (existsSync(jobsFile)) {
      try {
        const jobsContent = await readFile(jobsFile, 'utf-8');
        backupData.jobs = JSON.parse(jobsContent);
      } catch (error) {
        console.warn('Could not read jobs file');
      }
    }
    
    // Read content data
    const contentFile = path.join(dataDir, 'content.json');
    if (existsSync(contentFile)) {
      try {
        const contentContent = await readFile(contentFile, 'utf-8');
        backupData.content = JSON.parse(contentContent);
      } catch (error) {
        console.warn('Could not read content file');
      }
    }
    
    // Read credentials data (if exists)
    const credentialsFile = path.join(dataDir, 'credentials.json');
    if (existsSync(credentialsFile)) {
      try {
        const credentialsContent = await readFile(credentialsFile, 'utf-8');
        backupData.credentials = JSON.parse(credentialsContent);
      } catch (error) {
        console.warn('Could not read credentials file');
      }
    }
    
    // Calculate total records
    backupData.metadata.totalRecords = 
      backupData.applications.length + 
      backupData.jobs.length + 
      backupData.content.length + 
      backupData.credentials.length;
    
    // Create ZIP file
    const zip = new JSZip();
    
    // Add data files to ZIP
    zip.file('applications.json', JSON.stringify(backupData.applications, null, 2));
    zip.file('jobs.json', JSON.stringify(backupData.jobs, null, 2));
    zip.file('content.json', JSON.stringify(backupData.content, null, 2));
    zip.file('credentials.json', JSON.stringify(backupData.credentials, null, 2));
    zip.file('metadata.json', JSON.stringify(backupData.metadata, null, 2));
    
    // Add README file
    const readmeContent = `
CareerFlow Website Backup
========================

Backup Date: ${backupData.metadata.backupDate}
Version: ${backupData.metadata.version}
Total Records: ${backupData.metadata.totalRecords}

Contents:
- applications.json: ${backupData.applications.length} application records
- jobs.json: ${backupData.jobs.length} job posting records
- content.json: ${backupData.content.length} content sections
- credentials.json: ${backupData.credentials.length} credential records

To restore this backup, upload this ZIP file through the admin dashboard.
`;
    zip.file('README.txt', readmeContent);
    
    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Create filename with timestamp and record count
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `backup-${timestamp}-${backupData.metadata.totalRecords}-records.zip`;
    const backupPath = path.join(backupDir, filename);
    
    // Save ZIP file
    await writeFile(backupPath, zipBuffer);
    
    console.log(`Backup created: ${filename} (${backupData.metadata.totalRecords} records)`);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error creating backup:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Restore from backup
async function restoreBackup(zipBuffer: Buffer): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create data directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Read ZIP file
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBuffer);
    
    let restoredCount = 0;
    
    // Restore applications
    const applicationsFile = zipContent.file('applications.json');
    if (applicationsFile) {
      const applicationsContent = await applicationsFile.async('string');
      await writeFile(path.join(dataDir, 'applications.json'), applicationsContent);
      restoredCount++;
    }
    
    // Restore jobs
    const jobsFile = zipContent.file('jobs.json');
    if (jobsFile) {
      const jobsContent = await jobsFile.async('string');
      await writeFile(path.join(dataDir, 'jobs.json'), jobsContent);
      restoredCount++;
    }
    
    // Restore content
    const contentFile = zipContent.file('content.json');
    if (contentFile) {
      const contentContent = await contentFile.async('string');
      await writeFile(path.join(dataDir, 'content.json'), contentContent);
      restoredCount++;
    }
    
    // Restore credentials
    const credentialsFile = zipContent.file('credentials.json');
    if (credentialsFile) {
      const credentialsContent = await credentialsFile.async('string');
      await writeFile(path.join(dataDir, 'credentials.json'), credentialsContent);
      restoredCount++;
    }
    
    console.log(`Backup restored: ${restoredCount} files`);
    
    return { 
      success: true, 
      message: `Successfully restored ${restoredCount} data files from backup` 
    };
  } catch (error) {
    console.error('Error restoring backup:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Get list of backups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const filename = searchParams.get('filename');
    
    if (action === 'list') {
      const backups = await getBackupFiles();
      return NextResponse.json({
        success: true,
        data: backups
      });
    }
    
    if (action === 'download' && filename) {
      const dataDir = path.join(process.cwd(), 'data');
      const backupDir = path.join(dataDir, 'backups');
      const filePath = path.join(backupDir, filename);
      
      if (!existsSync(filePath)) {
        return NextResponse.json({
          success: false,
          message: 'Backup file not found'
        }, { status: 404 });
      }
      
      const fileBuffer = await readFile(filePath);
      
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error in backup GET:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process request',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Create backup
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'create') {
      const result = await createBackup();
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Backup created successfully',
          filename: result.filename
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to create backup',
          error: result.error
        }, { status: 500 });
      }
    }
    
    if (action === 'restore') {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({
          success: false,
          message: 'No backup file provided'
        }, { status: 400 });
      }
      
      if (!file.name.endsWith('.zip')) {
        return NextResponse.json({
          success: false,
          message: 'File must be a ZIP backup file'
        }, { status: 400 });
      }
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await restoreBackup(buffer);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: result.message
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to restore backup',
          error: result.error
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error in backup POST:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process request',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Delete backup
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({
        success: false,
        message: 'Filename is required'
      }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), 'data');
    const backupDir = path.join(dataDir, 'backups');
    const filePath = path.join(backupDir, filename);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        message: 'Backup file not found'
      }, { status: 404 });
    }
    
    await unlink(filePath);
    
    console.log(`Backup deleted: ${filename}`);
    
    return NextResponse.json({
      success: true,
      message: 'Backup deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete backup',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
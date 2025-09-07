import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    // Check if applications file exists
    if (!existsSync(applicationsFile)) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No applications found'
      });
    }
    
    // Read applications from file
    const fileContent = await readFile(applicationsFile, 'utf-8');
    const applications = JSON.parse(fileContent);
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Filter applications
    let filteredApplications = applications;
    
    if (search) {
      filteredApplications = applications.filter((app: any) => 
        app.name.toLowerCase().includes(search) ||
        app.email.toLowerCase().includes(search) ||
        app.position.toLowerCase().includes(search)
      );
    }
    
    if (status !== 'all') {
      filteredApplications = filteredApplications.filter((app: any) => 
        app.status === status
      );
    }
    
    // Apply pagination
    const paginatedApplications = filteredApplications.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: paginatedApplications,
      meta: {
        total: filteredApplications.length,
        limit,
        offset,
        hasMore: offset + limit < filteredApplications.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch applications',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Get specific application by ID
export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json();
    
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    if (!existsSync(applicationsFile)) {
      return NextResponse.json({
        success: false,
        message: 'Application not found'
      }, { status: 404 });
    }
    
    const fileContent = await readFile(applicationsFile, 'utf-8');
    const applications = JSON.parse(fileContent);
    
    const application = applications.find((app: any) => app.id === applicationId);
    
    if (!application) {
      return NextResponse.json({
        success: false,
        message: 'Application not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: application
    });
    
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch application',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Delete application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    
    if (!applicationId) {
      return NextResponse.json({
        success: false,
        message: 'Application ID is required'
      }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    if (!existsSync(applicationsFile)) {
      return NextResponse.json({
        success: false,
        message: 'Application not found'
      }, { status: 404 });
    }
    
    const fileContent = await readFile(applicationsFile, 'utf-8');
    let applications = JSON.parse(fileContent);
    
    const applicationIndex = applications.findIndex((app: any) => app.id === applicationId);
    
    if (applicationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Application not found'
      }, { status: 404 });
    }
    
    // Remove the application
    const deletedApplication = applications.splice(applicationIndex, 1)[0];
    
    // Save updated applications
    await writeFile(applicationsFile, JSON.stringify(applications, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
      data: deletedApplication
    });
    
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete application',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Update application status or other fields
export async function PUT(request: NextRequest) {
  try {
    const { applicationId, updates } = await request.json();
    
    if (!applicationId) {
      return NextResponse.json({
        success: false,
        message: 'Application ID is required'
      }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    if (!existsSync(applicationsFile)) {
      return NextResponse.json({
        success: false,
        message: 'Application not found'
      }, { status: 404 });
    }
    
    const fileContent = await readFile(applicationsFile, 'utf-8');
    let applications = JSON.parse(fileContent);
    
    const applicationIndex = applications.findIndex((app: any) => app.id === applicationId);
    
    if (applicationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Application not found'
      }, { status: 404 });
    }
    
    // Update the application
    applications[applicationIndex] = {
      ...applications[applicationIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated applications
    await writeFile(applicationsFile, JSON.stringify(applications, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
      data: applications[applicationIndex]
    });
    
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update application',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
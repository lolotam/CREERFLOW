import { NextRequest, NextResponse } from 'next/server';
import { jobModel } from '@/lib/models';
import type { JobFilters, PaginationOptions } from '@/lib/models/types';

// Force Node.js runtime for better-sqlite3 compatibility
export const runtime = 'nodejs';

// Legacy interface for backward compatibility
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

// Note: Legacy sample job generation functions removed
// Database is now initialized with sample data via scripts/insert-sample-data.ts

// Get all jobs with filtering
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const country = searchParams.get('country') || '';
    const type = searchParams.get('type') as 'full-time' | 'part-time' | 'contract' | '';
    const experience = searchParams.get('experience') || '';
    const statusParam = searchParams.get('status') || 'active';
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));

    // If ID is provided, fetch single job
    if (id) {
      try {
        const job = jobModel.findById(id);
        if (!job) {
          return NextResponse.json({
            success: false,
            message: 'Job not found'
          }, { status: 404 });
        }

        // Transform to legacy format
        const legacyJob: LegacyJob = {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          country: job.country,
          salary: job.salary || '',
          type: job.type,
          category: job.category || '',
          experience: job.experience || '',
          description: job.description || '',
          requirements: Array.isArray(job.requirements) ? job.requirements : [],
          benefits: Array.isArray(job.benefits) ? job.benefits : [],
          posted: job.posted || 'Just posted',
          status: job.status,
          applicants: job.applicants_count,
          matchPercentage: job.match_percentage,
          featured: job.featured,
          createdAt: job.created_at,
          updatedAt: job.updated_at
        };

        return NextResponse.json({
          success: true,
          data: [legacyJob],
          meta: {
            total: 1,
            limit: 1,
            page: 1,
            total_pages: 1,
            offset: 0,
            hasMore: false
          }
        });
      } catch (error) {
        console.error('Error fetching job by ID:', error);
        return NextResponse.json({
          success: false,
          message: 'Failed to fetch job',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
        }, { status: 500 });
      }
    }

    // Build filters object
    const filters: JobFilters = {};
    if (statusParam !== 'all') {
      filters.status = statusParam as 'active' | 'paused' | 'closed';
    }
    if (category) filters.category = category;
    if (country) filters.country = country;
    if (type) filters.type = type;
    if (experience) filters.experience = experience;
    if (featured !== undefined) filters.featured = featured;
    if (search) filters.search = search;

    // Build pagination options
    const pagination: PaginationOptions = {
      page,
      limit,
      sort_by: 'created_at',
      sort_order: 'DESC'
    };

    // Get jobs from database
    const result = jobModel.findAll(filters, pagination);
    
    console.log('🔍 Jobs API Debug:', {
      filters,
      pagination,
      resultTotal: result.total,
      resultDataLength: result.data.length
    });

    // Transform to legacy format for backward compatibility
    const legacyJobs: LegacyJob[] = result.data.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      country: job.country,
      salary: job.salary || '',
      type: job.type,
      category: job.category || '',
      experience: job.experience || '',
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      posted: job.posted || 'Just posted',
      status: job.status,
      applicants: job.applicants_count,
      matchPercentage: job.match_percentage,
      featured: job.featured,
      createdAt: job.created_at,
      updatedAt: job.updated_at
    }));

    console.log('📤 Returning jobs data:', {
      successStatus: true,
      jobsCount: legacyJobs.length,
      sampleJob: legacyJobs[0] ? {
        id: legacyJobs[0].id,
        title: legacyJobs[0].title,
        company: legacyJobs[0].company
      } : 'No jobs'
    });

    return NextResponse.json({
      success: true,
      data: legacyJobs,
      meta: {
        total: result.total,
        limit: result.limit,
        page: result.page,
        total_pages: result.total_pages,
        offset: (result.page - 1) * result.limit,
        hasMore: result.page < result.total_pages
      }
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Create a new job
export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.country) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: title, company, location, and country are required'
      }, { status: 400 });
    }

    // Create new job using the model
    const newJob = jobModel.create({
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      country: jobData.country,
      salary: jobData.salary || 'Competitive',
      type: jobData.type || 'full-time',
      category: jobData.category || 'medical',
      experience: jobData.experience || 'mid',
      description: jobData.description || '',
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      status: jobData.status || 'active',
      featured: jobData.featured || false,
      posted: jobData.posted || 'Just posted',
      match_percentage: jobData.matchPercentage
    });

    // Transform to legacy format for response
    const legacyJob: LegacyJob = {
      id: newJob.id,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      country: newJob.country,
      salary: newJob.salary || '',
      type: newJob.type,
      category: newJob.category || '',
      experience: newJob.experience || '',
      description: newJob.description || '',
      requirements: Array.isArray(newJob.requirements) ? newJob.requirements : [],
      benefits: Array.isArray(newJob.benefits) ? newJob.benefits : [],
      posted: newJob.posted || 'Just posted',
      status: newJob.status,
      applicants: newJob.applicants_count,
      matchPercentage: newJob.match_percentage,
      featured: newJob.featured,
      createdAt: newJob.created_at,
      updatedAt: newJob.updated_at
    };

    console.log(`New job created: ${newJob.id} - ${newJob.title} at ${newJob.company}`);

    return NextResponse.json({
      success: true,
      message: 'Job created successfully',
      data: legacyJob
    });
    
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Update a job
export async function PUT(request: NextRequest) {
  try {
    const { jobId, updates } = await request.json();

    if (!jobId) {
      return NextResponse.json({
        success: false,
        message: 'Job ID is required'
      }, { status: 400 });
    }

    // Update job using the model
    const updatedJob = jobModel.update({
      id: jobId,
      ...updates
    });

    if (!updatedJob) {
      return NextResponse.json({
        success: false,
        message: 'Job not found'
      }, { status: 404 });
    }

    // Transform to legacy format for response
    const legacyJob: LegacyJob = {
      id: updatedJob.id,
      title: updatedJob.title,
      company: updatedJob.company,
      location: updatedJob.location,
      country: updatedJob.country,
      salary: updatedJob.salary || '',
      type: updatedJob.type,
      category: updatedJob.category || '',
      experience: updatedJob.experience || '',
      description: updatedJob.description || '',
      requirements: Array.isArray(updatedJob.requirements) ? updatedJob.requirements : [],
      benefits: Array.isArray(updatedJob.benefits) ? updatedJob.benefits : [],
      posted: updatedJob.posted || 'Just posted',
      status: updatedJob.status,
      applicants: updatedJob.applicants_count,
      matchPercentage: updatedJob.match_percentage,
      featured: updatedJob.featured,
      createdAt: updatedJob.created_at,
      updatedAt: updatedJob.updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: legacyJob
    });
    
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update job',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Delete a job
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    if (!jobId) {
      return NextResponse.json({
        success: false,
        message: 'Job ID is required'
      }, { status: 400 });
    }

    // Delete job using the model
    const deleted = jobModel.delete(jobId);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        message: 'Job not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
      data: { id: jobId }
    });
    
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete job',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
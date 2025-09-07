import { NextRequest, NextResponse } from 'next/server';
import { jobModel } from '@/lib/models';

// Force Node.js runtime for better-sqlite3 compatibility
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Get filter counts from database
    const result = jobModel.findAll({ status: 'active' }, { page: 1, limit: 1000 });
    const jobs = result.data;

    // Calculate counts for each filter category
    const countryCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const experienceCounts: Record<string, number> = {};

    jobs.forEach(job => {
      // Country counts
      if (job.country) {
        countryCounts[job.country] = (countryCounts[job.country] || 0) + 1;
      }

      // Category counts
      if (job.category) {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
      }

      // Type counts
      if (job.type) {
        typeCounts[job.type] = (typeCounts[job.type] || 0) + 1;
      }

      // Experience counts
      if (job.experience) {
        experienceCounts[job.experience] = (experienceCounts[job.experience] || 0) + 1;
      }
    });

    // Format the response to match the expected structure
    const stats = {
      countries: [
        { value: 'Kuwait', label: 'Kuwait', count: countryCounts['Kuwait'] || 0 },
        { value: 'United Arab Emirates', label: 'United Arab Emirates', count: countryCounts['United Arab Emirates'] || 0 },
        { value: 'Saudi Arabia', label: 'Saudi Arabia', count: countryCounts['Saudi Arabia'] || 0 },
        { value: 'Qatar', label: 'Qatar', count: countryCounts['Qatar'] || 0 },
      ],
      categories: [
        { value: 'nursing', label: 'Nursing', count: categoryCounts['nursing'] || 0 },
        { value: 'medical', label: 'Medical', count: categoryCounts['medical'] || 0 },
        { value: 'radiology', label: 'Radiology', count: categoryCounts['radiology'] || 0 },
        { value: 'pharmacy', label: 'Pharmacy', count: categoryCounts['pharmacy'] || 0 },
        { value: 'dental', label: 'Dental', count: categoryCounts['dental'] || 0 },
        { value: 'therapy', label: 'Therapy', count: categoryCounts['therapy'] || 0 },
        { value: 'administration', label: 'Administration', count: categoryCounts['administration'] || 0 },
      ],
      jobTypes: [
        { value: 'full-time', label: 'Full-time', count: typeCounts['full-time'] || 0 },
        { value: 'part-time', label: 'Part-time', count: typeCounts['part-time'] || 0 },
        { value: 'contract', label: 'Contract', count: typeCounts['contract'] || 0 },
      ],
      experienceLevels: [
        { value: 'entry', label: 'Entry Level', count: experienceCounts['entry'] || 0 },
        { value: 'mid', label: 'Mid Level', count: experienceCounts['mid'] || 0 },
        { value: 'senior', label: 'Senior Level', count: experienceCounts['senior'] || 0 },
      ],
      totalJobs: jobs.length
    };

    console.log('📊 Filter stats calculated:', {
      totalJobs: stats.totalJobs,
      countryCounts,
      categoryCounts,
      typeCounts,
      experienceCounts
    });

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching job stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch job statistics',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

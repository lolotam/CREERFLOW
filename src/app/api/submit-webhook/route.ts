import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const WEBHOOK_URL = 'https://n8n-waleed.shop/webhook-test/f369bb52-4c9d-46f4-87f5-842015b4231e';

// Helper function to save application to local storage
const saveApplicationLocally = async (payload: any) => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const applicationsFile = path.join(dataDir, 'applications.json');
    
    // Create data directory if it doesn't exist
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Read existing applications or create empty array
    let applications = [];
    if (existsSync(applicationsFile)) {
      try {
        const fileContent = await readFile(applicationsFile, 'utf-8');
        applications = JSON.parse(fileContent);
      } catch (error) {
        console.warn('Could not read existing applications file, starting fresh');
        applications = [];
      }
    }
    
    // Create application record
    const applicationRecord = {
      id: `CF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      phone: `${payload.phoneCountryCode} ${payload.phone}`,
      position: payload.currentPosition || 'Position not specified',
      appliedDate: new Date().toISOString(),
      status: 'pending',
      matchScore: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
      data: payload, // Store full payload for detailed view
      submittedAt: payload.submittedAt || new Date().toISOString(),
    };
    
    // Add to applications array
    applications.unshift(applicationRecord); // Add to beginning
    
    // Keep only last 1000 applications to prevent file from growing too large
    if (applications.length > 1000) {
      applications = applications.slice(0, 1000);
    }
    
    // Save back to file
    await writeFile(applicationsFile, JSON.stringify(applications, null, 2));
    
    console.log(`Application saved locally: ${applicationRecord.id} - ${applicationRecord.name}`);
    return applicationRecord.id;
    
  } catch (error) {
    console.error('Failed to save application locally:', error);
    return null;
  }
};

// Webhook sending function (simplified to match other webhook implementations)
async function sendToWebhook(applicationData: any): Promise<boolean> {
  try {
    const webhookPayload = {
      // Personal Information
      firstName: applicationData.firstName,
      lastName: applicationData.lastName,
      email: applicationData.email,
      phone: `${applicationData.phoneCountryCode || ''} ${applicationData.phone || ''}`.trim(),

      // Professional Information
      currentPosition: applicationData.currentPosition || '',
      yearsOfExperience: applicationData.yearsOfExperience || '',

      // Application Details
      jobId: applicationData.jobId || '',
      jobTitle: applicationData.jobTitle || '',

      // Documents
      resume: applicationData.resume || '',
      coverLetter: applicationData.coverLetter || '',
      portfolio: applicationData.portfolio || '',

      // Additional Information
      additionalInfo: applicationData.additionalInfo || '',
      linkedIn: applicationData.linkedIn || '',

      // Metadata
      submittedAt: applicationData.submittedAt || new Date().toISOString(),
      applicationId: `CF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      console.log('Application webhook sent successfully:', response.status);
      return true;
    } else {
      console.error('Application webhook failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Application webhook error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let payload: any = null;

  try {
    // Parse the JSON payload from the frontend
    payload = await request.json();

    // Validate required fields
    if (!payload.firstName || !payload.lastName || !payload.email) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: firstName, lastName, and email are required',
        error: 'Validation failed'
      }, { status: 400 });
    }

    // Log the submission attempt
    console.log('Webhook proxy: Forwarding application submission', {
      applicant: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      jobId: payload.jobId,
      submittedAt: payload.submittedAt,
      hasResume: !!payload.resume,
      hasCoverLetter: !!payload.coverLetter,
      hasPortfolio: !!payload.portfolio,
      timestamp: new Date().toISOString(),
    });

    // Save application locally for admin dashboard
    const localApplicationId = await saveApplicationLocally(payload);

    // Send to webhook (don't block the response on webhook failure)
    const webhookPromise = sendToWebhook(payload);

    // Wait for webhook result (but don't fail if webhook fails)
    const webhookSuccess = await webhookPromise;

    const processingTime = Date.now() - startTime;

    // Log the submission
    console.log('Application submission:', {
      id: localApplicationId,
      applicant: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      jobId: payload.jobId,
      submittedAt: payload.submittedAt,
      webhookSent: webhookSuccess,
      processingTime: `${processingTime}ms`,
    });

    // Return success response to the frontend
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We will review your application and get back to you soon.',
      data: {
        applicationId: localApplicationId,
        applicantName: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        submittedAt: payload.submittedAt,
        processingTime: `${processingTime}ms`,
      },
      webhookSent: webhookSuccess,
    }, { status: 200 });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Application submission error:', error);

    // Store application data as fallback even on error
    if (payload) {
      await saveApplicationLocally(payload);
      console.log('Application saved locally as fallback');
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to process application submission',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const WEBHOOK_URL = 'https://n8n-waleed.shop/webhook-test/f369bb52-4c9d-46f4-87f5-842015b4231e';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay
const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to create a timeout promise
const createTimeoutPromise = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

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

// Enhanced fetch with timeout and retry logic
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Webhook attempt ${attempt}/${retries}: ${url.substring(0, 100)}...`);

      // Create fetch promise with timeout
      const fetchPromise = fetch(url, {
        ...options,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });

      const timeoutPromise = createTimeoutPromise(REQUEST_TIMEOUT);
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      // If successful, return the response
      if (response.ok) {
        console.log(`Webhook success on attempt ${attempt}: ${response.status}`);
        return response;
      }

      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        console.log(`Webhook client error ${response.status}, not retrying`);
        return response;
      }

      // For server errors (5xx), retry
      if (attempt < retries) {
        console.log(`Webhook server error ${response.status}, retrying in ${RETRY_DELAY * attempt}ms`);
        await delay(RETRY_DELAY * attempt); // Exponential backoff
        continue;
      }

      return response;
    } catch (error) {
      console.log(`Webhook attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error');

      if (attempt < retries) {
        await delay(RETRY_DELAY * attempt);
        continue;
      }

      throw error;
    }
  }

  throw new Error('All retry attempts failed');
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

    // Forward the request to the n8n webhook using POST with JSON payload
    const webhookResponse = await fetchWithRetry(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CareerFlow-Proxy/1.0',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(payload),
    });

    const processingTime = Date.now() - startTime;

    // Check if the webhook request was successful
    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Webhook submission failed:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        error: errorText,
        processingTime: `${processingTime}ms`,
        applicant: `${payload.firstName} ${payload.lastName}`,
      });

      // Provide specific error messages based on status code
      let userMessage = 'Failed to submit application to webhook';
      let fallbackAction = '';

      if (webhookResponse.status === 404) {
        userMessage = 'The application processing service is currently unavailable';
        fallbackAction = 'Please try again in a few minutes or contact support if the issue persists.';
      } else if (webhookResponse.status >= 500) {
        userMessage = 'The application processing service is experiencing technical difficulties';
        fallbackAction = 'Your application data has been logged. Please try again later.';
      } else if (webhookResponse.status === 429) {
        userMessage = 'Too many applications submitted recently';
        fallbackAction = 'Please wait a moment before submitting again.';
      } else if (webhookResponse.status === 400) {
        userMessage = 'There was an issue with your application data';
        fallbackAction = 'Please check your information and try again.';
      } else if (webhookResponse.status === 403) {
        userMessage = 'Application submission is currently restricted';
        fallbackAction = 'Please contact support for assistance.';
      }

      // Store application data locally as fallback (in production, save to database)
      console.log('FALLBACK: Storing application data locally:', {
        applicant: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        timestamp: new Date().toISOString(),
        webhookError: webhookResponse.status,
        payload: JSON.stringify(payload, null, 2),
      });

      return NextResponse.json({
        success: false,
        message: userMessage,
        fallbackAction,
        error: `Webhook returned ${webhookResponse.status}: ${webhookResponse.statusText}`,
        retryAfter: webhookResponse.status === 429 ? 60 : undefined, // Suggest retry after 60 seconds for rate limiting
      }, { status: 502 }); // Bad Gateway
    }

    // Get the response from the webhook
    let webhookData;
    try {
      webhookData = await webhookResponse.json();
    } catch (parseError) {
      // If webhook doesn't return JSON, that's okay
      console.log('Webhook response is not JSON, treating as success');
      webhookData = { message: 'Webhook processed successfully' };
    }

    console.log('Webhook submission successful:', {
      applicant: `${payload.firstName} ${payload.lastName}`,
      webhookStatus: webhookResponse.status,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
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
        webhookResponse: webhookData,
      }
    }, { status: 200 });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Webhook proxy error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      processingTime: `${processingTime}ms`,
      applicant: payload ? `${payload.firstName} ${payload.lastName}` : 'Unknown',
    });

    // Store application data as fallback even on error
    if (payload) {
      console.log('ERROR FALLBACK: Storing application data:', {
        applicant: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        payload: JSON.stringify(payload, null, 2),
      });
    }

    // Check if it's a network/timeout error
    if (error instanceof Error && (
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.name === 'AbortError'
    )) {
      return NextResponse.json({
        success: false,
        message: 'Network error: Unable to reach the application processing service',
        fallbackAction: 'Your application data has been saved. Please try submitting again in a few minutes.',
        error: 'The webhook service appears to be unavailable. Please try again later.',
        retryAfter: 300, // Suggest retry after 5 minutes
      }, { status: 503 }); // Service Unavailable
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to process application submission',
      fallbackAction: 'Your application data has been logged. Please contact support if this issue persists.',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error',
      retryAfter: 60, // Suggest retry after 1 minute
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

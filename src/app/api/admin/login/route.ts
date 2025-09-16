import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/auth';
import { createAdminSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid request format - expected JSON'
      }, { status: 400 });
    }

    const { username, password } = requestBody;

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 });
    }

    // Verify credentials
    const authResult = await verifyAdminCredentials(username, password);
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({
        success: false,
        message: authResult.error || 'Invalid credentials'
      }, { status: 401 });
    }

    // Create admin session
    await createAdminSession(authResult.user.username);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        username: authResult.user.username,
        role: authResult.user.role
      }
    }, { status: 200 });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Login failed due to server error'
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
    },
  });
}

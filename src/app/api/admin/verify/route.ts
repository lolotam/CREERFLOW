import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await getSession();

    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated',
        authenticated: false
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication verified',
      authenticated: true,
      user: {
        username: session.username,
        role: session.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Admin verification error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Verification failed due to server error',
      authenticated: false
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

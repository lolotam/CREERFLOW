import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Destroy session
    await destroySession();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    }, { status: 200 });

    return response;

  } catch (error) {
    console.error('Admin logout error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Logout failed due to server error'
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

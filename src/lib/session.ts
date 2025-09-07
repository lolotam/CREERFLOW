import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface SessionData {
  userId?: string;
  username?: string;
  role?: string;
  isLoggedIn: boolean;
}

const defaultSession: SessionData = {
  isLoggedIn: false,
};

// Validate SESSION_SECRET
if (!process.env.SESSION_SECRET) {
  console.error('⚠️  CRITICAL: SESSION_SECRET environment variable is not set. Sessions will not work securely.');
  throw new Error('SESSION_SECRET environment variable is required for secure sessions.');
}

if (process.env.SESSION_SECRET.length < 32) {
  console.error('⚠️  CRITICAL: SESSION_SECRET must be at least 32 characters long.');
  throw new Error('SESSION_SECRET must be at least 32 characters long.');
}

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'careerflow-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60, // 24 hours
    sameSite: 'strict' as const,
    path: '/',
  },
};

/**
 * Get session from cookies (for App Router)
 */
export async function getSession(): Promise<SessionData> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    
    if (!session.isLoggedIn) {
      return defaultSession;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return defaultSession;
  }
}

/**
 * Get session from request (for middleware and API routes)
 */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionData> {
  try {
    const response = new NextResponse();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    
    if (!session.isLoggedIn) {
      return defaultSession;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting session from request:', error);
    return defaultSession;
  }
}

/**
 * Create admin session
 */
export async function createAdminSession(username: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    
    session.userId = 'admin-1';
    session.username = username;
    session.role = 'admin';
    session.isLoggedIn = true;
    
    await session.save();
    
    console.log('Admin session created:', {
      username,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating admin session:', error);
    throw new Error('Failed to create session');
  }
}

/**
 * Destroy session
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    
    session.destroy();
    
    console.log('Session destroyed:', {
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error destroying session:', error);
    throw new Error('Failed to destroy session');
  }
}

/**
 * Check if user is authenticated admin
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return session.isLoggedIn && session.role === 'admin';
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Check if request is from authenticated admin (for middleware)
 */
export async function isAuthenticatedRequest(request: NextRequest): Promise<boolean> {
  try {
    const session = await getSessionFromRequest(request);
    return session.isLoggedIn && session.role === 'admin';
  } catch (error) {
    console.error('Error checking request authentication:', error);
    return false;
  }
}

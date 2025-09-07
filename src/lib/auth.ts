import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// Admin credentials - loaded from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Hash the password if it's provided, otherwise use a placeholder that will always fail
const ADMIN_PASSWORD_HASH = ADMIN_PASSWORD 
  ? bcrypt.hashSync(ADMIN_PASSWORD, parseInt(process.env.BCRYPT_ROUNDS || '12'))
  : '$2a$12$invalidhashedpasswordthatwillnevermatch';

// Warn if no admin password is set
if (!ADMIN_PASSWORD) {
  console.warn('⚠️  WARNING: ADMIN_PASSWORD environment variable is not set. Admin login will not work.');
}

// JWT secret - must be set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Warn if no JWT secret is set
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET environment variable is not set. Using fallback secret for development.');
}

// Warn if no JWT secret is set
if (!JWT_SECRET) {
  console.error('⚠️  CRITICAL: JWT_SECRET environment variable is not set. Authentication will not work securely.');
  throw new Error('JWT_SECRET environment variable is required for secure authentication.');
}

export interface AdminUser {
  username: string;
  role: 'admin';
}

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

export interface TokenPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<AuthResult> {
  try {
    // Check username
    if (username !== ADMIN_USERNAME) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    return {
      success: true,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}

/**
 * Generate JWT token for authenticated admin
 */
export function generateToken(user: AdminUser): string {
  return jwt.sign(
    {
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '24h' // Token expires in 24 hours
    }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): AuthResult {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Type guard to ensure decoded has the expected structure
    if (typeof decoded === 'object' && decoded !== null && 'username' in decoded && 'role' in decoded) {
      const payload = decoded as TokenPayload;

      return {
        success: true,
        user: {
          username: payload.username,
          role: payload.role as 'admin'
        }
      };
    }

    // If decoded doesn't have the expected structure
    return {
      success: false,
      error: 'Invalid token structure'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid or expired token'
    };
  }
}

/**
 * Extract token from request headers or cookies
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookies
  const tokenCookie = request.cookies.get('admin-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

/**
 * Verify if request is from authenticated admin
 */
export function verifyAdminRequest(request: NextRequest): AuthResult {
  const token = extractTokenFromRequest(request);
  
  if (!token) {
    return {
      success: false,
      error: 'No authentication token provided'
    };
  }

  return verifyToken(token);
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: AdminUser | undefined): boolean {
  return user?.role === 'admin';
}

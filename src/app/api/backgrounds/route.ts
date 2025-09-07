import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface BackgroundConfig {
  page: string;
  pageName: string;
  desktop: string;
  tablet: string;
  mobile: string;
  type: 'solid' | 'gradient';
  direction?: 'to right' | 'to bottom' | 'to top right' | 'to bottom right';
}

// Default background configurations
const defaultBackgrounds: BackgroundConfig[] = [
  {
    page: 'home',
    pageName: 'Home Page',
    desktop: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
    tablet: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
    mobile: 'linear-gradient(to bottom, #0c0c0c 0%, #1a1a1a 100%)',
    type: 'gradient',
    direction: 'to right'
  },
  {
    page: 'jobs',
    pageName: 'Jobs Page',
    desktop: 'linear-gradient(135deg, #000000 0%, #1e1e1e 100%)',
    tablet: 'linear-gradient(135deg, #000000 0%, #1e1e1e 100%)',
    mobile: 'linear-gradient(to bottom, #000000 0%, #1e1e1e 100%)',
    type: 'gradient',
    direction: 'to right'
  },
  {
    page: 'favorites',
    pageName: 'Favorites Page',
    desktop: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    tablet: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    mobile: 'linear-gradient(to bottom, #1a1a1a 0%, #2d2d2d 100%)',
    type: 'gradient',
    direction: 'to right'
  },
  {
    page: 'contact',
    pageName: 'Contact Page',
    desktop: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)',
    tablet: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)',
    mobile: 'linear-gradient(to bottom, #0a0a0a 0%, #1f1f1f 100%)',
    type: 'gradient',
    direction: 'to right'
  },
  {
    page: 'admin',
    pageName: 'Admin Dashboard',
    desktop: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
    tablet: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
    mobile: 'linear-gradient(to bottom, #111827 0%, #1f2937 100%)',
    type: 'gradient',
    direction: 'to right'
  }
];

const dataDir = path.join(process.cwd(), 'data');
const backgroundsFile = path.join(dataDir, 'backgrounds.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

// Read backgrounds from file
async function readBackgrounds(): Promise<BackgroundConfig[]> {
  try {
    await ensureDataDirectory();
    
    if (!existsSync(backgroundsFile)) {
      // If file doesn't exist, create it with default content
      await writeFile(backgroundsFile, JSON.stringify(defaultBackgrounds, null, 2));
      return defaultBackgrounds;
    }
    
    const data = await readFile(backgroundsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading backgrounds:', error);
    return defaultBackgrounds;
  }
}

// Write backgrounds to file
async function writeBackgrounds(backgrounds: BackgroundConfig[]): Promise<void> {
  try {
    await ensureDataDirectory();
    await writeFile(backgroundsFile, JSON.stringify(backgrounds, null, 2));
  } catch (error) {
    console.error('Error writing backgrounds:', error);
    throw error;
  }
}

// GET: Fetch all background configurations
export async function GET() {
  try {
    const backgrounds = await readBackgrounds();
    
    return NextResponse.json({
      success: true,
      data: backgrounds,
      meta: {
        total: backgrounds.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching backgrounds:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch background configurations',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// PUT: Update a specific background configuration
export async function PUT(request: NextRequest) {
  try {
    const { page, desktop, tablet, mobile, type, direction } = await request.json();
    
    if (!page) {
      return NextResponse.json({
        success: false,
        message: 'Page identifier is required'
      }, { status: 400 });
    }

    const backgrounds = await readBackgrounds();
    const backgroundIndex = backgrounds.findIndex(bg => bg.page === page);
    
    if (backgroundIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Background configuration not found'
      }, { status: 404 });
    }

    // Update the background configuration
    const updates: Partial<BackgroundConfig> = {};
    if (desktop !== undefined) updates.desktop = desktop;
    if (tablet !== undefined) updates.tablet = tablet;
    if (mobile !== undefined) updates.mobile = mobile;
    if (type !== undefined) updates.type = type;
    if (direction !== undefined) updates.direction = direction;

    backgrounds[backgroundIndex] = { ...backgrounds[backgroundIndex], ...updates };
    
    await writeBackgrounds(backgrounds);
    
    return NextResponse.json({
      success: true,
      message: 'Background configuration updated successfully',
      data: backgrounds[backgroundIndex]
    });
  } catch (error) {
    console.error('Error updating background:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update background configuration',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// POST: Handle special actions (reset, backup)
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'reset':
        await writeBackgrounds(defaultBackgrounds);
        return NextResponse.json({
          success: true,
          message: 'Background configurations reset to defaults',
          data: defaultBackgrounds
        });
        
      case 'backup':
        const currentBackgrounds = await readBackgrounds();
        const backupData = {
          timestamp: new Date().toISOString(),
          backgrounds: currentBackgrounds
        };
        
        const backupFile = path.join(dataDir, `backgrounds-backup-${Date.now()}.json`);
        await writeFile(backupFile, JSON.stringify(backupData, null, 2));
        
        return NextResponse.json({
          success: true,
          message: 'Background configurations backed up successfully',
          backupFile: path.basename(backupFile)
        });
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling background action:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process background action',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// DELETE: Reset to defaults (alternative to POST reset)
export async function DELETE() {
  try {
    await writeBackgrounds(defaultBackgrounds);
    
    return NextResponse.json({
      success: true,
      message: 'Background configurations reset to defaults',
      data: defaultBackgrounds
    });
  } catch (error) {
    console.error('Error resetting backgrounds:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to reset background configurations',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
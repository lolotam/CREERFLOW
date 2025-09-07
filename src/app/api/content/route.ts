import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'image' | 'hero' | 'stats';
  content: string;
}

// Default content sections
const defaultContent: ContentSection[] = [
  {
    id: 'hero-title',
    title: 'Hero Section Title',
    type: 'hero',
    content: 'CareerFlow'
  },
  {
    id: 'hero-subtitle',
    title: 'Hero Section Subtitle',
    type: 'text',
    content: 'Transform your career with CareerFlow - the next-generation animated job recruitment platform'
  },
  {
    id: 'hero-cta',
    title: 'Hero CTA Button Text',
    type: 'text',
    content: 'Start Your Journey'
  },
  {
    id: 'jobs-header',
    title: 'Jobs Page Header',
    type: 'text',
    content: 'Find Your Dream Job'
  },
  {
    id: 'jobs-subtitle',
    title: 'Jobs Page Subtitle',
    type: 'text',
    content: 'Discover thousands of opportunities from top healthcare employers'
  },
  {
    id: 'about-title',
    title: 'About Section Title',
    type: 'text',
    content: 'About CareerFlow'
  },
  {
    id: 'about-description',
    title: 'About Section Description',
    type: 'text',
    content: 'We are dedicated to connecting talented healthcare professionals with leading employers across the Gulf region.'
  },
  {
    id: 'company-stats',
    title: 'Company Statistics',
    type: 'stats',
    content: JSON.stringify({
      totalJobs: '2,500+',
      companies: '150+',
      successRate: '95%',
      candidates: '10,000+'
    })
  },
  {
    id: 'categories-title',
    title: 'Job Categories Section Title',
    type: 'text',
    content: 'Browse by Category'
  },
  {
    id: 'categories-subtitle',
    title: 'Job Categories Section Subtitle',
    type: 'text',
    content: 'Discover opportunities across healthcare and medical fields'
  }
];

// Initialize content data if it doesn't exist
const initializeContentData = async () => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const contentFile = path.join(dataDir, 'content.json');
    
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    if (!existsSync(contentFile)) {
      await writeFile(contentFile, JSON.stringify(defaultContent, null, 2));
      console.log('Initialized content data with default content');
    }
  } catch (error) {
    console.error('Error initializing content data:', error);
  }
};

// Get all content sections
export async function GET(request: NextRequest) {
  try {
    await initializeContentData();
    
    const dataDir = path.join(process.cwd(), 'data');
    const contentFile = path.join(dataDir, 'content.json');
    
    if (!existsSync(contentFile)) {
      return NextResponse.json({
        success: true,
        data: defaultContent
      });
    }
    
    const fileContent = await readFile(contentFile, 'utf-8');
    const content: ContentSection[] = JSON.parse(fileContent);
    
    return NextResponse.json({
      success: true,
      data: content
    });
    
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch content',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Update content section
export async function PUT(request: NextRequest) {
  try {
    const { sectionId, content } = await request.json();
    
    if (!sectionId || content === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Section ID and content are required'
      }, { status: 400 });
    }
    
    const dataDir = path.join(process.cwd(), 'data');
    const contentFile = path.join(dataDir, 'content.json');
    
    // Ensure content file exists
    await initializeContentData();
    
    const fileContent = await readFile(contentFile, 'utf-8');
    let contentSections: ContentSection[] = JSON.parse(fileContent);
    
    const sectionIndex = contentSections.findIndex(section => section.id === sectionId);
    
    if (sectionIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Content section not found'
      }, { status: 404 });
    }
    
    // Update the content section
    contentSections[sectionIndex] = {
      ...contentSections[sectionIndex],
      content: content
    };
    
    // Save updated content
    await writeFile(contentFile, JSON.stringify(contentSections, null, 2));
    
    console.log(`Content updated: ${sectionId} - ${content.substring(0, 50)}...`);
    
    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      data: contentSections[sectionIndex]
    });
    
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update content',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Backup content
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'backup') {
      const dataDir = path.join(process.cwd(), 'data');
      const contentFile = path.join(dataDir, 'content.json');
      const backupFile = path.join(dataDir, `content-backup-${Date.now()}.json`);
      
      if (existsSync(contentFile)) {
        const content = await readFile(contentFile, 'utf-8');
        await writeFile(backupFile, content);
        
        return NextResponse.json({
          success: true,
          message: 'Content backed up successfully',
          backupFile: backupFile
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'No content file found to backup'
        }, { status: 404 });
      }
    }
    
    if (action === 'restore') {
      // Reset to default content
      const dataDir = path.join(process.cwd(), 'data');
      const contentFile = path.join(dataDir, 'content.json');
      
      await writeFile(contentFile, JSON.stringify(defaultContent, null, 2));
      
      return NextResponse.json({
        success: true,
        message: 'Content restored to defaults',
        data: defaultContent
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error with content action:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to perform content action',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}
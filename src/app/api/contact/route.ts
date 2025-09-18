import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createContactMessage } from '../../../../lib/database';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  userAgent: string | null;
  ipAddress: string | null;
}

const CONTACTS_FILE_PATH = path.join(process.cwd(), 'data', 'contacts.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(CONTACTS_FILE_PATH);
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

async function readContacts(): Promise<ContactMessage[]> {
  try {
    if (!existsSync(CONTACTS_FILE_PATH)) {
      return [];
    }
    const data = await readFile(CONTACTS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts file:', error);
    return [];
  }
}

async function saveContacts(contacts: ContactMessage[]): Promise<void> {
  try {
    await ensureDataDirectory();
    await writeFile(CONTACTS_FILE_PATH, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error('Error saving contacts file:', error);
    throw error;
  }
}

// Webhook configuration
const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL || 'https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf';

async function sendToWebhook(contactData: any): Promise<boolean> {
  try {
    const webhookPayload = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      subject: contactData.subject,
      message: contactData.message
    };

    const response = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      console.log('Contact webhook sent successfully:', response.status);
      return true;
    } else {
      console.error('Contact webhook failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Contact webhook error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }

    // Create contact message object
    const contactMessage: ContactMessage = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      subject: body.subject.trim(),
      message: body.message.trim(),
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    };

    // Send to webhook (don't block the response on webhook failure)
    const webhookPromise = sendToWebhook(contactMessage);

    // Read existing contacts
    const contacts = await readContacts();

    // Add new contact
    contacts.push(contactMessage);

    // Save updated contacts (JSON file for backward compatibility)
    await saveContacts(contacts);

    // Also save to database for admin dashboard
    try {
      await createContactMessage({
        name: contactMessage.name,
        email: contactMessage.email,
        subject: contactMessage.subject,
        message: contactMessage.message
      });
      console.log('Contact message saved to database:', contactMessage.email);
    } catch (dbError) {
      console.error('Failed to save contact message to database:', dbError);
      // Don't fail the request if database save fails
    }

    // Wait for webhook result (but don't fail if webhook fails)
    const webhookSuccess = await webhookPromise;

    // Log the contact message
    console.log('New Contact Message:', {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
      submittedAt: contactMessage.submittedAt,
      webhookSent: webhookSuccess,
    });

    console.log('📧 Contact form processing completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Contact message received successfully',
      data: {
        id: contactMessage.id,
        name: contactMessage.name,
        email: contactMessage.email,
        submittedAt: contactMessage.submittedAt,
      },
      webhookSent: webhookSuccess,
    }, { status: 200 });

  } catch (error) {
    console.error('Contact form submission error:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to process contact message',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
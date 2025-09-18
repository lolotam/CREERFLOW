import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { createEmailSubscriber } from '../../../../lib/database';

interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  userAgent: string | null;
  ipAddress: string | null;
}

// Webhook configuration
const NEWSLETTER_WEBHOOK_URL = process.env.NEWSLETTER_WEBHOOK_URL || 'https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287';
const SUBSCRIPTIONS_FILE_PATH = path.join(process.cwd(), 'data', 'subscriptions.json');

async function ensureDataDirectory() {
  const dataDir = path.dirname(SUBSCRIPTIONS_FILE_PATH);
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
}

async function readSubscriptions(): Promise<NewsletterSubscription[]> {
  try {
    if (!existsSync(SUBSCRIPTIONS_FILE_PATH)) {
      return [];
    }
    const data = await readFile(SUBSCRIPTIONS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading subscriptions file:', error);
    return [];
  }
}

async function saveSubscriptions(subscriptions: NewsletterSubscription[]): Promise<void> {
  try {
    await ensureDataDirectory();
    await writeFile(SUBSCRIPTIONS_FILE_PATH, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error saving subscriptions file:', error);
    throw error;
  }
}

async function sendToWebhook(email: string): Promise<boolean> {
  try {
    const webhookPayload = {
      email: email
    };

    const response = await fetch(NEWSLETTER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (response.ok) {
      console.log('Newsletter webhook sent successfully:', response.status);
      return true;
    } else {
      console.error('Newsletter webhook failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Newsletter webhook error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid email address is required'
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email is already subscribed
    const existingSubscriptions = await readSubscriptions();
    const isAlreadySubscribed = existingSubscriptions.some(sub => sub.email === normalizedEmail);

    if (isAlreadySubscribed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is already subscribed to our newsletter'
        },
        { status: 409 }
      );
    }

    // Create subscription object
    const subscription: NewsletterSubscription = {
      id: `newsletter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    };

    // Send to webhook (don't block the response on webhook failure)
    const webhookPromise = sendToWebhook(normalizedEmail);

    // Add to subscriptions (JSON file for backward compatibility)
    existingSubscriptions.push(subscription);
    await saveSubscriptions(existingSubscriptions);

    // Also save to database for admin dashboard
    try {
      await createEmailSubscriber(normalizedEmail);
      console.log('Email subscriber saved to database:', normalizedEmail);
    } catch (dbError) {
      console.error('Failed to save subscriber to database:', dbError);
      // Don't fail the request if database save fails
    }

    // Wait for webhook result (but don't fail if webhook fails)
    const webhookSuccess = await webhookPromise;

    // Log the subscription
    console.log('New Newsletter Subscription:', {
      id: subscription.id,
      email: subscription.email,
      subscribedAt: subscription.subscribedAt,
      webhookSent: webhookSuccess,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        data: {
          id: subscription.id,
          email: subscription.email,
          subscribedAt: subscription.subscribedAt,
        },
        webhookSent: webhookSuccess,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

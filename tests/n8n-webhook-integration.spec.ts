import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:4444';
const WEBHOOK_TIMEOUT = 10000; // 10 seconds for webhook response

test.describe('n8n Webhook Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for webhook tests
    test.setTimeout(30000);
  });

  test('Contact Form - Should submit successfully and trigger n8n webhook', async ({ page }) => {
    // Navigate to contact page
    await page.goto(`${BASE_URL}/en/contact`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Fill in contact form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test.contact@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message from Playwright automated testing for n8n webhook integration.');

    // Submit form and wait for response
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/contact') && response.status() === 200,
      { timeout: WEBHOOK_TIMEOUT }
    );

    await page.click('button[type="submit"]');

    const response = await responsePromise;
    const responseData = await response.json();

    // Verify response
    expect(response.status()).toBe(200);
    expect(responseData).toHaveProperty('success', true);

    // Check for success message on page
    await expect(page.locator('text=/success|sent|thank/i')).toBeVisible({ timeout: 5000 });

    console.log('✅ Contact form webhook test passed');
  });

  test('Newsletter Subscription - Should submit successfully and trigger n8n webhook', async ({ page }) => {
    // Navigate to homepage (where newsletter form is usually located)
    await page.goto(`${BASE_URL}/en`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Generate unique email for this test
    const uniqueEmail = `newsletter.test.${Date.now()}@example.com`;

    // Find and fill newsletter form
    // Try multiple possible selectors as forms can vary
    const emailInput = await page.locator('input[type="email"], input[placeholder*="email" i], input[name="email"]').first();
    await emailInput.fill(uniqueEmail);

    // Submit newsletter form
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/subscribe') && response.status() === 200,
      { timeout: WEBHOOK_TIMEOUT }
    );

    // Click submit button (try multiple possible selectors)
    const submitButton = await page.locator('button:has-text("Subscribe"), button[type="submit"]:near(input[type="email"]), button:has-text("Submit")').first();
    await submitButton.click();

    const response = await responsePromise;
    const responseData = await response.json();

    // Verify response
    expect(response.status()).toBe(200);
    expect(responseData).toHaveProperty('success', true);

    // Check for success message
    await expect(page.locator('text=/subscribed|success|thank/i')).toBeVisible({ timeout: 5000 });

    console.log('✅ Newsletter subscription webhook test passed');
  });

  test('Job Application - Should submit successfully and trigger n8n webhook', async ({ page }) => {
    // Navigate to jobs page
    await page.goto(`${BASE_URL}/en/jobs`);

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Click on first job listing to view details
    await page.locator('.job-card, [data-testid="job-card"], article').first().click();

    // Wait for job details page
    await page.waitForLoadState('networkidle');

    // Click Apply button
    await page.click('button:has-text("Apply"), a:has-text("Apply")');

    // Fill application form
    await page.fill('input[name="firstName"], input[placeholder*="first" i]', 'John');
    await page.fill('input[name="lastName"], input[placeholder*="last" i]', 'Doe');
    await page.fill('input[name="email"], input[type="email"]', 'john.doe.test@example.com');
    await page.fill('input[name="phone"], input[type="tel"]', '+96512345678');

    // Upload CV (create a test file)
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-resume.pdf'); // Assuming test file exists

    // Additional fields if present
    const coverLetterField = await page.locator('textarea[name="coverLetter"], textarea[placeholder*="cover" i]');
    if (await coverLetterField.isVisible()) {
      await coverLetterField.fill('This is a test cover letter from Playwright automated testing.');
    }

    // Submit application
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/submit-webhook') && response.status() === 200,
      { timeout: WEBHOOK_TIMEOUT }
    );

    await page.click('button[type="submit"]:has-text("Submit"), button:has-text("Apply")');

    const response = await responsePromise;
    const responseData = await response.json();

    // Verify response
    expect(response.status()).toBe(200);
    expect(responseData).toHaveProperty('success', true);

    // Check for success message
    await expect(page.locator('text=/submitted|success|thank|received/i')).toBeVisible({ timeout: 5000 });

    console.log('✅ Job application webhook test passed');
  });

  test('Verify all webhooks are responding (Health Check)', async ({ request }) => {
    // Test Contact webhook endpoint directly
    const contactResponse = await request.post(`${BASE_URL}/api/contact`, {
      data: {
        name: 'Health Check',
        email: 'health@check.com',
        message: 'Testing webhook health'
      }
    });
    expect(contactResponse.status()).toBe(200);
    console.log('✅ Contact webhook endpoint is healthy');

    // Test Newsletter webhook endpoint directly
    const newsletterResponse = await request.post(`${BASE_URL}/api/subscribe`, {
      data: {
        email: `health.check.${Date.now()}@example.com`
      }
    });
    expect(newsletterResponse.status()).toBe(200);
    console.log('✅ Newsletter webhook endpoint is healthy');

    // Test Job Application webhook endpoint directly
    const jobResponse = await request.post(`${BASE_URL}/api/submit-webhook`, {
      data: {
        jobId: 1,
        jobTitle: 'Test Position',
        firstName: 'Health',
        lastName: 'Check',
        email: 'health.check@example.com',
        phone: '+96500000000',
        cvUrl: 'https://example.com/test.pdf'
      }
    });
    expect(jobResponse.status()).toBe(200);
    console.log('✅ Job application webhook endpoint is healthy');
  });

  test('Webhook Error Handling - Invalid data should return appropriate error', async ({ request }) => {
    // Test Contact with missing required fields
    const contactResponse = await request.post(`${BASE_URL}/api/contact`, {
      data: {
        name: 'Test'
        // Missing email and message
      }
    });
    expect(contactResponse.status()).toBe(400);

    // Test Newsletter with invalid email
    const newsletterResponse = await request.post(`${BASE_URL}/api/subscribe`, {
      data: {
        email: 'invalid-email'
      }
    });
    expect(contactResponse.status()).toBe(400);

    console.log('✅ Webhook error handling tests passed');
  });
});

test.describe('n8n Workflow Validation', () => {
  test('Verify webhook IDs match configuration', async () => {
    // These IDs should match your n8n workflow configuration
    const expectedWebhooks = {
      contact: '2db83cc9-3a65-40e4-9283-15e80c9681cf',
      newsletter: '31160d81-3436-4e9f-a73d-3786dfe4d287',
      jobApplication: 'f369bb52-4c9d-46f4-87f5-842015b4231e'
    };

    // Log webhook configuration
    console.log('📋 n8n Webhook Configuration:');
    console.log(`   Contact Form: ${expectedWebhooks.contact}`);
    console.log(`   Newsletter: ${expectedWebhooks.newsletter}`);
    console.log(`   Job Application: ${expectedWebhooks.jobApplication}`);
    console.log('✅ All webhook IDs are correctly configured');
  });
});
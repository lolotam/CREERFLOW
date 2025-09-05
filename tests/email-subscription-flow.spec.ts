import { test, expect } from '@playwright/test';

test.describe('Email Subscription Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should submit email subscription from footer form', async ({ page }) => {
    // Find the newsletter signup form in the footer
    const emailInput = page.locator('input[type="email"]').last(); // Get the footer email input
    const subscribeButton = page.locator('button:has-text("Subscribe")').last();

    // Fill in a test email
    const testEmail = `test-${Date.now()}@example.com`;
    await emailInput.fill(testEmail);
    
    // Submit the form
    await subscribeButton.click();
    
    // Wait for success message
    await expect(page.locator('text=Thank you for subscribing')).toBeVisible({ timeout: 10000 });
    
    console.log(`✅ Email subscription submitted: ${testEmail}`);
  });

  test('should verify subscription appears in admin dashboard', async ({ page }) => {
    // First, submit a subscription
    const testEmail = `admin-test-${Date.now()}@example.com`;
    
    // Submit subscription from footer
    const emailInput = page.locator('input[type="email"]').last();
    const subscribeButton = page.locator('button:has-text("Subscribe")').last();
    
    await emailInput.fill(testEmail);
    await subscribeButton.click();
    
    // Wait for success message
    await expect(page.locator('text=Thank you for subscribing')).toBeVisible({ timeout: 10000 });
    
    // Now navigate to admin dashboard
    await page.goto('http://localhost:3000/admin/login');
    
    // Login with admin credentials
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await expect(page.locator('text=Admin Dashboard')).toBeVisible({ timeout: 10000 });
    
    // Navigate to subscribers section
    await page.click('text=Subscribers');
    
    // Check if the subscription appears in the admin dashboard
    await expect(page.locator(`text=${testEmail}`)).toBeVisible({ timeout: 10000 });
    
    console.log(`✅ Subscription verified in admin dashboard: ${testEmail}`);
  });

  test('should check API endpoints for subscription data', async ({ page }) => {
    // Test the JSON-based subscription endpoint
    const jsonResponse = await page.request.get('http://localhost:3000/data/subscriptions.json');
    expect(jsonResponse.status()).toBe(200);
    
    const jsonData = await jsonResponse.json();
    expect(Array.isArray(jsonData)).toBe(true);
    console.log(`✅ JSON subscriptions found: ${jsonData.length}`);
    
    // Test the database-based admin endpoint
    const dbResponse = await page.request.get('http://localhost:3000/api/admin/subscribers');
    console.log(`Database API status: ${dbResponse.status()}`);
    
    if (dbResponse.status() === 200) {
      const dbData = await dbResponse.json();
      console.log(`✅ Database subscriptions found: ${dbData.data?.total || 0}`);
    }
  });
});

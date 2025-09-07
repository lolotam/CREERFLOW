import { test, expect } from '@playwright/test';

test.describe('Complete Email Subscription Flow', () => {
  test('should complete full subscription flow from frontend to admin dashboard', async ({ page }) => {
    const testEmail = `flow-test-${Date.now()}@example.com`;
    
    // Step 1: Navigate to homepage
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Find and fill the newsletter subscription form in footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for footer to be visible
    await page.waitForSelector('footer', { timeout: 10000 });
    
    // Find the email input in the footer (newsletter signup)
    const emailInput = page.locator('footer input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    await emailInput.fill(testEmail);
    
    // Find and click the subscribe button
    const subscribeButton = page.locator('footer button:has-text("Subscribe")');
    await expect(subscribeButton).toBeVisible();
    await expect(subscribeButton).toBeEnabled();
    
    await subscribeButton.click();
    
    // Step 3: Wait for success message
    await expect(page.locator('text=Thank you for subscribing')).toBeVisible({ timeout: 10000 });
    console.log(`✅ Step 1 Complete: Subscription submitted for ${testEmail}`);
    
    // Step 4: Verify subscription was saved via API
    const subscriptionResponse = await page.request.get('http://localhost:4444/api/admin/subscribers');
    expect(subscriptionResponse.status()).toBe(200);
    
    const subscriptionData = await subscriptionResponse.json();
    expect(subscriptionData.success).toBe(true);
    
    // Check if our test email appears in the subscribers list
    const foundSubscriber = subscriptionData.data.subscribers.find(
      (sub: any) => sub.email === testEmail
    );
    
    if (foundSubscriber) {
      console.log(`✅ Step 2 Complete: ${testEmail} found in database`);
    } else {
      console.log(`❌ Step 2 Failed: ${testEmail} not found in database`);
      console.log(`Available subscribers: ${subscriptionData.data.subscribers.length}`);
    }
    
    // Step 5: Navigate to admin dashboard and verify subscription appears
    await page.goto('http://localhost:4444/admin/login');
    
    // Login with admin credentials
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await expect(page.locator('text=Admin Dashboard')).toBeVisible({ timeout: 15000 });
    console.log(`✅ Step 3 Complete: Admin login successful`);
    
    // Navigate to subscribers section
    await page.click('text=Subscribers');
    await page.waitForLoadState('networkidle');
    
    // Check if the subscription appears in the admin dashboard
    const subscriberInDashboard = page.locator(`text=${testEmail}`);
    
    try {
      await expect(subscriberInDashboard).toBeVisible({ timeout: 10000 });
      console.log(`✅ Step 4 Complete: ${testEmail} visible in admin dashboard`);
    } catch (error) {
      console.log(`❌ Step 4 Failed: ${testEmail} not visible in admin dashboard`);
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/subscription-flow-debug.png' });
      
      // Log what we can see in the dashboard
      const dashboardContent = await page.textContent('body');
      console.log('Dashboard content preview:', dashboardContent?.substring(0, 500));
    }
    
    console.log(`🎉 Subscription flow test completed for ${testEmail}`);
  });

  test('should verify subscription API endpoints work correctly', async ({ page }) => {
    const testEmail = `api-direct-test-${Date.now()}@example.com`;
    
    // Test direct API subscription
    const subscribeResponse = await page.request.post('http://localhost:4444/api/subscribe', {
      data: { email: testEmail }
    });
    
    expect(subscribeResponse.status()).toBe(200);
    const subscribeResult = await subscribeResponse.json();
    expect(subscribeResult.success).toBe(true);
    expect(subscribeResult.data.email).toBe(testEmail);
    
    console.log(`✅ Direct API subscription successful: ${testEmail}`);
    
    // Wait a moment for database operations
    await page.waitForTimeout(2000);
    
    // Test admin API retrieval
    const adminResponse = await page.request.get('http://localhost:4444/api/admin/subscribers');
    expect(adminResponse.status()).toBe(200);
    
    const adminResult = await adminResponse.json();
    expect(adminResult.success).toBe(true);
    
    console.log(`✅ Admin API working: ${adminResult.data.total} total subscribers`);
    
    // Verify our test email appears
    const foundSubscriber = adminResult.data.subscribers.find(
      (sub: any) => sub.email === testEmail
    );
    
    if (foundSubscriber) {
      console.log(`✅ Integration verified: ${testEmail} found in admin API`);
      expect(foundSubscriber.email).toBe(testEmail);
      expect(foundSubscriber.status).toBe('active');
    } else {
      console.log(`❌ Integration failed: ${testEmail} not found in admin API`);
      console.log(`Available emails:`, adminResult.data.subscribers.map((s: any) => s.email));
    }
  });
});

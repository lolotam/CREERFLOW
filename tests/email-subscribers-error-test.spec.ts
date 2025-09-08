import { test, expect } from '@playwright/test';

test.describe('Email Subscribers Error Testing', () => {
  test('should test email subscribers loading and error handling', async ({ page }) => {
    console.log('🧪 TESTING: Email subscribers error investigation');
    
    // Navigate to admin login first
    await page.goto('http://localhost:4444/en/admin/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Login to admin dashboard
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Successfully logged into admin dashboard');
    
    // Listen for console errors before navigating
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('🚨 Console Error:', msg.text());
      }
    });
    
    // Listen for network requests
    const failedRequests: any[] = [];
    const successfulRequests: any[] = [];
    
    page.on('response', response => {
      if (response.url().includes('/api/admin/subscribers')) {
        if (response.status() >= 400) {
          failedRequests.push({
            url: response.url(),
            status: response.status(),
            statusText: response.statusText()
          });
          console.log(`❌ Failed Request: ${response.url()} - ${response.status()}`);
        } else {
          successfulRequests.push({
            url: response.url(),
            status: response.status()
          });
          console.log(`✅ Successful Request: ${response.url()} - ${response.status()}`);
        }
      }
    });
    
    // Try to navigate to Email Subscribers section
    const emailSubscribersTab = page.locator('button').filter({ hasText: 'Email Subscribers' });
    await expect(emailSubscribersTab).toBeVisible();
    
    console.log('📧 Clicking Email Subscribers tab');
    await emailSubscribersTab.click();
    
    // Wait for the section to load
    await page.waitForTimeout(3000);
    
    // Check for loading state
    const loadingIndicator = page.locator('text=Loading subscribers');
    console.log('⏳ Checking for loading indicator');
    
    // Wait for either loading to finish or error to appear
    await page.waitForTimeout(5000);
    
    // Log all captured errors and requests
    console.log('📊 SUMMARY:');
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Failed Requests: ${failedRequests.length}`);
    console.log(`Successful Requests: ${successfulRequests.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('🚨 Console Errors Found:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}: ${error}`);
      });
    }
    
    if (failedRequests.length > 0) {
      console.log('❌ Failed Requests Found:');
      failedRequests.forEach((req, index) => {
        console.log(`  ${index + 1}: ${req.url} - ${req.status} ${req.statusText}`);
      });
    }
    
    if (successfulRequests.length > 0) {
      console.log('✅ Successful Requests:');
      successfulRequests.forEach((req, index) => {
        console.log(`  ${index + 1}: ${req.url} - ${req.status}`);
      });
    }
    
    // Check if subscribers table is visible
    const subscribersTable = page.locator('table');
    const tableVisible = await subscribersTable.isVisible().catch(() => false);
    console.log(`📋 Subscribers table visible: ${tableVisible}`);
    
    // Check for error messages in UI
    const errorMessages = await page.locator('text*=Failed').allTextContents();
    if (errorMessages.length > 0) {
      console.log('🚨 UI Error Messages:');
      errorMessages.forEach((msg, index) => {
        console.log(`  ${index + 1}: ${msg}`);
      });
    }
    
    // Test the API directly
    console.log('🔧 Testing API directly...');
    const apiResponse = await page.request.get('http://localhost:4444/api/admin/subscribers?page=1&limit=20');
    console.log(`API Direct Test: ${apiResponse.status()}`);
    
    if (apiResponse.ok()) {
      const data = await apiResponse.json();
      console.log(`API Data: ${JSON.stringify(data, null, 2)}`);
    } else {
      const errorText = await apiResponse.text();
      console.log(`API Error: ${errorText}`);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'email-subscribers-error-test.png', fullPage: true });
    console.log('📸 Screenshot saved: email-subscribers-error-test.png');
  });
});
import { test, expect } from '@playwright/test';

test.describe('Admin Job Management Error Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('should reproduce job management error in admin dashboard', async ({ page }) => {
    // Login to admin dashboard
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of dashboard
    await page.screenshot({ 
      path: 'test-results/admin-dashboard-before-fix.png',
      fullPage: true
    });
    
    // Look for job management section or error messages
    const errorMessages = page.locator('text=/Failed to fetch jobs|Error|Try again/i');
    const jobsSection = page.locator('[data-testid="jobs-section"]');
    
    // Check if there are any error messages visible
    const errorCount = await errorMessages.count();
    if (errorCount > 0) {
      console.log('Found error messages on dashboard');
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorMessages.nth(i).textContent();
        console.log(`Error ${i + 1}: ${errorText}`);
      }
    }
    
    // Check if jobs section exists
    const jobsSectionCount = await jobsSection.count();
    console.log(`Found ${jobsSectionCount} job-related sections`);
    
    // Try to navigate to jobs management if there's a link
    const jobsLink = page.locator('a:has-text("Jobs"), a:has-text("Job Management"), button:has-text("Jobs")');
    const jobsLinkCount = await jobsLink.count();
    
    if (jobsLinkCount > 0) {
      console.log('Found jobs management link, clicking...');
      await jobsLink.first().click();
      await page.waitForTimeout(3000);
      
      // Check for errors after clicking
      const postClickErrors = page.locator('text=/Failed to fetch jobs|Error|Try again/i');
      const postClickErrorCount = await postClickErrors.count();
      
      if (postClickErrorCount > 0) {
        console.log('Found errors after clicking jobs link');
        for (let i = 0; i < postClickErrorCount; i++) {
          const errorText = await postClickErrors.nth(i).textContent();
          console.log(`Post-click Error ${i + 1}: ${errorText}`);
        }
      }
      
      // Take screenshot after clicking
      await page.screenshot({ 
        path: 'test-results/admin-jobs-error.png',
        fullPage: true
      });
    }
    
    // Check network requests for failed API calls
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/api/jobs') && response.status() >= 400) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Reload page to capture network errors
    await page.reload();
    await page.waitForTimeout(5000);
    
    // Log any failed API responses
    if (responses.length > 0) {
      console.log('Failed API responses:');
      responses.forEach(response => {
        console.log(`${response.status} ${response.statusText}: ${response.url}`);
      });
    }
    
    // The test should pass regardless of errors found - we're just documenting them
    expect(true).toBe(true);
  });

  test('should check admin dashboard accessibility', async ({ page }) => {
    // Login to admin dashboard
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify admin dashboard loads
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    
    // Check if we can access the dashboard at all
    const dashboardTitle = await page.title();
    console.log(`Dashboard title: ${dashboardTitle}`);
    
    expect(dashboardTitle).toBeTruthy();
  });
});

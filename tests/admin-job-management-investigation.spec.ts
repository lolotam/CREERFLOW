import { test, expect } from '@playwright/test';

test.describe('Admin Job Management Investigation - 0 of 0 Jobs Issue', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Login to admin dashboard
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should investigate job management section showing 0 of 0 jobs', async ({ page }) => {
    console.log('🔍 INVESTIGATING: Job Management Section - 0 of 0 Jobs Issue');
    
    // Take screenshot of initial dashboard state
    await page.screenshot({ 
      path: 'test-results/admin-dashboard-initial.png',
      fullPage: true
    });
    
    // Look for job management section or tab
    const jobsTab = page.locator('text=Jobs, text=Job Management, button:has-text("Jobs")');
    const jobsTabCount = await jobsTab.count();
    console.log(`📋 Jobs tab/section found: ${jobsTabCount}`);
    
    if (jobsTabCount > 0) {
      // Click on jobs tab/section
      await jobsTab.first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking jobs section
      await page.screenshot({ 
        path: 'test-results/admin-jobs-section.png',
        fullPage: true
      });
    }
    
    // Look for "0 of 0 jobs" text or similar
    const zeroJobsText = page.locator('text=/0.*of.*0.*jobs/i, text=/no.*jobs/i, text=/0.*jobs/i');
    const zeroJobsCount = await zeroJobsText.count();
    console.log(`📊 "0 of 0 jobs" or similar text found: ${zeroJobsCount}`);
    
    if (zeroJobsCount > 0) {
      for (let i = 0; i < zeroJobsCount; i++) {
        const text = await zeroJobsText.nth(i).textContent();
        console.log(`  Text ${i + 1}: "${text}"`);
      }
    }
    
    // Look for job-related elements
    const jobElements = page.locator('[data-testid*="job"], .job, [class*="job"]');
    const jobElementsCount = await jobElements.count();
    console.log(`💼 Job-related elements found: ${jobElementsCount}`);
    
    // Check for loading states
    const loadingElements = page.locator('text=/loading/i, .loading, [data-testid="loading"]');
    const loadingCount = await loadingElements.count();
    console.log(`⏳ Loading elements found: ${loadingCount}`);
    
    // Check for error messages
    const errorElements = page.locator('text=/error/i, text=/failed/i, .error');
    const errorCount = await errorElements.count();
    console.log(`❌ Error elements found: ${errorCount}`);
    
    if (errorCount > 0) {
      for (let i = 0; i < Math.min(errorCount, 3); i++) {
        const errorText = await errorElements.nth(i).textContent();
        console.log(`  Error ${i + 1}: "${errorText}"`);
      }
    }
    
    // Monitor network requests for job-related API calls
    const jobApiRequests = [];
    page.on('response', response => {
      if (response.url().includes('/api') && (response.url().includes('job') || response.url().includes('Job'))) {
        jobApiRequests.push({
          url: response.url(),
          status: response.status(),
          method: response.request().method()
        });
      }
    });
    
    // Refresh the page to capture network requests
    await page.reload();
    await page.waitForTimeout(3000);
    
    console.log(`🌐 Job-related API requests: ${jobApiRequests.length}`);
    jobApiRequests.forEach(req => {
      console.log(`  ${req.method} ${req.status}: ${req.url}`);
    });
    
    // Check if there's a jobs table or list
    const jobsTable = page.locator('table, .table, [role="table"]');
    const jobsTableCount = await jobsTable.count();
    console.log(`📊 Tables found: ${jobsTableCount}`);
    
    if (jobsTableCount > 0) {
      const tableRows = page.locator('tbody tr, .table-row');
      const rowCount = await tableRows.count();
      console.log(`📋 Table rows found: ${rowCount}`);
    }
    
    // Look for pagination or count displays
    const paginationElements = page.locator('text=/page/i, text=/total/i, text=/showing/i');
    const paginationCount = await paginationElements.count();
    console.log(`📄 Pagination/count elements found: ${paginationCount}`);
    
    if (paginationCount > 0) {
      for (let i = 0; i < Math.min(paginationCount, 3); i++) {
        const paginationText = await paginationElements.nth(i).textContent();
        console.log(`  Pagination ${i + 1}: "${paginationText}"`);
      }
    }
    
    console.log('🔍 Investigation complete - data collected for analysis');
  });

  test('should check if jobs exist in the main jobs API', async ({ page }) => {
    console.log('🔍 CHECKING: Main Jobs API for data availability');
    
    // Test the main jobs API endpoint directly
    const response = await page.request.get('http://localhost:3000/api/jobs');
    console.log(`📡 Main Jobs API response status: ${response.status()}`);
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log(`📊 Jobs API response:`, JSON.stringify(data, null, 2));
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`💼 Total jobs in main API: ${data.data.length}`);
        if (data.data.length > 0) {
          console.log(`📋 Sample job:`, data.data[0]);
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Jobs API error: ${errorText}`);
    }
  });

  test('should check admin-specific jobs API if it exists', async ({ page }) => {
    console.log('🔍 CHECKING: Admin-specific Jobs API');
    
    // Test potential admin jobs API endpoints
    const adminEndpoints = [
      '/api/admin/jobs',
      '/api/admin/job-management',
      '/api/jobs/admin',
      '/api/admin/dashboard/jobs'
    ];
    
    for (const endpoint of adminEndpoints) {
      try {
        const response = await page.request.get(`http://localhost:3000${endpoint}`);
        console.log(`📡 ${endpoint} response status: ${response.status()}`);
        
        if (response.status() === 200) {
          const data = await response.json();
          console.log(`📊 ${endpoint} response:`, JSON.stringify(data, null, 2));
        } else if (response.status() !== 404) {
          const errorText = await response.text();
          console.log(`❌ ${endpoint} error: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint} request failed: ${error}`);
      }
    }
  });
});

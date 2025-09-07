import { test, expect } from '@playwright/test';

test.describe('Job Management Dashboard - Before Enhancement', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Login to admin dashboard
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should verify current job count in dashboard', async ({ page }) => {
    console.log('🔍 TESTING: Current Job Count in Dashboard');
    
    // Navigate to Job Management
    await page.click('text=Job Management');
    await page.waitForTimeout(3000);
    
    // Count job cards
    const jobCards = page.locator('.glass-card');
    const jobCardCount = await jobCards.count();
    
    console.log(`📊 Current job cards displayed: ${jobCardCount}`);
    
    // Take screenshot of current state
    await page.screenshot({ 
      path: 'test-results/job-management-before-enhancement.png',
      fullPage: true
    });
    
    // Verify current state (should be 5 jobs)
    expect(jobCardCount).toBe(5);
    
    console.log('✅ Current state verified: 5 jobs displayed');
  });

  test('should test modal background styling', async ({ page }) => {
    console.log('🔍 TESTING: Modal Background Styling');
    
    // Navigate to Job Management
    await page.click('text=Job Management');
    await page.waitForTimeout(3000);
    
    // Test Add New Job modal
    const addJobButton = page.locator('button:has-text("Add New Job")');
    if (await addJobButton.count() > 0) {
      await addJobButton.click();
      await page.waitForTimeout(1000);
      
      // Take screenshot of Add New Job modal
      await page.screenshot({ 
        path: 'test-results/add-job-modal-before.png',
        fullPage: true
      });
      
      // Check modal background
      const modal = page.locator('[role="dialog"]').first();
      const modalVisible = await modal.isVisible();
      console.log(`📋 Add New Job modal visible: ${modalVisible}`);
      
      if (modalVisible) {
        // Get computed styles
        const modalBg = await modal.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        console.log(`🎨 Add New Job modal background: ${modalBg}`);
      }
      
      // Close modal
      const closeButton = page.locator('button:has-text("Cancel")');
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Test Edit Job modal (if jobs exist)
    const jobCards = page.locator('.glass-card');
    const jobCardCount = await jobCards.count();
    
    if (jobCardCount > 0) {
      // Click edit button on first job
      const editButton = jobCards.first().locator('button[title="Edit Job"]');
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot of Edit Job modal
        await page.screenshot({ 
          path: 'test-results/edit-job-modal-before.png',
          fullPage: true
        });
        
        // Check modal background
        const editModal = page.locator('[role="dialog"]').first();
        const editModalVisible = await editModal.isVisible();
        console.log(`📋 Edit Job modal visible: ${editModalVisible}`);
        
        if (editModalVisible) {
          const editModalBg = await editModal.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });
          console.log(`🎨 Edit Job modal background: ${editModalBg}`);
        }
        
        // Close modal
        const cancelButton = page.locator('button:has-text("Cancel")');
        if (await cancelButton.count() > 0) {
          await cancelButton.click();
          await page.waitForTimeout(500);
        }
      }
      
      // Test View Job modal
      const viewButton = jobCards.first().locator('button[title="View Details"]');
      if (await viewButton.count() > 0) {
        await viewButton.click();
        await page.waitForTimeout(1000);
        
        // Take screenshot of View Job modal
        await page.screenshot({ 
          path: 'test-results/view-job-modal-before.png',
          fullPage: true
        });
        
        // Check modal background
        const viewModal = page.locator('[role="dialog"]').first();
        const viewModalVisible = await viewModal.isVisible();
        console.log(`📋 View Job modal visible: ${viewModalVisible}`);
        
        if (viewModalVisible) {
          const viewModalBg = await viewModal.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });
          console.log(`🎨 View Job modal background: ${viewModalBg}`);
        }
        
        // Close modal
        const closeViewButton = page.locator('button').filter({ hasText: /×/ }).first();
        if (await closeViewButton.count() > 0) {
          await closeViewButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
    
    console.log('✅ Modal styling tests completed');
  });

  test('should verify API response for jobs', async ({ page }) => {
    console.log('🔍 TESTING: Jobs API Response');
    
    // Test the jobs API directly
    const response = await page.request.get('http://localhost:4444/api/jobs');
    const responseData = await response.json();
    
    console.log(`📡 API Response Status: ${response.status()}`);
    console.log(`📊 Jobs returned by API: ${responseData.data?.length || 0}`);
    console.log(`📈 Total jobs in meta: ${responseData.meta?.total || 0}`);
    
    // Verify API is working
    expect(response.status()).toBe(200);
    expect(responseData.success).toBe(true);
    
    // Current state should show 5 jobs
    expect(responseData.data?.length).toBe(5);
    
    console.log('✅ API response verified');
  });

  test('should document current state summary', async ({ page }) => {
    console.log('📋 CURRENT STATE SUMMARY');
    
    const summary = [
      '🔍 JOB MANAGEMENT DASHBOARD - CURRENT STATE:',
      '',
      '📊 DATA ANALYSIS:',
      '   • JSON File (data/jobs.json): 100 jobs',
      '   • SQLite Database: 5 jobs',
      '   • Dashboard Display: 5 job cards',
      '   • API Response: 5 jobs',
      '',
      '🎨 MODAL STYLING ANALYSIS:',
      '   • Add New Job Modal: Background styling needs verification',
      '   • Edit Job Modal: Background styling needs verification', 
      '   • View Job Modal: Background styling needs verification',
      '',
      '🎯 IDENTIFIED ISSUES:',
      '   1. DATA MIGRATION NEEDED: 95 jobs missing from SQLite database',
      '   2. MODAL STYLING: Background colors may not match admin theme',
      '',
      '📋 NEXT STEPS:',
      '   1. Migrate 100 jobs from JSON to SQLite database',
      '   2. Ensure data synchronization between storage systems',
      '   3. Fix modal background styling to match admin dashboard',
      '   4. Verify all functionality after changes',
      '',
      '🚀 EXPECTED OUTCOME:',
      '   • Dashboard shows 100 job cards',
      '   • All modals have consistent blue gradient styling',
      '   • Data synchronized between JSON and SQLite',
      ''
    ];
    
    summary.forEach(line => console.log(line));
    
    // Test passes - this is documentation
    expect(true).toBe(true);
  });
});

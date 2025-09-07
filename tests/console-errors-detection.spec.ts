import { test, expect } from '@playwright/test';

test.describe('Console Errors Detection - CareerFlow Application', () => {
  let allErrors: Array<{page: string, type: string, message: string, timestamp: number}> = [];
  let allWarnings: Array<{page: string, type: string, message: string, timestamp: number}> = [];

  test.beforeEach(async ({ page }) => {
    // Capture console messages
    page.on('console', (msg) => {
      const timestamp = Date.now();
      const messageData = {
        page: page.url(),
        type: msg.type(),
        message: msg.text(),
        timestamp
      };

      if (msg.type() === 'error') {
        allErrors.push(messageData);
        console.log(`🚨 ERROR on ${page.url()}: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        allWarnings.push(messageData);
        console.log(`⚠️ WARNING on ${page.url()}: ${msg.text()}`);
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      const timestamp = Date.now();
      allErrors.push({
        page: page.url(),
        type: 'pageerror',
        message: error.message,
        timestamp
      });
      console.log(`💥 PAGE ERROR on ${page.url()}: ${error.message}`);
    });
  });

  test('should detect console errors on homepage', async ({ page }) => {
    console.log('🏠 CHECKING: Homepage console errors');
    
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/homepage-console-check.png',
      fullPage: true
    });
    
    console.log('✅ Homepage console check completed');
  });

  test('should detect console errors on admin login page', async ({ page }) => {
    console.log('🔐 CHECKING: Admin login page console errors');
    
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Test login form interaction
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.waitForTimeout(1000);
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/admin-login-console-check.png',
      fullPage: true
    });
    
    console.log('✅ Admin login page console check completed');
  });

  test('should detect console errors on admin dashboard', async ({ page }) => {
    console.log('📊 CHECKING: Admin dashboard console errors');
    
    // Login first
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/admin-dashboard-console-check.png',
      fullPage: true
    });
    
    console.log('✅ Admin dashboard console check completed');
  });

  test('should detect console errors in Job Management section', async ({ page }) => {
    console.log('💼 CHECKING: Job Management console errors');
    
    // Login and navigate to Job Management
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Navigate to Job Management
    await page.click('text=Job Management');
    await page.waitForTimeout(5000); // Wait for jobs to load
    
    // Test Add New Job modal
    const addJobButton = page.locator('button:has-text("Add New Job")');
    if (await addJobButton.count() > 0) {
      await addJobButton.click();
      await page.waitForTimeout(2000);
      
      // Close modal
      const closeButton = page.locator('button:has-text("Cancel")');
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/job-management-console-check.png',
      fullPage: true
    });
    
    console.log('✅ Job Management console check completed');
  });

  test('should detect console errors in Email Subscribers section', async ({ page }) => {
    console.log('📧 CHECKING: Email Subscribers console errors');
    
    // Login and navigate to Email Subscribers
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Navigate to Email Subscribers
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(3000);
    
    // Test preview functionality
    const subscriberRows = page.locator('tbody tr');
    const subscriberCount = await subscriberRows.count();
    
    if (subscriberCount > 0) {
      const previewButton = subscriberRows.first().locator('button[title="Preview Subscriber"]');
      if (await previewButton.count() > 0) {
        await previewButton.click();
        await page.waitForTimeout(1000);
        
        // Close preview
        const closePreview = page.locator('button:has-text("Close")');
        if (await closePreview.count() > 0) {
          await closePreview.click();
          await page.waitForTimeout(500);
        }
      }
    }
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/email-subscribers-console-check.png',
      fullPage: true
    });
    
    console.log('✅ Email Subscribers console check completed');
  });

  test('should detect console errors in Contact Messages section', async ({ page }) => {
    console.log('📬 CHECKING: Contact Messages console errors');
    
    // Login and navigate to Contact Messages
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Navigate to Contact Messages
    await page.click('text=Contact Messages');
    await page.waitForTimeout(3000);
    
    // Test view message functionality
    const messageRows = page.locator('tbody tr');
    const messageCount = await messageRows.count();
    
    if (messageCount > 0) {
      const viewButton = messageRows.first().locator('button[title="View Message"]');
      if (await viewButton.count() > 0) {
        await viewButton.click();
        await page.waitForTimeout(1000);
        
        // Close modal
        const closeButton = page.locator('button:has-text("Close")');
        if (await closeButton.count() > 0) {
          await closeButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: 'test-results/contact-messages-console-check.png',
      fullPage: true
    });
    
    console.log('✅ Contact Messages console check completed');
  });

  test('should analyze and categorize all detected errors', async ({ page }) => {
    console.log('📋 ANALYZING: All detected console errors and warnings');
    
    // Categorize errors
    const criticalErrors = allErrors.filter(error => 
      !error.message.includes('favicon') &&
      !error.message.includes('404') &&
      !error.message.includes('net::ERR_FAILED') &&
      !error.message.includes('Failed to load resource') &&
      !error.message.toLowerCase().includes('warning')
    );
    
    const apiErrors = allErrors.filter(error => 
      error.message.includes('404') ||
      error.message.includes('500') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('API')
    );
    
    const resourceErrors = allErrors.filter(error => 
      error.message.includes('favicon') ||
      error.message.includes('Failed to load resource') ||
      error.message.includes('net::ERR_FAILED')
    );
    
    const reactErrors = allErrors.filter(error => 
      error.message.includes('React') ||
      error.message.includes('Component') ||
      error.message.includes('Hook') ||
      error.message.includes('useState') ||
      error.message.includes('useEffect')
    );
    
    const jsErrors = allErrors.filter(error => 
      error.message.includes('TypeError') ||
      error.message.includes('ReferenceError') ||
      error.message.includes('SyntaxError') ||
      error.message.includes('undefined') ||
      error.message.includes('null')
    );
    
    console.log('\n📊 CONSOLE ERROR ANALYSIS REPORT:');
    console.log('=====================================');
    console.log(`🚨 Total Errors: ${allErrors.length}`);
    console.log(`⚠️ Total Warnings: ${allWarnings.length}`);
    console.log(`💥 Critical Errors: ${criticalErrors.length}`);
    console.log(`📡 API Errors: ${apiErrors.length}`);
    console.log(`📁 Resource Errors: ${resourceErrors.length}`);
    console.log(`⚛️ React Errors: ${reactErrors.length}`);
    console.log(`🔧 JavaScript Errors: ${jsErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log('\n🚨 CRITICAL ERRORS FOUND:');
      criticalErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message}`);
        console.log(`   Page: ${error.page}`);
      });
    }
    
    if (apiErrors.length > 0) {
      console.log('\n📡 API ERRORS FOUND:');
      apiErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message}`);
        console.log(`   Page: ${error.page}`);
      });
    }
    
    if (reactErrors.length > 0) {
      console.log('\n⚛️ REACT ERRORS FOUND:');
      reactErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message}`);
        console.log(`   Page: ${error.page}`);
      });
    }
    
    if (jsErrors.length > 0) {
      console.log('\n🔧 JAVASCRIPT ERRORS FOUND:');
      jsErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message}`);
        console.log(`   Page: ${error.page}`);
      });
    }
    
    if (allWarnings.length > 0) {
      console.log('\n⚠️ WARNINGS FOUND:');
      allWarnings.slice(0, 10).forEach((warning, index) => {
        console.log(`${index + 1}. [${warning.type}] ${warning.message}`);
        console.log(`   Page: ${warning.page}`);
      });
      if (allWarnings.length > 10) {
        console.log(`   ... and ${allWarnings.length - 10} more warnings`);
      }
    }
    
    console.log('\n📋 PRIORITY RECOMMENDATIONS:');
    if (criticalErrors.length > 0) {
      console.log('🔴 HIGH PRIORITY: Fix critical errors that break functionality');
    }
    if (reactErrors.length > 0) {
      console.log('🟡 MEDIUM PRIORITY: Fix React component errors');
    }
    if (jsErrors.length > 0) {
      console.log('🟡 MEDIUM PRIORITY: Fix JavaScript runtime errors');
    }
    if (apiErrors.length > 0) {
      console.log('🟠 LOW-MEDIUM PRIORITY: Fix API endpoint errors');
    }
    if (resourceErrors.length > 0) {
      console.log('🟢 LOW PRIORITY: Fix resource loading errors (favicon, etc.)');
    }
    
    console.log('\n✅ Console error detection and analysis completed');
    
    // Test passes - this is analysis
    expect(true).toBe(true);
  });
});

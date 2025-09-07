import { test, expect } from '@playwright/test';

test.describe('Comprehensive Console Error Check', () => {
  const errors: Array<{ page: string; error: string; type: string }> = [];
  const warnings: Array<{ page: string; warning: string }> = [];

  // Critical pages to test
  const pagesToTest = [
    { path: '/', name: 'Home' },
    { path: '/en', name: 'Home (English)' },
    { path: '/fr', name: 'Home (French)' },
    { path: '/en/jobs', name: 'Jobs' },
    { path: '/en/about', name: 'About' },
    { path: '/en/contact', name: 'Contact' },
    { path: '/admin', name: 'Admin Login' },
  ];

  test.beforeEach(async ({ page }) => {
    // Capture console errors and warnings
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const location = msg.location();
        errors.push({
          page: page.url(),
          error: text,
          type: 'console'
        });
        console.error(`❌ Console Error: ${text}`);
        if (location.url) {
          console.error(`   Location: ${location.url}:${location.lineNumber}:${location.columnNumber}`);
        }
      }
      if (msg.type() === 'warning') {
        warnings.push({
          page: page.url(),
          warning: msg.text()
        });
      }
    });

    // Capture page errors (uncaught exceptions, syntax errors)
    page.on('pageerror', error => {
      errors.push({
        page: page.url(),
        error: error.message,
        type: 'pageerror'
      });
      console.error(`❌ Page Error: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack}`);
      }
    });

    // Capture failed requests
    page.on('requestfailed', request => {
      const failure = request.failure();
      if (failure) {
        errors.push({
          page: page.url(),
          error: `Failed request: ${request.url()} - ${failure.errorText}`,
          type: 'network'
        });
        console.error(`❌ Network Error: ${request.url()} - ${failure.errorText}`);
      }
    });
  });

  // Test each page
  for (const pageInfo of pagesToTest) {
    test(`Check ${pageInfo.name} page (${pageInfo.path})`, async ({ page }) => {
      console.log(`\n🔍 Testing: ${pageInfo.name} (${pageInfo.path})`);
      
      // Navigate to the page
      const response = await page.goto(`http://localhost:4444${pageInfo.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Check response status
      expect(response?.status()).toBeLessThan(400);
      
      // Wait for any dynamic content
      await page.waitForTimeout(2000);

      // Check for specific common errors
      const pageContent = await page.content();
      
      // Check for React hydration errors
      const hydrationErrors = await page.locator('text=/hydration/i').count();
      if (hydrationErrors > 0) {
        console.error(`❌ Hydration error detected on ${pageInfo.name}`);
      }

      // Check for Next.js specific errors
      const nextErrors = await page.locator('text=/Error occurred prerendering page/i').count();
      if (nextErrors > 0) {
        console.error(`❌ Next.js prerendering error on ${pageInfo.name}`);
      }
    });
  }

  test('Admin Dashboard - Full Functionality', async ({ page }) => {
    console.log(`\n🔍 Testing: Admin Dashboard with login`);
    
    // Go to admin page
    await page.goto('http://localhost:4444/admin');
    
    // Login
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'admin@careerflow2024!');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Test each dashboard section
    const sections = [
      'Job Management',
      'Email Subscribers',
      'Contact Messages',
      'Settings'
    ];

    for (const section of sections) {
      const sectionButton = page.locator(`button:has-text("${section}")`);
      if (await sectionButton.isVisible()) {
        await sectionButton.click();
        await page.waitForTimeout(1000);
        console.log(`✓ Tested ${section} section`);
      }
    }
  });

  test.afterAll(() => {
    console.log('\n' + '='.repeat(60));
    console.log('COMPREHENSIVE ERROR REPORT');
    console.log('='.repeat(60));
    
    if (errors.length === 0) {
      console.log('✅ No console errors detected!');
    } else {
      console.log(`\n❌ Total Errors Found: ${errors.length}`);
      console.log('\nError Summary by Type:');
      
      const errorsByType = errors.reduce((acc, err) => {
        acc[err.type] = (acc[err.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(errorsByType).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count} errors`);
      });
      
      console.log('\nDetailed Errors:');
      errors.forEach((err, index) => {
        console.log(`\n${index + 1}. [${err.type}] on ${err.page}`);
        console.log(`   ${err.error}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log(`\n⚠️ Total Warnings: ${warnings.length}`);
    }
    
    console.log('\n' + '='.repeat(60));
  });
});
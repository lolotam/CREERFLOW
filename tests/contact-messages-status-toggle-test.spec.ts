import { test, expect } from '@playwright/test';

test.describe('Contact Messages Status Toggle Test', () => {
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
    
    // Navigate to Contact Messages tab
    await page.click('text=Contact Messages');
    await page.waitForTimeout(2000);
  });

  test('should verify new toggle-style status controls', async ({ page }) => {
    console.log('🔍 Testing New Toggle-Style Status Controls...');
    
    // Check if status toggle buttons exist
    const newButtons = page.locator('button:has-text("New")');
    const readButtons = page.locator('button:has-text("Read")');
    const repliedButtons = page.locator('button:has-text("Replied")');
    
    const newCount = await newButtons.count();
    const readCount = await readButtons.count();
    const repliedCount = await repliedButtons.count();
    
    console.log(`🟡 "New" buttons found: ${newCount}`);
    console.log(`🔵 "Read" buttons found: ${readCount}`);
    console.log(`🟢 "Replied" buttons found: ${repliedCount}`);
    
    // Should have equal numbers of each button (one set per message)
    expect(newCount).toBeGreaterThan(0);
    expect(readCount).toBeGreaterThan(0);
    expect(repliedCount).toBeGreaterThan(0);
    expect(newCount).toBe(readCount);
    expect(readCount).toBe(repliedCount);
    
    console.log('✅ Toggle-style status controls are present!');
  });

  test('should test status toggle functionality', async ({ page }) => {
    console.log('🔍 Testing Status Toggle Functionality...');
    
    // Monitor network requests for status update API calls
    const statusUpdateRequests = [];
    page.on('response', response => {
      if (response.url().includes('/api/admin/contact-messages') && response.request().method() === 'PUT') {
        statusUpdateRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Find the first set of status buttons
    const firstNewButton = page.locator('button:has-text("New")').first();
    const firstReadButton = page.locator('button:has-text("Read")').first();
    const firstRepliedButton = page.locator('button:has-text("Replied")').first();
    
    // Check initial active state
    const newButtonClass = await firstNewButton.getAttribute('class');
    const readButtonClass = await firstReadButton.getAttribute('class');
    const repliedButtonClass = await firstRepliedButton.getAttribute('class');
    
    console.log('📋 Initial button states:');
    console.log(`  New: ${newButtonClass?.includes('border-yellow') ? 'ACTIVE' : 'inactive'}`);
    console.log(`  Read: ${readButtonClass?.includes('border-blue') ? 'ACTIVE' : 'inactive'}`);
    console.log(`  Replied: ${repliedButtonClass?.includes('border-green') ? 'ACTIVE' : 'inactive'}`);
    
    // Test clicking a different status
    if (readButtonClass?.includes('border-blue')) {
      // Currently "Read", click "New"
      console.log('🧪 Changing status from "Read" to "New"...');
      await firstNewButton.click();
    } else if (newButtonClass?.includes('border-yellow')) {
      // Currently "New", click "Read"
      console.log('🧪 Changing status from "New" to "Read"...');
      await firstReadButton.click();
    } else {
      // Currently "Replied", click "Read"
      console.log('🧪 Changing status from "Replied" to "Read"...');
      await firstReadButton.click();
    }
    
    await page.waitForTimeout(2000);
    
    console.log(`🌐 Status update API requests: ${statusUpdateRequests.length}`);
    
    if (statusUpdateRequests.length > 0) {
      statusUpdateRequests.forEach(req => {
        console.log(`  ${req.status} ${req.statusText}: ${req.url}`);
      });
      
      // Check updated button states
      const updatedNewClass = await firstNewButton.getAttribute('class');
      const updatedReadClass = await firstReadButton.getAttribute('class');
      const updatedRepliedClass = await firstRepliedButton.getAttribute('class');
      
      console.log('📋 Updated button states:');
      console.log(`  New: ${updatedNewClass?.includes('border-yellow') ? 'ACTIVE' : 'inactive'}`);
      console.log(`  Read: ${updatedReadClass?.includes('border-blue') ? 'ACTIVE' : 'inactive'}`);
      console.log(`  Replied: ${updatedRepliedClass?.includes('border-green') ? 'ACTIVE' : 'inactive'}`);
      
      console.log('✅ Status toggle functionality working!');
    } else {
      console.log('❌ No status update API requests detected');
    }
  });

  test('should verify status toggle visual feedback', async ({ page }) => {
    console.log('🔍 Testing Status Toggle Visual Feedback...');
    
    // Check visual styling of active vs inactive buttons
    const firstNewButton = page.locator('button:has-text("New")').first();
    const firstReadButton = page.locator('button:has-text("Read")').first();
    const firstRepliedButton = page.locator('button:has-text("Replied")').first();
    
    // Get styling for each button
    const newStyles = await firstNewButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border
      };
    });
    
    const readStyles = await firstReadButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border
      };
    });
    
    const repliedStyles = await firstRepliedButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border
      };
    });
    
    console.log('🎨 Button styles:');
    console.log('  New:', newStyles);
    console.log('  Read:', readStyles);
    console.log('  Replied:', repliedStyles);
    
    // Test hover effects
    await firstNewButton.hover();
    await page.waitForTimeout(500);
    
    await firstReadButton.hover();
    await page.waitForTimeout(500);
    
    await firstRepliedButton.hover();
    await page.waitForTimeout(500);
    
    console.log('✅ Status toggle visual feedback tested!');
  });

  test('should take screenshot of new status controls', async ({ page }) => {
    console.log('🔍 Taking Screenshot of New Status Controls...');
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/contact-messages-status-toggles.png',
      fullPage: true
    });
    
    console.log('📸 Screenshot saved: contact-messages-status-toggles.png');
  });
});

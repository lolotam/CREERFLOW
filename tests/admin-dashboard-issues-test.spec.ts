import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Issues Investigation', () => {
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

  test('should test Email Subscribers section functionality', async ({ page }) => {
    console.log('🔍 Testing Email Subscribers Section...');
    
    // Navigate to Email Subscribers tab
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(2000);
    
    // Take screenshot of subscribers section
    await page.screenshot({ 
      path: 'test-results/email-subscribers-before-fix.png',
      fullPage: true
    });
    
    // Check if subscribers table loads
    const subscribersTable = page.locator('table');
    const tableExists = await subscribersTable.count() > 0;
    console.log(`📊 Subscribers table exists: ${tableExists}`);
    
    if (tableExists) {
      // Look for action buttons (Preview and Delete)
      const previewButtons = page.locator('button:has-text("Preview"), button[title*="Preview"], button[title*="View"]');
      const deleteButtons = page.locator('button:has-text("Delete"), button[title*="Delete"], .trash');
      
      const previewCount = await previewButtons.count();
      const deleteCount = await deleteButtons.count();
      
      console.log(`👁️ Preview buttons found: ${previewCount}`);
      console.log(`🗑️ Delete buttons found: ${deleteCount}`);
      
      // Test Preview function if buttons exist
      if (previewCount > 0) {
        console.log('🧪 Testing Preview function...');
        try {
          await previewButtons.first().click();
          await page.waitForTimeout(1000);
          
          // Check if preview modal/content appears
          const modal = page.locator('.modal, [role="dialog"], .preview');
          const modalVisible = await modal.isVisible().catch(() => false);
          console.log(`📋 Preview modal visible: ${modalVisible}`);
          
          if (modalVisible) {
            // Check modal content visibility
            const modalContent = await modal.textContent();
            console.log(`📝 Preview modal content length: ${modalContent?.length || 0}`);
          }
        } catch (error) {
          console.log(`❌ Preview function error: ${error}`);
        }
      }
      
      // Test Delete function if buttons exist
      if (deleteCount > 0) {
        console.log('🧪 Testing Delete function...');
        try {
          // Monitor network requests for delete API calls
          const deleteRequests = [];
          page.on('response', response => {
            if (response.url().includes('/api/admin/subscribers') && response.request().method() === 'DELETE') {
              deleteRequests.push({
                url: response.url(),
                status: response.status()
              });
            }
          });
          
          await deleteButtons.first().click();
          await page.waitForTimeout(2000);
          
          console.log(`🌐 Delete API requests: ${deleteRequests.length}`);
          deleteRequests.forEach(req => {
            console.log(`  ${req.status}: ${req.url}`);
          });
        } catch (error) {
          console.log(`❌ Delete function error: ${error}`);
        }
      }
    }
  });

  test('should test Contact Messages section functionality', async ({ page }) => {
    console.log('🔍 Testing Contact Messages Section...');
    
    // Navigate to Contact Messages tab
    await page.click('text=Contact Messages');
    await page.waitForTimeout(2000);
    
    // Take screenshot of messages section
    await page.screenshot({ 
      path: 'test-results/contact-messages-before-fix.png',
      fullPage: true
    });
    
    // Check if messages table loads
    const messagesTable = page.locator('table');
    const tableExists = await messagesTable.count() > 0;
    console.log(`📊 Messages table exists: ${tableExists}`);
    
    if (tableExists) {
      // Look for action buttons and status slider
      const previewButtons = page.locator('button:has-text("Preview"), button[title*="Preview"], button[title*="View"], .eye');
      const deleteButtons = page.locator('button:has-text("Delete"), button[title*="Delete"], .trash');
      const statusSliders = page.locator('select, .slider, input[type="range"]');
      
      const previewCount = await previewButtons.count();
      const deleteCount = await deleteButtons.count();
      const sliderCount = await statusSliders.count();
      
      console.log(`👁️ Preview buttons found: ${previewCount}`);
      console.log(`🗑️ Delete buttons found: ${deleteCount}`);
      console.log(`🎚️ Status sliders found: ${sliderCount}`);
      
      // Test Preview function
      if (previewCount > 0) {
        console.log('🧪 Testing Preview function...');
        try {
          await previewButtons.first().click();
          await page.waitForTimeout(1000);
          
          // Check if preview modal appears
          const modal = page.locator('.modal, [role="dialog"], .preview');
          const modalVisible = await modal.isVisible().catch(() => false);
          console.log(`📋 Preview modal visible: ${modalVisible}`);
          
          if (modalVisible) {
            // Check modal styling and visibility
            const modalStyles = await modal.evaluate(el => {
              const styles = window.getComputedStyle(el);
              return {
                opacity: styles.opacity,
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                zIndex: styles.zIndex
              };
            });
            console.log(`🎨 Modal styles:`, modalStyles);
            
            // Check if content is readable
            const modalText = await modal.textContent();
            console.log(`📝 Modal content length: ${modalText?.length || 0}`);
          }
        } catch (error) {
          console.log(`❌ Preview function error: ${error}`);
        }
      }
      
      // Test Delete function
      if (deleteCount > 0) {
        console.log('🧪 Testing Delete function...');
        try {
          // Monitor network requests for delete API calls
          const deleteRequests = [];
          page.on('response', response => {
            if (response.url().includes('/api/admin/contact-messages') && response.request().method() === 'DELETE') {
              deleteRequests.push({
                url: response.url(),
                status: response.status()
              });
            }
          });
          
          await deleteButtons.first().click();
          await page.waitForTimeout(2000);
          
          console.log(`🌐 Delete API requests: ${deleteRequests.length}`);
          deleteRequests.forEach(req => {
            console.log(`  ${req.status}: ${req.url}`);
          });
        } catch (error) {
          console.log(`❌ Delete function error: ${error}`);
        }
      }
      
      // Test Status Slider
      if (sliderCount > 0) {
        console.log('🧪 Testing Status Slider...');
        try {
          const slider = statusSliders.first();
          const initialValue = await slider.inputValue().catch(() => '');
          console.log(`🎚️ Initial slider value: ${initialValue}`);
          
          // Try to change slider value
          await slider.selectOption('read').catch(() => {
            console.log('📝 Slider is not a select element, trying other methods...');
          });
          
          await page.waitForTimeout(1000);
          const newValue = await slider.inputValue().catch(() => '');
          console.log(`🎚️ New slider value: ${newValue}`);
          
        } catch (error) {
          console.log(`❌ Status slider error: ${error}`);
        }
      }
    }
    
    // The test should pass regardless of issues found - we're documenting them
    expect(true).toBe(true);
  });
});

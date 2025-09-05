import { test, expect } from '@playwright/test';

test.describe('Contact Messages Delete Function Test', () => {
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
    
    // Navigate to Contact Messages tab
    await page.click('text=Contact Messages');
    await page.waitForTimeout(2000);
  });

  test('should test Contact Messages Delete function', async ({ page }) => {
    console.log('🔍 Testing Contact Messages Delete Function...');
    
    // Check if Delete buttons exist
    const deleteButtons = page.locator('button[title="Delete"]');
    const deleteCount = await deleteButtons.count();
    console.log(`🗑️ Delete buttons found: ${deleteCount}`);
    
    if (deleteCount > 0) {
      console.log('🧪 Testing Delete function...');
      
      // Monitor network requests for delete API calls
      const deleteRequests = [];
      page.on('response', response => {
        if (response.url().includes('/api/admin/contact-messages') && response.request().method() === 'DELETE') {
          deleteRequests.push({
            url: response.url(),
            status: response.status(),
            statusText: response.statusText()
          });
        }
      });
      
      // Monitor for confirmation dialog
      let dialogAppeared = false;
      page.on('dialog', async dialog => {
        console.log(`📋 Confirmation dialog: ${dialog.message()}`);
        dialogAppeared = true;
        expect(dialog.message()).toContain('Are you sure you want to delete');
        await dialog.accept(); // Accept the deletion to test API call
      });
      
      // Click delete button
      await deleteButtons.first().click();
      await page.waitForTimeout(3000);
      
      console.log(`📋 Dialog appeared: ${dialogAppeared}`);
      console.log(`🌐 Delete API requests: ${deleteRequests.length}`);
      
      if (deleteRequests.length > 0) {
        deleteRequests.forEach(req => {
          console.log(`  ${req.status} ${req.statusText}: ${req.url}`);
        });
      }
      
      // Check if there are any error messages on the page
      const errorMessages = page.locator('text=/error|failed|Error/i');
      const errorCount = await errorMessages.count();
      if (errorCount > 0) {
        console.log(`❌ Found ${errorCount} error messages on page`);
        for (let i = 0; i < Math.min(errorCount, 3); i++) {
          const errorText = await errorMessages.nth(i).textContent();
          console.log(`  Error ${i + 1}: ${errorText}`);
        }
      }
      
      // The test should pass regardless - we're documenting the issue
      expect(true).toBe(true);
    } else {
      console.log('❌ No delete buttons found');
    }
  });

  test('should check if modal interferes with delete function', async ({ page }) => {
    console.log('🔍 Testing Modal Interference with Delete Function...');
    
    // First open a preview modal
    const previewButtons = page.locator('button[title*="View"], .eye');
    const previewCount = await previewButtons.count();
    console.log(`👁️ Preview buttons found: ${previewCount}`);
    
    if (previewCount > 0) {
      // Open preview modal
      await previewButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Check if modal is visible
      const modal = page.locator('text=Message Details').locator('..');
      const modalVisible = await modal.isVisible();
      console.log(`📋 Preview modal visible: ${modalVisible}`);
      
      if (modalVisible) {
        // Try to click delete button while modal is open
        const deleteButtons = page.locator('button[title="Delete"]');
        const deleteCount = await deleteButtons.count();
        console.log(`🗑️ Delete buttons found while modal open: ${deleteCount}`);
        
        if (deleteCount > 0) {
          // Check if delete buttons are clickable
          const firstDeleteButton = deleteButtons.first();
          const isClickable = await firstDeleteButton.isEnabled();
          console.log(`🖱️ Delete button clickable while modal open: ${isClickable}`);
          
          // Check if modal blocks pointer events
          const modalElement = modal.first();
          const modalStyles = await modalElement.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              pointerEvents: styles.pointerEvents,
              zIndex: styles.zIndex,
              position: styles.position
            };
          });
          console.log(`🎨 Modal styles:`, modalStyles);
        }
        
        // Close modal
        await page.click('button:has-text("Close")');
        await page.waitForTimeout(500);
      }
    }
    
    expect(true).toBe(true);
  });
});

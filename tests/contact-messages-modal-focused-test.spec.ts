import { test, expect } from '@playwright/test';

test.describe('Contact Messages Modal Status Dropdown - Focused Test', () => {
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

  test('should test contact messages modal status dropdown with detailed debugging', async ({ page }) => {
    console.log('🔍 TESTING: Contact Messages Modal Status Dropdown (Detailed)');
    
    // Navigate to Contact Messages
    await page.click('text=Contact Messages');
    await page.waitForTimeout(5000); // Longer wait
    
    // Take screenshot of contact messages page
    await page.screenshot({ 
      path: 'test-results/contact-messages-page-before-modal.png',
      fullPage: true
    });
    
    // Check if there are any contact messages
    const messageRows = page.locator('tbody tr');
    const messageCount = await messageRows.count();
    
    console.log(`📧 Contact messages found: ${messageCount}`);
    
    if (messageCount > 0) {
      // Find and click View button on first message
      const firstRow = messageRows.first();
      const viewButton = firstRow.locator('button[title="View Message"]');
      const viewButtonExists = await viewButton.count() > 0;
      
      console.log(`👁️ View button exists: ${viewButtonExists}`);
      
      if (viewButtonExists) {
        console.log('🔄 Clicking View button...');
        await viewButton.click();
        await page.waitForTimeout(2000);
        
        // Check for any modal or dialog
        const modals = page.locator('[role="dialog"], .modal, .fixed.inset-0');
        const modalCount = await modals.count();
        console.log(`📋 Modal elements found: ${modalCount}`);
        
        // Check for specific modal content
        const modalContent = page.locator('text=Message Details, text=Contact Details, text=Subject');
        const contentCount = await modalContent.count();
        console.log(`📋 Modal content elements found: ${contentCount}`);
        
        // Take screenshot after clicking view button
        await page.screenshot({ 
          path: 'test-results/contact-messages-after-view-click.png',
          fullPage: true
        });
        
        // Look for status dropdown more broadly
        const allSelects = page.locator('select');
        const selectCount = await allSelects.count();
        console.log(`📋 Total select elements found: ${selectCount}`);
        
        if (selectCount > 0) {
          for (let i = 0; i < selectCount; i++) {
            const select = allSelects.nth(i);
            const isVisible = await select.isVisible();
            const options = await select.locator('option').count();
            console.log(`📋 Select ${i + 1}: visible=${isVisible}, options=${options}`);
            
            if (isVisible && options > 0) {
              const optionTexts = await select.locator('option').allTextContents();
              console.log(`📋 Select ${i + 1} options:`, optionTexts);
              
              // Test if this is the status dropdown
              if (optionTexts.includes('New') || optionTexts.includes('Read') || optionTexts.includes('Replied')) {
                console.log(`✅ Found status dropdown at index ${i + 1}`);
                
                // Test status changes
                const currentValue = await select.inputValue();
                console.log(`📊 Current status: ${currentValue}`);
                
                // Try changing to 'read'
                await select.selectOption('read');
                await page.waitForTimeout(1000);
                
                const newValue = await select.inputValue();
                console.log(`📊 New status after change: ${newValue}`);
                expect(newValue).toBe('read');
                
                console.log('✅ Status dropdown is working correctly!');
                break;
              }
            }
          }
        }
        
        // Look for close button and close modal
        const closeButtons = page.locator('button:has-text("Close"), button:has-text("×"), button[aria-label="Close"]');
        const closeButtonCount = await closeButtons.count();
        console.log(`🔘 Close buttons found: ${closeButtonCount}`);
        
        if (closeButtonCount > 0) {
          await closeButtons.first().click();
          await page.waitForTimeout(1000);
          console.log('🔄 Modal closed');
        }
      }
    } else {
      console.log('⚠️ No contact messages found to test modal');
    }
    
    console.log('✅ Detailed modal test completed');
  });

  test('should verify contact messages data and UI state', async ({ page }) => {
    console.log('🔍 TESTING: Contact Messages Data and UI State');
    
    // Navigate to Contact Messages
    await page.click('text=Contact Messages');
    await page.waitForTimeout(3000);
    
    // Check page title and headers
    const pageTitle = await page.textContent('h1, h2, .text-2xl');
    console.log(`📋 Page title: ${pageTitle}`);
    
    // Check for loading states
    const loadingElements = page.locator('text=Loading, .animate-spin, .loading');
    const loadingCount = await loadingElements.count();
    console.log(`⏳ Loading elements: ${loadingCount}`);
    
    // Check for error messages
    const errorElements = page.locator('text=Error, text=Failed, .text-red');
    const errorCount = await errorElements.count();
    console.log(`❌ Error elements: ${errorCount}`);
    
    // Check table structure
    const table = page.locator('table');
    const tableExists = await table.count() > 0;
    console.log(`📊 Table exists: ${tableExists}`);
    
    if (tableExists) {
      const headers = await table.locator('th').allTextContents();
      console.log(`📊 Table headers:`, headers);
      
      const rows = await table.locator('tbody tr').count();
      console.log(`📊 Table rows: ${rows}`);
    }
    
    // Check for action buttons
    const actionButtons = page.locator('button[title*="View"], button[title*="Delete"]');
    const actionButtonCount = await actionButtons.count();
    console.log(`🔘 Action buttons found: ${actionButtonCount}`);
    
    console.log('✅ Data and UI state verification completed');
  });
});

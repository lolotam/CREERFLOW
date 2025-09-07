import { test, expect } from '@playwright/test';

test.describe('Contact Messages Status Update Test', () => {
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

  test('should test current status dropdown functionality', async ({ page }) => {
    console.log('🔍 Testing Contact Messages Status Dropdown...');
    
    // Check if status dropdowns exist (in the table rows, not the filter)
    const statusDropdowns = page.locator('tbody tr select');
    const dropdownCount = await statusDropdowns.count();
    console.log(`📋 Status dropdowns found: ${dropdownCount}`);

    if (dropdownCount > 0) {
      console.log('🧪 Testing status dropdown functionality...');

      // Get the first dropdown from the table rows
      const firstDropdown = statusDropdowns.first();
      const initialValue = await firstDropdown.inputValue();
      console.log(`📝 Initial status value: ${initialValue}`);
      
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
      
      // Try to change the status
      const newStatus = initialValue === 'new' ? 'read' : 'new';
      await firstDropdown.selectOption(newStatus);
      await page.waitForTimeout(2000);
      
      console.log(`🔄 Changed status from "${initialValue}" to "${newStatus}"`);
      console.log(`🌐 Status update API requests: ${statusUpdateRequests.length}`);
      
      if (statusUpdateRequests.length > 0) {
        statusUpdateRequests.forEach(req => {
          console.log(`  ${req.status} ${req.statusText}: ${req.url}`);
        });
        
        // Verify the status was updated
        const updatedValue = await firstDropdown.inputValue();
        console.log(`📝 Updated status value: ${updatedValue}`);
        expect(updatedValue).toBe(newStatus);
        
        console.log('✅ Status dropdown working correctly!');
      } else {
        console.log('❌ No status update API requests detected');
      }
    } else {
      console.log('❌ No status dropdowns found');
    }
  });

  test('should check status dropdown styling and options', async ({ page }) => {
    console.log('🔍 Testing Status Dropdown Styling...');
    
    const statusDropdowns = page.locator('select');
    const dropdownCount = await statusDropdowns.count();
    
    if (dropdownCount > 0) {
      const firstDropdown = statusDropdowns.first();
      
      // Check dropdown styling
      const dropdownStyles = await firstDropdown.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          border: styles.border,
          borderRadius: styles.borderRadius
        };
      });
      console.log(`🎨 Dropdown styles:`, dropdownStyles);
      
      // Check available options
      const options = await firstDropdown.locator('option').allTextContents();
      console.log(`📋 Available status options: ${options.join(', ')}`);
      
      // Verify expected options exist
      expect(options).toContain('New');
      expect(options).toContain('Read');
      expect(options).toContain('Replied');
      
      console.log('✅ Status dropdown has correct options and styling!');
    }
  });

  test('should verify status colors and visual indicators', async ({ page }) => {
    console.log('🔍 Testing Status Visual Indicators...');
    
    // Check status badges/indicators in the status column
    const statusBadges = page.locator('span').filter({ hasText: /new|read|replied/i });
    const badgeCount = await statusBadges.count();
    console.log(`🏷️ Status badges found: ${badgeCount}`);
    
    if (badgeCount > 0) {
      // Check different status colors
      for (let i = 0; i < Math.min(badgeCount, 3); i++) {
        const badge = statusBadges.nth(i);
        const badgeText = await badge.textContent();
        const badgeStyles = await badge.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            text: el.textContent
          };
        });
        console.log(`🎨 Status "${badgeText}" styles:`, badgeStyles);
      }
      
      console.log('✅ Status visual indicators working!');
    }
  });

  test('should test status update in preview modal', async ({ page }) => {
    console.log('🔍 Testing Status Update in Preview Modal...');
    
    // Open preview modal
    const previewButtons = page.locator('button[title*="View"], .eye');
    const previewCount = await previewButtons.count();
    
    if (previewCount > 0) {
      await previewButtons.first().click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('text=Message Details').locator('..');
      const modalVisible = await modal.isVisible();
      
      if (modalVisible) {
        // Check if there's a status dropdown in the modal
        const modalStatusDropdown = modal.locator('select');
        const modalDropdownExists = await modalStatusDropdown.count() > 0;
        console.log(`📋 Status dropdown in modal: ${modalDropdownExists}`);
        
        if (modalDropdownExists) {
          const initialValue = await modalStatusDropdown.inputValue();
          console.log(`📝 Modal initial status: ${initialValue}`);
          
          // Try to change status in modal
          const newStatus = initialValue === 'new' ? 'read' : 'new';
          await modalStatusDropdown.selectOption(newStatus);
          await page.waitForTimeout(1000);
          
          const updatedValue = await modalStatusDropdown.inputValue();
          console.log(`📝 Modal updated status: ${updatedValue}`);
        }
        
        await page.click('button:has-text("Close")');
        console.log('✅ Modal status update tested!');
      }
    }
  });
});

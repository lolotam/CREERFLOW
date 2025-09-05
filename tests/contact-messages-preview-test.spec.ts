import { test, expect } from '@playwright/test';

test.describe('Contact Messages Preview UI Fix Test', () => {
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

  test('should verify Preview modal visibility and styling', async ({ page }) => {
    console.log('🔍 Testing Contact Messages Preview UI...');
    
    // Check if Preview buttons exist
    const previewButtons = page.locator('button[title*="View"], .eye');
    const previewCount = await previewButtons.count();
    console.log(`👁️ Preview buttons found: ${previewCount}`);
    
    if (previewCount > 0) {
      console.log('🧪 Testing Preview modal visibility...');
      
      // Click the first Preview button
      await previewButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Check if preview modal appears
      const modal = page.locator('text=Message Details').locator('..');
      const modalVisible = await modal.isVisible();
      console.log(`📋 Preview modal visible: ${modalVisible}`);
      
      expect(modalVisible).toBe(true);
      
      if (modalVisible) {
        // Check modal styling and visibility
        const modalElement = page.locator('div:has-text("Message Details")').first();
        const modalStyles = await modalElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            opacity: styles.opacity,
            zIndex: styles.zIndex,
            visibility: styles.visibility
          };
        });
        console.log(`🎨 Modal styles:`, modalStyles);
        
        // Verify modal is not transparent
        expect(modalStyles.opacity).toBe('1');
        expect(modalStyles.visibility).toBe('visible');
        
        // Check if modal content is readable
        await expect(page.locator('text=Message Details')).toBeVisible();
        await expect(page.locator('text=From:')).toBeVisible();
        await expect(page.locator('text=Subject:')).toBeVisible();
        await expect(page.locator('text=Date:')).toBeVisible();
        await expect(page.locator('text=Status:')).toBeVisible();
        await expect(page.locator('text=Message:')).toBeVisible();
        
        // Check text contrast and readability
        const messageContent = page.locator('div:has-text("Message:") + div');
        if (await messageContent.isVisible()) {
          const contentStyles = await messageContent.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              color: styles.color,
              backgroundColor: styles.backgroundColor
            };
          });
          console.log(`📝 Message content styles:`, contentStyles);
        }
        
        // Take screenshot for visual verification
        await page.screenshot({ 
          path: 'test-results/contact-messages-preview-after-fix.png',
          fullPage: true
        });
        
        // Close modal
        await page.click('button:has-text("Close")');
        await page.waitForTimeout(500);
        
        // Verify modal is closed
        const modalClosed = await modal.isVisible();
        expect(modalClosed).toBe(false);
        
        console.log('✅ Preview modal UI working correctly!');
      }
    } else {
      console.log('❌ No preview buttons found');
    }
  });

  test('should verify modal does not interfere with other functions', async ({ page }) => {
    console.log('🔍 Testing Modal Interference...');
    
    // Open preview modal
    const previewButtons = page.locator('button[title*="View"], .eye');
    const previewCount = await previewButtons.count();
    
    if (previewCount > 0) {
      // Open modal
      await previewButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Check if modal blocks other interactions
      const modal = page.locator('text=Message Details').locator('..');
      const modalVisible = await modal.isVisible();
      
      if (modalVisible) {
        // Check if background elements are still accessible
        const deleteButtons = page.locator('button[title="Delete"]');
        const deleteCount = await deleteButtons.count();
        console.log(`🗑️ Delete buttons visible while modal open: ${deleteCount}`);
        
        // Modal should not block background interactions when closed
        await page.click('button:has-text("Close")');
        await page.waitForTimeout(500);
        
        // Verify delete buttons are still functional after modal close
        if (deleteCount > 0) {
          const firstDeleteButton = deleteButtons.first();
          const isClickable = await firstDeleteButton.isEnabled();
          console.log(`🖱️ Delete button clickable after modal close: ${isClickable}`);
          expect(isClickable).toBe(true);
        }
        
        console.log('✅ Modal does not interfere with other functions!');
      }
    }
  });

  test('should verify modal content completeness', async ({ page }) => {
    console.log('🔍 Testing Modal Content Completeness...');
    
    const previewButtons = page.locator('button[title*="View"], .eye');
    const previewCount = await previewButtons.count();
    
    if (previewCount > 0) {
      await previewButtons.first().click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('text=Message Details').locator('..');
      const modalVisible = await modal.isVisible();
      
      if (modalVisible) {
        // Check all required fields are present and visible
        const requiredFields = [
          'Message Details',
          'From:',
          'Subject:',
          'Date:',
          'Status:',
          'Message:'
        ];
        
        for (const field of requiredFields) {
          const fieldElement = page.locator(`text=${field}`);
          const fieldVisible = await fieldElement.isVisible();
          console.log(`📋 Field "${field}" visible: ${fieldVisible}`);
          expect(fieldVisible).toBe(true);
        }
        
        // Check if status has proper styling
        const statusElement = page.locator('span').filter({ hasText: /new|read|replied/ }).first();
        if (await statusElement.isVisible()) {
          const statusStyles = await statusElement.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              padding: styles.padding
            };
          });
          console.log(`🎨 Status styling:`, statusStyles);
        }
        
        await page.click('button:has-text("Close")');
        console.log('✅ Modal content is complete and properly styled!');
      }
    }
  });
});

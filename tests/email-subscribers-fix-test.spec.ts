import { test, expect } from '@playwright/test';

test.describe('Email Subscribers Preview Fix Test', () => {
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
    
    // Navigate to Email Subscribers tab
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(2000);
  });

  test('should verify Preview button exists and works', async ({ page }) => {
    console.log('🔍 Testing Email Subscribers Preview Function...');
    
    // Check if Preview buttons exist
    const previewButtons = page.locator('button[title="Preview"]');
    const previewCount = await previewButtons.count();
    console.log(`👁️ Preview buttons found: ${previewCount}`);
    
    // Verify Preview buttons exist
    expect(previewCount).toBeGreaterThan(0);
    
    if (previewCount > 0) {
      console.log('🧪 Testing Preview function...');
      
      // Click the first Preview button
      await previewButtons.first().click();
      await page.waitForTimeout(1000);
      
      // Check if preview modal appears
      const modal = page.locator('text=Subscriber Details').locator('..');
      const modalVisible = await modal.isVisible();
      console.log(`📋 Preview modal visible: ${modalVisible}`);
      
      expect(modalVisible).toBe(true);
      
      if (modalVisible) {
        // Check modal content
        await expect(page.locator('text=Subscriber Details')).toBeVisible();
        await expect(page.locator('text=Email:')).toBeVisible();
        await expect(page.locator('text=Status:')).toBeVisible();
        await expect(page.locator('text=Subscription Date:')).toBeVisible();
        
        // Check modal styling (should not be transparent)
        const modalElement = page.locator('div:has-text("Subscriber Details")').first();
        const modalStyles = await modalElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            opacity: styles.opacity
          };
        });
        console.log(`🎨 Modal styles:`, modalStyles);
        
        // Verify modal is not transparent
        expect(modalStyles.opacity).toBe('1');
        
        // Close modal
        await page.click('button:has-text("Close")');
        await page.waitForTimeout(500);
        
        // Verify modal is closed
        const modalClosed = await modal.isVisible();
        expect(modalClosed).toBe(false);
        
        console.log('✅ Preview function working correctly!');
      }
    }
  });

  test('should verify Delete function still works', async ({ page }) => {
    console.log('🔍 Testing Email Subscribers Delete Function...');
    
    // Check if Delete buttons exist
    const deleteButtons = page.locator('button[title="Delete"]');
    const deleteCount = await deleteButtons.count();
    console.log(`🗑️ Delete buttons found: ${deleteCount}`);
    
    expect(deleteCount).toBeGreaterThan(0);
    
    // Test Delete function (without actually deleting)
    if (deleteCount > 0) {
      console.log('🧪 Testing Delete function...');
      
      // Monitor for confirmation dialog
      page.on('dialog', async dialog => {
        console.log(`📋 Confirmation dialog: ${dialog.message()}`);
        expect(dialog.message()).toContain('Are you sure you want to delete');
        await dialog.dismiss(); // Cancel the deletion
      });
      
      await deleteButtons.first().click();
      await page.waitForTimeout(1000);
      
      console.log('✅ Delete function shows confirmation dialog correctly!');
    }
  });

  test('should verify action buttons layout', async ({ page }) => {
    console.log('🔍 Testing Action Buttons Layout...');
    
    // Check if all action buttons exist in correct order
    const actionContainer = page.locator('td').filter({ hasText: /Preview|Delete/ }).first();
    
    if (await actionContainer.isVisible()) {
      const buttons = actionContainer.locator('button');
      const buttonCount = await buttons.count();
      console.log(`🔘 Total action buttons: ${buttonCount}`);
      
      // Should have 3 buttons: Preview, Status Toggle, Delete
      expect(buttonCount).toBe(3);
      
      // Check button order and titles
      const firstButton = buttons.nth(0);
      const secondButton = buttons.nth(1);
      const thirdButton = buttons.nth(2);
      
      await expect(firstButton).toHaveAttribute('title', 'Preview');
      await expect(thirdButton).toHaveAttribute('title', 'Delete');
      
      console.log('✅ Action buttons layout is correct!');
    }
  });
});

import { test, expect } from '@playwright/test';

test.describe('Social Media Links Implementation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Give time for components to load
  });

  test('should display social media icons in footer', async ({ page }) => {
    // Scroll to footer to ensure it's visible
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check that all social media icons are present
    const whatsappLink = page.locator('a[aria-label="WhatsApp"]');
    const instagramLink = page.locator('a[aria-label="Instagram"]');
    const facebookLink = page.locator('a[aria-label="Facebook"]');
    
    await expect(whatsappLink).toBeVisible();
    await expect(instagramLink).toBeVisible();
    await expect(facebookLink).toBeVisible();
  });

  test('should have correct Instagram URL', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check Instagram link URL
    const instagramLink = page.locator('a[aria-label="Instagram"]');
    await expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/careerflowkw');
    await expect(instagramLink).toHaveAttribute('target', '_blank');
    await expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have correct Facebook URL', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check Facebook link URL
    const facebookLink = page.locator('a[aria-label="Facebook"]');
    await expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/creerflow/');
    await expect(facebookLink).toHaveAttribute('target', '_blank');
    await expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have correct WhatsApp URL', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check WhatsApp link URL
    const whatsappLink = page.locator('a[aria-label="WhatsApp"]');
    await expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/96555683677');
    await expect(whatsappLink).toHaveAttribute('target', '_blank');
    await expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have hover effects on social media icons', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Test hover effect on Instagram icon
    const instagramLink = page.locator('a[aria-label="Instagram"]');
    await instagramLink.hover();
    
    // Check that the element has hover styling (gradient background)
    const instagramClasses = await instagramLink.getAttribute('class');
    expect(instagramClasses).toContain('hover:bg-gradient-to-r');
    expect(instagramClasses).toContain('hover:from-purple-500');
    expect(instagramClasses).toContain('hover:to-pink-500');
    
    // Test hover effect on Facebook icon
    const facebookLink = page.locator('a[aria-label="Facebook"]');
    await facebookLink.hover();
    
    const facebookClasses = await facebookLink.getAttribute('class');
    expect(facebookClasses).toContain('hover:bg-blue-600');
  });

  test('should open social media links in new tabs', async ({ page, context }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Test Instagram link opens in new tab
    const instagramLink = page.locator('a[aria-label="Instagram"]');
    
    // Listen for new page creation
    const pagePromise = context.waitForEvent('page');
    await instagramLink.click();
    const newPage = await pagePromise;
    
    // Verify the new page URL
    await newPage.waitForLoadState();
    expect(newPage.url()).toBe('https://www.instagram.com/careerflowkw');
    
    // Close the new tab
    await newPage.close();
  });

  test('should display social media icons on different pages', async ({ page }) => {
    // Test on jobs page
    await page.goto('http://localhost:3000/jobs');
    await page.waitForLoadState('networkidle');
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    await expect(page.locator('a[aria-label="Instagram"]')).toBeVisible();
    await expect(page.locator('a[aria-label="Facebook"]')).toBeVisible();
    
    // Test on contact page
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    await expect(page.locator('a[aria-label="Instagram"]')).toBeVisible();
    await expect(page.locator('a[aria-label="Facebook"]')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check accessibility attributes
    const socialLinks = page.locator('a[aria-label*="Instagram"], a[aria-label*="Facebook"], a[aria-label*="WhatsApp"]');
    
    for (const link of await socialLinks.all()) {
      // Each link should have aria-label
      const ariaLabel = await link.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      
      // Each link should have proper rel attribute for security
      const rel = await link.getAttribute('rel');
      expect(rel).toBe('noopener noreferrer');
      
      // Each link should open in new tab
      const target = await link.getAttribute('target');
      expect(target).toBe('_blank');
    }
  });

  test('should maintain consistent styling across social media icons', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    const socialLinks = page.locator('a[aria-label*="Instagram"], a[aria-label*="Facebook"], a[aria-label*="WhatsApp"]');
    
    for (const link of await socialLinks.all()) {
      const classes = await link.getAttribute('class');
      
      // Check common styling classes
      expect(classes).toContain('p-2');
      expect(classes).toContain('rounded-full');
      expect(classes).toContain('bg-white/10');
      expect(classes).toContain('text-white/60');
      expect(classes).toContain('hover:text-white');
      expect(classes).toContain('transition-all');
      expect(classes).toContain('duration-300');
    }
  });
});

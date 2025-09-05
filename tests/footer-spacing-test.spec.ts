import { test, expect } from '@playwright/test';

test.describe('Footer Social Media Icons Spacing Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
  });

  test('should capture current footer spacing before fix', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Target the specific social media container with updated class
    const socialMediaContainer = page.locator('div.flex.justify-center.space-x-6.mb-4');
    await expect(socialMediaContainer).toBeVisible();
    
    // Take screenshot for visual inspection
    await socialMediaContainer.screenshot({ 
      path: 'test-results/footer-spacing-before.png',
      animations: 'disabled'
    });
    
    // Measure spacing between icons
    const whatsappIcon = page.locator('a[aria-label="WhatsApp"]');
    const instagramIcon = page.locator('a[aria-label="Instagram"]');
    const facebookIcon = page.locator('a[aria-label="Facebook"]');
    
    // Get bounding boxes to measure spacing
    const whatsappBox = await whatsappIcon.boundingBox();
    const instagramBox = await instagramIcon.boundingBox();
    const facebookBox = await facebookIcon.boundingBox();
    
    expect(whatsappBox).toBeTruthy();
    expect(instagramBox).toBeTruthy();
    expect(facebookBox).toBeTruthy();
    
    if (whatsappBox && instagramBox && facebookBox) {
      // Calculate spacing between icons
      const whatsappToInstagram = instagramBox.x - (whatsappBox.x + whatsappBox.width);
      const instagramToFacebook = facebookBox.x - (instagramBox.x + instagramBox.width);
      
      console.log('Current spacing:');
      console.log(`WhatsApp to Instagram: ${whatsappToInstagram}px`);
      console.log(`Instagram to Facebook: ${instagramToFacebook}px`);
      
      // Document current spacing for comparison
      expect(whatsappToInstagram).toBeGreaterThan(0);
      expect(instagramToFacebook).toBeGreaterThan(0);
    }
  });

  test('should verify social media container has space-x class', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check the container class for spacing
    const socialMediaContainer = page.locator('div.flex.justify-center.space-x-6.mb-4');
    const containerClass = await socialMediaContainer.getAttribute('class');
    
    console.log('Social media container classes:', containerClass);
    
    // Verify it has the updated spacing class
    expect(containerClass).toContain('space-x-6');
  });

  test('should verify improved spacing after fix', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Target the social media container
    const socialMediaContainer = page.locator('div.flex.justify-center.space-x-6.mb-4');
    await expect(socialMediaContainer).toBeVisible();

    // Take screenshot of improved spacing
    await socialMediaContainer.screenshot({
      path: 'test-results/footer-spacing-after.png',
      animations: 'disabled'
    });

    // Measure improved spacing between icons
    const whatsappIcon = page.locator('a[aria-label="WhatsApp"]');
    const instagramIcon = page.locator('a[aria-label="Instagram"]');
    const facebookIcon = page.locator('a[aria-label="Facebook"]');

    // Get bounding boxes to measure spacing
    const whatsappBox = await whatsappIcon.boundingBox();
    const instagramBox = await instagramIcon.boundingBox();
    const facebookBox = await facebookIcon.boundingBox();

    expect(whatsappBox).toBeTruthy();
    expect(instagramBox).toBeTruthy();
    expect(facebookBox).toBeTruthy();

    if (whatsappBox && instagramBox && facebookBox) {
      // Calculate improved spacing between icons
      const whatsappToInstagram = instagramBox.x - (whatsappBox.x + whatsappBox.width);
      const instagramToFacebook = facebookBox.x - (instagramBox.x + instagramBox.width);

      console.log('Improved spacing:');
      console.log(`WhatsApp to Instagram: ${whatsappToInstagram}px`);
      console.log(`Instagram to Facebook: ${instagramToFacebook}px`);

      // Verify spacing is improved (should be 24px with space-x-6)
      expect(whatsappToInstagram).toBeGreaterThanOrEqual(20); // Allow some tolerance
      expect(instagramToFacebook).toBeGreaterThanOrEqual(20);
      expect(whatsappToInstagram).toBeLessThanOrEqual(28); // Upper bound
      expect(instagramToFacebook).toBeLessThanOrEqual(28);
    }
  });
});

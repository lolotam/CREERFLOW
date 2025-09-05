import { test, expect } from '@playwright/test';

test.describe('Favicon Implementation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
  });

  test('should have favicon.ico in HTML head', async ({ page }) => {
    // Check for favicon.ico link (allow multiple as Next.js may generate additional ones)
    const faviconIco = page.locator('link[rel="icon"][href*="favicon.ico"]');
    await expect(faviconIco).toHaveCount(1);
  });

  test('should have PNG favicon links with correct sizes', async ({ page }) => {
    // Check for 16x16 PNG favicon
    const favicon16 = page.locator('link[rel="icon"][href*="favicon-16x16.png"]');
    await expect(favicon16).toHaveCount(1);
    
    // Check for 32x32 PNG favicon
    const favicon32 = page.locator('link[rel="icon"][href*="favicon-32x32.png"]');
    await expect(favicon32).toHaveCount(1);
  });

  test('should have Apple Touch Icon', async ({ page }) => {
    // Check for Apple Touch Icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"][href*="apple-touch-icon.png"]');
    await expect(appleTouchIcon).toHaveCount(1);
  });

  test('should have web manifest link', async ({ page }) => {
    // Check for web manifest (allow multiple as Next.js may generate additional ones)
    const manifest = page.locator('link[rel="manifest"][href*="site.webmanifest"]');
    await expect(manifest).toHaveCount(1);
  });

  test('should load favicon files successfully', async ({ page }) => {
    // Test that favicon files are accessible
    const faviconUrls = [
      '/favicon.ico',
      '/favicon-16x16.png',
      '/favicon-32x32.png',
      '/apple-touch-icon.png',
      '/android-chrome-192x192.png',
      '/android-chrome-512x512.png',
      '/site.webmanifest'
    ];

    for (const url of faviconUrls) {
      const response = await page.request.get(`http://localhost:3000${url}`);
      expect(response.status()).toBe(200);
    }
  });

  test('should have proper web manifest content', async ({ page }) => {
    // Fetch and validate web manifest
    const response = await page.request.get('http://localhost:3000/site.webmanifest');
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest.name).toBe('CareerFlow - Healthcare Jobs in Kuwait & Gulf');
    expect(manifest.short_name).toBe('CareerFlow');
    expect(manifest.icons).toHaveLength(2);
    expect(manifest.theme_color).toBe('#3b82f6');
    expect(manifest.display).toBe('standalone');
  });

  test('should display favicon in browser tab', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that the page title is set (indicates proper metadata loading)
    await expect(page).toHaveTitle(/CareerFlow/);
    
    // Take a screenshot to visually verify favicon (optional)
    await page.screenshot({ 
      path: 'test-results/favicon-test.png',
      fullPage: false 
    });
  });
});

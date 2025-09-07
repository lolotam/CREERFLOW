import { test, expect } from '@playwright/test';

test.describe('Simple Favicon Tests', () => {
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
      const response = await page.request.get(`http://localhost:4444${url}`);
      expect(response.status()).toBe(200);
      console.log(`✅ ${url} - Status: ${response.status()}`);
    }
  });

  test('should have proper web manifest content', async ({ page }) => {
    // Fetch and validate web manifest
    const response = await page.request.get('http://localhost:4444/site.webmanifest');
    expect(response.status()).toBe(200);
    
    const manifest = await response.json();
    expect(manifest.name).toBe('CareerFlow - Healthcare Jobs in Kuwait & Gulf');
    expect(manifest.short_name).toBe('CareerFlow');
    expect(manifest.icons).toHaveLength(2);
    expect(manifest.theme_color).toBe('#3b82f6');
    expect(manifest.display).toBe('standalone');
  });

  test('should display page with title', async ({ page }) => {
    await page.goto('http://localhost:4444');
    await expect(page).toHaveTitle(/CareerFlow/);
  });
});

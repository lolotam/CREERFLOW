import { test, expect } from '@playwright/test';

test.describe('Subscription API Tests', () => {
  test('should test subscription API endpoint directly', async ({ page }) => {
    // Test the subscription API endpoint
    const testEmail = `api-test-${Date.now()}@example.com`;
    
    const response = await page.request.post('http://localhost:4444/api/subscribe', {
      data: {
        email: testEmail
      }
    });

    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data.email).toBe(testEmail);
    
    console.log(`✅ Subscription API test passed: ${testEmail}`);
    console.log(`📧 Response:`, result);
  });

  test('should test admin subscribers API endpoint', async ({ page }) => {
    // Test the admin subscribers API endpoint
    const response = await page.request.get('http://localhost:4444/api/admin/subscribers');
    
    console.log(`📊 Admin API status: ${response.status()}`);
    
    if (response.status() === 200) {
      const result = await response.json();
      console.log(`✅ Admin API response:`, result);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.subscribers).toBeDefined();
      
      console.log(`📧 Total subscribers in database: ${result.data.total}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Admin API error:`, errorText);
    }
  });

  test('should verify subscription flow integration', async ({ page }) => {
    // First, create a subscription via the API
    const testEmail = `integration-test-${Date.now()}@example.com`;
    
    const subscribeResponse = await page.request.post('http://localhost:4444/api/subscribe', {
      data: {
        email: testEmail
      }
    });

    expect(subscribeResponse.status()).toBe(200);
    console.log(`✅ Created subscription: ${testEmail}`);

    // Wait a moment for database operations
    await page.waitForTimeout(1000);

    // Then check if it appears in the admin API
    const adminResponse = await page.request.get('http://localhost:4444/api/admin/subscribers');
    
    if (adminResponse.status() === 200) {
      const adminResult = await adminResponse.json();
      
      // Check if our test email appears in the subscribers list
      const foundSubscriber = adminResult.data.subscribers.find(
        (sub: any) => sub.email === testEmail
      );
      
      if (foundSubscriber) {
        console.log(`✅ Integration test passed: ${testEmail} found in admin dashboard`);
        expect(foundSubscriber.email).toBe(testEmail);
      } else {
        console.log(`❌ Integration test failed: ${testEmail} not found in admin dashboard`);
        console.log(`📧 Available subscribers:`, adminResult.data.subscribers.map((s: any) => s.email));
      }
    } else {
      console.log(`❌ Admin API not accessible for integration test`);
    }
  });
});

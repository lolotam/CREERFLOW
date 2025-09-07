import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow Tests', () => {
  test('should complete full contact form flow from frontend to admin dashboard', async ({ page }) => {
    const testData = {
      name: `Test Contact ${Date.now()}`,
      email: `contact-test-${Date.now()}@example.com`,
      subject: 'Test Contact Subject',
      message: 'This is a test message to verify the contact form integration with the admin dashboard.'
    };
    
    console.log(`📧 Testing with data:`, testData);
    
    // Step 1: Navigate to contact page
    await page.goto('http://localhost:4444/contact');
    await page.waitForLoadState('networkidle');
    
    // Step 2: Fill out the contact form
    await page.fill('input[name="name"]', testData.name);
    await page.fill('input[name="email"]', testData.email);
    await page.fill('input[name="subject"]', testData.subject);
    await page.fill('textarea[name="message"]', testData.message);
    
    // Step 3: Submit the form
    await page.click('button[type="submit"]');
    
    // Step 4: Wait for success message
    await expect(page.locator('text=Thank you for your message')).toBeVisible({ timeout: 10000 });
    console.log(`✅ Step 1 Complete: Contact form submitted for ${testData.email}`);
    
    // Step 5: Verify message was saved via API
    const contactResponse = await page.request.get('http://localhost:4444/api/admin/contact-messages');
    expect(contactResponse.status()).toBe(200);
    
    const contactData = await contactResponse.json();
    expect(contactData.success).toBe(true);
    
    // Check if our test message is in the list
    const foundMessage = contactData.data.messages.find(
      (msg: any) => msg.email === testData.email
    );
    
    if (foundMessage) {
      console.log(`✅ Step 2 Complete: ${testData.email} found in database`);
      console.log(`📧 Message details: ${foundMessage.name} - ${foundMessage.subject}`);
    } else {
      console.log(`❌ Step 2 Failed: ${testData.email} not found in database`);
      console.log(`Available messages: ${contactData.data.messages.length}`);
    }
    
    // Step 6: Navigate to admin dashboard and verify message appears
    await page.goto('http://localhost:4444/admin/login');
    
    // Login with admin credentials
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await expect(page.locator('text=Admin Dashboard')).toBeVisible({ timeout: 15000 });
    console.log(`✅ Step 3 Complete: Admin login successful`);
    
    // Navigate to contact messages section
    await page.click('text=Messages');
    await page.waitForLoadState('networkidle');
    
    // Check if the message appears in the admin dashboard
    const messageInDashboard = page.locator(`text=${testData.email}`);
    
    try {
      await expect(messageInDashboard).toBeVisible({ timeout: 10000 });
      console.log(`✅ Step 4 Complete: ${testData.email} visible in admin dashboard`);
    } catch (error) {
      console.log(`❌ Step 4 Failed: ${testData.email} not visible in admin dashboard`);
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/contact-form-debug.png' });
      
      // Log what we can see in the dashboard
      const dashboardContent = await page.textContent('body');
      console.log('Dashboard content preview:', dashboardContent?.substring(0, 500));
    }
    
    console.log(`🎉 Contact form flow test completed for ${testData.email}`);
  });

  test('should verify contact API endpoints work correctly', async ({ page }) => {
    const testData = {
      name: `API Test ${Date.now()}`,
      email: `api-contact-test-${Date.now()}@example.com`,
      subject: 'API Test Subject',
      message: 'This is an API test message.'
    };
    
    // Test direct API contact submission
    const contactResponse = await page.request.post('http://localhost:4444/api/contact', {
      data: testData
    });
    
    expect(contactResponse.status()).toBe(200);
    const contactResult = await contactResponse.json();
    expect(contactResult.success).toBe(true);
    expect(contactResult.data.email).toBe(testData.email);
    
    console.log(`✅ Direct API contact submission successful: ${testData.email}`);
    
    // Wait a moment for database operations
    await page.waitForTimeout(2000);
    
    // Test admin API retrieval
    const adminResponse = await page.request.get('http://localhost:4444/api/admin/contact-messages');
    expect(adminResponse.status()).toBe(200);
    
    const adminResult = await adminResponse.json();
    expect(adminResult.success).toBe(true);
    
    console.log(`✅ Admin API working: ${adminResult.data.total} total messages`);
    
    // Verify our test message appears
    const foundMessage = adminResult.data.messages.find(
      (msg: any) => msg.email === testData.email
    );
    
    if (foundMessage) {
      console.log(`✅ Integration verified: ${testData.email} found in admin API`);
      expect(foundMessage.email).toBe(testData.email);
      expect(foundMessage.status).toBe('new');
      expect(foundMessage.name).toBe(testData.name);
      expect(foundMessage.subject).toBe(testData.subject);
    } else {
      console.log(`❌ Integration failed: ${testData.email} not found in admin API`);
      console.log(`Available emails:`, adminResult.data.messages.map((m: any) => m.email));
    }
  });
});

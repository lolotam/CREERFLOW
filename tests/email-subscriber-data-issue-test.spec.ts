import { test, expect } from '@playwright/test';

test.describe('Email Subscriber Data Retrieval Issue Investigation', () => {
  test('should test email subscription and admin dashboard visibility', async ({ page }) => {
    console.log('🔍 TESTING: Email Subscriber Data Retrieval Issue');
    
    // Step 1: Test subscription process with lolotam@gmail.com
    console.log('📧 Step 1: Testing subscription process...');
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    
    // Find email subscription form
    const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]');
    const subscribeButton = page.locator('button:has-text("Subscribe"), button:has-text("Join"), button[type="submit"]');
    
    const emailInputCount = await emailInput.count();
    const subscribeButtonCount = await subscribeButton.count();
    
    console.log(`📧 Email inputs found: ${emailInputCount}`);
    console.log(`🔘 Subscribe buttons found: ${subscribeButtonCount}`);
    
    if (emailInputCount > 0 && subscribeButtonCount > 0) {
      // Try to subscribe with lolotam@gmail.com
      await emailInput.first().fill('lolotam@gmail.com');
      await subscribeButton.first().click();
      await page.waitForTimeout(2000);
      
      // Check for "already subscribed" message
      const alreadySubscribedText = page.locator('text=/already.*subscribed|subscribed.*already/i');
      const alreadySubscribedCount = await alreadySubscribedText.count();
      
      console.log(`⚠️ "Already subscribed" messages found: ${alreadySubscribedCount}`);
      
      if (alreadySubscribedCount > 0) {
        const message = await alreadySubscribedText.first().textContent();
        console.log(`📝 Message: "${message}"`);
      }
    }
    
    // Step 2: Check admin dashboard for the email
    console.log('\n📊 Step 2: Checking admin dashboard...');
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Login to admin dashboard
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Navigate to Email Subscribers section
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(2000);
    
    // Take screenshot of email subscribers section
    await page.screenshot({ 
      path: 'test-results/email-subscribers-before-fix.png',
      fullPage: true
    });
    
    // Check if lolotam@gmail.com appears in the table
    const lolotamEmail = page.locator('text=lolotam@gmail.com');
    const lolotamEmailCount = await lolotamEmail.count();
    
    console.log(`📧 lolotam@gmail.com found in admin table: ${lolotamEmailCount}`);
    
    // Count total subscribers shown in admin dashboard
    const subscriberRows = page.locator('tbody tr');
    const subscriberRowCount = await subscriberRows.count();
    
    console.log(`📊 Total subscriber rows in admin dashboard: ${subscriberRowCount}`);
    
    // Check for pagination or "showing X of Y" text
    const paginationText = page.locator('text=/showing.*of|page.*of|total/i');
    const paginationCount = await paginationText.count();
    
    if (paginationCount > 0) {
      for (let i = 0; i < Math.min(paginationCount, 3); i++) {
        const text = await paginationText.nth(i).textContent();
        console.log(`📄 Pagination info ${i + 1}: "${text}"`);
      }
    }
    
    // List all emails currently visible in the table
    const emailCells = page.locator('tbody tr td:has-text("@")');
    const emailCellCount = await emailCells.count();
    
    console.log(`📧 Email addresses visible in table: ${emailCellCount}`);
    
    if (emailCellCount > 0) {
      console.log('📧 Visible emails:');
      for (let i = 0; i < Math.min(emailCellCount, 5); i++) {
        const email = await emailCells.nth(i).textContent();
        console.log(`  ${i + 1}. ${email}`);
      }
    }
    
    console.log('\n🔍 Investigation complete - data collected for analysis');
  });

  test('should check email subscribers API directly', async ({ page }) => {
    console.log('🔍 TESTING: Email Subscribers API Direct Access');
    
    // Test the admin email subscribers API endpoint
    const response = await page.request.get('http://localhost:4444/api/admin/subscribers');
    console.log(`📡 Admin subscribers API response status: ${response.status()}`);
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log(`📊 Admin API response structure:`, {
        success: data.success,
        dataLength: data.data?.length || 0,
        total: data.total || data.meta?.total || 'unknown'
      });
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`📧 Total subscribers from admin API: ${data.data.length}`);
        
        // Check if lolotam@gmail.com is in the API response
        const lolotamSubscriber = data.data.find(sub => sub.email === 'lolotam@gmail.com');
        console.log(`📧 lolotam@gmail.com found in API: ${!!lolotamSubscriber}`);
        
        if (lolotamSubscriber) {
          console.log(`📝 lolotam@gmail.com details:`, lolotamSubscriber);
        }
        
        // Show first few subscribers for reference
        console.log('📧 First few subscribers from API:');
        data.data.slice(0, 3).forEach((sub, index) => {
          console.log(`  ${index + 1}. ${sub.email} (status: ${sub.status})`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Admin subscribers API error: ${errorText}`);
    }
  });

  test('should check public subscription API', async ({ page }) => {
    console.log('🔍 TESTING: Public Subscription API');
    
    // Test subscribing via API to see the response
    const subscribeResponse = await page.request.post('http://localhost:4444/api/subscribe', {
      data: { email: 'lolotam@gmail.com' }
    });
    
    console.log(`📡 Subscribe API response status: ${subscribeResponse.status()}`);
    
    const subscribeData = await subscribeResponse.json();
    console.log(`📊 Subscribe API response:`, subscribeData);
    
    // This should show "already subscribed" if the email exists in database
    if (subscribeData.message && subscribeData.message.toLowerCase().includes('already')) {
      console.log('✅ Confirmed: lolotam@gmail.com exists in database (already subscribed)');
    }
  });
});

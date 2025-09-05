import { test, expect } from '@playwright/test';

test.describe('Contact Messages Data Retrieval Issue Investigation', () => {
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
    
    // Navigate to Contact Messages section
    await page.click('text=Contact Messages');
    await page.waitForTimeout(2000);
  });

  test('should investigate contact messages data retrieval', async ({ page }) => {
    console.log('🔍 INVESTIGATING: Contact Messages Data Retrieval');
    
    // Take screenshot of contact messages section
    await page.screenshot({ 
      path: 'test-results/contact-messages-before-fix.png',
      fullPage: true
    });
    
    // Count total messages shown in admin dashboard
    const messageRows = page.locator('tbody tr');
    const messageRowCount = await messageRows.count();
    
    console.log(`📊 Total message rows in admin dashboard: ${messageRowCount}`);
    
    // Check for pagination or "showing X of Y" text
    const paginationText = page.locator('text=/showing.*of|page.*of|total.*messages/i');
    const paginationCount = await paginationText.count();
    
    if (paginationCount > 0) {
      for (let i = 0; i < Math.min(paginationCount, 3); i++) {
        const text = await paginationText.nth(i).textContent();
        console.log(`📄 Pagination info ${i + 1}: "${text}"`);
      }
    }
    
    // List all emails/names currently visible in the table
    const emailCells = page.locator('tbody tr td:has-text("@")');
    const nameCells = page.locator('tbody tr td:first-child');
    
    const emailCellCount = await emailCells.count();
    const nameCellCount = await nameCells.count();
    
    console.log(`📧 Email addresses visible in table: ${emailCellCount}`);
    console.log(`👤 Names visible in table: ${nameCellCount}`);
    
    if (nameCellCount > 0) {
      console.log('👤 Visible contact names:');
      for (let i = 0; i < Math.min(nameCellCount, 5); i++) {
        const name = await nameCells.nth(i).textContent();
        console.log(`  ${i + 1}. ${name}`);
      }
    }
    
    if (emailCellCount > 0) {
      console.log('📧 Visible contact emails:');
      for (let i = 0; i < Math.min(emailCellCount, 5); i++) {
        const email = await emailCells.nth(i).textContent();
        console.log(`  ${i + 1}. ${email}`);
      }
    }
    
    console.log('\n🔍 Investigation complete - data collected for analysis');
  });

  test('should check contact messages API directly', async ({ page }) => {
    console.log('🔍 TESTING: Contact Messages API Direct Access');
    
    // Test the admin contact messages API endpoint
    const response = await page.request.get('http://localhost:3000/api/admin/contact-messages');
    console.log(`📡 Admin contact messages API response status: ${response.status()}`);
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log(`📊 Admin API response structure:`, {
        success: data.success,
        dataLength: data.data?.messages?.length || 0,
        total: data.data?.total || 'unknown'
      });
      
      if (data.data && data.data.messages && Array.isArray(data.data.messages)) {
        console.log(`📧 Total contact messages from admin API: ${data.data.messages.length}`);
        
        // Show first few messages for reference
        console.log('📧 First few contact messages from API:');
        data.data.messages.slice(0, 3).forEach((msg, index) => {
          console.log(`  ${index + 1}. ${msg.name} (${msg.email}) - ${msg.subject} [${msg.status}]`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Admin contact messages API error: ${errorText}`);
    }
  });

  test('should check database directly for contact messages', async ({ page }) => {
    console.log('🔍 TESTING: Contact Messages Database Direct Check');
    
    // This test will help us understand if there are messages in the database
    // that aren't being displayed in the admin dashboard
    
    // We'll use a simple approach to test this
    const testMessage = {
      name: 'Test Contact Data Check',
      email: 'test-contact-data@example.com',
      subject: 'Testing Contact Messages Data Retrieval',
      message: 'This is a test message to verify contact messages data retrieval works correctly.'
    };
    
    // Submit a test contact message via the public API
    console.log('📝 Submitting test contact message...');
    const submitResponse = await page.request.post('http://localhost:3000/api/contact', {
      data: testMessage
    });
    
    console.log(`📡 Contact submission response status: ${submitResponse.status()}`);
    
    if (submitResponse.status() === 200) {
      const submitData = await submitResponse.json();
      console.log(`📊 Contact submission response:`, submitData);
      
      // Wait a moment for the message to be saved
      await page.waitForTimeout(2000);
      
      // Now check if it appears in the admin API
      const adminResponse = await page.request.get('http://localhost:3000/api/admin/contact-messages');
      
      if (adminResponse.status() === 200) {
        const adminData = await adminResponse.json();
        
        // Look for our test message
        const testMessageFound = adminData.data.messages.find(msg => 
          msg.email === testMessage.email && msg.subject === testMessage.subject
        );
        
        console.log(`🔍 Test message found in admin API: ${!!testMessageFound}`);
        
        if (testMessageFound) {
          console.log(`📝 Test message details:`, {
            id: testMessageFound.id,
            name: testMessageFound.name,
            email: testMessageFound.email,
            subject: testMessageFound.subject,
            status: testMessageFound.status
          });
        }
      }
    } else {
      const errorText = await submitResponse.text();
      console.log(`❌ Contact submission error: ${errorText}`);
    }
  });
});

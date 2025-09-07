#!/usr/bin/env tsx

async function testSubscriptionAPI() {
  try {
    console.log('🧪 Testing subscription API...');

    const testEmail = `test-new-${Date.now()}@example.com`;
    console.log(`📧 Testing with email: ${testEmail}`);

    // Test subscription
    const subscribeResponse = await fetch('http://localhost:4444/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      })
    });

    const subscribeResult = await subscribeResponse.json();
    console.log('📧 Subscribe API response:', subscribeResult);

    if (subscribeResult.success) {
      console.log('✅ Subscription successful!');
      
      // Wait a moment for database operations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test admin API
      console.log('\n🔍 Testing admin API...');
      const adminResponse = await fetch('http://localhost:4444/api/admin/subscribers');
      const adminResult = await adminResponse.json();
      
      console.log('👨‍💼 Admin API response:', adminResult);
      
      if (adminResult.success) {
        console.log(`✅ Admin API working! Found ${adminResult.data.total} subscribers`);
        
        // Check if our test email is in the list
        const foundSubscriber = adminResult.data.subscribers.find(
          (sub: any) => sub.email === testEmail
        );
        
        if (foundSubscriber) {
          console.log('🎉 SUCCESS: Email subscription flow is working end-to-end!');
          console.log(`📧 Found subscriber: ${foundSubscriber.email} (${foundSubscriber.status})`);
        } else {
          console.log('❌ Email not found in admin dashboard');
        }
      } else {
        console.log('❌ Admin API failed:', adminResult);
      }
    } else {
      console.log('❌ Subscription failed:', subscribeResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSubscriptionAPI();

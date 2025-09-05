#!/usr/bin/env tsx

async function testContactAPI() {
  try {
    console.log('🧪 Testing contact form API...');
    
    const testData = {
      name: `Test User ${Date.now()}`,
      email: `test-contact-${Date.now()}@example.com`,
      subject: 'Test Contact Message',
      message: 'This is a test message to verify the contact form integration with the admin dashboard.'
    };
    
    console.log(`📧 Testing with data:`, testData);
    
    // Test contact form submission
    const contactResponse = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const contactResult = await contactResponse.json();
    console.log('📧 Contact API response:', contactResult);

    if (contactResult.success) {
      console.log('✅ Contact form submission successful!');
      
      // Wait a moment for database operations
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test admin API
      console.log('\n🔍 Testing admin contact messages API...');
      const adminResponse = await fetch('http://localhost:3000/api/admin/contact-messages');
      const adminResult = await adminResponse.json();
      
      console.log('👨‍💼 Admin API response:', adminResult);
      
      if (adminResult.success) {
        console.log(`✅ Admin API working! Found ${adminResult.data.total} messages`);
        
        // Check if our test message is in the list
        const foundMessage = adminResult.data.messages.find(
          (msg: any) => msg.email === testData.email
        );
        
        if (foundMessage) {
          console.log('🎉 SUCCESS: Contact form flow is working end-to-end!');
          console.log(`📧 Found message: ${foundMessage.name} (${foundMessage.email}) - ${foundMessage.subject}`);
          console.log(`📅 Submitted: ${foundMessage.submission_date}`);
          console.log(`📊 Status: ${foundMessage.status}`);
        } else {
          console.log('❌ Contact message not found in admin dashboard');
          console.log('Available messages:', adminResult.data.messages.map((m: any) => ({
            name: m.name,
            email: m.email,
            subject: m.subject
          })));
        }
      } else {
        console.log('❌ Admin API failed:', adminResult);
      }
    } else {
      console.log('❌ Contact form submission failed:', contactResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testContactAPI();

#!/usr/bin/env tsx

import { createContactMessage, getAllContactMessages } from '../lib/database';

async function testContactDatabase() {
  try {
    console.log('🧪 Testing contact message database functions...');
    
    const testData = {
      name: `Test User Direct ${Date.now()}`,
      email: `test-direct-${Date.now()}@example.com`,
      subject: 'Test Direct Database',
      message: 'This is a direct database test message.'
    };
    
    console.log(`📧 Testing with data:`, testData);
    
    // Test creating a contact message directly
    console.log('\n🔍 Testing createContactMessage function...');
    const result = await createContactMessage(testData);
    
    if (result) {
      console.log('✅ Contact message created successfully!');
      console.log(`📧 Created message:`, result);
    } else {
      console.log('❌ Failed to create contact message');
    }
    
    // Test getting all contact messages
    console.log('\n🔍 Testing getAllContactMessages function...');
    const allMessages = await getAllContactMessages();
    
    console.log(`📊 Total messages: ${allMessages.total}`);
    console.log(`📧 Messages found: ${allMessages.messages.length}`);
    
    allMessages.messages.forEach(msg => {
      console.log(`  - ${msg.name} (${msg.email}) - ${msg.subject} - ${msg.submission_date}`);
    });
    
    if (allMessages.total > 0) {
      console.log('🎉 SUCCESS: Contact message database functions are working!');
    } else {
      console.log('❌ No messages found in database');
    }

  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testContactDatabase();

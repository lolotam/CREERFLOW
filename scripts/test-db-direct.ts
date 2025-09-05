#!/usr/bin/env tsx

import { getDatabase } from '../lib/database';

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    const db = await getDatabase();
    if (!db) {
      console.error('❌ Failed to get database connection');
      return;
    }

    console.log('✅ Database connected successfully');

    // Check if email_subscribers table exists
    const emailTables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='email_subscribers'");
    console.log('📋 email_subscribers table exists:', emailTables.length > 0);

    if (emailTables.length > 0) {
      // Test simple count query
      console.log('\n🔍 Testing email subscribers count...');
      const countResult = await db.get("SELECT COUNT(*) as count FROM email_subscribers");
      console.log(`📊 Total subscribers: ${countResult.count}`);

      // Test select query
      console.log('\n🔍 Testing email subscribers query...');
      const subscribers = await db.all("SELECT * FROM email_subscribers LIMIT 5");
      console.log(`📧 Sample subscribers: ${subscribers.length}`);
      subscribers.forEach(sub => {
        console.log(`  - ${sub.email} (${sub.status}) - ${sub.subscription_date}`);
      });
    }

    // Check if contact_messages table exists
    const contactTables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='contact_messages'");
    console.log('\n📋 contact_messages table exists:', contactTables.length > 0);

    if (contactTables.length > 0) {
      // Get table schema
      const schema = await db.all("PRAGMA table_info(contact_messages)");
      console.log('\n📋 contact_messages schema:');
      schema.forEach(col => {
        console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
      });

      // Test simple count query
      console.log('\n🔍 Testing contact messages count...');
      const contactCountResult = await db.get("SELECT COUNT(*) as count FROM contact_messages");
      console.log(`📊 Total contact messages: ${contactCountResult.count}`);

      // Test select query
      console.log('\n🔍 Testing contact messages query...');
      const messages = await db.all("SELECT * FROM contact_messages LIMIT 5");
      console.log(`📧 Sample messages: ${messages.length}`);
      messages.forEach(msg => {
        console.log(`  - ${msg.name} (${msg.email}) - ${msg.subject} - ${msg.submission_date}`);
      });

    } else {
      console.log('❌ contact_messages table does not exist');
    }

  } catch (error) {
    console.error('❌ Database test error:', error);
  }
}

testDatabase();

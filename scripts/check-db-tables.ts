#!/usr/bin/env tsx

import { getDatabase } from '../lib/database';

async function checkTables() {
  try {
    const db = await getDatabase();
    
    // Get all tables
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 Database Tables:');
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });

    // Check if email_subscribers table exists
    const emailSubscribersExists = tables.some(t => t.name === 'email_subscribers');
    console.log(`\n📧 email_subscribers table exists: ${emailSubscribersExists}`);

    if (emailSubscribersExists) {
      // Get table schema
      const schema = await db.all("PRAGMA table_info(email_subscribers)");
      console.log('\n📋 email_subscribers schema:');
      schema.forEach(col => {
        console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
      });

      // Get count
      const count = await db.get("SELECT COUNT(*) as count FROM email_subscribers");
      console.log(`\n📊 email_subscribers count: ${count.count}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTables();

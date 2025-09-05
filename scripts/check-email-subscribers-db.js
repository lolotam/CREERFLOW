const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

console.log('🔍 Checking email subscribers database...\n');

try {
  // Check if email_subscribers table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='email_subscribers'").all();
  console.log(`📊 email_subscribers table exists: ${tables.length > 0}`);
  
  if (tables.length > 0) {
    // Get table schema
    const schema = db.prepare("PRAGMA table_info(email_subscribers)").all();
    console.log('\n📋 Table schema:');
    schema.forEach(col => {
      console.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    // Count total subscribers
    const countResult = db.prepare("SELECT COUNT(*) as count FROM email_subscribers").get();
    console.log(`\n📊 Total subscribers in database: ${countResult.count}`);
    
    // Get all subscribers
    const subscribers = db.prepare("SELECT * FROM email_subscribers ORDER BY subscription_date DESC").all();
    console.log(`\n📧 All subscribers:`);
    
    if (subscribers.length === 0) {
      console.log('  ❌ No subscribers found in database');
    } else {
      subscribers.forEach((sub, index) => {
        console.log(`  ${index + 1}. ${sub.email} (${sub.status}) - ${sub.subscription_date}`);
      });
    }
    
    // Check specifically for lolotam@gmail.com
    const lolotamSubscriber = db.prepare("SELECT * FROM email_subscribers WHERE email = ?").get('lolotam@gmail.com');
    console.log(`\n🔍 lolotam@gmail.com in database: ${!!lolotamSubscriber}`);
    
    if (lolotamSubscriber) {
      console.log(`📝 lolotam@gmail.com details:`, lolotamSubscriber);
    }
    
    // Test the exact query used by admin API
    console.log('\n🧪 Testing admin API query...');
    const page = 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    // Count query
    const adminCountResult = db.prepare("SELECT COUNT(*) as count FROM email_subscribers").get();
    console.log(`📊 Admin API count query result: ${adminCountResult.count}`);
    
    // Data query
    const adminSubscribers = db.prepare(`
      SELECT * FROM email_subscribers
      ORDER BY subscription_date DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    console.log(`📧 Admin API data query result: ${adminSubscribers.length} subscribers`);
    adminSubscribers.forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.email} (${sub.status})`);
    });
    
  } else {
    console.log('❌ email_subscribers table does not exist');
  }
  
} catch (error) {
  console.error('❌ Error checking database:', error);
} finally {
  db.close();
}

// Also check the JSON file system
console.log('\n🔍 Checking JSON file subscriptions...');
const fs = require('fs');
const jsonPath = path.join(__dirname, '..', 'data', 'subscriptions.json');

try {
  if (fs.existsSync(jsonPath)) {
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const subscriptions = JSON.parse(jsonData);
    
    console.log(`📊 JSON file subscriptions: ${subscriptions.length}`);
    
    // Check for lolotam@gmail.com in JSON
    const lolotamInJson = subscriptions.find(sub => sub.email === 'lolotam@gmail.com');
    console.log(`🔍 lolotam@gmail.com in JSON: ${!!lolotamInJson}`);
    
    if (lolotamInJson) {
      console.log(`📝 lolotam@gmail.com JSON details:`, lolotamInJson);
    }
    
    // Show first few subscriptions
    console.log('\n📧 First few JSON subscriptions:');
    subscriptions.slice(0, 5).forEach((sub, index) => {
      console.log(`  ${index + 1}. ${sub.email} - ${sub.subscribedAt}`);
    });
    
  } else {
    console.log('❌ subscriptions.json file does not exist');
  }
} catch (error) {
  console.error('❌ Error reading JSON file:', error);
}

const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

console.log('🧪 Testing admin API database queries directly...\n');

try {
  // Test the exact query used by getAllEmailSubscribers
  console.log('🔍 Testing getAllEmailSubscribers query logic...');
  
  const page = 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  // Test count query (no filters)
  console.log('\n📊 Testing count query...');
  const countResult = db.prepare("SELECT COUNT(*) as count FROM email_subscribers").get();
  console.log(`Count result:`, countResult);
  
  // Test data query (no filters)
  console.log('\n📧 Testing data query...');
  const subscribers = db.prepare(`
    SELECT * FROM email_subscribers
    ORDER BY subscription_date DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
  
  console.log(`Data query result: ${subscribers.length} subscribers`);
  subscribers.slice(0, 5).forEach((sub, index) => {
    console.log(`  ${index + 1}. ${sub.email} (${sub.status}) - ${sub.subscription_date}`);
  });
  
  // Test with search filter
  console.log('\n🔍 Testing with search filter (lolotam)...');
  const searchCountResult = db.prepare("SELECT COUNT(*) as count FROM email_subscribers WHERE email LIKE ?").get('%lolotam%');
  console.log(`Search count result:`, searchCountResult);
  
  const searchSubscribers = db.prepare(`
    SELECT * FROM email_subscribers
    WHERE email LIKE ?
    ORDER BY subscription_date DESC
    LIMIT ? OFFSET ?
  `).all('%lolotam%', limit, offset);
  
  console.log(`Search data result: ${searchSubscribers.length} subscribers`);
  searchSubscribers.forEach((sub, index) => {
    console.log(`  ${index + 1}. ${sub.email} (${sub.status}) - ${sub.subscription_date}`);
  });
  
  // Test with status filter
  console.log('\n📊 Testing with status filter (active)...');
  const statusCountResult = db.prepare("SELECT COUNT(*) as count FROM email_subscribers WHERE status = ?").get('active');
  console.log(`Status count result:`, statusCountResult);
  
  const statusSubscribers = db.prepare(`
    SELECT * FROM email_subscribers
    WHERE status = ?
    ORDER BY subscription_date DESC
    LIMIT ? OFFSET ?
  `).all('active', limit, offset);
  
  console.log(`Status data result: ${statusSubscribers.length} subscribers`);
  statusSubscribers.slice(0, 3).forEach((sub, index) => {
    console.log(`  ${index + 1}. ${sub.email} (${sub.status}) - ${sub.subscription_date}`);
  });
  
} catch (error) {
  console.error('❌ Error testing queries:', error);
} finally {
  db.close();
}

// Test the actual API endpoint
console.log('\n🌐 Testing actual API endpoint...');
const fetch = require('node-fetch');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:4444/api/admin/subscribers');
    console.log(`📡 API Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📊 API Response:`, JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log(`❌ API Error: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testAPI();

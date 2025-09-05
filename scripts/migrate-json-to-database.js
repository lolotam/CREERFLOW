const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

// JSON file path
const jsonPath = path.join(__dirname, '..', 'data', 'subscriptions.json');

console.log('🔄 Migrating JSON subscriptions to database...\n');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');
  
  // Check current database state
  const currentCount = db.prepare("SELECT COUNT(*) as count FROM email_subscribers").get();
  console.log(`📊 Current database subscribers: ${currentCount.count}`);
  
  // Read JSON subscriptions
  if (!fs.existsSync(jsonPath)) {
    console.log('❌ subscriptions.json file not found');
    return;
  }
  
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const subscriptions = JSON.parse(jsonData);
  console.log(`📊 JSON file subscribers: ${subscriptions.length}`);
  
  // Prepare insert statement
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO email_subscribers (email, status, subscription_date, created_at, updated_at)
    VALUES (?, 'active', ?, ?, ?)
  `);
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  console.log('\n🔄 Migrating subscriptions...');
  
  for (const subscription of subscriptions) {
    try {
      // Convert subscribedAt to proper datetime format
      const subscriptionDate = new Date(subscription.subscribedAt).toISOString().replace('T', ' ').replace('Z', '');
      const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
      
      const result = insertStmt.run(
        subscription.email,
        subscriptionDate,
        subscriptionDate, // created_at
        now // updated_at
      );
      
      if (result.changes > 0) {
        migratedCount++;
        console.log(`✅ Migrated: ${subscription.email}`);
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped (already exists): ${subscription.email}`);
      }
    } catch (error) {
      console.error(`❌ Error migrating ${subscription.email}:`, error.message);
      skippedCount++;
    }
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  // Verify final state
  const finalCount = db.prepare("SELECT COUNT(*) as count FROM email_subscribers").get();
  
  console.log(`\n🎉 Migration completed!`);
  console.log(`   ✅ Successfully migrated: ${migratedCount} subscribers`);
  console.log(`   ⏭️ Skipped (duplicates): ${skippedCount} subscribers`);
  console.log(`   📊 Total in database now: ${finalCount.count}`);
  
  // Verify lolotam@gmail.com is now in database
  const lolotamCheck = db.prepare("SELECT * FROM email_subscribers WHERE email = ?").get('lolotam@gmail.com');
  console.log(`\n🔍 lolotam@gmail.com now in database: ${!!lolotamCheck}`);
  
  if (lolotamCheck) {
    console.log(`📝 lolotam@gmail.com details:`, {
      id: lolotamCheck.id,
      email: lolotamCheck.email,
      status: lolotamCheck.status,
      subscription_date: lolotamCheck.subscription_date
    });
  }
  
  // Show all subscribers for verification
  console.log('\n📧 All subscribers in database after migration:');
  const allSubscribers = db.prepare("SELECT email, status, subscription_date FROM email_subscribers ORDER BY subscription_date DESC").all();
  allSubscribers.forEach((sub, index) => {
    console.log(`  ${index + 1}. ${sub.email} (${sub.status}) - ${sub.subscription_date}`);
  });
  
} catch (error) {
  console.error('❌ Error during migration:', error);
  db.exec('ROLLBACK');
} finally {
  db.close();
}

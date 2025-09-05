const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

// JSON file path
const jsonPath = path.join(__dirname, '..', 'data', 'contacts.json');

console.log('🔄 Migrating JSON contact messages to database...\n');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');
  
  // Check current database state
  const currentCount = db.prepare("SELECT COUNT(*) as count FROM contact_messages").get();
  console.log(`📊 Current database contact messages: ${currentCount.count}`);
  
  // Read JSON contact messages
  if (!fs.existsSync(jsonPath)) {
    console.log('❌ contacts.json file not found');
    return;
  }
  
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const contactMessages = JSON.parse(jsonData);
  console.log(`📊 JSON file contact messages: ${contactMessages.length}`);
  
  // Prepare insert statement
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO contact_messages (name, email, subject, message, status, submission_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'new', ?, ?, ?)
  `);
  
  let migratedCount = 0;
  let skippedCount = 0;
  
  console.log('\n🔄 Migrating contact messages...');
  
  for (const contact of contactMessages) {
    try {
      // Convert submittedAt to proper datetime format
      const submissionDate = new Date(contact.submittedAt).toISOString().replace('T', ' ').replace('Z', '');
      const now = new Date().toISOString().replace('T', ' ').replace('Z', '');
      
      // Check if message already exists (by email and subject combination)
      const existing = db.prepare("SELECT id FROM contact_messages WHERE email = ? AND subject = ?")
        .get(contact.email, contact.subject);
      
      if (existing) {
        skippedCount++;
        console.log(`⏭️ Skipped (already exists): ${contact.name} (${contact.email}) - ${contact.subject}`);
        continue;
      }
      
      const result = insertStmt.run(
        contact.name,
        contact.email,
        contact.subject,
        contact.message,
        submissionDate,
        submissionDate, // created_at
        now // updated_at
      );
      
      if (result.changes > 0) {
        migratedCount++;
        console.log(`✅ Migrated: ${contact.name} (${contact.email}) - ${contact.subject}`);
      } else {
        skippedCount++;
        console.log(`⏭️ Skipped: ${contact.name} (${contact.email}) - ${contact.subject}`);
      }
    } catch (error) {
      console.error(`❌ Error migrating ${contact.name} (${contact.email}):`, error.message);
      skippedCount++;
    }
  }
  
  // Commit transaction
  db.exec('COMMIT');
  
  // Verify final state
  const finalCount = db.prepare("SELECT COUNT(*) as count FROM contact_messages").get();
  
  console.log(`\n🎉 Migration completed!`);
  console.log(`   ✅ Successfully migrated: ${migratedCount} contact messages`);
  console.log(`   ⏭️ Skipped (duplicates): ${skippedCount} contact messages`);
  console.log(`   📊 Total in database now: ${finalCount.count}`);
  
  // Verify test message is now in database
  const testMessageCheck = db.prepare("SELECT * FROM contact_messages WHERE email = ? AND subject = ?")
    .get('test-contact-data@example.com', 'Testing Contact Messages Data Retrieval');
  
  console.log(`\n🔍 Test message now in database: ${!!testMessageCheck}`);
  
  if (testMessageCheck) {
    console.log(`📝 Test message details:`, {
      id: testMessageCheck.id,
      name: testMessageCheck.name,
      email: testMessageCheck.email,
      subject: testMessageCheck.subject,
      status: testMessageCheck.status,
      submission_date: testMessageCheck.submission_date
    });
  }
  
  // Show all contact messages for verification
  console.log('\n📧 All contact messages in database after migration:');
  const allMessages = db.prepare("SELECT name, email, subject, status, submission_date FROM contact_messages ORDER BY submission_date DESC").all();
  allMessages.forEach((msg, index) => {
    console.log(`  ${index + 1}. ${msg.name} (${msg.email}) - ${msg.subject} [${msg.status}] - ${msg.submission_date}`);
  });
  
} catch (error) {
  console.error('❌ Error during migration:', error);
  db.exec('ROLLBACK');
} finally {
  db.close();
}

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'data', 'careerflow.db');
const db = new Database(dbPath);

// JSON file path
const jsonPath = path.join(__dirname, '..', 'data', 'contacts.json');

console.log('🔍 Checking contact messages storage systems...\n');

try {
  // Check database contact messages
  console.log('📊 DATABASE CONTACT MESSAGES:');
  
  const dbCount = db.prepare("SELECT COUNT(*) as count FROM contact_messages").get();
  console.log(`📊 Total contact messages in database: ${dbCount.count}`);
  
  if (dbCount.count > 0) {
    const dbMessages = db.prepare("SELECT * FROM contact_messages ORDER BY submission_date DESC").all();
    console.log('\n📧 Database contact messages:');
    dbMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. ${msg.name} (${msg.email}) - ${msg.subject} [${msg.status}] - ${msg.submission_date}`);
    });
  }
  
  // Check JSON file contact messages
  console.log('\n📊 JSON FILE CONTACT MESSAGES:');
  
  if (fs.existsSync(jsonPath)) {
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const jsonMessages = JSON.parse(jsonData);
    
    console.log(`📊 Total contact messages in JSON file: ${jsonMessages.length}`);
    
    if (jsonMessages.length > 0) {
      console.log('\n📧 JSON file contact messages:');
      jsonMessages.slice(0, 10).forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg.name} (${msg.email}) - ${msg.subject} - ${msg.submittedAt}`);
      });
      
      // Check for messages in JSON but not in database
      console.log('\n🔍 CHECKING FOR MISSING MESSAGES:');
      
      const dbEmails = new Set();
      if (dbCount.count > 0) {
        const dbMessages = db.prepare("SELECT email, subject FROM contact_messages").all();
        dbMessages.forEach(msg => {
          dbEmails.add(`${msg.email}:${msg.subject}`);
        });
      }
      
      const missingMessages = [];
      jsonMessages.forEach(jsonMsg => {
        const key = `${jsonMsg.email}:${jsonMsg.subject}`;
        if (!dbEmails.has(key)) {
          missingMessages.push(jsonMsg);
        }
      });
      
      console.log(`❌ Messages in JSON but NOT in database: ${missingMessages.length}`);
      
      if (missingMessages.length > 0) {
        console.log('\n📧 Missing messages:');
        missingMessages.forEach((msg, index) => {
          console.log(`  ${index + 1}. ${msg.name} (${msg.email}) - ${msg.subject} - ${msg.submittedAt}`);
        });
      }
      
      // Check for the specific test message we just submitted
      const testMessage = jsonMessages.find(msg => 
        msg.email === 'test-contact-data@example.com' && 
        msg.subject === 'Testing Contact Messages Data Retrieval'
      );
      
      if (testMessage) {
        console.log('\n🔍 Found our test message in JSON:');
        console.log(`📝 Test message: ${testMessage.name} (${testMessage.email}) - ${testMessage.subject}`);
        console.log(`📅 Submitted: ${testMessage.submittedAt}`);
        
        // Check if it's in database
        const testInDb = db.prepare("SELECT * FROM contact_messages WHERE email = ? AND subject = ?")
          .get(testMessage.email, testMessage.subject);
        
        console.log(`📊 Test message in database: ${!!testInDb}`);
        
        if (!testInDb) {
          console.log('❌ CONFIRMED: Test message exists in JSON but NOT in database');
        }
      }
    }
  } else {
    console.log('❌ contacts.json file does not exist');
  }
  
} catch (error) {
  console.error('❌ Error checking contact messages:', error);
} finally {
  db.close();
}

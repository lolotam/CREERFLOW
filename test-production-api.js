// Using built-in fetch API (Node.js 18+)

const PRODUCTION_URL = 'https://careerflowkw.com'; // Test production server webhook status

async function testProductionAPI() {
  console.log('Testing production API endpoints...\n');

  // Test 1: Contact API
  console.log('1. Testing Contact API...');
  try {
    const contactResponse = await fetch(`${PRODUCTION_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+96555555555',
        subject: 'Webhook Test',
        message: 'Testing webhook functionality'
      })
    });
    
    const contactResult = await contactResponse.json();
    console.log('Contact API Status:', contactResponse.status);
    console.log('Contact API Response:', contactResult);
    console.log('Webhook sent:', contactResult.webhookSent);
  } catch (error) {
    console.error('Contact API Error:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Newsletter API
  console.log('2. Testing Newsletter API...');
  try {
    const newsletterResponse = await fetch(`${PRODUCTION_URL}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'newsletter.test@example.com'
      })
    });
    
    const newsletterResult = await newsletterResponse.json();
    console.log('Newsletter API Status:', newsletterResponse.status);
    console.log('Newsletter API Response:', newsletterResult);
    console.log('Webhook sent:', newsletterResult.webhookSent);
  } catch (error) {
    console.error('Newsletter API Error:', error.message);
  }

  console.log('\n---\n');

  // Test 3: Job Application API
  console.log('3. Testing Job Application API...');
  try {
    const applicationResponse = await fetch(`${PRODUCTION_URL}/api/submit-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'application.test@example.com',
        phone: '+96555555555',
        currentPosition: 'Software Developer',
        jobId: 'test-job-id',
        jobTitle: 'Test Position'
      })
    });
    
    const applicationResult = await applicationResponse.json();
    console.log('Application API Status:', applicationResponse.status);
    console.log('Application API Response:', applicationResult);
    console.log('Webhook sent:', applicationResult.webhookSent);
  } catch (error) {
    console.error('Application API Error:', error.message);
  }
}

testProductionAPI();
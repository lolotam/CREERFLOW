// Post-Deployment Verification Script
// Run this AFTER updating production environment variables

const PRODUCTION_URL = 'https://careerflowkw.com';

async function testPostDeploymentAPI() {
  console.log('🚀 POST-DEPLOYMENT VERIFICATION');
  console.log('=================================');
  console.log(`Testing: ${PRODUCTION_URL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  let allTestsPassed = true;
  const results = {
    contact: { status: 'pending', webhookSent: false, error: null },
    newsletter: { status: 'pending', webhookSent: false, error: null },
    application: { status: 'pending', webhookSent: false, error: null }
  };

  // Test 1: Contact API
  console.log('1️⃣ Testing Contact API...');
  try {
    const contactResponse = await fetch(`${PRODUCTION_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Post-Deploy Test User',
        email: 'posttest@example.com',
        phone: '+96555555555',
        subject: 'Post-Deployment Webhook Test',
        message: 'Testing webhook functionality after deployment fix'
      })
    });
    
    const contactResult = await contactResponse.json();
    results.contact.status = contactResponse.status;
    results.contact.webhookSent = contactResult.webhookSent || false;
    results.contact.error = contactResult.error || null;
    
    console.log(`   Status: ${contactResponse.status}`);
    console.log(`   Success: ${contactResult.success}`);
    console.log(`   Webhook Sent: ${contactResult.webhookSent}`);
    
    if (contactResponse.status === 200 && contactResult.webhookSent) {
      console.log('   ✅ CONTACT API: WORKING CORRECTLY');
    } else {
      console.log('   ❌ CONTACT API: STILL FAILING');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ CONTACT API ERROR: ${error.message}`);
    results.contact.error = error.message;
    allTestsPassed = false;
  }

  console.log('\n---\n');

  // Test 2: Newsletter API
  console.log('2️⃣ Testing Newsletter API...');
  try {
    const newsletterResponse = await fetch(`${PRODUCTION_URL}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'posttest.newsletter@example.com'
      })
    });
    
    const newsletterResult = await newsletterResponse.json();
    results.newsletter.status = newsletterResponse.status;
    results.newsletter.webhookSent = newsletterResult.webhookSent || false;
    results.newsletter.error = newsletterResult.error || null;
    
    console.log(`   Status: ${newsletterResponse.status}`);
    console.log(`   Success: ${newsletterResult.success}`);
    console.log(`   Webhook Sent: ${newsletterResult.webhookSent}`);
    
    if (newsletterResponse.status === 200 && newsletterResult.webhookSent) {
      console.log('   ✅ NEWSLETTER API: WORKING CORRECTLY');
    } else {
      console.log('   ❌ NEWSLETTER API: STILL FAILING');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ NEWSLETTER API ERROR: ${error.message}`);
    results.newsletter.error = error.message;
    allTestsPassed = false;
  }

  console.log('\n---\n');

  // Test 3: Job Application API
  console.log('3️⃣ Testing Job Application API...');
  try {
    const applicationResponse = await fetch(`${PRODUCTION_URL}/api/submit-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'PostDeploy',
        lastName: 'Test',
        email: 'posttest.application@example.com',
        phone: '+96555555555',
        currentPosition: 'QA Engineer',
        jobId: 'post-deploy-test-job',
        jobTitle: 'Test Position'
      })
    });
    
    const applicationResult = await applicationResponse.json();
    results.application.status = applicationResponse.status;
    results.application.webhookSent = applicationResult.webhookSent || false;
    results.application.error = applicationResult.error || null;
    
    console.log(`   Status: ${applicationResponse.status}`);
    console.log(`   Success: ${applicationResult.success}`);
    console.log(`   Webhook Sent: ${applicationResult.webhookSent}`);
    
    if (applicationResponse.status === 200 && applicationResult.webhookSent) {
      console.log('   ✅ APPLICATION API: WORKING CORRECTLY');
    } else {
      console.log('   ❌ APPLICATION API: STILL FAILING');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ APPLICATION API ERROR: ${error.message}`);
    results.application.error = error.message;
    allTestsPassed = false;
  }

  // Generate final report
  console.log('\n🔥 DEPLOYMENT VERIFICATION REPORT 🔥');
  console.log('=====================================');
  console.log(`Test Date: ${new Date().toISOString()}`);
  console.log(`Server: ${PRODUCTION_URL}`);
  console.log('');
  
  console.log('📊 RESULTS SUMMARY:');
  console.log(`Contact API: ${results.contact.status} | Webhook: ${results.contact.webhookSent ? '✅' : '❌'}`);
  console.log(`Newsletter API: ${results.newsletter.status} | Webhook: ${results.newsletter.webhookSent ? '✅' : '❌'}`);
  console.log(`Application API: ${results.application.status} | Webhook: ${results.application.webhookSent ? '✅' : '❌'}`);
  
  console.log('');
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! DEPLOYMENT SUCCESSFUL! 🎉');
    console.log('✅ All webhooks are working correctly');
    console.log('✅ Production environment variables updated successfully');
    console.log('✅ n8n integration is functioning properly');
  } else {
    console.log('🚨 SOME TESTS FAILED! DEPLOYMENT NEEDS ATTENTION! 🚨');
    console.log('');
    console.log('🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Verify environment variables are set correctly on production server');
    console.log('2. Restart the production application');
    console.log('3. Check n8n workflow status at https://n8n-waleed.shop');
    console.log('4. Verify webhook URLs are accessible:');
    console.log('   - https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e');
    console.log('   - https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf');
    console.log('   - https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287');
  }
  
  console.log('=====================================');
  
  return {
    allTestsPassed,
    results,
    timestamp: new Date().toISOString()
  };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testPostDeploymentAPI };
} else {
  // Run immediately if called directly
  testPostDeploymentAPI();
}
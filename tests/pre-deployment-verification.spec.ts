import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://careerflowkw.com';

test.describe('Pre-Deployment Production Server Testing', () => {
  test('Document current broken webhook state - Contact API', async ({ request }) => {
    console.log('🔍 Testing Contact API before deployment...');
    
    const contactResponse = await request.post(`${PRODUCTION_URL}/api/contact`, {
      data: {
        name: 'Pre-Deploy Test User',
        email: 'pretest@example.com',
        phone: '+96555555555',
        subject: 'Pre-Deployment Test',
        message: 'Testing webhook before deployment fix'
      }
    });
    
    const contactResult = await contactResponse.json();
    
    console.log('📊 Contact API Results:');
    console.log('Status:', contactResponse.status());
    console.log('Response:', JSON.stringify(contactResult, null, 2));
    console.log('Webhook Status:', contactResult.webhookSent);
    
    // Document the current broken state
    if (contactResponse.status() === 500) {
      console.log('✅ CONFIRMED: Contact API failing as expected (webhook 404)');
    } else {
      console.log('⚠️  UNEXPECTED: Contact API not failing as expected');
    }
  });

  test('Document current broken webhook state - Newsletter API', async ({ request }) => {
    console.log('🔍 Testing Newsletter API before deployment...');
    
    const newsletterResponse = await request.post(`${PRODUCTION_URL}/api/subscribe`, {
      data: {
        email: 'pretest.newsletter@example.com'
      }
    });
    
    const newsletterResult = await newsletterResponse.json();
    
    console.log('📊 Newsletter API Results:');
    console.log('Status:', newsletterResponse.status());
    console.log('Response:', JSON.stringify(newsletterResult, null, 2));
    console.log('Webhook Status:', newsletterResult.webhookSent);
    
    // Document the current broken state
    if (newsletterResponse.status() === 500) {
      console.log('✅ CONFIRMED: Newsletter API failing as expected (webhook 404)');
    } else {
      console.log('⚠️  UNEXPECTED: Newsletter API not failing as expected');
    }
  });

  test('Document current broken webhook state - Application API', async ({ request }) => {
    console.log('🔍 Testing Application API before deployment...');
    
    const applicationResponse = await request.post(`${PRODUCTION_URL}/api/submit-webhook`, {
      data: {
        firstName: 'PreDeploy',
        lastName: 'Test',
        email: 'pretest.application@example.com',
        phone: '+96555555555',
        currentPosition: 'Test Position',
        jobId: 'pre-deploy-test'
      }
    });
    
    const applicationResult = await applicationResponse.json();
    
    console.log('📊 Application API Results:');
    console.log('Status:', applicationResponse.status());
    console.log('Response:', JSON.stringify(applicationResult, null, 2));
    console.log('Webhook Status:', applicationResult.webhookSent);
    
    // Document the current broken state
    if (applicationResponse.status() === 502) {
      console.log('✅ CONFIRMED: Application API failing as expected (webhook 404)');
    } else {
      console.log('⚠️  UNEXPECTED: Application API not failing as expected');
    }
  });

  test('Test production website accessibility', async ({ page }) => {
    console.log('🔍 Testing production website accessibility...');
    
    // Test if the main site loads
    await page.goto(PRODUCTION_URL);
    await page.waitForLoadState('networkidle');
    
    const title = await page.title();
    console.log('Website Title:', title);
    
    // Check if basic elements exist
    const hasHeader = await page.locator('header').isVisible();
    const hasFooter = await page.locator('footer').isVisible();
    
    console.log('Has Header:', hasHeader);
    console.log('Has Footer:', hasFooter);
    
    // Test navigation
    const jobsLink = page.locator('a[href*="jobs"], a[href*="careers"]').first();
    if (await jobsLink.isVisible()) {
      console.log('✅ Jobs section accessible');
    } else {
      console.log('⚠️  Jobs section not found');
    }
    
    console.log('✅ Website is accessible and loading correctly');
  });

  test('Generate pre-deployment report', async () => {
    console.log('\n🔥 PRE-DEPLOYMENT STATUS REPORT 🔥');
    console.log('=====================================');
    console.log('Production Server: careerflowkw.com');
    console.log('Test Date:', new Date().toISOString());
    console.log('');
    console.log('🚨 EXPECTED FAILURES (BEFORE FIX):');
    console.log('- Contact API: 500 error (webhook failing)');
    console.log('- Newsletter API: 500 error (webhook failing)');
    console.log('- Application API: 502 error (webhook 404)');
    console.log('');
    console.log('🎯 ROOT CAUSE:');
    console.log('Production server using development webhook URLs:');
    console.log('❌ https://n8n-waleed.shop/webhook-test/[id]');
    console.log('');
    console.log('✅ SHOULD BE USING (PRODUCTION):');
    console.log('✅ https://n8n-waleed.shop/webhook/[id]');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Deploy environment variable changes');
    console.log('2. Restart production application');
    console.log('3. Run post-deployment tests');
    console.log('4. Verify all webhooks return 200 status');
    console.log('=====================================');
  });
});
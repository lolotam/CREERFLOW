import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://careerflowkw.com';

test.describe('Production Webhook Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production site
    await page.goto(PRODUCTION_URL);
  });

  test('Test contact form submission', async ({ page }) => {
    console.log('Testing contact form on production...');
    
    // Navigate to contact page or find contact form
    // First check if contact form is on homepage
    const contactSection = page.locator('[data-testid="contact-form"], #contact, .contact-form').first();
    
    if (await contactSection.isVisible()) {
      console.log('Contact form found on homepage');
    } else {
      // Try to find contact page link
      const contactLink = page.locator('a[href*="contact"], a[href*="#contact"]').first();
      if (await contactLink.isVisible()) {
        await contactLink.click();
        await page.waitForLoadState('networkidle');
      }
    }

    // Fill contact form
    await page.fill('input[name="name"], [name="firstName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '+96555555555');
    await page.fill('input[name="subject"], textarea[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message to verify webhook functionality');

    // Listen for network requests to capture webhook calls
    const webhookRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('n8n-waleed.shop')) {
        webhookRequests.push({
          url: request.url(),
          method: request.method(),
          postData: request.postDataJSON()
        });
        console.log('Webhook request detected:', request.url());
      }
    });

    // Submit form
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();

    // Wait for response
    await page.waitForTimeout(3000);
    
    console.log('Webhook requests captured:', webhookRequests);
  });

  test('Test job application form submission', async ({ page }) => {
    console.log('Testing job application form on production...');
    
    // Navigate to jobs page
    const jobsLink = page.locator('a[href*="jobs"], a[href*="careers"]').first();
    if (await jobsLink.isVisible()) {
      await jobsLink.click();
      await page.waitForLoadState('networkidle');
    }

    // Find a job listing and click apply
    const applyButton = page.locator('button:has-text("Apply"), a:has-text("Apply"), [data-testid="apply-button"]').first();
    
    if (await applyButton.isVisible()) {
      await applyButton.click();
      await page.waitForLoadState('networkidle');

      // Fill application form
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', 'Doe');
      await page.fill('input[name="email"]', 'john.doe@example.com');
      await page.fill('input[name="phone"]', '+96555555555');
      await page.fill('input[name="currentPosition"], textarea[name="currentPosition"]', 'Software Developer');

      // Listen for webhook requests
      const webhookRequests: any[] = [];
      page.on('request', (request) => {
        if (request.url().includes('n8n-waleed.shop')) {
          webhookRequests.push({
            url: request.url(),
            method: request.method(),
            postData: request.postDataJSON()
          });
          console.log('Application webhook request detected:', request.url());
        }
      });

      // Submit application
      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();

      // Wait for response
      await page.waitForTimeout(3000);
      
      console.log('Application webhook requests captured:', webhookRequests);
    } else {
      console.log('No apply button found on jobs page');
    }
  });

  test('Test newsletter subscription', async ({ page }) => {
    console.log('Testing newsletter subscription on production...');
    
    // Look for newsletter signup form (usually in footer)
    const newsletterForm = page.locator('[data-testid="newsletter-form"], .newsletter, .subscribe').first();
    
    // Try footer if not found
    if (!(await newsletterForm.isVisible())) {
      const footer = page.locator('footer').first();
      await footer.scrollIntoViewIfNeeded();
    }

    // Find email input for newsletter
    const emailInput = page.locator('input[type="email"][name*="email"], input[placeholder*="email"], input[placeholder*="newsletter"]').first();
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('newsletter.test@example.com');

      // Listen for webhook requests
      const webhookRequests: any[] = [];
      page.on('request', (request) => {
        if (request.url().includes('n8n-waleed.shop')) {
          webhookRequests.push({
            url: request.url(),
            method: request.method(),
            postData: request.postDataJSON()
          });
          console.log('Newsletter webhook request detected:', request.url());
        }
      });

      // Submit newsletter form
      const submitBtn = page.locator('button[type="submit"]').last();
      await submitBtn.click();

      // Wait for response
      await page.waitForTimeout(3000);
      
      console.log('Newsletter webhook requests captured:', webhookRequests);
    } else {
      console.log('Newsletter signup form not found');
    }
  });

  test('Check API endpoints directly', async ({ request }) => {
    console.log('Testing API endpoints directly...');
    
    // Test contact API
    const contactResponse = await request.post(`${PRODUCTION_URL}/api/contact`, {
      data: {
        name: 'API Test User',
        email: 'apitest@example.com',
        phone: '+96555555555',
        subject: 'API Test Subject',
        message: 'This is an API test message'
      }
    });
    
    console.log('Contact API response:', await contactResponse.json());
    
    // Test subscribe API
    const subscribeResponse = await request.post(`${PRODUCTION_URL}/api/subscribe`, {
      data: {
        email: 'apitest.newsletter@example.com'
      }
    });
    
    console.log('Subscribe API response:', await subscribeResponse.json());
    
    // Test application API
    const applicationResponse = await request.post(`${PRODUCTION_URL}/api/submit-webhook`, {
      data: {
        firstName: 'API',
        lastName: 'Test',
        email: 'apitest.application@example.com',
        phone: '+96555555555',
        currentPosition: 'Test Position',
        jobId: 'test-job'
      }
    });
    
    console.log('Application API response:', await applicationResponse.json());
  });
});
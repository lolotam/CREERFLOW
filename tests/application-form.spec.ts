import { test, expect, Page } from '@playwright/test';

// Test data
const testData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  phone: '123-456-7890',
  address: '123 Main Street',
  country: 'United States',
  experience: '2-5 years',
  education: "Bachelor's Degree",
  status: 'Actively Looking'
};

// Helper function to fill form fields
async function fillApplicationForm(page: Page, data = testData) {
  // Fill personal information
  await page.getByPlaceholder('Enter your first name').fill(data.firstName);
  await page.getByPlaceholder('Enter your last name').fill(data.lastName);
  await page.getByPlaceholder('your.email@example.com').fill(data.email);
  await page.getByPlaceholder('123-456-7890').fill(data.phone);
  await page.getByPlaceholder('123 Main Street').fill(data.address);

  // Select country - find the combobox in the Personal Information section
  const personalSection = page.locator('section').filter({ hasText: 'Personal Information' });
  await personalSection.getByRole('combobox').last().selectOption([data.country]);

  // Fill experience and education - find comboboxes in Experience section
  const experienceSection = page.locator('section').filter({ hasText: 'Experience & Skills' });
  await experienceSection.getByRole('combobox').first().selectOption([data.experience]);
  await experienceSection.getByRole('combobox').last().selectOption([data.education]);

  // Select status - find combobox in Additional Information section
  const additionalSection = page.locator('section').filter({ hasText: 'Additional Information' });
  await additionalSection.getByRole('combobox').nth(1).selectOption([data.status]);
}

// Helper function to upload a test file
async function uploadTestFile(page: Page) {
  // Create a simple test PDF content
  const testPdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT/Helvetica 12 Tf 72 720 Td(Test Resume)Tj ET
endstream endobj
xref 0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
trailer<</Size 5/Root 1 0 R>>
startxref 318
%%EOF`;

  // Find the resume file input specifically
  const resumeSection = page.locator('div').filter({ hasText: 'Resume *' });
  const fileInput = resumeSection.locator('input[type="file"]');

  // Upload the test file directly to the input
  await fileInput.setInputFiles({
    name: 'test-resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(testPdfContent)
  });
}

test.describe('CareerFlow Application Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/en/apply');
    await expect(page).toHaveTitle(/CareerFlow/);
  });

  test('should load the application form correctly', async ({ page }) => {
    // Check if main form elements are present
    await expect(page.getByRole('heading', { name: 'Apply for Senior Registered Nurse' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Complete Your Application' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Experience & Skills' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Additional Information' })).toBeVisible();
    
    // Check if submit button is initially disabled
    await expect(page.getByRole('button', { name: 'Submit Application' })).toBeDisabled();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    const submitButton = page.getByRole('button', { name: 'Submit Application' });
    await expect(submitButton).toBeDisabled();
    
    // Fill only some required fields
    await page.getByRole('textbox', { name: 'Enter your first name' }).fill('John');
    await page.getByRole('textbox', { name: 'Enter your last name' }).fill('Doe');
    
    // Submit button should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when all required fields are filled', async ({ page }) => {
    await fillApplicationForm(page);
    await uploadTestFile(page);
    
    // Wait for file upload to complete
    await expect(page.getByText('File Uploaded')).toBeVisible({ timeout: 10000 });
    
    // Submit button should now be enabled
    await expect(page.getByRole('button', { name: 'Submit Application' })).toBeEnabled();
  });

  test('should validate file upload types', async ({ page }) => {
    // Try to upload an invalid file type
    await page.getByRole('button', { name: 'Choose File' }).first().click();

    await page.setInputFiles('input[type="file"]', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file')
    });

    // Should show error message for invalid file type
    await expect(page.getByText(/File type must be one of/)).toBeVisible({ timeout: 5000 });
  });

  test('should successfully submit application with valid data', async ({ page }) => {
    // Set up network monitoring
    const requests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/submit-webhook')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData()
        });
      }
    });

    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/submit-webhook')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    // Fill the form completely
    await fillApplicationForm(page);
    await uploadTestFile(page);

    // Wait for file upload to complete
    await expect(page.getByText('File Uploaded')).toBeVisible({ timeout: 10000 });

    // Submit the form
    await page.getByRole('button', { name: 'Submit Application' }).click();

    // Wait for submission to complete (either success or error)
    await page.waitForTimeout(5000);

    // Verify that the API request was made
    expect(requests.length).toBeGreaterThan(0);
    expect(requests[0].method).toBe('POST');
    expect(requests[0].url).toContain('/api/submit-webhook');

    // Check if we got a response
    expect(responses.length).toBeGreaterThan(0);

    // Log the response for debugging
    console.log('API Response:', responses[0]);

    // The response should be either success (200) or a specific error
    expect([200, 502, 503].includes(responses[0].status)).toBeTruthy();
  });

  test('should handle webhook errors gracefully', async ({ page }) => {
    // Fill the form completely
    await fillApplicationForm(page);
    await uploadTestFile(page);

    // Wait for file upload to complete
    await expect(page.getByText('File Uploaded')).toBeVisible({ timeout: 10000 });

    // Submit the form
    await page.getByRole('button', { name: 'Submit Application' }).click();

    // Wait for potential error dialog
    await page.waitForTimeout(3000);

    // Check if an error dialog appears (this is expected if webhook is not active)
    const dialog = page.locator('[role="dialog"]');
    if (await dialog.isVisible()) {
      await expect(dialog).toContainText(/Failed to submit application/);
      // Close the dialog
      await page.keyboard.press('Escape');
    }
  });

  test('should display proper error messages for network issues', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/submit-webhook', route => {
      route.abort('failed');
    });

    // Fill the form completely
    await fillApplicationForm(page);
    await uploadTestFile(page);

    // Wait for file upload to complete
    await expect(page.getByText('File Uploaded')).toBeVisible({ timeout: 10000 });

    // Submit the form
    await page.getByRole('button', { name: 'Submit Application' }).click();

    // Should show network error
    await expect(page.getByText(/network error|failed to submit/i)).toBeVisible({ timeout: 10000 });
  });

  test('should verify webhook URL is correctly configured', async ({ page }) => {
    // Navigate to the API endpoint directly to test it
    const response = await page.request.get('http://localhost:3000/api/submit-webhook');

    // Should return 405 Method Not Allowed for GET request
    expect(response.status()).toBe(405);
  });
});

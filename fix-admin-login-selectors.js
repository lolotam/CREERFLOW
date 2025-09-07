const fs = require('fs');
const path = require('path');

// List of test files that need to be updated
const testFiles = [
  'tests/admin-dashboard-comprehensive-test.spec.ts',
  'tests/admin-dashboard-issues-test.spec.ts',
  'tests/admin-job-management-fix-verification.spec.ts',
  'tests/admin-job-management-investigation.spec.ts',
  'tests/admin-job-management-test.spec.ts',
  'tests/comprehensive-verification-all-changes.spec.ts',
  'tests/contact-messages-data-issue-test.spec.ts',
  'tests/contact-messages-delete-test.spec.ts',
  'tests/contact-messages-fix-verification.spec.ts',
  'tests/contact-messages-modal-focused-test.spec.ts',
  'tests/contact-messages-preview-test.spec.ts',
  'tests/contact-messages-status-slider-test.spec.ts',
  'tests/contact-messages-status-test.spec.ts',
  'tests/contact-messages-status-toggle-test.spec.ts',
  'tests/email-subscriber-data-issue-test.spec.ts',
  'tests/email-subscriber-fix-verification.spec.ts',
  'tests/email-subscribers-fix-test.spec.ts',
  'tests/job-management-after-enhancement.spec.ts',
  'tests/job-management-before-enhancement.spec.ts',
  'tests/job-management-modal-styling-baseline.spec.ts',
  'tests/job-management-section-test.spec.ts'
];

console.log('🔧 Fixing admin login button selectors in test files...');

let totalFilesUpdated = 0;
let totalReplacements = 0;

testFiles.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Replace the problematic selector patterns
      // Only replace admin login contexts (after username/password fill)

      // Pattern 1: Replace admin login button clicks
      content = content.replace(
        /(await page\.fill\('input\[name="password"\]', '@Ww55683677wW@'\);\s*\n\s*)await page\.click\('button\[type="submit"\]'\);/g,
        "$1await page.getByRole('button', { name: 'Sign In' }).click();"
      );

      // Pattern 2: Replace admin login button locators
      content = content.replace(
        /const loginButton = page\.locator\('button\[type="submit"\]'\);/g,
        "const loginButton = page.getByRole('button', { name: 'Sign In' });"
      );

      // Pattern 3: Generic admin login context replacement
      content = content.replace(
        /(admin.*\n.*username.*admin.*\n.*password.*@Ww55683677wW@.*\n\s*)await page\.click\('button\[type="submit"\]'\);/g,
        "$1await page.getByRole('button', { name: 'Sign In' }).click();"
      );
      
      // Count replacements made in this file
      const replacements = (originalContent.match(/button\[type="submit"\]/g) || []).length;
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${filePath} - ${replacements} replacements made`);
        totalFilesUpdated++;
        totalReplacements += replacements;
      } else {
        console.log(`ℹ️  No changes needed in ${filePath}`);
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n📊 Summary:');
console.log(`✅ Files updated: ${totalFilesUpdated}`);
console.log(`🔄 Total replacements: ${totalReplacements}`);
console.log('\n🎯 Admin login button selectors have been updated to use:');
console.log("   page.getByRole('button', { name: 'Sign In' })");
console.log('\n✨ This should resolve the selector ambiguity issue between Sign In and Subscribe buttons.');

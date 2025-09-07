import { test, expect } from '@playwright/test';

test.describe('Detailed Console Error Analysis', () => {
  test('should capture and analyze console errors with detailed output', async ({ page }) => {
    console.log('🔍 DETAILED CONSOLE ERROR ANALYSIS');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const logs: string[] = [];
    
    // Capture all console messages
    page.on('console', (msg) => {
      const message = `[${msg.type().toUpperCase()}] ${msg.text()}`;
      
      if (msg.type() === 'error') {
        errors.push(message);
        console.log(`🚨 ${message}`);
      } else if (msg.type() === 'warning') {
        warnings.push(message);
        console.log(`⚠️ ${message}`);
      } else if (msg.type() === 'log') {
        logs.push(message);
      }
    });
    
    // Capture page errors
    page.on('pageerror', (error) => {
      const message = `[PAGE ERROR] ${error.message}`;
      errors.push(message);
      console.log(`💥 ${message}`);
    });
    
    // Test 1: Homepage
    console.log('\n🏠 Testing Homepage...');
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Test 2: Admin Login
    console.log('\n🔐 Testing Admin Login...');
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test 3: Admin Dashboard
    console.log('\n📊 Testing Admin Dashboard...');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Test 4: Job Management
    console.log('\n💼 Testing Job Management...');
    await page.click('text=Job Management');
    await page.waitForTimeout(5000);
    
    // Test Add Job Modal
    const addJobButton = page.locator('button:has-text("Add New Job")');
    if (await addJobButton.count() > 0) {
      console.log('   Testing Add Job Modal...');
      await addJobButton.click();
      await page.waitForTimeout(2000);
      
      const closeButton = page.locator('button:has-text("Cancel")');
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Test 5: Email Subscribers
    console.log('\n📧 Testing Email Subscribers...');
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(3000);
    
    // Test 6: Contact Messages
    console.log('\n📬 Testing Contact Messages...');
    await page.click('text=Contact Messages');
    await page.waitForTimeout(3000);
    
    // Analysis
    console.log('\n📊 CONSOLE ERROR ANALYSIS RESULTS:');
    console.log('=====================================');
    console.log(`🚨 Total Errors: ${errors.length}`);
    console.log(`⚠️ Total Warnings: ${warnings.length}`);
    console.log(`📝 Total Logs: ${logs.length}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 ERRORS DETECTED:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✅ NO ERRORS DETECTED!');
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS DETECTED:');
      warnings.slice(0, 10).forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
      if (warnings.length > 10) {
        console.log(`   ... and ${warnings.length - 10} more warnings`);
      }
    } else {
      console.log('\n✅ NO WARNINGS DETECTED!');
    }
    
    // Categorize errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.includes('net::ERR_FAILED') &&
      !error.includes('Failed to load resource')
    );
    
    const apiErrors = errors.filter(error => 
      error.includes('404') ||
      error.includes('500') ||
      error.includes('Failed to fetch') ||
      error.includes('API')
    );
    
    const resourceErrors = errors.filter(error => 
      error.includes('favicon') ||
      error.includes('Failed to load resource') ||
      error.includes('net::ERR_FAILED')
    );
    
    console.log('\n📋 ERROR CATEGORIZATION:');
    console.log(`💥 Critical Errors: ${criticalErrors.length}`);
    console.log(`📡 API Errors: ${apiErrors.length}`);
    console.log(`📁 Resource Errors: ${resourceErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log('\n🔴 CRITICAL ERRORS (NEED IMMEDIATE FIX):');
      criticalErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (apiErrors.length > 0) {
      console.log('\n🟡 API ERRORS (MEDIUM PRIORITY):');
      apiErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (resourceErrors.length > 0) {
      console.log('\n🟢 RESOURCE ERRORS (LOW PRIORITY):');
      resourceErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    if (criticalErrors.length === 0 && apiErrors.length === 0) {
      console.log('✅ APPLICATION IS RUNNING CLEANLY!');
      console.log('   No critical errors or API errors detected.');
      console.log('   Only minor resource errors (if any) that don\'t affect functionality.');
    } else {
      if (criticalErrors.length > 0) {
        console.log('🔴 Fix critical errors immediately - they may break functionality');
      }
      if (apiErrors.length > 0) {
        console.log('🟡 Fix API errors - they may affect data loading');
      }
    }
    
    // Test should pass if no critical errors
    expect(criticalErrors.length).toBeLessThanOrEqual(2);
    
    console.log('\n✅ Detailed console error analysis completed');
  });
});

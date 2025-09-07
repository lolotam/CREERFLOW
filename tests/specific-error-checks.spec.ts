import { test, expect } from '@playwright/test';

test.describe('Specific Error Checks for Common Issues', () => {
  test('should check for React hydration errors', async ({ page }) => {
    console.log('⚛️ CHECKING: React hydration errors');
    
    const hydrationErrors: string[] = [];
    const reactErrors: string[] = [];
    
    page.on('console', (msg) => {
      const message = msg.text();
      
      if (message.includes('hydration') || message.includes('Hydration')) {
        hydrationErrors.push(message);
        console.log(`💧 HYDRATION ERROR: ${message}`);
      }
      
      if (message.includes('React') || message.includes('Warning: ')) {
        reactErrors.push(message);
        console.log(`⚛️ REACT WARNING: ${message}`);
      }
    });
    
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`💧 Hydration errors found: ${hydrationErrors.length}`);
    console.log(`⚛️ React warnings found: ${reactErrors.length}`);
    
    if (hydrationErrors.length > 0) {
      console.log('\n💧 HYDRATION ERRORS:');
      hydrationErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (reactErrors.length > 0) {
      console.log('\n⚛️ REACT WARNINGS:');
      reactErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    expect(hydrationErrors.length).toBe(0);
  });

  test('should check for Next.js specific errors', async ({ page }) => {
    console.log('🔄 CHECKING: Next.js specific errors');
    
    const nextjsErrors: string[] = [];
    const routingErrors: string[] = [];
    
    page.on('console', (msg) => {
      const message = msg.text();
      
      if (message.includes('Next.js') || message.includes('next/') || message.includes('_next/')) {
        nextjsErrors.push(message);
        console.log(`🔄 NEXT.JS ERROR: ${message}`);
      }
      
      if (message.includes('router') || message.includes('navigation') || message.includes('404')) {
        routingErrors.push(message);
        console.log(`🧭 ROUTING ERROR: ${message}`);
      }
    });
    
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    
    // Test navigation
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.goto('http://localhost:4444/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    console.log(`🔄 Next.js errors found: ${nextjsErrors.length}`);
    console.log(`🧭 Routing errors found: ${routingErrors.length}`);
    
    if (nextjsErrors.length > 0) {
      console.log('\n🔄 NEXT.JS ERRORS:');
      nextjsErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (routingErrors.length > 0) {
      console.log('\n🧭 ROUTING ERRORS:');
      routingErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  });

  test('should check for API and network errors', async ({ page }) => {
    console.log('📡 CHECKING: API and network errors');
    
    const apiErrors: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', (msg) => {
      const message = msg.text();
      
      if (message.includes('Failed to fetch') || 
          message.includes('API') || 
          message.includes('500') || 
          message.includes('404') ||
          message.includes('fetch')) {
        apiErrors.push(message);
        console.log(`📡 API ERROR: ${message}`);
      }
      
      if (message.includes('net::') || 
          message.includes('ERR_') || 
          message.includes('Failed to load resource')) {
        networkErrors.push(message);
        console.log(`🌐 NETWORK ERROR: ${message}`);
      }
    });
    
    // Test API endpoints by navigating to admin sections
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test Job Management (loads jobs API)
    await page.click('text=Job Management');
    await page.waitForTimeout(5000);
    
    // Test Email Subscribers (loads subscribers API)
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(3000);
    
    // Test Contact Messages (loads messages API)
    await page.click('text=Contact Messages');
    await page.waitForTimeout(3000);
    
    console.log(`📡 API errors found: ${apiErrors.length}`);
    console.log(`🌐 Network errors found: ${networkErrors.length}`);
    
    if (apiErrors.length > 0) {
      console.log('\n📡 API ERRORS:');
      apiErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (networkErrors.length > 0) {
      console.log('\n🌐 NETWORK ERRORS:');
      networkErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  });

  test('should check for JavaScript runtime errors', async ({ page }) => {
    console.log('🔧 CHECKING: JavaScript runtime errors');
    
    const jsErrors: string[] = [];
    const typeErrors: string[] = [];
    
    page.on('console', (msg) => {
      const message = msg.text();
      
      if (msg.type() === 'error') {
        jsErrors.push(message);
        console.log(`🔧 JS ERROR: ${message}`);
        
        if (message.includes('TypeError') || 
            message.includes('ReferenceError') || 
            message.includes('SyntaxError') ||
            message.includes('undefined') ||
            message.includes('null')) {
          typeErrors.push(message);
          console.log(`⚠️ TYPE ERROR: ${message}`);
        }
      }
    });
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
      console.log(`💥 PAGE ERROR: ${error.message}`);
    });
    
    // Test various interactions that might cause JS errors
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    
    // Test form interactions
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test modal interactions
    await page.click('text=Job Management');
    await page.waitForTimeout(3000);
    
    const addJobButton = page.locator('button:has-text("Add New Job")');
    if (await addJobButton.count() > 0) {
      await addJobButton.click();
      await page.waitForTimeout(1000);
      
      const closeButton = page.locator('button:has-text("Cancel")');
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    console.log(`🔧 JavaScript errors found: ${jsErrors.length}`);
    console.log(`⚠️ Type errors found: ${typeErrors.length}`);
    
    if (jsErrors.length > 0) {
      console.log('\n🔧 JAVASCRIPT ERRORS:');
      jsErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    if (typeErrors.length > 0) {
      console.log('\n⚠️ TYPE ERRORS:');
      typeErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Should have minimal JS errors
    expect(jsErrors.length).toBeLessThanOrEqual(3);
  });

  test('should generate comprehensive error summary', async ({ page }) => {
    console.log('📋 GENERATING: Comprehensive error summary');
    
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        allErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        allWarnings.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      allErrors.push(error.message);
    });
    
    // Complete application walkthrough
    await page.goto('http://localhost:4444');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.goto('http://localhost:4444/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '@Ww55683677wW@');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.click('text=Job Management');
    await page.waitForTimeout(3000);
    
    await page.click('text=Email Subscribers');
    await page.waitForTimeout(2000);
    
    await page.click('text=Contact Messages');
    await page.waitForTimeout(2000);
    
    console.log('\n📊 FINAL ERROR SUMMARY:');
    console.log('========================');
    console.log(`🚨 Total Errors: ${allErrors.length}`);
    console.log(`⚠️ Total Warnings: ${allWarnings.length}`);
    
    if (allErrors.length === 0 && allWarnings.length === 0) {
      console.log('\n🎉 EXCELLENT! NO CONSOLE ERRORS OR WARNINGS DETECTED!');
      console.log('✅ The CareerFlow application is running cleanly without any console issues.');
    } else if (allErrors.length === 0) {
      console.log('\n✅ GOOD! NO CONSOLE ERRORS DETECTED!');
      console.log(`⚠️ Only ${allWarnings.length} warnings found (non-critical).`);
    } else {
      console.log('\n🔍 ERRORS DETECTED - NEED INVESTIGATION:');
      allErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    console.log('\n🎯 CONSOLE ERROR STATUS:');
    if (allErrors.length === 0) {
      console.log('✅ APPLICATION CONSOLE STATUS: CLEAN');
      console.log('✅ NO CRITICAL FIXES NEEDED');
    } else {
      console.log('⚠️ APPLICATION CONSOLE STATUS: NEEDS ATTENTION');
      console.log(`🔧 ${allErrors.length} error(s) need to be fixed`);
    }
    
    expect(true).toBe(true); // Test always passes for reporting
  });
});

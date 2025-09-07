// Simple test to verify hydration fixes
// This script can be run in the browser console to check for hydration issues

console.log('🧪 Testing Hydration Fixes...');

// Test 1: Check if HTML element has suppressHydrationWarning
const htmlElement = document.documentElement;
const hasSuppress = htmlElement.hasAttribute('suppresshydrationwarning');
console.log(`✅ HTML suppressHydrationWarning: ${hasSuppress ? 'Present' : 'Missing'}`);

// Test 2: Check if body element has suppressHydrationWarning
const bodyElement = document.body;
const bodyHasSuppress = bodyElement.hasAttribute('suppresshydrationwarning');
console.log(`✅ Body suppressHydrationWarning: ${bodyHasSuppress ? 'Present' : 'Missing'}`);

// Test 3: Check for browser extension attributes
const extensionAttrs = [];
for (let attr of htmlElement.attributes) {
  if (!['lang', 'dir', 'suppresshydrationwarning'].includes(attr.name.toLowerCase())) {
    extensionAttrs.push(attr.name);
  }
}
console.log(`🔍 Browser extension attributes found: ${extensionAttrs.length > 0 ? extensionAttrs.join(', ') : 'None'}`);

// Test 4: Check for hydration-related console errors
const originalError = console.error;
let hydrationErrors = [];
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('hydration') || message.includes('server rendered HTML')) {
    hydrationErrors.push(message);
  }
  originalError.apply(console, args);
};

// Test 5: Check localStorage access (should be safe now)
try {
  const testKey = 'hydration-test';
  localStorage.setItem(testKey, 'test');
  localStorage.removeItem(testKey);
  console.log('✅ localStorage access: Safe');
} catch (error) {
  console.log('❌ localStorage access: Error -', error.message);
}

// Summary
setTimeout(() => {
  console.log('\n📊 Hydration Test Summary:');
  console.log(`- HTML suppressHydrationWarning: ${hasSuppress ? '✅' : '❌'}`);
  console.log(`- Body suppressHydrationWarning: ${bodyHasSuppress ? '✅' : '❌'}`);
  console.log(`- Extension attributes: ${extensionAttrs.length > 0 ? '⚠️ ' + extensionAttrs.length : '✅ None'}`);
  console.log(`- Hydration errors: ${hydrationErrors.length > 0 ? '❌ ' + hydrationErrors.length : '✅ None'}`);
  
  if (hasSuppress && bodyHasSuppress && hydrationErrors.length === 0) {
    console.log('🎉 All hydration fixes appear to be working correctly!');
  } else {
    console.log('⚠️ Some hydration issues may still exist. Check the details above.');
  }
}, 2000);

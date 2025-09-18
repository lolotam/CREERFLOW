// Quick test to verify webhook environment variables are loaded
console.log('=== Webhook Environment Variables Test ===');
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('SESSION_SECRET length:', process.env.SESSION_SECRET?.length || 0);
console.log('JOB_APPLICATION_WEBHOOK_URL:', process.env.JOB_APPLICATION_WEBHOOK_URL || 'NOT SET');
console.log('CONTACT_WEBHOOK_URL:', process.env.CONTACT_WEBHOOK_URL || 'NOT SET');
console.log('NEWSLETTER_WEBHOOK_URL:', process.env.NEWSLETTER_WEBHOOK_URL || 'NOT SET');

// Test webhook URLs format
const webhookUrls = [
  process.env.JOB_APPLICATION_WEBHOOK_URL,
  process.env.CONTACT_WEBHOOK_URL,
  process.env.NEWSLETTER_WEBHOOK_URL
].filter(Boolean);

webhookUrls.forEach((url, index) => {
  const isValidUrl = url && url.startsWith('https://') && url.includes('n8n-waleed.shop');
  console.log(`Webhook URL ${index + 1} valid:`, isValidUrl ? '✅' : '❌', url);
});

console.log('=== Test Complete ===');
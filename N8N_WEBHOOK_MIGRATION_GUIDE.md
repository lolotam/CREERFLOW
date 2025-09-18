# n8n Webhook Migration Guide: Development to Production

## Understanding n8n Webhook Modes

### Development Mode (`webhook-test`)
- **URL Pattern**: `https://n8n-waleed.shop/webhook-test/[workflow-id]`
- **Requirements**:
  - n8n editor must be open
  - Workflow can be inactive
  - Used for testing and development
- **Limitation**: Stops working when you close n8n editor

### Production Mode (`webhook`)
- **URL Pattern**: `https://n8n-waleed.shop/webhook/[workflow-id]`
- **Requirements**:
  - Workflow must be **ACTIVE** (turned ON)
  - n8n editor can be closed
  - Works 24/7 independently
- **Best for**: Live production environments

## Your Webhook Mappings

| Feature | Development URL | Production URL | Status |
|---------|----------------|----------------|---------|
| **Contact Form** | `https://n8n-waleed.shop/webhook-test/2db83cc9-3a65-40e4-9283-15e80c9681cf` | `https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf` | ✅ Ready |
| **Newsletter** | `https://n8n-waleed.shop/webhook-test/31160d81-3436-4e9f-a73d-3786dfe4d287` | `https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287` | ✅ Ready |
| **Job Application** | `https://n8n-waleed.shop/webhook-test/f369bb52-4c9d-46f4-87f5-842015b4231e` | `https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e` | ✅ Ready |

## Migration Steps

### Step 1: Activate n8n Workflows
1. Open n8n dashboard at `https://n8n-waleed.shop`
2. For each workflow:
   - Open the workflow
   - Toggle the **Active** switch to ON (top-right corner)
   - The switch should turn green/blue
   - Save the workflow

### Step 2: Verify Code Configuration
Your code is already configured correctly with production URLs:
- ✅ `src/app/api/contact/route.ts` - Using production URL
- ✅ `src/app/api/subscribe/route.ts` - Using production URL
- ✅ `src/app/api/submit-webhook/route.ts` - Using production URL

### Step 3: Environment Variables (Optional)
Add these to your `.env.local` file for flexibility:

```env
# n8n Webhook URLs (Production)
CONTACT_WEBHOOK_URL=https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf
NEWSLETTER_WEBHOOK_URL=https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287
JOB_APPLICATION_WEBHOOK_URL=https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e
```

### Step 4: Test Production Webhooks

#### Test Contact Form:
```bash
curl -X POST http://localhost:4444/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Test",
    "email": "test@example.com",
    "message": "Testing production webhook"
  }'
```

#### Test Newsletter:
```bash
curl -X POST http://localhost:4444/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newsletter@example.com"
  }'
```

#### Test Job Application:
```bash
curl -X POST http://localhost:4444/api/submit-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "jobTitle": "Test Position",
    "fullName": "Test User",
    "email": "applicant@example.com"
  }'
```

## Verification Checklist

- [ ] All three workflows are **ACTIVE** in n8n dashboard
- [ ] Production URLs are configured in code (already done ✅)
- [ ] Test each webhook endpoint
- [ ] Check n8n execution history for successful runs
- [ ] Deploy to production server

## Troubleshooting

### Issue: Webhook returns 404
**Solution**: Workflow is not active. Go to n8n and activate it.

### Issue: Webhook works in test but not production
**Solution**:
1. Check workflow is active
2. Verify URL doesn't have `webhook-test` in it
3. Check n8n logs for errors

### Issue: No data received in n8n
**Solution**:
1. Check request headers and body format
2. Verify n8n webhook node settings
3. Check for CORS issues

## Important Notes

1. **Always keep workflows ACTIVE** in production
2. **Monitor n8n dashboard** for failed executions
3. **Set up error notifications** in n8n workflows
4. **Test thoroughly** before deploying to production

## Current Status
✅ Your code is already configured with production webhook URLs
⚠️ You need to activate the workflows in n8n dashboard to complete migration

## Next Steps
1. Log into n8n dashboard
2. Activate all three workflows
3. Test each endpoint
4. Deploy to production
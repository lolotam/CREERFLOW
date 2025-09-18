# 🚀 CareerFlow Production Webhook Deployment Guide

## 🔍 **Current Issue Analysis**
Production server `careerflowkw.com` is experiencing webhook failures on all 3 forms:
- **Contact Form**: 500 error (webhook failing)
- **Newsletter Subscription**: 500 error (webhook failing) 
- **Job Application**: 502 error with "Webhook returned 404: Not Found"

**Root Cause**: Production server using development webhook URLs (`/webhook-test/`) instead of production URLs (`/webhook/`)

---

## 📋 **Required Environment Variables**

The following environment variables MUST be set on the production server:

```bash
# Critical Webhook URLs (Production)
JOB_APPLICATION_WEBHOOK_URL=https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e
CONTACT_WEBHOOK_URL=https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf
NEWSLETTER_WEBHOOK_URL=https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287

# Additional Production Settings
WEBHOOK_ENABLED=true
WEBHOOK_TIMEOUT=10000
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://careerflowkw.com
```

---

## 🏗️ **Deployment Options**

### **Option 1: Direct Server Access (SSH)**
```bash
# 1. SSH into production server
ssh user@your-server-ip

# 2. Navigate to project directory
cd /path/to/careerflow

# 3. Update environment file
nano .env.production

# 4. Add the required environment variables (see above)

# 5. Restart application
pm2 restart careerflow
# OR if using systemd:
sudo systemctl restart careerflow
# OR if using docker:
docker-compose restart
```

### **Option 2: Platform-Specific Deployments**

#### **Vercel**
```bash
# Set environment variables via Vercel CLI
vercel env add JOB_APPLICATION_WEBHOOK_URL production
# Enter: https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e

vercel env add CONTACT_WEBHOOK_URL production  
# Enter: https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf

vercel env add NEWSLETTER_WEBHOOK_URL production
# Enter: https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287

# Redeploy
vercel --prod
```

#### **Netlify**
```bash
# Set environment variables via Netlify CLI
netlify env:set JOB_APPLICATION_WEBHOOK_URL https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e
netlify env:set CONTACT_WEBHOOK_URL https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf
netlify env:set NEWSLETTER_WEBHOOK_URL https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287

# Trigger rebuild
netlify deploy --prod
```

#### **DigitalOcean App Platform**
```bash
# Update via doctl CLI
doctl apps update YOUR_APP_ID --spec=.do/app.yaml

# Or via web interface:
# 1. Go to DigitalOcean Control Panel
# 2. Navigate to Apps > Your App > Settings
# 3. Add environment variables in App-Level Environment Variables
```

### **Option 3: Docker Deployment**
```bash
# 1. Update docker-compose.yml or Dockerfile ENV vars
# 2. Rebuild and restart container
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# OR using docker run:
docker run -d \
  -e JOB_APPLICATION_WEBHOOK_URL=https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e \
  -e CONTACT_WEBHOOK_URL=https://n8n-waleed.shop/webhook/2db83cc9-3a65-40e4-9283-15e80c9681cf \
  -e NEWSLETTER_WEBHOOK_URL=https://n8n-waleed.shop/webhook/31160d81-3436-4e9f-a73d-3786dfe4d287 \
  your-app-image
```

---

## 🧪 **Testing & Verification**

### **Pre-Deployment Test (Current Broken State)**
```bash
# Test API endpoints to confirm current failures
curl -X POST https://careerflowkw.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test"}'

# Expected: 500 error with webhook failure
```

### **Post-Deployment Verification**
```bash
# 1. Test Contact Form
curl -X POST https://careerflowkw.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "phone": "+96555555555",
    "subject": "Webhook Test",
    "message": "Testing webhook functionality"
  }'

# 2. Test Newsletter Subscription  
curl -X POST https://careerflowkw.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "newsletter.test@example.com"}'

# 3. Test Job Application
curl -X POST https://careerflowkw.com/api/submit-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "application.test@example.com",
    "phone": "+96555555555",
    "currentPosition": "Software Developer"
  }'

# Expected: All should return 200 status with "webhookSent": true
```

---

## 🔄 **Rollback Plan**

If deployment fails:

1. **Revert Environment Variables**:
   ```bash
   # Set back to development URLs if needed
   JOB_APPLICATION_WEBHOOK_URL=https://n8n-waleed.shop/webhook-test/f369bb52-4c9d-46f4-87f5-842015b4231e
   ```

2. **Emergency Contact**: 
   - Check application logs: `pm2 logs` or `docker logs container_name`
   - Monitor n8n webhook status at `https://n8n-waleed.shop`

---

## 📊 **Success Criteria**

✅ **All API endpoints return 200 status**  
✅ **Response includes `"webhookSent": true`**  
✅ **No 404 webhook errors in logs**  
✅ **Forms work correctly on production website**  
✅ **n8n workflows receive data successfully**

---

## 🆘 **Troubleshooting**

### **Common Issues**:
1. **Environment variables not loaded**: Restart application
2. **Webhook still returns 404**: Verify n8n workflow is active
3. **CORS errors**: Check `NEXT_PUBLIC_APP_URL` is set correctly
4. **SSL certificate issues**: Ensure webhook URLs use `https://`

### **Debug Commands**:
```bash
# Check environment variables are loaded
printenv | grep WEBHOOK

# Check application logs
tail -f /var/log/careerflow.log

# Test webhook endpoint directly
curl -X POST https://n8n-waleed.shop/webhook/f369bb52-4c9d-46f4-87f5-842015b4231e \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```
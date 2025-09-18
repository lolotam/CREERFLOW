# CareerFlow Auto-Deployment Guide

## Overview

This guide provides complete instructions for setting up automated deployment for the CareerFlow application using GitHub webhooks, PM2 process management, and nginx reverse proxy.

## Architecture

```
GitHub Repository
       ↓ (push to main)
GitHub Actions Workflow
       ↓ (webhook trigger)
Nginx Reverse Proxy
       ↓
Webhook Receiver (Node.js)
       ↓
Deployment Script (Bash)
       ↓
PM2 Process Manager
       ↓
CareerFlow Application
```

## Prerequisites

- Ubuntu 20.04+ server with root access
- Domain name pointed to your server
- GitHub repository with CareerFlow code
- Basic knowledge of Linux command line

## Quick Setup

### 1. Server Preparation

```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Clone the setup files (or create them manually)
mkdir -p /var/www/careerflow
cd /var/www/careerflow
```

### 2. Run Auto-Setup Script

If you have the setup script on your server:

```bash
# Make setup script executable and run it
chmod +x /var/www/careerflow/setup-auto-deployment.sh
./setup-auto-deployment.sh
```

The script will:
- Install Node.js, PM2, nginx, and other dependencies
- Configure firewall settings
- Set up nginx reverse proxy
- Configure SSL certificates with Let's Encrypt
- Generate webhook secrets
- Create all necessary configuration files

### 3. GitHub Repository Configuration

After running the setup script, configure your GitHub repository:

#### Add GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions:

1. **WEBHOOK_URL**: `https://your-domain.com/webhook`
2. **WEBHOOK_SECRET**: (provided by setup script)

#### Add GitHub Webhook

Go to your repository → Settings → Webhooks:

1. **Payload URL**: `https://your-domain.com/webhook`
2. **Content type**: `application/json`
3. **Secret**: (same as WEBHOOK_SECRET)
4. **Events**: Just the push event
5. **Active**: ✅ Checked

### 4. Update Repository URLs

Update the deployment script with your actual repository URL:

```bash
# Edit the deployment script
nano /var/www/careerflow/deploy.sh

# Change this line:
REPO_URL="https://github.com/YOUR_USERNAME/careerflow.git"
# To your actual repository URL
```

## Manual Setup (Step by Step)

If you prefer to set up everything manually:

### 1. Install Dependencies

```bash
# Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
nvm use node

# Install PM2
npm install -g pm2

# Install nginx and other tools
apt install -y nginx git curl ufw certbot python3-certbot-nginx
```

### 2. Create Deployment Directory Structure

```bash
mkdir -p /var/www/careerflow/{deployment-logs,backups}
```

### 3. Copy Configuration Files

Copy these files to your server (they should be in your repository):

- `/var/www/careerflow/webhook-receiver.js`
- `/var/www/careerflow/deploy.sh`
- `/var/www/careerflow/ecosystem.webhook.config.js`
- `/etc/nginx/sites-available/careerflow-webhook`

### 4. Configure nginx

```bash
# Enable the site
ln -sf /etc/nginx/sites-available/careerflow-webhook /etc/nginx/sites-enabled/

# Update domain in config
sed -i 's/webhook.careerflow.com/your-domain.com/g' /etc/nginx/sites-available/careerflow-webhook

# Test and restart nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 5. Setup SSL Certificate

```bash
# Get SSL certificate
certbot --nginx -d your-domain.com --non-interactive --agree-tos --email your-email@example.com
```

### 6. Configure Firewall

```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

### 7. Start Services

```bash
# Start webhook receiver
cd /var/www/careerflow
pm2 start ecosystem.webhook.config.js

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root
pm2 save
```

## File Structure

```
/var/www/careerflow/
├── webhook-receiver.js          # Node.js webhook receiver
├── deploy.sh                    # Deployment script
├── ecosystem.webhook.config.js  # PM2 configuration for webhook
├── .env                        # Environment variables
├── app/                        # Deployed application (created on first deployment)
├── backups/                    # Application backups
├── deployment-logs/            # Deployment and webhook logs
└── setup-auto-deployment.sh   # One-time setup script
```

## Configuration Files

### Environment Variables (.env)

```bash
WEBHOOK_SECRET=your-webhook-secret
WEBHOOK_PORT=3002
WEBHOOK_DOMAIN=your-domain.com
REPO_URL=https://github.com/username/careerflow.git
NODE_ENV=production
PORT=4444
```

### PM2 Ecosystem Configuration

The webhook receiver runs as a PM2 process with:
- Automatic restarts on failure
- Log rotation
- Memory monitoring
- Graceful shutdown handling

### Nginx Configuration

- Reverse proxy from your domain to localhost:3002
- Rate limiting (1 request per second)
- Security headers
- SSL termination
- Access and error logging

## Deployment Process

### Automatic Deployment Flow

1. **Developer pushes to main branch**
2. **GitHub Actions workflow triggers**
   - Runs tests and builds
   - If successful, sends webhook to your server
3. **Webhook receiver validates and triggers deployment**
4. **Deployment script executes**:
   - Creates backup of current deployment
   - Clones latest code from repository
   - Installs dependencies
   - Builds application
   - Sets up database
   - Starts application with PM2
   - Performs health checks
   - Cleans up temporary files

### Manual Deployment

You can also trigger deployments manually:

```bash
# Test webhook endpoint
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$(echo -n '{}' | openssl dgst -sha256 -hmac 'your-webhook-secret' | cut -d' ' -f2)" \
  -H "X-GitHub-Event: push" \
  -d '{"ref":"refs/heads/main","repository":{"full_name":"username/careerflow"}}' \
  https://your-domain.com/webhook

# Or run deployment script directly
cd /var/www/careerflow
bash deploy.sh
```

## Monitoring and Troubleshooting

### Check Service Status

```bash
# Check PM2 processes
pm2 status

# Check webhook logs
pm2 logs careerflow-webhook

# Check deployment logs
tail -f /var/www/careerflow/deployment-logs/webhook.log

# Check nginx logs
tail -f /var/log/nginx/webhook.access.log
tail -f /var/log/nginx/webhook.error.log
```

### Health Checks

```bash
# Test webhook health
curl https://your-domain.com/health

# Test application health
curl http://localhost:4444

# Check application with PM2
pm2 show careerflow
```

### Common Issues

#### 1. Webhook Returns 401 (Invalid Signature)

- Verify webhook secret matches in GitHub and server configuration
- Check that the secret is properly encoded

#### 2. Deployment Fails

```bash
# Check deployment logs
cat /var/www/careerflow/deployment-logs/deploy-*.log

# Common causes:
# - Git authentication issues
# - Node.js/npm version incompatibility
# - Database connection problems
# - Port conflicts
```

#### 3. Application Won't Start

```bash
# Check PM2 logs
pm2 logs careerflow

# Check port availability
netstat -tulpn | grep :4444

# Restart application
pm2 restart careerflow
```

#### 4. SSL Certificate Issues

```bash
# Renew certificate
certbot renew

# Check certificate status
certbot certificates
```

### Backup and Recovery

#### Automatic Backups

The deployment script automatically creates backups before each deployment:

```bash
# View available backups
ls -la /var/www/careerflow/backups/

# Restore from backup (if deployment fails)
# This is done automatically by the deployment script
```

#### Manual Backup

```bash
# Create manual backup
cp -r /var/www/careerflow/app /var/www/careerflow/backups/manual-$(date +%Y%m%d-%H%M%S)
```

## Security Considerations

### Webhook Security

- Webhook signatures are validated using HMAC-SHA256
- Rate limiting prevents abuse (1 request/second)
- Only accepts POST requests to /webhook endpoint
- SSL/TLS encryption for all communications

### Server Security

- Firewall configured to allow only necessary ports
- Regular security updates recommended
- SSH key-based authentication recommended
- Consider fail2ban for additional protection

### Application Security

- Environment variables stored securely
- Database files protected with appropriate permissions
- Regular dependency updates via npm audit

## Maintenance

### Regular Tasks

```bash
# Update system packages
apt update && apt upgrade -y

# Update Node.js dependencies
cd /var/www/careerflow/app
npm audit fix

# Rotate logs
pm2 flush

# Check disk space
df -h

# Clean old backups (keep last 10)
cd /var/www/careerflow/backups
ls -t backup-* | tail -n +11 | xargs rm -rf
```

### SSL Certificate Renewal

Certificates automatically renew via cron job, but you can manually renew:

```bash
certbot renew
systemctl reload nginx
```

## Performance Optimization

### PM2 Cluster Mode

For high-traffic applications, consider running in cluster mode:

```javascript
// In ecosystem.config.js
module.exports = {
  apps: [{
    name: 'careerflow',
    script: 'npm',
    args: 'start',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster'
  }]
};
```

### Nginx Optimizations

Add to nginx configuration for better performance:

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Enable caching for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Updating the Deployment System

To update the deployment scripts or webhook receiver:

1. Update the files in your repository
2. Copy updated files to the server
3. Restart the webhook receiver:

```bash
pm2 restart careerflow-webhook
```

## Support and Troubleshooting

For additional support:

1. Check the deployment logs in `/var/www/careerflow/deployment-logs/`
2. Review PM2 logs: `pm2 logs`
3. Check nginx error logs: `/var/log/nginx/webhook.error.log`
4. Verify GitHub webhook delivery in repository settings

## Conclusion

This auto-deployment setup provides a robust, secure, and automated way to deploy your CareerFlow application. The system includes error handling, rollback capabilities, health checks, and comprehensive logging to ensure reliable deployments.

Remember to:
- Test the deployment pipeline thoroughly before using in production
- Monitor logs regularly
- Keep the system updated
- Have a backup plan for critical deployments
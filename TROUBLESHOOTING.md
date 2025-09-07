# CareerFlow Troubleshooting Guide

Comprehensive troubleshooting guide for common issues and their solutions.

## 🚨 Critical Issues Fixed (September 2025)

### ✅ Email Subscriber Data Retrieval Issue
**Problem**: `lolotam@gmail.com` showed "already subscribed" but didn't appear in admin dashboard.

**Root Cause**: Dual storage system - public API saved to JSON file + database, admin API only read from database.

**Solution Applied**:
```bash
# Run migration script
node scripts/migrate-json-to-database.js
```

**Verification**:
- Admin dashboard now shows all 20 subscribers
- `lolotam@gmail.com` is visible in admin table
- API returns complete subscriber list

### ✅ Contact Messages Data Retrieval Issue
**Problem**: Similar dual storage issue with contact messages.

**Root Cause**: Same pattern - JSON file had 19 messages, database had only 2.

**Solution Applied**:
```bash
# Run contact messages migration
node scripts/migrate-contact-messages-json-to-db.js
```

**Verification**:
- Admin dashboard shows all 17 contact messages
- Historical messages from August 2025 accessible
- All `lolotam@gmail.com` messages visible

## 🔧 Common Issues & Solutions

### Database Issues

#### 1. Database Connection Error
```
Error: SQLITE_CANTOPEN: unable to open database file
```

**Solutions**:
```bash
# Check database directory exists
mkdir -p data

# Check file permissions
chmod 755 data/
chmod 644 data/careerflow.db

# Recreate database if corrupted
rm data/careerflow.db
npm run db:setup
npm run db:seed
```

#### 2. Database Lock Error
```
Error: SQLITE_BUSY: database is locked
```

**Solutions**:
```bash
# Kill any processes using the database
lsof data/careerflow.db

# Restart the application
npm run dev
```

#### 3. Missing Sample Data
```bash
# Check current data status
npm run db:check

# Add sample jobs
npm run db:seed

# Migrate JSON data if needed
npm run db:migrate
```

### Admin Dashboard Issues

#### 1. Admin Login Failed
**Symptoms**: Invalid credentials error

**Solutions**:
```bash
# Check environment variables
cat .env.local | grep ADMIN

# Verify credentials
echo "Username: $ADMIN_USERNAME"
echo "Password: $ADMIN_PASSWORD"

# Reset admin password in .env.local
ADMIN_PASSWORD=new_secure_password
```

#### 2. Admin Dashboard Shows "0 of 0" Items
**Symptoms**: Empty tables in admin dashboard

**Solutions**:
```bash
# Check for dual storage issues
npm run db:check

# Migrate data from JSON to database
npm run db:migrate

# Verify migration success
curl http://localhost:4444/api/admin/subscribers
curl http://localhost:4444/api/admin/contact-messages
```

#### 3. Admin API Returns Empty Results
**Symptoms**: API returns `{"success": true, "data": [], "total": 0}`

**Solutions**:
```bash
# Check database directly
sqlite3 data/careerflow.db "SELECT COUNT(*) FROM email_subscribers;"
sqlite3 data/careerflow.db "SELECT COUNT(*) FROM contact_messages;"

# Run migration if counts don't match
npm run db:migrate
```

### Application Issues

#### 1. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4444
```

**Solutions**:
```bash
# Find and kill process on port 4444
lsof -ti:4444 | xargs kill -9

# Or use different port
npm run dev -- -p 4445
```

#### 2. Module Not Found Errors
```
Error: Cannot find module 'xyz'
```

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 3. Build Errors
```
Error: Build failed
```

**Solutions**:
```bash
# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix

# Clear cache and rebuild
npm run clean
npm run build
```

### API Issues

#### 1. API Route Not Found (404)
**Symptoms**: API endpoints return 404

**Solutions**:
```bash
# Check API route files exist
ls src/app/api/

# Verify route structure
ls src/app/api/admin/
ls src/app/api/jobs/

# Restart development server
npm run dev
```

#### 2. API Returns 500 Internal Server Error
**Symptoms**: Server errors in API responses

**Solutions**:
```bash
# Check server logs
npm run dev

# Check database connection
node scripts/check-email-subscribers-db.js

# Verify environment variables
cat .env.local
```

#### 3. CORS Issues
**Symptoms**: Cross-origin request blocked

**Solutions**:
```javascript
// Add to next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ];
  },
};
```

### Testing Issues

#### 1. Playwright Tests Failing
**Symptoms**: Tests timeout or fail

**Solutions**:
```bash
# Install Playwright browsers
npx playwright install

# Run tests in headed mode for debugging
npm run test:headed

# Check if application is running
curl http://localhost:4444
```

#### 2. Test Database Issues
**Symptoms**: Tests interfere with development data

**Solutions**:
```bash
# Use separate test database
TEST_DATABASE_PATH=./data/test-careerflow.db

# Reset test database before tests
rm data/test-careerflow.db
npm run db:setup
```

### Performance Issues

#### 1. Slow Page Load
**Symptoms**: Pages take long to load

**Solutions**:
```bash
# Enable production mode
NODE_ENV=production npm run build
npm start

# Check bundle size
npm run build -- --analyze

# Optimize images
# Use next/image component
```

#### 2. Memory Leaks
**Symptoms**: Application memory usage increases over time

**Solutions**:
```bash
# Monitor memory usage
node --inspect npm run dev

# Check for memory leaks in browser dev tools
# Restart application periodically
```

## 🔍 Debugging Tools

### Database Debugging
```bash
# SQLite command line
sqlite3 data/careerflow.db

# Check table schemas
.schema jobs
.schema email_subscribers
.schema contact_messages

# Query data
SELECT COUNT(*) FROM jobs;
SELECT * FROM email_subscribers LIMIT 5;
SELECT * FROM contact_messages WHERE status = 'new';
```

### API Debugging
```bash
# Test API endpoints
curl http://localhost:4444/api/jobs
curl http://localhost:4444/api/admin/subscribers
curl -X POST http://localhost:4444/api/subscribe -d '{"email":"test@example.com"}' -H "Content-Type: application/json"
```

### Log Analysis
```bash
# Check application logs
tail -f logs/application.log

# Check error logs
tail -f logs/error.log

# Enable debug logging
DEBUG=true npm run dev
```

## 🚨 Emergency Procedures

### Complete Reset
```bash
# Backup current data
cp data/careerflow.db data/backup-$(date +%Y%m%d).db

# Reset everything
rm -rf .next node_modules data/careerflow.db
npm install
npm run db:setup
npm run db:seed
npm run dev
```

### Data Recovery
```bash
# Restore from backup
cp data/backup-YYYYMMDD.db data/careerflow.db

# Migrate JSON data if needed
npm run db:migrate

# Verify data integrity
npm run db:check
```

### Production Emergency
```bash
# Quick rollback
git checkout previous-stable-commit
npm run build
npm start

# Check production logs
pm2 logs careerflow

# Restart production server
pm2 restart careerflow
```

## 📞 Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Check application logs
4. Try the emergency reset procedure

### How to Report Issues
1. **Environment**: OS, Node.js version, npm version
2. **Steps to reproduce**: Exact steps that cause the issue
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Logs**: Relevant error messages and logs
6. **Screenshots**: If UI-related

### Contact Information
- **GitHub Issues**: [Create an issue](https://github.com/lolotam/CREERFLOW/issues)
- **Email**: dr.vet.waleedtam@gmail.com
- **WhatsApp**: +96555683677

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Setup instructions
- [API Documentation](README.md#api-documentation)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLite Documentation](https://sqlite.org/docs.html)
- [Playwright Documentation](https://playwright.dev/docs)

---

**CareerFlow Troubleshooting Guide** - Last updated: September 2025

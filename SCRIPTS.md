# 📜 CareerFlow Scripts Documentation

This document provides detailed information about all available npm scripts and their usage in the CareerFlow project.

## 🚀 Development Scripts

### `npm run dev`
**Purpose**: Start the development server with Turbopack for fast builds
**Command**: `next dev --turbopack`
**Usage**:
```bash
npm run dev
```
**Features**:
- Hot reload for instant code changes
- Turbopack for faster builds
- Development optimizations
- Source maps for debugging
- Automatic TypeScript compilation

**Access Points**:
- Frontend: http://localhost:4444
- Admin Panel: http://localhost:4444/en/admin
- Arabic Version: http://localhost:4444/ar

---

## 🏗️ Build Scripts

### `npm run build`
**Purpose**: Build the application for production
**Command**: `next build`
**Usage**:
```bash
npm run build
```
**Output**:
- Optimized JavaScript bundles
- Static HTML pages
- Compressed assets
- Build analytics
- Performance metrics

**Build Features**:
- Code splitting
- Tree shaking
- Image optimization
- Static generation
- Bundle analysis

### `npm start`
**Purpose**: Start the production server
**Command**: `next start`
**Usage**:
```bash
npm run build
npm start
```
**Requirements**:
- Must run `npm run build` first
- Production environment variables
- Database initialization

---

## 🧪 Testing Scripts

### `npm test`
**Purpose**: Run all Playwright tests
**Command**: `playwright test`
**Usage**:
```bash
npm test
```
**Test Coverage**:
- End-to-end user flows
- Admin panel functionality
- API endpoint testing
- Cross-browser compatibility
- Mobile responsiveness

### `npm run test:ui`
**Purpose**: Run tests with interactive UI
**Command**: `playwright test --ui`
**Usage**:
```bash
npm run test:ui
```
**Features**:
- Visual test runner
- Step-by-step debugging
- Test result visualization
- Interactive test selection
- Real-time test execution

### `npm run test:debug`
**Purpose**: Run tests in debug mode
**Command**: `playwright test --debug`
**Usage**:
```bash
npm run test:debug
```
**Debug Features**:
- Breakpoint support
- Step-through execution
- Browser DevTools integration
- Variable inspection
- Call stack analysis

### `npm run test:headed`
**Purpose**: Run tests in headed mode (visible browser)
**Command**: `playwright test --headed`
**Usage**:
```bash
npm run test:headed
```
**Benefits**:
- Visual test execution
- Browser interaction observation
- UI behavior verification
- Manual intervention capability
- Screenshot capture

---

## 🔧 Code Quality Scripts

### `npm run lint`
**Purpose**: Run ESLint for code quality checks
**Command**: `next lint`
**Usage**:
```bash
npm run lint
```
**Checks**:
- TypeScript errors
- Code style violations
- Best practice adherence
- Security vulnerabilities
- Performance issues

**Auto-fix**:
```bash
npm run lint -- --fix
```

---

## 🗄️ Database Scripts

### Database Setup
```bash
# Initialize database schema
node scripts/setup-database.ts

# Verify database structure
node scripts/check-db.js

# Seed with sample data
node scripts/seed-jobs.ts
```

### Database Management
```bash
# Backup database
cp data/careerflow.db data/backups/careerflow-$(date +%Y%m%d).db

# Restore database
cp data/backups/careerflow-YYYYMMDD.db data/careerflow.db

# Reset database
rm data/careerflow.db
node scripts/setup-database.ts
```

---

## 🚀 Deployment Scripts

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

### Docker Deployment
```bash
# Build Docker image
docker build -t careerflow .

# Run Docker container
docker run -p 4444:4444 careerflow

# Docker Compose
docker-compose up -d
```

### Traditional Hosting
```bash
# Build for production
npm run build

# Start with PM2
pm2 start npm --name "careerflow" -- start

# Monitor with PM2
pm2 monit
```

---

## 🔍 Analysis Scripts

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Webpack bundle analyzer
ANALYZE=true npm run build
```

### Performance Analysis
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Performance testing
npm run test -- --grep "performance"
```

---

## 🛠️ Utility Scripts

### Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Data Management
```bash
# Export jobs data
node -e "
const db = require('./lib/database.ts');
const jobs = db.getAllJobs();
require('fs').writeFileSync('jobs-export.json', JSON.stringify(jobs, null, 2));
"

# Import jobs data
node -e "
const db = require('./lib/database.ts');
const jobs = JSON.parse(require('fs').readFileSync('jobs-import.json'));
jobs.forEach(job => db.createJob(job));
"
```

### Maintenance Scripts
```bash
# Clean build artifacts
rm -rf .next
rm -rf node_modules/.cache

# Update dependencies
npm update
npm audit fix

# Security audit
npm audit
npm audit fix --force
```

---

## 🔧 Custom Scripts

### Development Helpers
```bash
# Start with specific port
PORT=3001 npm run dev

# Start with debug mode
DEBUG=* npm run dev

# Start with specific locale
LOCALE=ar npm run dev
```

### Testing Helpers
```bash
# Run specific test file
npm test -- tests/application-form.spec.ts

# Run tests with specific browser
npm test -- --project=chromium

# Run tests with video recording
npm test -- --video=on
```

### Build Variants
```bash
# Build with bundle analysis
ANALYZE=true npm run build

# Build with source maps
GENERATE_SOURCEMAP=true npm run build

# Build for specific environment
NODE_ENV=staging npm run build
```

---

## 📊 Monitoring Scripts

### Health Checks
```bash
# Check application health
curl http://localhost:4444/api/health

# Check database connection
node scripts/check-db.js

# Check all services
npm run health-check
```

### Log Management
```bash
# View application logs
tail -f logs/application.log

# View error logs
tail -f logs/error.log

# Clear logs
> logs/application.log
> logs/error.log
```

---

## 🔐 Security Scripts

### Security Checks
```bash
# Security audit
npm audit

# Check for vulnerabilities
npm audit --audit-level moderate

# Update vulnerable packages
npm audit fix
```

### SSL/TLS Setup
```bash
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Start with HTTPS (development)
HTTPS=true npm run dev
```

---

## 📱 Mobile Development

### Mobile Testing
```bash
# Test on mobile devices
npm run test -- --project="Mobile Chrome"

# Test responsive design
npm run test -- --grep "responsive"

# Mobile performance testing
npm run test -- --grep "mobile performance"
```

---

## 🌐 Internationalization

### Translation Management
```bash
# Extract translation keys
npm run extract-translations

# Validate translations
npm run validate-translations

# Generate translation reports
npm run translation-report
```

---

## 📈 Performance Optimization

### Performance Scripts
```bash
# Analyze Core Web Vitals
npm run analyze-vitals

# Optimize images
npm run optimize-images

# Generate performance report
npm run performance-report
```

---

## 🔄 CI/CD Scripts

### Continuous Integration
```bash
# CI pipeline
npm ci
npm run lint
npm run build
npm test

# Pre-commit hooks
npm run pre-commit

# Pre-push hooks
npm run pre-push
```

---

## 📚 Documentation

### Documentation Generation
```bash
# Generate API documentation
npm run docs:api

# Generate component documentation
npm run docs:components

# Generate full documentation
npm run docs:build
```

---

## 🎯 Quick Reference

### Most Common Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm start              # Start production server

# Testing
npm test               # Run all tests
npm run test:ui        # Interactive test runner
npm run lint           # Code quality check

# Database
node scripts/setup-database.ts    # Initialize database
node scripts/check-db.js         # Verify database

# Deployment
vercel                 # Deploy to Vercel
npm run build && npm start       # Local production test
```

### Environment-Specific Commands
```bash
# Development
NODE_ENV=development npm run dev

# Staging
NODE_ENV=staging npm run build

# Production
NODE_ENV=production npm start
```

This comprehensive script documentation ensures that developers can efficiently work with the CareerFlow project across all development phases.

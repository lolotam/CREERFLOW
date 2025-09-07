# CareerFlow Setup Guide

Complete setup instructions for development and production environments.

## 🚀 Quick Start (Development)

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/lolotam/CREERFLOW.git
cd careerflow
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local  # or use your preferred editor
```

**Required Environment Variables:**
```env
DATABASE_PATH=./data/careerflow.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_APP_URL=http://localhost:4444
PORT=4444
```

### 4. Database Setup
```bash
# Create database directory
mkdir -p data

# Initialize database (if needed)
npm run db:setup

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:4444` to see the application.

## 🗄️ Database Management

### Initial Setup
The application uses SQLite database stored in `./data/careerflow.db`.

### Sample Data
```bash
# Add sample jobs
npm run db:seed

# Check database status
npm run db:check

# Migrate JSON data to database (if needed)
npm run db:migrate
```

### Database Schema
The database includes three main tables:
- `jobs` - Job postings
- `email_subscribers` - Newsletter subscribers  
- `contact_messages` - Contact form submissions

## 👨‍💼 Admin Dashboard

### Access
- **URL**: `http://localhost:4444/admin/login`
- **Username**: `admin` (configurable in .env)
- **Password**: Set in `ADMIN_PASSWORD` environment variable

### Features
- **Job Management** - Complete CRUD operations with card interface
- **Email Subscribers** - Manage newsletter subscriptions
- **Contact Messages** - Handle customer inquiries
- **Analytics** - Dashboard statistics and insights

## 🧪 Testing

### Setup Playwright
```bash
# Install Playwright browsers
npx playwright install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Generate test report
npm run test:report
```

### Test Coverage
- ✅ Job listing and filtering
- ✅ Email subscription system
- ✅ Contact form functionality
- ✅ Admin dashboard operations
- ✅ Data retrieval and migration

## 🚀 Production Deployment

### Environment Configuration
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
SESSION_SECURE=true
DEBUG=false
```

### Build Application
```bash
# Create production build
npm run build

# Start production server
npm start
```

### Database Considerations
- Ensure database file is writable
- Set up regular backups
- Consider database migration strategy

### Security Checklist
- [ ] Strong admin password set
- [ ] JWT secrets are random and secure
- [ ] HTTPS enabled (SESSION_SECURE=true)
- [ ] Debug mode disabled
- [ ] Rate limiting configured
- [ ] File upload restrictions set

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check database file exists
ls -la data/careerflow.db

# Recreate database
rm data/careerflow.db
npm run db:setup
npm run db:seed
```

#### Missing Sample Data
```bash
# Check current data
npm run db:check

# Add sample data
npm run db:seed

# Migrate JSON data
npm run db:migrate
```

#### Admin Login Issues
```bash
# Verify environment variables
cat .env.local | grep ADMIN

# Check admin credentials in database
sqlite3 data/careerflow.db "SELECT * FROM admin_users;"
```

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:4444 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Data Migration Issues

If you encounter data retrieval issues in admin dashboard:

```bash
# Check for dual storage issues
npm run db:check

# Migrate JSON data to database
npm run db:migrate

# Verify migration success
npm run db:check
```

### Performance Issues
```bash
# Clear Next.js cache
npm run clean

# Reinstall dependencies
npm run clean:install

# Check for memory leaks
node --inspect npm run dev
```

## 📁 Project Structure

```
careerflow/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/       # Internationalization
│   │   ├── api/            # API routes
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── admin/          # Admin dashboard
│   │   ├── ui/             # Reusable components
│   │   └── layout/         # Layout components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities and database
│   └── styles/             # Additional styles
├── data/                   # Database and JSON files
├── scripts/                # Database and utility scripts
├── tests/                  # Playwright tests
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev
npm test

# Commit changes
git add .
git commit -m "Add new feature"
```

### 2. Testing
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Format code
npm run format
```

### 3. Deployment
```bash
# Build for production
npm run build

# Test production build
npm start

# Deploy to platform
# (Platform-specific commands)
```

## 🌍 Internationalization

### Supported Languages
- English (en) - LTR
- Arabic (ar) - RTL

### Adding New Language
1. Add locale to `NEXT_PUBLIC_SUPPORTED_LOCALES`
2. Create translation files in `src/app/[locale]`
3. Update language selector component

## 📊 Monitoring & Analytics

### Error Tracking
Configure Sentry for error tracking:
```env
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
```

### Performance Monitoring
Enable performance monitoring:
```env
PERFORMANCE_MONITORING=true
```

### Analytics
Configure Google Analytics:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔐 Security Best Practices

### Environment Variables
- Use strong, unique passwords
- Generate secure JWT secrets
- Never commit .env.local to version control

### Database Security
- Regular backups
- Access control
- SQL injection prevention

### Application Security
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## 📞 Support

### Getting Help
- **Documentation**: Check README.md and this setup guide
- **Issues**: Create GitHub issue for bugs
- **Email**: dr.vet.waleedtam@gmail.com

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

---

**CareerFlow Setup Guide** - Last updated: September 2025

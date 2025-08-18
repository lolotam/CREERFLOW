# 🚀 CareerFlow - Advanced Job Recruitment Platform

<div align="center">

![CareerFlow Logo](public/logo2.png)

**Your Future Dashboard - Connecting Talent with Opportunity**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

</div>

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🗄️ Database Setup](#️-database-setup)
- [🌐 Internationalization](#-internationalization)
- [👨‍💼 Admin Panel](#-admin-panel)
- [🧪 Testing](#-testing)
- [📱 API Documentation](#-api-documentation)
- [🎨 UI Components](#-ui-components)
- [🔧 Development](#-development)
- [🚀 Deployment](#-deployment)
- [📄 License](#-license)

## 🌟 Features

### 🎯 Core Functionality
- **Advanced Job Search & Filtering** - Multi-criteria search with real-time filtering
- **Smart Job Matching** - AI-powered job recommendations based on user profiles
- **Featured Jobs Management** - Unlimited featured jobs with priority display
- **Application Tracking System** - Complete applicant lifecycle management
- **Real-time Dashboard** - Live statistics and analytics for admins
- **Document Management** - Resume, cover letter, and portfolio handling

### 🌍 Multi-language Support
- **Bilingual Interface** - English and Arabic (RTL) support
- **Dynamic Content Translation** - Real-time language switching
- **Localized Job Categories** - Region-specific job classifications
- **Cultural Adaptation** - UI/UX adapted for Middle Eastern markets

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Dark Theme** - Professional gradient backgrounds with glass morphism
- **Smooth Animations** - Framer Motion powered interactions
- **Accessibility** - WCAG 2.1 compliant with screen reader support
- **Progressive Web App** - Offline capabilities and app-like experience

### 🔐 Security & Performance
- **Secure Authentication** - JWT-based admin authentication with bcrypt hashing
- **SQL Injection Protection** - Parameterized queries and input validation
- **Rate Limiting** - API protection against abuse
- **Data Encryption** - Sensitive data protection at rest and in transit
- **Performance Optimization** - Code splitting, lazy loading, and caching

## 🏗️ Architecture

### 🛠️ Technology Stack

**Frontend:**
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion 12.23** - Animation library
- **Lucide React** - Modern icon library

**Backend:**
- **Next.js API Routes** - Serverless API endpoints
- **SQLite with better-sqlite3** - High-performance database
- **Iron Session** - Secure session management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token management

**Development & Testing:**
- **Playwright** - End-to-end testing framework
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Turbopack** - Fast development builds

### 📁 Project Structure

```
careerflow/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 [locale]/          # Internationalized routes
│   │   │   ├── 📁 admin/         # Admin dashboard
│   │   │   ├── 📁 jobs/          # Job listings
│   │   │   ├── 📁 apply/         # Application forms
│   │   │   └── 📁 contact/       # Contact pages
│   │   └── 📁 api/               # API endpoints
│   │       ├── 📁 jobs/          # Job management APIs
│   │       ├── 📁 applications/  # Application APIs
│   │       ├── 📁 admin/         # Admin APIs
│   │       └── 📁 contact/       # Contact APIs
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 admin/            # Admin-specific components
│   │   ├── 📁 carousels/        # Featured content carousels
│   │   ├── 📁 forms/            # Form components
│   │   └── 📁 ui/               # Base UI components
│   ├── 📁 lib/                  # Utility libraries
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 contexts/             # React contexts
│   └── 📁 i18n/                 # Internationalization
├── 📁 database/                 # Database schema and migrations
├── 📁 data/                     # Data files and backups
├── 📁 public/                   # Static assets
├── 📁 tests/                    # Test files
└── 📁 scripts/                  # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/lolotam/CREERFLOW.git
cd careerflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

```bash
# Initialize SQLite database
npm run setup-db

# Seed with sample data (optional)
npm run seed-data
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/en/admin](http://localhost:3000/en/admin)
- **Arabic Version**: [http://localhost:3000/ar](http://localhost:3000/ar)

**Default Admin Credentials:**
- Username: `admin`
- Password: `@Ww55683677wW@`

## 📦 Installation

### Development Environment

```bash
# Clone repository
git clone https://github.com/lolotam/CREERFLOW.git
cd careerflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
npm run setup-db

# Start development server
npm run dev
```

### Production Environment

```bash
# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start production server
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_PATH=./data/careerflow.db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-here

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=@Ww55683677wW@
ADMIN_EMAIL=info@careerflow.com
ADMIN_PHONE=+96555683677

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=info@careerflow.com
NEXT_PUBLIC_CONTACT_PHONE=+96555683677

# File Upload Settings
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=pdf,doc,docx

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000  # 15 minutes
```

### Next.js Configuration

The `next.config.ts` file includes:

- **Internationalization** setup with next-intl
- **Image optimization** for external domains
- **Webpack configuration** for SQLite native modules
- **Performance optimizations** for package imports

## 🗄️ Database Setup

### Schema Overview

The application uses SQLite with the following main tables:

- **`jobs`** - Job postings with full details
- **`applicants`** - User profiles and information
- **`applications`** - Job applications linking users to jobs
- **`admins`** - Administrative user accounts
- **`documents`** - File attachments (resumes, portfolios)
- **`contact_messages`** - Contact form submissions
- **`content_sections`** - Dynamic website content

### Database Initialization

```bash
# Run database setup script
node scripts/setup-database.ts

# Verify database structure
node scripts/check-db.js

# Seed with sample data
npm run seed-data
```

### Database Features

- **Foreign Key Constraints** - Data integrity enforcement
- **Indexes** - Optimized query performance
- **JSON Fields** - Flexible data storage for arrays
- **Automatic Timestamps** - Created/updated tracking
- **Soft Deletes** - Data preservation for auditing

## 🌐 Internationalization

CareerFlow supports full bilingual functionality with English and Arabic:

### Language Features

- **Dynamic Language Switching** - Real-time language toggle
- **RTL Support** - Complete right-to-left layout for Arabic
- **Localized URLs** - `/en/` and `/ar/` route prefixes
- **Cultural Adaptation** - Region-specific UI/UX patterns
- **Font Optimization** - Arabic fonts (Cairo, Tajawal, Amiri)

### Implementation

```typescript
// Language configuration in src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default
}));
```

### Translation Files

- **English**: `messages/en.json`
- **Arabic**: `messages/ar.json`

## 👨‍💼 Admin Panel

### Dashboard Features

- **Job Management** - Create, edit, delete, and feature jobs
- **Application Tracking** - Review and manage job applications
- **Featured Jobs Management** - Unlimited featured job control
- **Analytics Dashboard** - Real-time statistics and insights
- **Content Management** - Dynamic website content editing
- **Contact Management** - Handle contact form submissions

### Admin Access

```text
URL: /en/admin/dashboard
Username: admin
Password: @Ww55683677wW@
Contact: info@careerflow.com
Phone: (+96555683677) WhatsApp
```

### Admin Features

- **Secure Authentication** - JWT-based session management
- **Role-based Access** - Granular permission control
- **Data Export/Import** - CSV functionality for bulk operations
- **Real-time Updates** - Live synchronization across sections
- **Audit Logging** - Track all administrative actions

## 🧪 Testing

### Test Framework

CareerFlow uses **Playwright** for comprehensive end-to-end testing:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

### Test Coverage

- **Application Flow Testing** - Complete user journey validation
- **Admin Panel Testing** - Administrative functionality verification
- **API Endpoint Testing** - Backend functionality validation
- **Cross-browser Testing** - Chrome, Firefox, Safari compatibility
- **Mobile Responsiveness** - Touch and mobile-specific interactions

### Test Files

- `tests/application-form.spec.ts` - Application submission testing
- `tests/webhook-integration.spec.ts` - API integration testing

## 📱 API Documentation

### Core Endpoints

#### Jobs API

```typescript
// Get all jobs with filtering
GET /api/jobs?category=medical&featured=true&limit=10

// Create new job (Admin only)
POST /api/jobs
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Kuwait City",
  "salary": "2000-4000 KWD",
  "type": "full-time",
  "category": "technology"
}

// Update job (Admin only)
PUT /api/jobs
{
  "jobId": "job-123",
  "updates": { "featured": true }
}

// Delete job (Admin only)
DELETE /api/jobs?id=job-123
```

#### Applications API

```typescript
// Submit job application
POST /api/applications
{
  "jobId": "job-123",
  "applicantData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    // ... other fields
  }
}

// Get applications (Admin only)
GET /api/applications?status=pending&limit=20
```

#### Admin API

```typescript
// Admin login
POST /api/admin/login
{
  "username": "admin",
  "password": "@Ww55683677wW@"
}

// Get dashboard statistics
GET /api/admin/stats
```

### Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string | null,
  "timestamp": string
}
```

## 🎨 UI Components

### Component Library

CareerFlow includes a comprehensive set of reusable components:

#### Core Components

- **JobCard** - Individual job listing display
- **FeaturedJobsCarousel** - Rotating featured jobs showcase
- **ApplicationForm** - Multi-step application submission
- **SearchFilters** - Advanced job search and filtering
- **AdminDashboard** - Complete administrative interface

#### UI Components

- **GlassCard** - Modern glass morphism containers
- **GradientButton** - Animated gradient buttons
- **LoadingSpinner** - Consistent loading indicators
- **Modal** - Accessible modal dialogs
- **Toast** - User feedback notifications

#### Form Components

- **FormField** - Standardized form inputs
- **FileUpload** - Drag-and-drop file handling
- **CountrySelect** - International country selection
- **PhoneInput** - International phone number input
- **DatePicker** - Accessible date selection

### Styling System

- **Tailwind CSS 4.0** - Utility-first CSS framework
- **CSS Variables** - Dynamic theming support
- **Glass Morphism** - Modern translucent effects
- **Gradient Backgrounds** - Professional color schemes
- **Responsive Design** - Mobile-first approach

## 🔧 Development

### Development Workflow

```bash
# Start development server with Turbopack
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting (via ESLint)
- **Husky** - Git hooks for quality checks
- **Conventional Commits** - Standardized commit messages

### Development Tools

- **Turbopack** - Fast development builds
- **Hot Reload** - Instant code changes
- **Source Maps** - Debugging support
- **Error Boundaries** - Graceful error handling
- **Performance Monitoring** - Built-in performance tracking

### File Structure Guidelines

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   └── api/               # API endpoints
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── forms/            # Form components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
└── i18n/                 # Internationalization
```

## 🚀 Deployment

### Production Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables
vercel env add DATABASE_PATH
vercel env add JWT_SECRET
vercel env add SESSION_SECRET
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Hosting

```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "careerflow" -- start
```

### Environment Setup

#### Production Environment Variables

```env
# Production Database
DATABASE_PATH=/var/lib/careerflow/careerflow.db

# Security
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=info@careerflow.com
NEXT_PUBLIC_CONTACT_PHONE=+96555683677
```

### Performance Optimization

- **Static Generation** - Pre-built pages for better performance
- **Image Optimization** - Automatic image compression and resizing
- **Code Splitting** - Lazy loading of components
- **Bundle Analysis** - Webpack bundle analyzer integration
- **CDN Integration** - Static asset delivery optimization

## 📊 Performance & Analytics

### Performance Metrics

- **Core Web Vitals** - LCP, FID, CLS optimization
- **Lighthouse Score** - 95+ performance score
- **Bundle Size** - Optimized JavaScript bundles
- **Load Times** - Sub-second initial page loads
- **SEO Optimization** - Search engine friendly structure

### Monitoring

- **Error Tracking** - Built-in error boundary system
- **Performance Monitoring** - Real-time performance metrics
- **User Analytics** - Privacy-focused usage tracking
- **API Monitoring** - Endpoint performance tracking

## 🔒 Security

### Security Features

- **Input Validation** - Comprehensive data sanitization
- **SQL Injection Protection** - Parameterized queries
- **XSS Prevention** - Content Security Policy headers
- **CSRF Protection** - Token-based request validation
- **Rate Limiting** - API abuse prevention
- **Secure Headers** - Security-focused HTTP headers

### Data Protection

- **Password Hashing** - bcrypt with salt rounds
- **Session Security** - Secure session management
- **File Upload Security** - Type and size validation
- **Data Encryption** - Sensitive data protection
- **Privacy Compliance** - GDPR-ready data handling

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commit format
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Contact Information

- **Email**: info@careerflow.com
- **Phone**: (+96555683677) WhatsApp
- **Website**: [CareerFlow](https://your-domain.com)

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email Support**: Contact info@careerflow.com for direct support

---

<div align="center">

**Built with ❤️ by the CareerFlow Team**

*Connecting talent with opportunity across the Middle East*

</div>

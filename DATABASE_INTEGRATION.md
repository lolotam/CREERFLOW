# CareerFlow SQLite Database Integration

## Overview

This document provides comprehensive information about the SQLite database integration for the CareerFlow application. The database replaces the previous JSON file-based storage system with a robust, scalable SQLite solution.

## Database Schema

### Core Tables

#### 1. **admins** - Admin Authentication
```sql
CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **jobs** - Job Postings
```sql
CREATE TABLE jobs (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    salary VARCHAR(100),
    type VARCHAR(20) CHECK (type IN ('full-time', 'part-time', 'contract')),
    category VARCHAR(100),
    experience VARCHAR(50),
    description TEXT,
    requirements TEXT, -- JSON string array
    benefits TEXT, -- JSON string array
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    featured BOOLEAN DEFAULT 0,
    applicants_count INTEGER DEFAULT 0,
    posted VARCHAR(50) DEFAULT 'Just posted',
    match_percentage INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **applicants** - Applicant Information
```sql
CREATE TABLE applicants (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    phone_country_code VARCHAR(10),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    current_position VARCHAR(255),
    current_company VARCHAR(255),
    years_experience VARCHAR(50),
    education VARCHAR(255),
    skills TEXT, -- JSON string array
    certifications TEXT, -- JSON string array
    available_start_date DATE,
    salary_expectation VARCHAR(100),
    additional_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **applications** - Job Applications
```sql
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY,
    applicant_id VARCHAR(50) NOT NULL,
    job_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected', 'withdrawn')),
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    additional_info TEXT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewer_id INTEGER,
    submitted_data TEXT, -- JSON string of full application data
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES admins(id),
    UNIQUE(applicant_id, job_id)
);
```

#### 5. **documents** - File References
```sql
CREATE TABLE documents (
    id VARCHAR(50) PRIMARY KEY,
    applicant_id VARCHAR(50) NOT NULL,
    application_id VARCHAR(50),
    document_type VARCHAR(20) CHECK (document_type IN ('resume', 'cover_letter', 'portfolio', 'certificate', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
);
```

#### 6. **contact_messages** - Contact Form Submissions
```sql
CREATE TABLE contact_messages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded_at DATETIME,
    response_notes TEXT
);
```

#### 7. **content_sections** - Dynamic Content
```sql
CREATE TABLE content_sections (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Database Models

### TypeScript Models

The application uses TypeScript models for type-safe database operations:

- **JobModel** (`src/lib/models/Job.ts`) - Job CRUD operations
- **ApplicantModel** (`src/lib/models/Applicant.ts`) - Applicant management
- **ApplicationModel** (`src/lib/models/Application.ts`) - Application processing
- **AdminModel** (`src/lib/models/index.ts`) - Admin authentication
- **DocumentModel** (`src/lib/models/index.ts`) - Document management
- **ContactMessageModel** (`src/lib/models/index.ts`) - Contact form handling
- **ContentSectionModel** (`src/lib/models/index.ts`) - Content management

### Usage Examples

```typescript
import { jobModel, applicantModel, applicationModel } from '@/lib/models';

// Create a new job
const newJob = jobModel.create({
  title: 'Senior Nurse',
  company: 'Dubai Hospital',
  location: 'Dubai, UAE',
  country: 'United Arab Emirates',
  salary: '15,000 - 20,000 AED',
  type: 'full-time',
  category: 'nursing',
  requirements: ['BSN degree', '5+ years experience'],
  benefits: ['Health insurance', 'Housing allowance']
});

// Find jobs with filters
const jobs = jobModel.findAll(
  { status: 'active', category: 'nursing' },
  { page: 1, limit: 20, sort_by: 'created_at', sort_order: 'DESC' }
);

// Create an applicant
const applicant = applicantModel.create({
  first_name: 'Sarah',
  last_name: 'Johnson',
  email: 'sarah@example.com',
  skills: ['Patient Care', 'ICU', 'Emergency Medicine'],
  certifications: ['BLS', 'ACLS']
});
```

## Admin Credentials

### Default Admin Account
- **Username**: `admin`
- **Password**: `@Ww55683677wW@`
- **Email**: `info@careerflow.com`
- **Phone**: `+96555683677`

### Authentication
The admin authentication uses bcrypt for password hashing and iron-session for session management.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install better-sqlite3 @types/better-sqlite3
```

### 2. Initialize Database
```bash
# Run the complete setup script
npx tsx scripts/setup-database.ts

# Or run individual scripts
npx tsx scripts/migrate-data.ts      # Migrate existing JSON data
npx tsx scripts/insert-sample-data.ts # Insert sample data
```

### 3. Database Location
The SQLite database file is created at: `data/careerflow.db`

### 4. Environment Variables
No additional environment variables are required. The database uses default configurations suitable for development and production.

## API Integration

### Updated API Routes

The following API routes have been updated to use SQLite:

#### Jobs API (`/api/jobs`)
- **GET** - List jobs with filtering and pagination
- **POST** - Create new job
- **PUT** - Update existing job
- **DELETE** - Delete job

#### Applications API (Future)
- **GET** - List applications with filtering
- **POST** - Submit new application
- **PUT** - Update application status

#### Admin API (Future)
- **POST** - Admin authentication
- **GET** - Admin profile

### Backward Compatibility

The API responses maintain backward compatibility with the previous JSON-based format. Legacy interfaces are preserved while internally using the new database models.

## Performance Optimizations

### Indexes
The database includes optimized indexes for common query patterns:

```sql
-- Jobs table indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- Applications table indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
```

### Connection Management
- Uses better-sqlite3 for synchronous operations and better performance
- Implements singleton pattern for database connections
- Enables WAL mode for improved concurrent access
- Foreign key constraints are enabled for data integrity

## Data Migration

### From JSON to SQLite
The migration script (`scripts/migrate-data.ts`) handles:

1. **Jobs Migration** - Converts `data/jobs.json` to jobs table
2. **Applications Migration** - Converts `data/applications.json` to applications and applicants tables
3. **Contacts Migration** - Converts `data/contacts.json` to contact_messages table
4. **Content Migration** - Converts `data/content.json` to content_sections table

### Migration Safety
- Checks for existing records to prevent duplicates
- Preserves original IDs and timestamps where possible
- Provides detailed logging of migration progress
- Handles errors gracefully without corrupting data

## Backup and Maintenance

### Database Backup
```typescript
import { backupDatabase } from '@/lib/database';

// Create backup
backupDatabase('/path/to/backup/careerflow-backup.db');
```

### Database Statistics
```typescript
import { getDatabaseStats } from '@/lib/database';

const stats = getDatabaseStats();
console.log('Tables:', stats.tables);
console.log('Size:', stats.size);
```

## Testing

### Database Testing
- Initialize test database with sample data
- Test all CRUD operations for each model
- Verify foreign key constraints
- Test pagination and filtering
- Validate data integrity

### API Testing
- Test all API endpoints with SQLite backend
- Verify backward compatibility with existing frontend
- Test error handling and edge cases
- Performance testing with larger datasets

## Troubleshooting

### Common Issues

1. **Database Lock Errors**
   - Ensure proper connection management
   - Use transactions for multiple operations
   - Check for unclosed database connections

2. **Migration Failures**
   - Verify JSON file formats
   - Check for data validation errors
   - Review migration logs for specific errors

3. **Performance Issues**
   - Analyze query patterns
   - Add appropriate indexes
   - Consider query optimization

### Support
For technical support or questions about the database integration:
- **Email**: info@careerflow.com
- **Phone**: +96555683677 (WhatsApp available)

## Future Enhancements

### Planned Features
1. **Database Replication** - Master-slave setup for high availability
2. **Advanced Analytics** - Reporting and dashboard features
3. **Full-Text Search** - Enhanced search capabilities
4. **Audit Logging** - Track all database changes
5. **Automated Backups** - Scheduled backup system

### Scalability Considerations
- Monitor database size and performance
- Consider PostgreSQL migration for larger datasets
- Implement connection pooling for high traffic
- Add caching layer for frequently accessed data

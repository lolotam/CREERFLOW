-- CareerFlow SQLite Database Schema
-- Comprehensive database design for job recruitment platform

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- ADMINS TABLE
-- Store admin authentication and profile data
-- ============================================================================
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

-- ============================================================================
-- JOBS TABLE
-- Enhanced job postings with comprehensive fields
-- ============================================================================
CREATE TABLE jobs (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    salary VARCHAR(100),
    type VARCHAR(20) CHECK (type IN ('full-time', 'part-time', 'contract')) DEFAULT 'full-time',
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

-- ============================================================================
-- APPLICANTS TABLE
-- Store comprehensive applicant personal and professional information
-- ============================================================================
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

-- ============================================================================
-- APPLICATIONS TABLE
-- Link applicants to specific job postings with application details
-- ============================================================================
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
    UNIQUE(applicant_id, job_id) -- Prevent duplicate applications for same job
);

-- ============================================================================
-- DOCUMENTS TABLE
-- Store file references for resumes, cover letters, portfolios, etc.
-- ============================================================================
CREATE TABLE documents (
    id VARCHAR(50) PRIMARY KEY,
    applicant_id VARCHAR(50) NOT NULL,
    application_id VARCHAR(50), -- Optional: link to specific application
    document_type VARCHAR(20) CHECK (document_type IN ('resume', 'cover_letter', 'portfolio', 'certificate', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
);

-- ============================================================================
-- CONTACT_MESSAGES TABLE
-- Store contact form submissions and inquiries
-- ============================================================================
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

-- ============================================================================
-- CONTENT_SECTIONS TABLE
-- Store dynamic content for website sections (hero, about, etc.)
-- ============================================================================
CREATE TABLE content_sections (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- Optimize query performance for common operations
-- ============================================================================

-- Jobs table indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_featured ON jobs(featured);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(type);

-- Applicants table indexes
CREATE INDEX idx_applicants_email ON applicants(email);
CREATE INDEX idx_applicants_name ON applicants(last_name, first_name);
CREATE INDEX idx_applicants_created_at ON applicants(created_at);

-- Applications table indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_match_score ON applications(match_score);

-- Documents table indexes
CREATE INDEX idx_documents_applicant_id ON documents(applicant_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at);

-- Contact messages table indexes
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_submitted_at ON contact_messages(submitted_at);
CREATE INDEX idx_contact_messages_email ON contact_messages(email);

-- Content sections table indexes
CREATE INDEX idx_content_sections_type ON content_sections(type);
CREATE INDEX idx_content_sections_active ON content_sections(is_active);

-- ============================================================================
-- INITIAL ADMIN CREDENTIALS
-- Admin credentials will be inserted by the application code with proper bcrypt hash
-- ============================================================================

-- ============================================================================
-- DATABASE SCHEMA COMPLETE
-- All tables, indexes, and initial data have been defined
-- Timestamp updates will be handled in application code for better control
-- ============================================================================

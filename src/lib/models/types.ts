// Database model types for CareerFlow application

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary?: string;
  type: 'full-time' | 'part-time' | 'contract';
  category?: string;
  experience?: string;
  description?: string;
  requirements?: string; // JSON string array
  benefits?: string; // JSON string array
  status: 'active' | 'paused' | 'closed';
  featured: boolean;
  applicants_count: number;
  posted?: string;
  match_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  phone_country_code?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  current_position?: string;
  current_company?: string;
  years_experience?: string;
  education?: string;
  skills?: string; // JSON string array
  certifications?: string; // JSON string array
  available_start_date?: string;
  salary_expectation?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  job_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  match_score?: number;
  additional_info?: string;
  applied_at: string;
  reviewed_at?: string;
  reviewer_id?: number;
  submitted_data?: string; // JSON string of full application data
}

export interface Document {
  id: string;
  applicant_id: string;
  application_id?: string;
  document_type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  user_agent?: string;
  ip_address?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  submitted_at: string;
  responded_at?: string;
  response_notes?: string;
}

export interface ContentSection {
  id: string;
  title: string;
  type: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Input types for creating new records (without auto-generated fields)
export interface CreateJobInput {
  title: string;
  company: string;
  location: string;
  country: string;
  salary?: string;
  type?: 'full-time' | 'part-time' | 'contract';
  category?: string;
  experience?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  status?: 'active' | 'paused' | 'closed';
  featured?: boolean;
  posted?: string;
  match_percentage?: number;
}

export interface CreateApplicantInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  phone_country_code?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  current_position?: string;
  current_company?: string;
  years_experience?: string;
  education?: string;
  skills?: string[];
  certifications?: string[];
  available_start_date?: string;
  salary_expectation?: string;
  additional_info?: string;
}

export interface CreateApplicationInput {
  applicant_id: string;
  job_id: string;
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  match_score?: number;
  additional_info?: string;
  submitted_data?: Record<string, unknown>;
}

export interface CreateDocumentInput {
  applicant_id: string;
  application_id?: string;
  document_type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'other';
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
}

export interface CreateContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  user_agent?: string;
  ip_address?: string;
}

export interface CreateContentSectionInput {
  id: string;
  title: string;
  type: string;
  content: string;
  is_active?: boolean;
}

// Update types (all fields optional except id)
export interface UpdateJobInput extends Partial<CreateJobInput> {
  id: string;
}

export interface UpdateApplicantInput extends Partial<CreateApplicantInput> {
  id: string;
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> {
  id: string;
}

export interface UpdateContactMessageInput extends Partial<CreateContactMessageInput> {
  id: string;
  status?: 'new' | 'read' | 'replied' | 'archived';
  responded_at?: string;
  response_notes?: string;
}

export interface UpdateContentSectionInput extends Partial<CreateContentSectionInput> {
  id: string;
}

// Query filter types
export interface JobFilters {
  status?: 'active' | 'paused' | 'closed';
  category?: string;
  type?: 'full-time' | 'part-time' | 'contract';
  experience?: string;
  featured?: boolean;
  company?: string;
  location?: string;
  country?: string;
  search?: string; // For title/description search
}

export interface ApplicationFilters {
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  job_id?: string;
  applicant_id?: string;
  min_match_score?: number;
  date_from?: string;
  date_to?: string;
}

export interface ApplicantFilters {
  search?: string; // For name/email search
  years_experience?: string;
  country?: string;
  date_from?: string;
  date_to?: string;
}

// Pagination and sorting
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

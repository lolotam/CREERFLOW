import { getDatabase, Job, JobFilters, Application } from './database';

export async function getJobs(filters: JobFilters = {}) {
  const db = await getDatabase();
  
  let query = `
    SELECT * FROM jobs 
    WHERE is_active = 1
  `;
  
  const params: any[] = [];
  
  // Apply filters
  if (filters.category) {
    query += ` AND category = ?`;
    params.push(filters.category);
  }
  
  if (filters.location) {
    query += ` AND location = ?`;
    params.push(filters.location);
  }
  
  if (filters.job_type) {
    query += ` AND job_type = ?`;
    params.push(filters.job_type);
  }
  
  if (filters.experience_level) {
    query += ` AND experience_level = ?`;
    params.push(filters.experience_level);
  }
  
  if (filters.min_salary) {
    query += ` AND max_salary >= ?`;
    params.push(filters.min_salary);
  }
  
  if (filters.max_salary) {
    query += ` AND min_salary <= ?`;
    params.push(filters.max_salary);
  }
  
  if (filters.search) {
    query += ` AND (title LIKE ? OR description LIKE ? OR company_name LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  // Add sorting
  const sortBy = filters.sort_by || 'posted_date';
  const sortOrder = filters.sort_order || 'DESC';
  query += ` ORDER BY ${sortBy} ${sortOrder}`;
  
  // Add pagination
  const limit = filters.limit || 20;
  const offset = ((filters.page || 1) - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const jobs = await db.all(query, params);
  
  // Get total count for pagination
  let countQuery = `
    SELECT COUNT(*) as total FROM jobs 
    WHERE is_active = 1
  `;
  
  const countParams: any[] = [];
  
  if (filters.category) {
    countQuery += ` AND category = ?`;
    countParams.push(filters.category);
  }
  
  if (filters.location) {
    countQuery += ` AND location = ?`;
    countParams.push(filters.location);
  }
  
  if (filters.job_type) {
    countQuery += ` AND job_type = ?`;
    countParams.push(filters.job_type);
  }
  
  if (filters.experience_level) {
    countQuery += ` AND experience_level = ?`;
    countParams.push(filters.experience_level);
  }
  
  if (filters.min_salary) {
    countQuery += ` AND max_salary >= ?`;
    countParams.push(filters.min_salary);
  }
  
  if (filters.max_salary) {
    countQuery += ` AND min_salary <= ?`;
    countParams.push(filters.max_salary);
  }
  
  if (filters.search) {
    countQuery += ` AND (title LIKE ? OR description LIKE ? OR company_name LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    countParams.push(searchTerm, searchTerm, searchTerm);
  }
  
  const countResult = await db.get(countQuery, countParams);
  const total = countResult?.total || 0;
  
  return {
    jobs,
    pagination: {
      total,
      page: filters.page || 1,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getJobById(id: number): Promise<Job | null> {
  const db = await getDatabase();
  const job = await db.get('SELECT * FROM jobs WHERE id = ? AND is_active = 1', [id]);
  return job || null;
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const db = await getDatabase();
  
  const result = await db.run(`
    INSERT INTO jobs (
      title, category, location, country, city, job_type, experience_level,
      min_salary, max_salary, currency, description, requirements, benefits,
      company_name, application_deadline, is_remote
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    job.title, job.category, job.location, job.country, job.city,
    job.job_type, job.experience_level, job.min_salary, job.max_salary,
    job.currency || 'KWD', job.description, job.requirements, job.benefits,
    job.company_name, job.application_deadline, job.is_remote ? 1 : 0
  ]);
  
  return result.lastID!;
}

export async function updateJob(id: number, job: Partial<Job>): Promise<boolean> {
  const db = await getDatabase();
  
  const fields = Object.keys(job).filter(key => key !== 'id').map(key => `${key} = ?`);
  const values = Object.values(job).filter((_, index) => Object.keys(job)[index] !== 'id');
  
  if (fields.length === 0) return false;
  
  const query = `UPDATE jobs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
  const result = await db.run(query, [...values, id]);
  
  return result.changes! > 0;
}

export async function deleteJob(id: number): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.run('UPDATE jobs SET is_active = 0 WHERE id = ?', [id]);
  return result.changes! > 0;
}

export async function getJobStats() {
  const db = await getDatabase();
  
  const stats = await db.all(`
    SELECT 
      category,
      COUNT(*) as count,
      location,
      job_type,
      experience_level
    FROM jobs 
    WHERE is_active = 1 
    GROUP BY category, location, job_type, experience_level
  `);
  
  const categoryStats = await db.all(`
    SELECT category, COUNT(*) as count 
    FROM jobs 
    WHERE is_active = 1 
    GROUP BY category
  `);
  
  const locationStats = await db.all(`
    SELECT location, COUNT(*) as count 
    FROM jobs 
    WHERE is_active = 1 
    GROUP BY location
  `);
  
  const typeStats = await db.all(`
    SELECT job_type, COUNT(*) as count 
    FROM jobs 
    WHERE is_active = 1 
    GROUP BY job_type
  `);
  
  const experienceStats = await db.all(`
    SELECT experience_level, COUNT(*) as count 
    FROM jobs 
    WHERE is_active = 1 
    GROUP BY experience_level
  `);
  
  return {
    categories: categoryStats,
    locations: locationStats,
    types: typeStats,
    experience: experienceStats,
    total: categoryStats.reduce((sum, cat) => sum + cat.count, 0)
  };
}

export async function createApplication(application: Omit<Application, 'id' | 'applied_date'>): Promise<number> {
  const db = await getDatabase();
  
  const result = await db.run(`
    INSERT INTO applications (
      job_id, applicant_name, applicant_email, applicant_phone,
      cv_file_path, cover_letter, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    application.job_id, application.applicant_name, application.applicant_email,
    application.applicant_phone, application.cv_file_path, application.cover_letter,
    application.status || 'pending'
  ]);
  
  return result.lastID!;
}

export async function getApplicationsByJobId(jobId: number): Promise<Application[]> {
  const db = await getDatabase();
  return await db.all('SELECT * FROM applications WHERE job_id = ? ORDER BY applied_date DESC', [jobId]);
}

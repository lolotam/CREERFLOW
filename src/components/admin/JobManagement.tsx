'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, MapPin, DollarSign, Clock, Users, X, Save, RefreshCw, Download, Upload, FileText, Star, Search } from 'lucide-react';
import FeaturedJobsManagement from './FeaturedJobsManagement';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  experience: string;
  salary: string;
  posted: string;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
  description: string;
  requirements: string[];
  benefits: string[];
  featured: boolean;
}

interface JobFormData {
  title: string;
  company: string;
  location: string;
  country: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
  featured: boolean;
}

export default function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    country: '',
    type: 'full-time',
    category: 'nursing',
    experience: 'mid',
    salary: '',
    description: '',
    requirements: '',
    benefits: '',
    featured: false
  });

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the same data source as public jobs page for consistency
      // This ensures category filtering works correctly
      const response = await fetch('/api/jobs?status=active&limit=500');
      const result = await response.json();



      if (result.success) {
        setJobs(result.data);
        setFilteredJobs(result.data);
      } else {
        setError(result.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search term and filters
  useEffect(() => {
    let filtered = jobs;



    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(job => job.category.toLowerCase() === filterCategory.toLowerCase());
    }

    // Country filter
    if (filterCountry !== 'all') {
      filtered = filtered.filter(job => job.country === filterCountry);
    }

    // Date range filter
    if (filterDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filterDateRange) {
        case 'last7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'last90days':
          filterDate.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }

      if (filterDateRange !== 'all') {
        filtered = filtered.filter(job => {
          const jobDate = new Date(job.posted);
          return jobDate >= filterDate;
        });
      }
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterCategory, filterCountry, filterDateRange]);

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      country: '',
      type: 'full-time',
      category: 'nursing',
      experience: 'mid',
      salary: '',
      description: '',
      requirements: '',
      benefits: '',
      featured: false
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        benefits: formData.benefits.split('\n').filter(ben => ben.trim())
      };

      let response;
      if (editingJob) {
        // Update existing job
        response = await fetch('/api/jobs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: editingJob.id, updates: payload })
        });
      } else {
        // Create new job
        response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchJobs(); // Refresh the jobs list
        setShowAddForm(false);
        setEditingJob(null);
        resetForm();
        alert(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
      } else {
        alert(result.message || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      country: job.country,
      type: job.type,
      category: job.category,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
      featured: job.featured
    });
    setShowAddForm(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const response = await fetch(`/api/jobs?id=${jobId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        setJobs(jobs.filter(job => job.id !== jobId));
        alert('Job deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleViewJob = (job: Job) => {
    setViewingJob(job);
  };

  const handleStatusChange = async (jobId: string, newStatus: 'active' | 'paused' | 'closed') => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, updates: { status: newStatus } })
      });

      const result = await response.json();
      if (result.success) {
        setJobs(jobs.map(job =>
          job.id === jobId ? { ...job, status: newStatus } : job
        ));
      } else {
        alert(result.message || 'Failed to update job status');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleFeaturedToggle = async (jobId: string, currentFeatured: boolean) => {
    try {
      // No limit on featured jobs - removed artificial restriction

      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, updates: { featured: !currentFeatured } })
      });

      const result = await response.json();
      if (result.success) {
        // Update the job in the local state
        const updatedJobs = jobs.map(job =>
          job.id === jobId ? { ...job, featured: !currentFeatured } : job
        );
        setJobs(updatedJobs);

        // Also update filtered jobs for immediate UI update
        setFilteredJobs(filteredJobs.map(job =>
          job.id === jobId ? { ...job, featured: !currentFeatured } : job
        ));
      } else {
        alert('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status');
    }
  };

  // Export functions
  const handleExportJobs = async () => {
    try {
      const response = await fetch('/api/jobs/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Jobs exported successfully!');
      } else {
        alert('Failed to export jobs');
      }
    } catch (error) {
      console.error('Error exporting jobs:', error);
      alert('Failed to export jobs');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/jobs/export?action=template');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jobs-template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Template downloaded successfully!');
      } else {
        alert('Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    }
  };

  const handleImportJobs = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setImportLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/jobs/export', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await fetchJobs(); // Refresh the jobs list
        alert(`Successfully imported ${result.data.imported} jobs!`);
      } else {
        alert(result.message || 'Failed to import jobs');
      }
    } catch (error) {
      console.error('Error importing jobs:', error);
      alert('Failed to import jobs');
    } finally {
      setImportLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 bg-opacity-80 text-black font-medium';
      case 'paused':
        return 'bg-yellow-500 bg-opacity-80 text-black font-medium';
      case 'closed':
        return 'bg-red-500 bg-opacity-80 text-black font-medium';
      default:
        return 'bg-gray-500 bg-opacity-80 text-black font-medium';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-500 bg-opacity-80 text-black font-medium';
      case 'part-time':
        return 'bg-purple-500 bg-opacity-80 text-black font-medium';
      case 'contract':
        return 'bg-orange-500 bg-opacity-80 text-black font-medium';
      default:
        return 'bg-gray-500 bg-opacity-80 text-black font-medium';
    }
  };

  const countries = ['Kuwait', 'United Arab Emirates', 'Saudi Arabia', 'Qatar'];
  const categories = ['nursing', 'radiology', 'pharmacy', 'therapy', 'medical', 'dental', 'administration'];
  const experiences = ['entry', 'mid', 'senior'];

  return (
    <div className="space-y-6 rtl:text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rtl:sm:flex-row-reverse">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Job Management</h2>
          <p className="text-gray-400">Create, edit, and manage job postings ({jobs.length} total jobs)</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4 sm:mt-0 rtl:justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchJobs}
            disabled={loading}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 min-w-[100px] h-10"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadTemplate}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors min-w-[100px] h-10"
          >
            <FileText size={16} />
            <span>Template</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportJobs}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors min-w-[100px] h-10"
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>

          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportJobs}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={importLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={importLoading}
              className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 min-w-[100px] h-10"
            >
              {importLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload size={16} />
              )}
              <span>{importLoading ? 'Importing...' : 'Import'}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setEditingJob(null);
              setShowAddForm(true);
            }}
            className="btn-primary flex items-center space-x-2 px-4 py-2.5 min-w-[120px] h-10"
          >
            <Plus size={16} />
            <span>Add New Job</span>
          </motion.button>
        </div>
      </div>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Search Jobs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white bg-opacity-10 text-white border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 w-full placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="all" className="bg-gray-800 text-white">All Categories</option>
              <option value="medical" className="bg-gray-800 text-white">Medical</option>
              <option value="nursing" className="bg-gray-800 text-white">Nursing</option>
              <option value="radiology" className="bg-gray-800 text-white">Radiology</option>
              <option value="pharmacy" className="bg-gray-800 text-white">Pharmacy</option>
              <option value="dental" className="bg-gray-800 text-white">Dental</option>
              <option value="therapy" className="bg-gray-800 text-white">Therapy</option>
              <option value="administration" className="bg-gray-800 text-white">Administration</option>
            </select>
          </div>

          {/* Country Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-white mb-2">Country</label>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="all" className="bg-gray-800 text-white">All Countries</option>
              <option value="Kuwait" className="bg-gray-800 text-white">Kuwait</option>
              <option value="United Arab Emirates" className="bg-gray-800 text-white">UAE</option>
              <option value="Saudi Arabia" className="bg-gray-800 text-white">Saudi Arabia</option>
              <option value="Qatar" className="bg-gray-800 text-white">Qatar</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-white mb-2">Posted Date</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="all" className="bg-gray-800 text-white">All Time</option>
              <option value="last7days" className="bg-gray-800 text-white">Last 7 Days</option>
              <option value="last30days" className="bg-gray-800 text-white">Last 30 Days</option>
              <option value="last90days" className="bg-gray-800 text-white">Last 90 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="lg:w-auto flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterCountry('all');
                setFilterDateRange('all');
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors h-10 flex items-center space-x-2"
            >
              <X size={16} />
              <span>Clear</span>
            </motion.button>
          </div>
        </div>

        {/* Filter Results Summary */}
        <div className="mt-4 pt-4 border-t border-white border-opacity-10">
          <p className="text-gray-300 text-sm">
            Showing <span className="font-semibold text-white">{filteredJobs.length}</span> of{' '}
            <span className="font-semibold text-white">{jobs.length}</span> jobs
            {(searchTerm || filterCategory !== 'all' || filterCountry !== 'all' || filterDateRange !== 'all') && (
              <span className="text-pink-400"> (filtered)</span>
            )}
          </p>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-gray-400 mt-2">Loading jobs...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchJobs}
            className="mt-2 text-red-200 hover:text-red-100 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              {/* Job Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="font-medium mb-2" style={{ color: 'var(--accent-pink)' }}>
                    {job.company}
                  </p>
                  {job.featured && (
                    <span className="inline-block px-2 py-1 bg-yellow-500 bg-opacity-80 text-black font-medium text-xs rounded-full mb-2">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleViewJob(job)}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFeaturedToggle(job.id, job.featured)}
                    className={`p-2 rounded-full hover:bg-yellow-500 hover:bg-opacity-20 ${
                      job.featured ? 'text-yellow-400' : 'text-gray-400'
                    } hover:text-yellow-400`}
                    title={job.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star size={16} className={job.featured ? 'fill-current' : ''} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditJob(job)}
                    className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white"
                    title="Edit Job"
                  >
                    <Edit size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 rounded-full hover:bg-red-500 hover:bg-opacity-20 text-gray-400 hover:text-red-400"
                    title="Delete Job"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin size={14} className="mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <DollarSign size={14} className="mr-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Clock size={14} className="mr-2" />
                  <span>Posted {job.posted}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Users size={14} className="mr-2" />
                  <span>{job.applicants} applicants</span>
                </div>
              </div>

              {/* Status and Type */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-3 py-1 rounded-full ${getTypeColor(job.type)}`}>
                  {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                </span>
                
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value as any)}
                  className={`text-xs px-3 py-1 rounded-full border-none bg-transparent ${getStatusColor(job.status)}`}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {job.description}
              </p>

              {/* Actions */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary flex-1 py-2 text-sm"
                >
                  View Applications
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEditJob(job)}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  Edit Job
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No jobs message */}
      {!loading && !error && jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">No jobs found.</p>
          <p className="text-gray-500 text-sm mt-2">Create your first job posting to get started.</p>
        </motion.div>
      )}

      {/* No filtered jobs message */}
      {!loading && !error && jobs.length > 0 && filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">No jobs match your current filters.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria or clear the filters.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setFilterCountry('all');
              setFilterDateRange('all');
            }}
            className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            Clear All Filters
          </motion.button>
        </motion.div>
      )}

      {/* Featured Jobs Management Section */}
      {!loading && !error && jobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="border-t border-white/20 pt-8">
            <FeaturedJobsManagement onJobUpdate={fetchJobs} />
          </div>
        </motion.div>
      )}

      {/* Add/Edit Job Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddForm(false);
              setEditingJob(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal-admin p-8 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingJob ? 'Edit Job' : 'Add New Job'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingJob(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 hover:bg-opacity-10 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Senior Registered Nurse"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., City General Hospital"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Country *
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country} className="bg-gray-800">
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Kuwait City, Kuwait"
                    />
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="full-time" className="bg-gray-800">Full-time</option>
                      <option value="part-time" className="bg-gray-800">Part-time</option>
                      <option value="contract" className="bg-gray-800">Contract</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category} className="bg-gray-800">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="entry" className="bg-gray-800">Entry Level</option>
                      <option value="mid" className="bg-gray-800">Mid Level</option>
                      <option value="senior" className="bg-gray-800">Senior Level</option>
                    </select>
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $75,000 - $95,000"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the job role, responsibilities, and what you're looking for in a candidate..."
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Requirements (one per line)
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Bachelor's degree in Nursing\n3+ years of experience\nValid RN license`}
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Benefits (one per line)
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-white bg-opacity-90 border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Health insurance\nPaid time off\n401k matching`}
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-white">
                    Mark as featured job (appears prominently in listings)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingJob(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {formLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{editingJob ? 'Update Job' : 'Create Job'}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Job Details Modal */}
        {viewingJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setViewingJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal-admin p-6 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Job Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewingJob(null)}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{viewingJob.title}</h3>
                  <p className="text-gray-300">{viewingJob.company}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <p className="text-white">{viewingJob.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <p className="text-white">{viewingJob.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <p className="text-white">{viewingJob.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Salary</label>
                    <p className="text-white">{viewingJob.salary}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <div className="bg-white/5 rounded-lg p-4 text-white whitespace-pre-wrap">
                    {viewingJob.description}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Requirements</label>
                  <div className="bg-white/5 rounded-lg p-4 text-white">
                    {Array.isArray(viewingJob.requirements) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {viewingJob.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="whitespace-pre-wrap">{viewingJob.requirements}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Benefits</label>
                  <div className="bg-white/5 rounded-lg p-4 text-white">
                    {Array.isArray(viewingJob.benefits) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {viewingJob.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="whitespace-pre-wrap">{viewingJob.benefits}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      viewingJob.featured
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {viewingJob.featured ? 'Featured' : 'Standard'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Posted: {viewingJob.posted}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
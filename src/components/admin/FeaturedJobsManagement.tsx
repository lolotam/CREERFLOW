'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Save, X, MapPin, DollarSign, Clock, Users, Star, AlertTriangle } from 'lucide-react';

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

interface FeaturedJobsManagementProps {
  onJobUpdate?: () => void; // Callback to refresh parent component
}

export default function FeaturedJobsManagement({ onJobUpdate }: FeaturedJobsManagementProps) {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch featured jobs
  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/jobs?featured=true&status=active&limit=100');
      const result = await response.json();

      if (result.success) {
        setFeaturedJobs(result.data);
      } else {
        setError(result.message || 'Failed to fetch featured jobs');
      }
    } catch (err) {
      setError('Failed to fetch featured jobs');
      console.error('Error fetching featured jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  // Handle edit job
  const handleEditJob = (job: Job) => {
    setEditingJob(job.id);
    setEditForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      category: job.category,
      experience: job.experience
    });
  };

  // Handle save edit
  const handleSaveEdit = async (jobId: string) => {
    try {
      setActionLoading(jobId);

      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, updates: editForm })
      });

      const result = await response.json();
      if (result.success) {
        // Update local state
        setFeaturedJobs(featuredJobs.map(job =>
          job.id === jobId ? { ...job, ...editForm } : job
        ));
        setEditingJob(null);
        setEditForm({});
        
        // Notify parent component
        if (onJobUpdate) {
          onJobUpdate();
        }
      } else {
        setError(result.message || 'Failed to update job');
      }
    } catch (err) {
      setError('Failed to update job');
      console.error('Error updating job:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditForm({});
  };

  // Handle unfeature job (remove from featured)
  const handleUnfeatureJob = async (jobId: string) => {
    try {
      setActionLoading(jobId);

      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, updates: { featured: false } })
      });

      const result = await response.json();
      if (result.success) {
        // Remove from featured jobs list
        setFeaturedJobs(featuredJobs.filter(job => job.id !== jobId));
        setDeleteConfirm(null);
        
        // Notify parent component
        if (onJobUpdate) {
          onJobUpdate();
        }
      } else {
        setError(result.message || 'Failed to unfeature job');
      }
    } catch (err) {
      setError('Failed to unfeature job');
      console.error('Error unfeaturing job:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-gray-300">Loading featured jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchFeaturedJobs}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Featured Jobs Management</h3>
          <p className="text-gray-400">
            Manage your featured jobs ({featuredJobs.length} total)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">Featured Jobs</span>
        </div>
      </div>

      {/* Featured Jobs List */}
      {featuredJobs.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center">
          <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400 mb-2">No featured jobs found</p>
          <p className="text-gray-500 text-sm">
            Mark jobs as featured in the Job Management section above to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {featuredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              {editingJob === job.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={editForm.company || ''}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Salary
                      </label>
                      <input
                        type="text"
                        value={editForm.salary || ''}
                        onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => handleSaveEdit(job.id)}
                      disabled={actionLoading === job.id}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {actionLoading === job.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{job.title}</h4>
                        <p className="font-medium mb-2" style={{ color: 'var(--accent-pink)' }}>
                          {job.company}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-xs font-medium">FEATURED</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin size={14} />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <DollarSign size={14} />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock size={14} />
                        <span className="text-sm capitalize">{job.type}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Users size={14} />
                        <span className="text-sm">{job.applicants} applicants</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                        {job.category}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                        {job.experience}
                      </span>
                      <span className="text-gray-400 text-xs">{job.posted}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditJob(job)}
                      className="p-2 rounded-full hover:bg-blue-500 hover:bg-opacity-20 text-gray-400 hover:text-blue-400"
                      title="Edit Job"
                    >
                      <Edit size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDeleteConfirm(job.id)}
                      className="p-2 rounded-full hover:bg-red-500 hover:bg-opacity-20 text-gray-400 hover:text-red-400"
                      title="Remove from Featured"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 rounded-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Remove from Featured?</h3>
                <p className="text-gray-400 mb-6">
                  This will remove the job from the featured list. The job will remain active but won&apos;t be highlighted as featured.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUnfeatureJob(deleteConfirm)}
                    disabled={actionLoading === deleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {actionLoading === deleteConfirm ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                    ) : (
                      'Remove'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

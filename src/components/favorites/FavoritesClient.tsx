'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import JobCard from '@/components/jobs/JobCard';
import { Link } from '@/i18n/routing';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  matchPercentage?: number;
  featured: boolean;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
}

export default function FavoritesClient() {
  const { favorites, removeFromFavorites } = useFavorites();
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteJobs = async () => {
      if (favorites.length === 0) {
        setFavoriteJobs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch job details for each favorite job ID
        const jobPromises = favorites.map(async (jobId) => {
          const response = await fetch(`/api/jobs?id=${jobId}`);
          const result = await response.json();
          return result.success ? result.data[0] : null;
        });

        const jobs = await Promise.all(jobPromises);
        const validJobs = jobs.filter(job => job !== null);
        setFavoriteJobs(validJobs);
      } catch (error) {
        console.error('Error fetching favorite jobs:', error);
        setError('Failed to load favorite jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteJobs();
  }, [favorites]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all jobs from your favorites?')) {
      favorites.forEach(jobId => removeFromFavorites(jobId));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/jobs"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Jobs</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Favorites</h1>
              <p className="text-gray-400">
                {favoriteJobs.length} saved job{favoriteJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {favoriteJobs.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-400">Loading your favorite jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
          <p className="text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && favoriteJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start browsing jobs and click the bookmark icon to save positions you&apos;re interested in.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          >
            <span>Browse Jobs</span>
          </Link>
        </motion.div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && favoriteJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {favoriteJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
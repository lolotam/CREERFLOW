'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobSearch } from './JobSearchProvider';
import JobCard from './JobCard';
import { Loader2, Filter } from 'lucide-react';

export default function JobGrid() {
  const t = useTranslations('jobs');
  const { state, dispatch, fetchJobs } = useJobSearch();
  const [displayedJobs, setDisplayedJobs] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log('🖥️ JobGrid state update:', {
      totalJobs: state.totalJobs,
      jobsLength: state.jobs.length,
      filteredJobsLength: state.filteredJobs.length,
      loading: state.loading,
      error: state.error
    });
  }, [state]);


  const loadMore = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDisplayedJobs(prev => prev + 6);
    setIsLoading(false);
  };

  const visibleJobs = state.filteredJobs.slice(0, displayedJobs);
  const hasMore = displayedJobs < state.filteredJobs.length;

  // Reset displayed jobs when filters change
  useEffect(() => {
    setDisplayedJobs(6);
  }, [state.filteredJobs]);

  return (
    <div>
      {/* Loading State */}
      {state.loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
          <p className="text-gray-300">{t('loadingJobs')}</p>
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-300 mb-2">{t('errorLoading')}</h3>
          <p className="text-red-300 mb-4">{state.error}</p>
          <button 
            onClick={() => {
              dispatch({ type: 'SET_ERROR', payload: null });
              // Refetch jobs logic would go here
            }}
            className="text-red-200 hover:text-red-100 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results Header */}
      {!state.loading && !state.error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              {t('jobsFound').replace('0', state.totalJobs.toString())}
            </h2>
            <p className="text-gray-300">
              {t('showingResults')
                .replace('0', Math.min(displayedJobs, state.filteredJobs.length).toString())
                .replace('0', state.totalJobs.toString())}
            </p>
            {/* Refresh button */}
            <button
              onClick={() => {
                console.log('🔄 Manual fetch triggered');
                fetchJobs();
              }}
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
            >
              Refresh Jobs
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border rounded-lg focus:ring-2 bg-black text-white"
                    style={{ borderColor: 'var(--border-primary)', '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties}>
              <option>{t('sortMostRelevant')}</option>
              <option>{t('sortNewest')}</option>
              <option>{t('sortSalaryHigh')}</option>
              <option>{t('sortSalaryLow')}</option>
              <option>{t('sortBestMatch')}</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {!state.loading && !state.error && state.filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noJobsFound')}</h3>
          <p className="text-gray-600 mb-6">
            {t('noJobsDescription')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              dispatch({ type: 'RESET_FILTERS' });
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t('clearFilters')}
          </motion.button>
        </motion.div>
      )}

      {/* Jobs Grid */}
      <AnimatePresence mode="wait">
        {!state.loading && !state.error && state.filteredJobs.length > 0 && (
          <motion.div
            key="jobs-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {visibleJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && state.filteredJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>{t('loadMore')}</span>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Skeleton Loading */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6"
        >
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card p-6 rounded-2xl h-80">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Tags */}
        <div className="flex space-x-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

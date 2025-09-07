'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Search, MapPin, Filter } from 'lucide-react';
import { useJobSearch } from './JobSearchProvider';
import { useContent } from '@/contexts/ContentContext';

export default function JobsHeader() {
  const t = useTranslations('jobs');
  const { state, dispatch } = useJobSearch();
  const { getContent } = useContent();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    dispatch({ type: 'SET_SEARCH', payload: value });
  };

  return (
    <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            {t('subtitle').replace('0+', `${state.totalJobs.toLocaleString()}+`)}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job Title Search */}
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 rtl:text-right"
                />
              </div>

              {/* Location Search */}
              <div className="relative">
                <MapPin className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
                <input
                  type="text"
                  placeholder={t('locationFilter')}
                  onChange={(e) => dispatch({
                    type: 'SET_FILTER',
                    payload: { key: 'location', value: e.target.value }
                  })}
                  className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 rtl:text-right"
                />
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Search size={20} />
                <span>{t('searchButton')}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto"
        >
          {[
            { label: t('totalJobs'), value: state.totalJobs.toLocaleString() },
            { label: t('companies'), value: '500+' },
            { label: t('newThisWeek'), value: '127' },
            { label: t('remoteJobs'), value: '89' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

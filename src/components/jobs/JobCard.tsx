'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, DollarSign, Star, Bookmark, ExternalLink, Users, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTranslations } from 'next-intl';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
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
}

interface JobCardProps {
  job: Job;
  index: number;
}

export default function JobCard({ job, index }: JobCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isBookmarked = isFavorite(job.id);
  const t = useTranslations('jobs.card');

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(job.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-500 bg-opacity-20 text-black';
      case 'part-time': return 'bg-blue-500 bg-opacity-20 text-black';
      case 'contract': return 'bg-purple-500 bg-opacity-20 text-black';
      default: return 'bg-gray-500 bg-opacity-20 text-black';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative h-80 perspective-1000"
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={handleFlip}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className={`glass-card p-6 rounded-2xl h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 rtl:text-right ${
            job.featured ? 'ring-2 ring-opacity-50' : ''
          }`}
          style={job.featured ? { '--tw-ring-color': 'var(--accent-pink)' } as React.CSSProperties : {}}>
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4 rtl:flex-row-reverse">
                <div className="flex-1">
                  {job.featured && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full mb-2"
                    >
                      {t('featured')}
                    </motion.span>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="font-medium mb-2" style={{ color: 'var(--accent-pink)' }}>{job.company}</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isBookmarked 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-white bg-opacity-10 text-gray-400 hover:text-white hover:bg-opacity-20'
                  }`}
                  title={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                </motion.button>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-400 text-sm rtl:flex-row-reverse">
                  <MapPin size={14} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm rtl:flex-row-reverse">
                  <DollarSign size={14} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm rtl:flex-row-reverse">
                  <Clock size={14} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  <span>{job.posted}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4 rtl:justify-end">
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(job.type)}`}>
                  {job.type.replace('-', ' ')}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-10 text-black">
                  {job.experience}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div>
              {/* Match Percentage */}
              {job.matchPercentage && (
                <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Star size={16} className={getMatchColor(job.matchPercentage)} />
                    <span className={`text-sm font-medium ${getMatchColor(job.matchPercentage)}`}>
                      {job.matchPercentage}% {t('match')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{t('clickToFlip')}</span>
                </div>
              )}

              {/* Apply Button */}
              <Link
                href={`/apply?job=${job.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block w-full"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-2 px-4"
                >
                  {t('applyNow')}
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="glass-card p-6 rounded-2xl h-full flex flex-col rtl:text-right">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 rtl:flex-row-reverse">
              <h4 className="text-lg font-bold text-white">{t('jobDetails')}</h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="p-1 rounded-full hover:bg-white hover:bg-opacity-10"
              >
                <ExternalLink size={16} className="text-gray-400" />
              </motion.button>
            </div>

            {/* Description */}
            <div className="flex-1 overflow-y-auto">
              <div className="mb-4">
                <h5 className="font-semibold text-white mb-2">{t('description')}</h5>
                <p className="text-sm text-gray-400 line-clamp-3">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h5 className="font-semibold text-white mb-2">{t('requirements')}</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="flex items-start rtl:flex-row-reverse rtl:text-right">
                      <span className="w-1 h-1 rounded-full mt-2 mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0" style={{ backgroundColor: 'var(--accent-pink)' }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h5 className="font-semibold text-white mb-2">Benefits</h5>
                <div className="flex flex-wrap gap-1">
                  {job.benefits.slice(0, 3).map((benefit, index) => (
                    <span
                      key={index}
                      className="text-xs text-black px-2 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--accent-green)' }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex space-x-2 rtl:space-x-reverse mt-4">
              <Link
                href={`/apply?job=${job.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-2 px-4 text-sm"
                >
                  Apply Now
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => e.stopPropagation()}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Save
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

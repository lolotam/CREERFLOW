'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight, MapPin, DollarSign, Star, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/routing';

import 'keen-slider/keen-slider.min.css';

interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract';
  category: string;
  featured: boolean;
  posted: string;
}

interface FeaturedJobsCarouselProps {
  className?: string;
}

export default function FeaturedJobsCarousel({ className = '' }: FeaturedJobsCarouselProps) {
  const t = useTranslations('featuredJobs');
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      '(min-width: 400px)': {
        slides: { perView: 1, spacing: 16 },
      },
      '(min-width: 768px)': {
        slides: { perView: 2, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 3, spacing: 24 },
      },
      '(min-width: 1280px)': {
        slides: { perView: 4, spacing: 24 },
      },
    },
    slides: { perView: 1, spacing: 16 },
  });

  // Fetch featured jobs
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/jobs?featured=true&status=active&limit=15');
        const result = await response.json();
        
        if (result.success) {
          setFeaturedJobs(result.data);
          console.log('✨ Featured jobs loaded:', result.data.length);
        } else {
          setError(result.message || 'Failed to fetch featured jobs');
        }
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
        setError('Failed to fetch featured jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  // Don't render if no featured jobs
  if (loading) {
    return (
      <section className={`py-12 bg-gray-900 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p className="text-gray-400">{t('loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredJobs.length === 0) {
    return null; // Don't show the section if there are no featured jobs
  }

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Star className="text-yellow-400 mr-2" size={24} />
            <h2 className="text-3xl md:text-4xl font-black text-white">
              {t('title')}
            </h2>
            <Star className="text-yellow-400 ml-2" size={24} />
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {featuredJobs.map((job, index) => (
              <div key={job.id} className="keen-slider__slide">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="glass-card p-6 h-full hover:bg-white/20 transition-all duration-300 group relative overflow-hidden rtl:text-right">
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>

                    {/* Job Content */}
                    <div className="space-y-4">
                      {/* Title and Company */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                          {truncateTitle(job.title)}
                        </h3>
                        <p className="text-white/70 font-medium">{job.company}</p>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-white/60 rtl:flex-row-reverse">
                        <MapPin size={16} className="mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0" />
                        <span className="text-sm">{job.location}</span>
                      </div>

                      {/* Salary */}
                      {job.salary && (
                        <div className="flex items-center text-white/60 rtl:flex-row-reverse">
                          <DollarSign size={16} className="mr-2 rtl:mr-0 rtl:ml-2 flex-shrink-0" />
                          <span className="text-sm">{job.salary}</span>
                        </div>
                      )}

                      {/* Job Type */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse rtl:justify-end">
                        <span className="px-3 py-1 bg-blue-500/20 text-black rounded-full text-xs font-medium">
                          {job.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-black rounded-full text-xs font-medium">
                          {job.category.toUpperCase()}
                        </span>
                      </div>

                      {/* Posted Time */}
                      <p className="text-xs text-white/50">{job.posted}</p>

                      {/* Apply Button */}
                      <Link
                        href={`/apply?job=${job.id}` as any}
                        className="block w-full"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                          <span>Apply Now</span>
                          <ExternalLink size={16} />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {loaded && instanceRef.current && featuredJobs.length > 1 && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 z-10"
                aria-label="Previous featured jobs"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 z-10"
                aria-label="Next featured jobs"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {loaded && instanceRef.current && featuredJobs.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(featuredJobs.length / 4) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx * 4)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentSlide / 4) === idx
                      ? 'bg-white'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide group ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

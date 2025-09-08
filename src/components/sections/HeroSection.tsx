'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { Search, UploadCloud, Users } from 'lucide-react';
import Image from 'next/image';
import { useContent } from '@/contexts/ContentContext';

export default function HeroSection() {
  const t = useTranslations('hero');
  const router = useRouter();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 100]);
  const y3 = useTransform(scrollY, [0, 500], [0, 75]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const { getContent, getContentSection } = useContent();

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);

    // Navigate to jobs page with search parameters using Next.js router
    router.push(`/jobs?${params.toString()}` as any);
  };

  // Get stats content or fallback to default stats
  const getStatsContent = () => {
    const statsSection = getContentSection('company-stats');
    if (statsSection && statsSection.content) {
      try {
        return JSON.parse(statsSection.content);
      } catch (error) {
        console.error('Error parsing stats JSON:', error);
      }
    }
    return {
      totalJobs: '100+',
      companies: '500+',
      remoteJobs: '89'
    };
  };

  const dynamicStats = getStatsContent();

  const trustMetrics = [
    t('stats.jobs').replace('100+', dynamicStats.totalJobs || '100+'),
    t('stats.companies').replace('500+', dynamicStats.companies || '500+'),
    t('stats.remote').replace('89', dynamicStats.remoteJobs || '89')
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-36 pb-32">
      {/* Enhanced Background with matching gradient theme */}
      <div className="absolute inset-0">
        <motion.div
          style={{ y }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full filter blur-3xl"
               style={{ background: 'radial-gradient(circle, rgba(255, 184, 224, 0.4) 0%, transparent 70%)' }} />
          <div className="absolute top-40 right-10 w-96 h-96 rounded-full filter blur-3xl"
               style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 left-1/2 w-96 h-96 rounded-full filter blur-3xl"
               style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full filter blur-3xl"
               style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)' }} />
        </motion.div>
      </div>

      {/* Animated Water Drop Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Water Drop 1: New Healthcare Jobs */}
        <motion.div
          className="absolute top-1/4 left-1/4"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 1, duration: 0.8, ease: "backOut" }}
          style={{ y }}
        >
          <div className="water-drop water-drop-traverse-1 water-drop-medium">
            <div className="water-drop-content">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  New Jobs
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water Drop 2: Gulf Region */}
        <motion.div
          className="absolute top-1/3 right-1/4"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 1.5, duration: 0.8, ease: "backOut" }}
          style={{ y: y2 }}
        >
          <div className="water-drop water-drop-traverse-2 water-drop-delay-1 water-drop-small">
            <div className="water-drop-content">
              <div className="flex flex-col items-center space-y-2">
                <Users size={20} className="text-blue-400 drop-shadow-lg" />
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  Gulf
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water Drop 3: CareerFlow */}
        <motion.div
          className="absolute bottom-1/3 left-1/3"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 2, duration: 0.8, ease: "backOut" }}
          style={{ y: y3 }}
        >
          <div className="water-drop water-drop-traverse-3 water-drop-delay-2 water-drop-large">
            <div className="water-drop-content">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-r from-pink-400 to-purple-400 shadow-lg">
                  <span className="text-black font-bold text-sm">CF</span>
                </div>
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  Career
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water Drop 4: Kuwait */}
        <motion.div
          className="absolute top-1/2 left-1/5"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 2.5, duration: 0.8, ease: "backOut" }}
          style={{ y: y2 }}
        >
          <div className="water-drop water-drop-kuwait water-drop-traverse-4 water-drop-delay-3 water-drop-medium">
            <div className="water-drop-content">
              <div className="flex flex-col items-center justify-center">
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  Kuwait
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water Drop 5: UAE */}
        <motion.div
          className="absolute top-2/3 right-1/5"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 3, duration: 0.8, ease: "backOut" }}
          style={{ y: y }}
        >
          <div className="water-drop water-drop-uae water-drop-traverse-5 water-drop-delay-1 water-drop-small">
            <div className="water-drop-content">
              <div className="flex flex-col items-center justify-center">
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  UAE
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water Drop 6: Qatar */}
        <motion.div
          className="absolute bottom-1/4 right-1/3"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 3.5, duration: 0.8, ease: "backOut" }}
          style={{ y: y3 }}
        >
          <div className="water-drop water-drop-qatar water-drop-traverse-6 water-drop-delay-2 water-drop-medium">
            <div className="water-drop-content">
              <div className="flex flex-col items-center justify-center">
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  Qatar
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water Drop 7: Saudi Arabia */}
        <motion.div
          className="absolute top-1/5 right-2/5"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: -45 }}
          transition={{ delay: 4, duration: 0.8, ease: "backOut" }}
          style={{ y: y2 }}
        >
          <div className="water-drop water-drop-saudi water-drop-traverse-7 water-drop-delay-3 water-drop-large">
            <div className="water-drop-content">
              <div className="flex flex-col items-center justify-center">
                <span className="text-white/95 text-sm md:text-base font-bold text-center leading-tight">
                  Saudi
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3D Character 1: Nurse */}
        <motion.div
          className="absolute top-1/6 left-1/6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4.5, duration: 0.8, ease: "backOut" }}
          style={{ y: y3 }}
        >
          <div className="character-3d character-3d-medium character-float-1 character-delay-1">
            <Image
              src="/images/characters/nurse.png"
              alt="Healthcare Nurse"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* 3D Character 2: Doctor Woman */}
        <motion.div
          className="absolute bottom-1/6 right-1/6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 5, duration: 0.8, ease: "backOut" }}
          style={{ y: y }}
        >
          <div className="character-3d character-3d-large character-float-2 character-delay-2">
            <Image
              src="/images/characters/doctor-woman.png"
              alt="Healthcare Doctor"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </motion.div>

        {/* 3D Character 3: Female Doctor */}
        <motion.div
          className="absolute top-2/5 right-1/8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 5.5, duration: 0.8, ease: "backOut" }}
          style={{ y: y2 }}
        >
          <div className="character-3d character-3d-small character-float-3 character-delay-3">
            <Image
              src="/images/characters/doctor-female.png"
              alt="Female Healthcare Doctor"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          {/* Main Heading - Healthcare focused */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {t('title')}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium"
          >
            {t('subtitle')}
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex-1">
                <label htmlFor="search-keywords" className="sr-only">{t('searchPlaceholder')}</label>
                <input
                  id="search-keywords"
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-white/60 border-0 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg text-base"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="search-location" className="sr-only">{t('locationPlaceholder')}</label>
                <input
                  id="search-location"
                  type="text"
                  placeholder={t('locationPlaceholder')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-white/60 border-0 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg text-base"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary group flex items-center justify-center space-x-2 px-8 py-3 min-w-[140px]"
              >
                <Search size={20} />
                <span>{t('searchButton')}</span>
              </motion.button>
            </div>
          </motion.form>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/apply"
                className="btn-secondary group inline-flex items-center space-x-2 text-lg"
              >
                <UploadCloud size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span>{t('uploadCV')}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Dashboard Dropdown Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <motion.div
              className="glass-card inline-flex items-center space-x-3 px-6 py-4 rounded-2xl cursor-pointer group"
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.img
                src="/logo4.png"
                alt="CareerFlow Logo"
                className="w-8 h-8 object-contain"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
              <motion.span
                className="text-white font-semibold text-lg"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {t('dashboardButton')}
              </motion.span>
              <motion.div
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Trust Strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-white/70 text-sm md:text-base">
              {trustMetrics.join(' • ')}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

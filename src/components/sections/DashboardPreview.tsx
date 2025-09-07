'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BarChart3, Bell, Target, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPreview() {
  const t = useTranslations('dashboard');

  const features = [
    { icon: Target, title: t('features.matching'), color: 'text-blue-500' },
    { icon: BarChart3, title: t('features.tracking'), color: 'text-green-500' },
    { icon: TrendingUp, title: t('features.analytics'), color: 'text-purple-500' },
    { icon: Bell, title: t('features.notifications'), color: 'text-orange-500' },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >

          {/* Dashboard Image Placeholder - Replace with actual dashboard screenshot */}
          <div className="relative rounded-2xl border border-white/10 glass-card overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={32} className="text-white" />
                </div>
                <p className="text-white/60 text-sm">{t('preview')}</p>
                <p className="text-white/40 text-xs mt-1">{t('comingSoon')}</p>
              </div>
            </div>

            {/* Uncomment when dashboard image is available */}
            {/*
            <Image
              src="/images/dashboard-preview.png"
              alt="CareerFlow dashboard showing job applications and match scores"
              width={800}
              height={450}
              loading="lazy"
              className="w-full h-auto"
            />
            */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

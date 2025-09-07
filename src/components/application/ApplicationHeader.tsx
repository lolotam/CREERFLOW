'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface ApplicationHeaderProps {
  jobId?: string;
}

export default function ApplicationHeader({ jobId }: ApplicationHeaderProps) {
  const t = useTranslations('application');
  const tHeader = useTranslations('application.header');

  // Mock job data - in real app, fetch based on jobId
  const jobData = {
    title: tHeader('jobTitle'),
    company: tHeader('company'),
    location: tHeader('location'),
    type: tHeader('type'),
    salary: tHeader('salary')
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} className="rtl:rotate-180" />
            <span>{t('backToJobs')}</span>
          </Link>
        </motion.div>

        {/* Job Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-6 rounded-2xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-left rtl:text-right">
                {tHeader('applyFor')} {jobData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Briefcase size={16} />
                  <span>{jobData.company}</span>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <MapPin size={16} />
                  <span>{jobData.location}</span>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Clock size={16} />
                  <span>{jobData.type}</span>
                </div>
              </div>
            </div>

            <div className="text-right rtl:text-left">
              <div className="text-lg font-semibold text-gray-900">{jobData.salary}</div>
              <div className="text-sm text-gray-600">{tHeader('annualSalary')}</div>
            </div>
          </div>
        </motion.div>

        {/* Application Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-blue-100 mb-2">{t('steps')}</p>
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="w-2 h-2 bg-blue-300 rounded-full opacity-50"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

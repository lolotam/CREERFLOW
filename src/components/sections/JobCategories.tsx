'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Heart, Stethoscope, Radiation, Pill, Smile, ClipboardList } from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'image' | 'hero' | 'stats';
  content: string;
}

export default function CategoriesSection() {
  const t = useTranslations('categories');
  const [content, setContent] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        const result = await response.json();
        if (result.success) {
          setContent(result.data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  // Get content by ID or fallback to default text
  const getContent = (id: string, fallback: string = '') => {
    const section = content.find(c => c.id === id);
    return section ? section.content : fallback;
  };

  const categories = [
    {
      icon: Stethoscope,
      name: t('medical'),
      description: t('descriptions.medical'),
      count: t('positions.medical'),
      slug: 'medical',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Heart,
      name: t('nursing'),
      description: t('descriptions.nursing'),
      count: t('positions.nursing'),
      slug: 'nursing',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Radiation,
      name: t('radiology'),
      description: t('descriptions.radiology'),
      count: t('positions.radiology'),
      slug: 'radiology',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Pill,
      name: t('pharmacy'),
      description: t('descriptions.pharmacy'),
      count: t('positions.pharmacy'),
      slug: 'pharmacy',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Smile,
      name: t('dental'),
      description: t('descriptions.dental'),
      count: t('positions.dental'),
      slug: 'dental',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: ClipboardList,
      name: t('administration'),
      description: t('descriptions.administration'),
      count: t('positions.administration'),
      slug: 'administration',
      color: 'from-indigo-500 to-blue-500'
    },
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
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <a
                href={`/jobs?category=${category.slug}`}
                className="glass-card block p-6 md:p-8 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center md:text-left"
                aria-label={`${t('browse')} ${category.name} - ${category.count}`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0`}>
                  <category.icon size={24} className="md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">{category.description}</p>
                <p className="text-xs md:text-sm text-gray-400">{category.count} positions available</p>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

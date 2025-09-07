'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { UserPlus, Target, Send } from 'lucide-react';

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      icon: UserPlus,
      title: t('step1.title'),
      description: t('step1.description'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: t('step2.title'),
      description: t('step2.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Send,
      title: t('step3.title'),
      description: t('step3.description'),
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card text-center p-8 focus-within:ring-2 focus-within:ring-blue-500"
            >
              {/* Step Icon */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                  <step.icon size={32} className="md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center shadow-md border-2 border-white/20">
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-300 text-base md:text-lg">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

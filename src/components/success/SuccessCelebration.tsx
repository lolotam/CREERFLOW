'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle, Calendar, Mail, Phone, ArrowRight, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Confetti from './Confetti';

export default function SuccessCelebration() {
  const t = useTranslations();
  const [showConfetti, setShowConfetti] = useState(true);
  const [submissionDate, setSubmissionDate] = useState<string>('');

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Set submission date after mounting to prevent hydration mismatch
    setSubmissionDate(new Date().toLocaleDateString());

    return () => clearTimeout(timer);
  }, []);

  const nextSteps = [
    {
      icon: Mail,
      title: 'Confirmation Email',
      description: 'Check your email for application confirmation and reference number',
      time: 'Within 5 minutes',
      status: 'pending'
    },
    {
      icon: Phone,
      title: 'Initial Review',
      description: 'Our HR team will review your application and qualifications',
      time: '1-2 business days',
      status: 'upcoming'
    },
    {
      icon: Calendar,
      title: 'Interview Invitation',
      description: 'If selected, you&apos;ll receive an interview invitation',
      time: '3-5 business days',
      status: 'upcoming'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Confetti */}
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={64} className="text-green-600" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for applying! We&apos;ve received your application and will review it carefully.
            Here&apos;s what happens next:
          </p>
        </motion.div>

        {/* Application Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-card p-6 rounded-2xl mb-12 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-black font-medium">Position:</span>
              <span className="ml-2 font-medium text-blue-600">Senior Registered Nurse</span>
            </div>
            <div>
              <span className="text-black font-medium">Company:</span>
              <span className="ml-2 font-medium text-blue-600">City General Hospital</span>
            </div>
            <div>
              <span className="text-black font-medium">Reference ID:</span>
              <span className="ml-2 font-medium text-blue-600">#CF-2024-001234</span>
            </div>
            <div>
              <span className="text-black font-medium">Submitted:</span>
              <span className="ml-2 font-medium text-blue-600">{submissionDate || 'Today'}</span>
            </div>
          </div>
        </motion.div>

        {/* Next Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">What&apos;s Next?</h2>
          
          <div className="max-w-3xl mx-auto">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className="flex items-start space-x-4 mb-8 last:mb-0"
              >
                {/* Step Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <step.icon size={24} />
                </div>

                {/* Step Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <span className="text-sm text-gray-500">{step.time}</span>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Connecting Line */}
                {index < nextSteps.length - 1 && (
                  <div className="absolute left-6 mt-12 w-0.5 h-8 bg-gray-200" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/jobs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span>Browse More Jobs</span>
              <ArrowRight size={20} />
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-12 text-center text-gray-600"
        >
          <p className="mb-2">Questions about your application?</p>
          <p>
            Contact us at{' '}
            <a href="mailto:info@careerflow.com" className="text-blue-600 hover:underline">
              info@careerflow.com
            </a>
            {' '}or{' '}
            <a href="tel:+96555683677" className="text-blue-600 hover:underline">
              (+96555683677) WhatsApp also
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

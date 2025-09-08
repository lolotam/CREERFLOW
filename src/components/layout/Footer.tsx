'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Stethoscope, Heart as HeartIcon, Radiation, Pill, Smile, ClipboardList, MessageCircle, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tCategories = useTranslations('categories');
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const footerLinks = [
    { href: '/privacy', label: t('privacy') },
    { href: '/terms', label: t('terms') },
    { href: '/contact', label: t('contact') },
  ];

  const jobCategories = [
    { href: '/jobs?category=medical', label: tCategories('medical'), icon: Stethoscope },
    { href: '/jobs?category=nursing', label: tCategories('nursing'), icon: HeartIcon },
    { href: '/jobs?category=radiology', label: tCategories('radiology'), icon: Radiation },
    { href: '/jobs?category=pharmacy', label: tCategories('pharmacy'), icon: Pill },
    { href: '/jobs?category=dental', label: tCategories('dental'), icon: Smile },
    { href: '/jobs?category=administration', label: tCategories('administration'), icon: ClipboardList },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Please enter a valid email address.');
      setTimeout(() => {
        setSubscriptionStatus('idle');
        setSubscriptionMessage('');
      }, 3000);
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('idle');
    setSubscriptionMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubscriptionStatus('success');
        setSubscriptionMessage(result.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
        setSubscriptionMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setSubscriptionMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
        setSubscriptionMessage('');
      }, 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white border-t" style={{ borderColor: 'var(--border-primary)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo4.png"
                alt="CareerFlow Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold">CareerFlow</span>
            </div>
            <p className="text-white/70 mb-6 text-base">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="mailto:info@careerflow.com"
                className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
              >
                <Mail size={16} />
                <span>info@careerflow.com</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">{t('topCategories')}</h3>
            <ul className="space-y-2">
              {jobCategories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href as any}
                    className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors text-sm"
                  >
                    <category.icon size={14} />
                    <span>{category.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">{t('stayUpdated')}</h3>
            <p className="text-white/70 text-sm mb-4">{t('stayUpdatedDesc')}</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <label htmlFor="newsletter-email" className="sr-only">{t('emailPlaceholder')}</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing || !email}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
              >
                {isSubscribing ? `${t('subscribe')}...` : t('subscribe')}
              </button>
              {subscriptionMessage && (
                <p className={`text-xs ${
                  subscriptionStatus === 'success' ? 'text-green-400' :
                  subscriptionStatus === 'error' ? 'text-red-400' :
                  'text-white/70'
                }`}>
                  {subscriptionMessage}
                </p>
              )}
            </form>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as any}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>


        </div>

        {/* Social Proof & Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-white/10 mt-8 pt-8"
        >
          {/* First Row: Trusted By and Contact Info with Admin Login */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            {/* Left Side: Trusted By Text */}
            <div className="text-center md:text-left rtl:md:text-right">
              <p className="text-white/70 text-sm">
                {t('trustedBy')}
              </p>
            </div>

            {/* Right Side: Admin Login */}
            <div className="flex justify-center md:justify-end rtl:md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/admin/login"
                  className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
                >
                  <span>{t('adminLogin')}</span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Second Row: Made With and Contact Info */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Left Side: Made With */}
            <div className="text-center md:text-left rtl:md:text-right">
              <div className="flex items-center justify-center md:justify-start rtl:md:justify-end space-x-1 rtl:space-x-reverse text-white/60 text-sm mb-2">
                <span>{t('madeWith')}</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart size={16} className="text-red-500" />
                </motion.div>
                <span>{t('by')}</span>
              </div>
            </div>

            {/* Right Side: Contact Info */}
            <div className="text-center md:text-right rtl:md:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end rtl:md:justify-start space-y-2 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse text-white/60 text-sm">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Phone size={14} />
                  <span>+96555683677</span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin size={14} />
                  <span>Kuwait - Salmiya</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-white/10">
            {/* Social Media Icons */}
            <div className="flex justify-center space-x-6 mb-4">
              <motion.a
                href="https://wa.me/96555683677"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-green-500 text-white/60 hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/careerflowkw"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-white/60 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/creerflow/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/10 hover:bg-blue-600 text-white/60 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </motion.a>
            </div>

            <p className="text-white/60 text-sm">
              © 2024 CareerFlow. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

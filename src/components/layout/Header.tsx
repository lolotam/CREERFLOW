'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Heart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const { favorites, isHydrated } = useFavorites();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/jobs', label: t('jobs') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-header"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo4.png"
                alt="CareerFlow Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-white">
                CareerFlow
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  href={item.href as any}
                  className={`relative px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
                    pathname === item.href
                      ? 'text-black'
                      : 'text-white hover:text-black hover:bg-white hover:bg-opacity-10'
                  }`}
                  style={pathname === item.href ? { background: 'var(--gradient-primary)' } : {}}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side - Favorites, Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Favorites Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={"/favorites" as any}
                className="p-3 rounded-full bg-white bg-opacity-10 text-gray-400 hover:text-white hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                title={t('favorites')}
              >
                <Heart size={20} />
                {isHydrated && favorites.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            
            <LanguageSwitcher />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={"/apply" as any}
                className="btn-primary px-6 py-2"
              >
                {t('apply')}
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Favorites Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href={"/favorites" as any}
                className="p-2 rounded-lg bg-white bg-opacity-10 text-gray-400 hover:text-white hover:bg-opacity-20 transition-colors flex items-center justify-center"
                title="My Favorites"
              >
                <Heart size={20} />
                {isHydrated && favorites.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
                  >
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </motion.span>
                )}
              </Link>
            </motion.div>
            
            <LanguageSwitcher />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t mt-2 pt-4 pb-4"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    className={`px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-black'
                        : 'text-white hover:text-black hover:bg-white hover:bg-opacity-10'
                    }`}
                    style={pathname === item.href ? { background: 'var(--gradient-primary)' } : {}}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={"/apply" as any}
                  className="btn-primary px-6 py-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('apply')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

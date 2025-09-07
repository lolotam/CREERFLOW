'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLocale}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
      <motion.div
        animate={{ rotate: locale === 'ar' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-4 h-4 flex items-center justify-center"
      >
        <div className={`w-3 h-3 rounded-full ${locale === 'en' ? 'bg-blue-500' : 'bg-green-500'}`} />
      </motion.div>
    </motion.button>
  );
}

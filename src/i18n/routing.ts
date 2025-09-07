import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  // The `pathnames` object holds pairs of internal and
  // external paths. All paths now use English segments
  // for consistency across locales, with only locale prefix differing.
  pathnames: {
    // If all locales use the same pathname, a single
    // string or only the internal pathname can be provided.
    '/': '/',
    '/jobs': '/jobs',
    '/apply': '/apply',
    '/thanks': '/thanks',
    '/dashboard-preview': '/dashboard-preview',
    '/admin/applicants': '/admin/applicants',
    '/contact': '/contact',
    '/favorites': '/favorites',
    '/admin/login': '/admin/login',
    '/admin/dashboard': '/admin/dashboard'
  }
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

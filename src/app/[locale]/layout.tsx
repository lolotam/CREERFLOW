import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ContentProvider } from '@/contexts/ContentContext';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});



export const metadata: Metadata = {
  title: "Healthcare Jobs in Kuwait & Gulf | CareerFlow",
  description: "Find nursing, medical, radiology, and pharmacy jobs across Kuwait, KSA, UAE, Qatar, and Bahrain. 100+ new roles weekly. Upload your CV and apply in minutes.",
  keywords: "healthcare jobs Kuwait, medical jobs Gulf, nursing jobs UAE, pharmacy jobs Qatar, radiology jobs Bahrain, hospital jobs KSA",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Healthcare Jobs in Kuwait & Gulf | CareerFlow",
    description: "Find nursing, medical, radiology, and pharmacy jobs across Kuwait, KSA, UAE, Qatar, and Bahrain. 100+ new roles weekly.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthcare Jobs in Kuwait & Gulf | CareerFlow",
    description: "Find nursing, medical, radiology, and pharmacy jobs across Kuwait, KSA, UAE, Qatar, and Bahrain.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  // Ensure consistent locale values for hydration
  const htmlLang = locale || 'en';
  const htmlDir = htmlLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={htmlLang} dir={htmlDir} suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased ${htmlLang === 'ar' ? 'font-cairo' : ''}`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <ContentProvider>
            <FavoritesProvider>
              {/* Skip to content link for accessibility */}
              <a href="#main" className="skip-to-content">
                Skip to main content
              </a>
              <Header />
              {children}
              <Footer />
            </FavoritesProvider>
          </ContentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

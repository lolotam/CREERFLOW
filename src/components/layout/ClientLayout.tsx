'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <>
        {/* Skip to content link for accessibility */}
        <a href="#main" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        {children}
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}

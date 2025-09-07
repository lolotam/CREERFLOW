import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedJobsCarousel from '@/components/carousels/FeaturedJobsCarousel';
import CategoriesSection from '@/components/sections/JobCategories';
import HowItWorksSection from '@/components/sections/HowItWorks';
import DashboardPreview from '@/components/sections/DashboardPreview';
import TestimonialsCarousel from '@/components/carousels/TestimonialsCarousel';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main id="main" className="min-h-screen">
      <HeroSection />
      <FeaturedJobsCarousel />
      <CategoriesSection />
      <HowItWorksSection />
      <DashboardPreview />
      <TestimonialsCarousel />
    </main>
  );
}

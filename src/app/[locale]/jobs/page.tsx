import { setRequestLocale } from 'next-intl/server';
import FeaturedJobsCarousel from '@/components/carousels/FeaturedJobsCarousel';
import JobsHeader from '@/components/jobs/JobsHeader';
import JobFilters from '@/components/jobs/JobFilters';
import JobGrid from '@/components/jobs/JobGrid';
import JobSearchProvider from '@/components/jobs/JobSearchProvider';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function JobsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <JobSearchProvider>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <FeaturedJobsCarousel />
        <JobsHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <JobFilters />
            </div>

            {/* Jobs Grid */}
            <div className="lg:col-span-3">
              <JobGrid />
            </div>
          </div>
        </div>
      </main>
    </JobSearchProvider>
  );
}

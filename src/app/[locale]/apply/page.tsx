import { setRequestLocale } from 'next-intl/server';
import SinglePageApplicationForm from '@/components/application/SinglePageApplicationForm';
import ApplicationHeader from '@/components/application/ApplicationHeader';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ job?: string }>;
};

export default async function ApplyPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { job } = await searchParams;
  
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16">
      <ApplicationHeader jobId={job} />
      <div className="container mx-auto px-4 py-8">
        <SinglePageApplicationForm jobId={job} />
      </div>
    </main>
  );
}

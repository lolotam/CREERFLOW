import { setRequestLocale } from 'next-intl/server';
import DashboardPreview from '@/components/sections/DashboardPreview';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPreviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <DashboardPreview />
    </main>
  );
}

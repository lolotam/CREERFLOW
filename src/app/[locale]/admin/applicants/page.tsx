import { setRequestLocale } from 'next-intl/server';
import AdminDashboard from '@/components/admin/AdminDashboard';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminApplicantsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </main>
  );
}

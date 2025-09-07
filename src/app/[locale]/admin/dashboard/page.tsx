import { setRequestLocale } from 'next-intl/server';
import AdminDashboardClient from './AdminDashboardClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminDashboardClient />;
}

import { setRequestLocale } from 'next-intl/server';
import AdminApplicantsClient from './AdminApplicantsClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminApplicantsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminApplicantsClient />;
}

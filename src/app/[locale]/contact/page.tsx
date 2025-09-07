import { setRequestLocale } from 'next-intl/server';
import ContactPageComponent from '@/components/contact/ContactPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <ContactPageComponent />;
}
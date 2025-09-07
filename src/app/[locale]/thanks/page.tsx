import { setRequestLocale } from 'next-intl/server';
import SuccessCelebration from '@/components/success/SuccessCelebration';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ThanksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <SuccessCelebration />
    </main>
  );
}

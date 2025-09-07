import { setRequestLocale } from 'next-intl/server';
import FavoritesClient from '@/components/favorites/FavoritesClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FavoritesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-black">
      <FavoritesClient />
    </main>
  );
}
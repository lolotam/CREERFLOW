'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function HydrationTest() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const { favorites, isHydrated } = useFavorites();

  useEffect(() => {
    setMounted(true);
    // Only set time after mounting to prevent hydration mismatch
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Hydration Test</h3>
      <div className="space-y-2">
        <p>Component mounted: {mounted ? '✅' : '❌'}</p>
        <p>Favorites hydrated: {isHydrated ? '✅' : '❌'}</p>
        <p>Favorites count: {favorites.length}</p>
        <p>Current time: {currentTime || 'Loading...'}</p>
      </div>
    </div>
  );
}

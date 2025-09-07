'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (jobId: string) => void;
  removeFromFavorites: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
  toggleFavorite: (jobId: string) => void;
  isHydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);
    try {
      const savedFavorites = localStorage.getItem('careerflow-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    try {
      localStorage.setItem('careerflow-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites, isHydrated]);

  const addToFavorites = (jobId: string) => {
    setFavorites(prev => {
      if (!prev.includes(jobId)) {
        return [...prev, jobId];
      }
      return prev;
    });
  };

  const removeFromFavorites = (jobId: string) => {
    setFavorites(prev => prev.filter(id => id !== jobId));
  };

  const isFavorite = (jobId: string) => {
    return favorites.includes(jobId);
  };

  const toggleFavorite = (jobId: string) => {
    if (isFavorite(jobId)) {
      removeFromFavorites(jobId);
    } else {
      addToFavorites(jobId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        isHydrated,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
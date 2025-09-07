'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to handle hydration state and prevent hydration mismatches
 * Returns true only after the component has mounted on the client side
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook specifically for handling browser extension interference
 * Provides a safe way to render content that might be affected by extensions
 */
export function useSafeHydration() {
  const [isSafe, setIsSafe] = useState(false);

  useEffect(() => {
    // Small delay to allow browser extensions to modify the DOM
    const timer = setTimeout(() => {
      setIsSafe(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return isSafe;
}

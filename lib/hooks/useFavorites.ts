'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'velvet_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // localStorage が使えない場合は無視
    }
    setLoaded(true);
  }, []);

  const toggleFavorite = useCallback((girlId: string) => {
    setFavorites(prev => {
      const next = prev.includes(girlId)
        ? prev.filter(id => id !== girlId)
        : [...prev, girlId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // 無視
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((girlId: string) => {
    return favorites.includes(girlId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite, loaded };
}

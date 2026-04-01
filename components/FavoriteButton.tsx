'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';

interface FavoriteButtonProps {
  girlId: string;
  girlName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({ girlId, girlName, size = 'md', className = '' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, loaded } = useFavorites();

  if (!loaded) return null;

  const liked = isFavorite(girlId);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(girlId);
      }}
      aria-label={liked ? `${girlName}をお気に入りから削除` : `${girlName}をお気に入りに追加`}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-full
        transition-all duration-200 transform hover:scale-110 active:scale-95
        ${liked
          ? 'bg-rose-500 text-white shadow-lg shadow-rose-300'
          : 'bg-white/90 text-neutral-400 hover:text-rose-500 hover:bg-white shadow-md'
        }
        ${className}
      `}
    >
      <Heart
        className={`${iconSizes[size]} transition-all`}
        fill={liked ? 'currentColor' : 'none'}
        strokeWidth={liked ? 0 : 2}
      />
    </button>
  );
}

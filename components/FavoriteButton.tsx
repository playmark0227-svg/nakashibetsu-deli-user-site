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
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
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
        flex items-center justify-center
        transition-colors duration-200
        ${liked
          ? 'bg-[#0b0a09] text-[#c9a961]'
          : 'bg-white/90 backdrop-blur-sm text-[#76705f] hover:text-[#0b0a09]'
        }
        ${className}
      `}
    >
      <Heart
        className={iconSizes[size]}
        fill={liked ? 'currentColor' : 'none'}
        strokeWidth={liked ? 0 : 1.5}
      />
    </button>
  );
}

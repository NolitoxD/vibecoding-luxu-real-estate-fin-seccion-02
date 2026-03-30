'use client';

import { useState, useTransition } from 'react';
import { toggleFavorite } from '@/app/actions/profile';

interface FavoriteButtonProps {
  propertyId: string;
  initialFavorite?: boolean;
  isLoggedIn?: boolean;
}

export default function FavoriteButton({ 
  propertyId, 
  initialFavorite = false, 
  isLoggedIn = false 
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    // Optimistic update
    setIsFavorite((prev) => !prev);

    startTransition(async () => {
      try {
        await toggleFavorite(propertyId);
      } catch {
        // Revert on error
        setIsFavorite((prev) => !prev);
      }
    });
  };

  return (
    <button
      className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
        isPending ? 'opacity-60 scale-90' : 'scale-100'
      } ${
        isFavorite
          ? 'bg-mosque text-white shadow-lg'
          : 'bg-white/90 text-nordic hover:bg-mosque hover:text-white'
      }`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={isPending}
    >
      <span className="material-icons text-lg font-material-icons">
        {isFavorite ? 'favorite' : 'favorite_border'}
      </span>
    </button>
  );
}

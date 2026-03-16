'use client';

import { useState } from 'react';

export default function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <button
      className={`absolute top-3 right-3 p-2 rounded-full transition-colors z-10 ${
        isFavorite 
          ? 'bg-mosque text-white' 
          : 'bg-white/90 text-nordic hover:bg-mosque hover:text-white'
      }`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
      }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="material-icons text-lg font-material-icons">
        {isFavorite ? 'favorite' : 'favorite_border'}
      </span>
    </button>
  );
}

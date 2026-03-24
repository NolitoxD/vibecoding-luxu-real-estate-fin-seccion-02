'use client';

import { useState } from 'react';
import { Property } from '@/types/property';
import EditPropertyModal from './EditPropertyModal';
import DeletePropertyModal from './DeletePropertyModal';

export default function PropertyRowActions({ property }: { property: Property }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setIsEditOpen(true)}
        className="text-gray-400 hover:text-blue-600 transition-colors"
        title="Edit Property"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <button
        onClick={() => setIsDeleteOpen(true)}
        className="text-gray-400 hover:text-red-600 transition-colors"
        title="Delete Property"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {isEditOpen && (
        <EditPropertyModal
          property={property}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {isDeleteOpen && (
        <DeletePropertyModal
          propertyId={property.id}
          propertyTitle={property.title}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
}

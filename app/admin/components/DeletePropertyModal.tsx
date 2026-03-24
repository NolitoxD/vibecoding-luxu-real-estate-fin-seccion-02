'use client';

import { useState, useTransition } from 'react';
import { deleteProperty } from '@/lib/actions/admin';

export default function DeletePropertyModal({
  propertyId,
  propertyTitle,
  onClose,
}: {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleDelete = () => {
    setError('');
    startTransition(async () => {
      try {
        await deleteProperty(propertyId);
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error deleting property');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Property
          </h3>
          <p className="text-sm text-gray-500 break-words">
            Are you sure you want to delete <span className="font-semibold">{propertyTitle}</span>? This action cannot be undone.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

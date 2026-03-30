'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { reactivateProperty } from '@/lib/actions/admin';

export default function ReactivatePropertyModal({
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleReactivate = () => {
    setError('');
    startTransition(async () => {
      try {
        await reactivateProperty(propertyId);
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error reactivating property');
      }
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-left whitespace-normal">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Reactivate Property
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to reactivate <span className="font-semibold text-gray-900">{propertyTitle}</span>? 
            The property will become visible again in the public listing.
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
            onClick={handleReactivate}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPending ? 'Reactivating...' : 'Reactivate'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

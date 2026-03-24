'use client';

import { useState, useTransition } from 'react';
import { Property } from '@/types/property';
import { updateProperty } from '@/lib/actions/admin';

export default function EditPropertyModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  
  // Basic states for edit (could be expanded)
  const [price, setPrice] = useState(property.price);
  const [status, setStatus] = useState(property.status || 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      try {
        await updateProperty(property.id, {
          price,
          status: status as 'active' | 'pending' | 'sold',
        });
        onClose();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error updating property');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h3 className="text-xl font-semibold mb-4">Edit Property</h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              title="Title"
              type="text"
              value={property.title}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              title="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min={0}
              disabled={isPending}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              title="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'pending' | 'sold')}
              disabled={isPending}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="active">Active</option>
              <option value="pending">Pending Sale</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

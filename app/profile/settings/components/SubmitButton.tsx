'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
        pending 
          ? 'bg-nordic/20 text-nordic/50 cursor-not-allowed' 
          : 'bg-mosque hover:bg-[#005544] text-white shadow-md shadow-mosque/20 hover:shadow-lg hover:shadow-mosque/30'
      }`}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
          Saving...
        </span>
      ) : (
        label
      )}
    </button>
  );
}

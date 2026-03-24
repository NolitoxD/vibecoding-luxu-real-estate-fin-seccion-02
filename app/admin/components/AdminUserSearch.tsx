'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export default function AdminUserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (debouncedQuery !== currentQ) {
      router.push(`?${createQueryString('q', debouncedQuery)}`);
    }
  }, [debouncedQuery, router, createQueryString, searchParams]);

  return (
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <div className="relative flex-1 min-w-[250px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          title="Search users"
          placeholder="Search by name, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150 ease-in-out"
        />
      </div>
    </div>
  );
}

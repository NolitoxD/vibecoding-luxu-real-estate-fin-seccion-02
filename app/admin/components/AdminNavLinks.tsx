'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNavLinks() {
  const pathname = usePathname();

  const isUsers = pathname.includes('/admin/users');
  const isProperties = pathname === '/admin' || (pathname.startsWith('/admin/properties') && !isUsers);

  return (
    <>
      <Link 
        href="/admin" 
        className={`text-sm font-medium transition-colors ${isProperties ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-gray-900'}`}
      >
        Propiedades
      </Link>
      <Link 
        href="/admin/users" 
        className={`text-sm font-medium transition-colors ${isUsers ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-gray-900'}`}
      >
        Usuarios y Roles
      </Link>
    </>
  );
}

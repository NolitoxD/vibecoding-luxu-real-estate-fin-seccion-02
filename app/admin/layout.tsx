import Link from 'next/link';
import AdminNavLinks from './components/AdminNavLinks';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <nav className="flex space-x-6 items-center">
            <AdminNavLinks />
            <div className="h-4 w-px bg-gray-300"></div>
            <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Volver al sitio
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
}

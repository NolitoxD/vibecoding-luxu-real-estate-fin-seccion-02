import { createClient } from '@/lib/supabase/server';
import AdminPropertyFilters from './components/AdminPropertyFilters';
import AdminPropertySearch from './components/AdminPropertySearch';
import PropertyRowActions from './components/PropertyRowActions';
import Link from 'next/link';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AdminPropertiesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const status = searchParams?.status as string;
  const type = searchParams?.type as string;
  const price = searchParams?.price as string;
  const q = searchParams?.q as string;

  const ITEMS_PER_PAGE = 8;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const supabase = await createClient();

  // Fetch stats for top cards
  const { count: totalListings } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });
    
  // Support both 'status' column and fallback depending on data presence
  const { count: activeProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .eq('is_active', true);
    
  const { count: pendingSale } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .eq('is_active', true);

  // Fetch paginated and filtered properties
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' }) // Select all to easily pass to RowActions and get all fields
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('status', status);
  if (type) query = query.eq('type', type);
  if (price) query = query.lte('price', Number(price));
  if (q) query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%`);

  const { data: properties, count, error } = await query;

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error al cargar las propiedades: {error.message}</div>;
  }

  const totalPages = matchCountToPages(count || 0, ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">My Properties</h2>
          <p className="text-sm text-gray-500">Manage your portfolio and track performance.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <AdminPropertySearch />
          <AdminPropertyFilters />
          <Link href="/admin/properties/new" className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm whitespace-nowrap">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add New Property
          </Link>
        </div>
      </div>
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Listings</p>
            <p className="text-3xl font-bold text-gray-900">{totalListings || 0}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Properties</p>
            <p className="text-3xl font-bold text-gray-900">{activeProperties || 0}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Sale</p>
            <p className="text-3xl font-bold text-gray-900">{pendingSale || 0}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Property Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties?.map((property) => {
                const isInactive = property.is_active === false;
                return (
                <tr key={property.id} className={`hover:bg-gray-50 transition-colors${isInactive ? ' opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-24 relative rounded-lg overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518884-ce5882228d96?w=800&q=80'}
                          alt={property.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">{property.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{property.location}</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            {property.beds || 0} Beds
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            {property.baths || 0} Baths
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">${property.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-0.5 capitalize">{property.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isInactive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200 bg-red-50 text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Inactive
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700 capitalize">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          property.status === 'active' ? 'bg-green-500' : property.status === 'pending' ? 'bg-orange-500' : 'bg-gray-400'
                        }`}></span>
                        {property.status || 'Standard'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <PropertyRowActions property={property} />
                  </td>
                </tr>
                );
              })}
              {(!properties || properties.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg mb-2">No properties found</p>
                    <p className="text-sm">Try adjusting your filters or add a new property.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{from + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(to + 1, count || 0)}</span> of <span className="font-semibold text-gray-900">{count}</span> results
            </span>
            <div className="flex gap-2">
              <Link
                href={`?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ''}${type ? `&type=${type}` : ''}${price ? `&price=${price}` : ''}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md border ${page <= 1 ? 'border-gray-200 text-gray-400 pointer-events-none' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </Link>
              <Link
                href={`?page=${Math.min(totalPages, page + 1)}${status ? `&status=${status}` : ''}${type ? `&type=${type}` : ''}${price ? `&price=${price}` : ''}`}
                className={`px-3 py-1.5 text-sm font-medium rounded-md border ${page >= totalPages ? 'border-gray-200 text-gray-400 pointer-events-none' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function matchCountToPages(count: number, itemsPerPage: number) {
  return Math.ceil(count / itemsPerPage);
}

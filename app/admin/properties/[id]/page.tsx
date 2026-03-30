import { createClient } from '@/lib/supabase/server';
import PropertyForm from '../../components/PropertyForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddEditPropertyPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;
  const isNew = id === 'new';

  let property = undefined;

  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      notFound();
    }
    property = data;
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link className="hover:text-emerald-700 transition-colors" href="/admin">Properties</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-gray-900">{isNew ? 'Add New' : 'Edit Property'}</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
              {isNew ? 'Add New Property' : 'Edit Property'}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              {isNew 
                ? 'Fill in the details below to create a new listing. Fields marked with * are mandatory.' 
                : 'Update the property details below and save your changes.'}
            </p>
          </div>
        </div>
      </header>

      <PropertyForm property={property} />
    </div>
  );
}

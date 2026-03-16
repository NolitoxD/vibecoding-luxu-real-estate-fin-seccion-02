import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "../../../lib/supabase/server";
import { Property } from "../../../types/property";
import Navbar from "../../../components/Navbar";
import PropertyGallery from "../../../components/PropertyGallery";
import PropertyContactCard from "../../../components/PropertyContactCard";
import PropertyFeatures from "../../../components/PropertyFeatures";
import PropertyMapWrapper from "../../../components/PropertyMapWrapper";
import { getTranslation } from "../../../i18n/server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProperty(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug ?? data.id,
    title: data.title,
    location: data.location,
    price: Number(data.price),
    images: data.images || [],
    beds: data.beds,
    baths: Number(data.baths),
    sqft: data.sqft,
    garage: data.garage ?? 0,
    type: data.type as "sale" | "rent",
    is_new: data.is_new ?? false,
    created_at: data.created_at,
    is_featured: data.is_featured ?? false,
    description: data.description,
    amenities: data.amenities ?? [],
    lat: data.lat ? Number(data.lat) : undefined,
    lng: data.lng ? Number(data.lng) : undefined,
    agent: data.agent ?? undefined,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  const { t } = await getTranslation();

  if (!property)
    return { title: `${t("common.property_not_found")} | LuxeEstate` };

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return {
    title: `${property.title} — ${price} | LuxeEstate`,
    description:
      property.description ??
      `${property.beds} beds, ${property.baths} baths in ${property.location}`,
    openGraph: {
      title: property.title,
      description: property.description ?? "",
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);
  const { t } = await getTranslation();

  if (!property) notFound();

  return (
    <>
      <style>{`
        .leaflet-container { z-index: 0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left column: Gallery */}
          <div className="lg:col-span-8 space-y-4">
            <PropertyGallery
              images={property.images}
              title={property.title}
              isNew={property.is_new}
              type={property.type}
            />
          </div>

          {/* Right column: Contact card + Map (sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <PropertyContactCard property={property} />

              {property.lat && property.lng && (
                <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                  <PropertyMapWrapper
                    lat={property.lat}
                    lng={property.lng}
                    title={property.title}
                    location={property.location}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom-left: Features, Description, Amenities */}
          <div className="lg:col-span-8 lg:row-start-2">
            <PropertyFeatures property={property} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic/50">
            {t("common.footer_text")}
          </div>
          <div className="flex gap-6">
            <a
              className="text-nordic/40 hover:text-mosque transition-colors"
              href="#"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              className="text-nordic/40 hover:text-mosque transition-colors"
              href="#"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

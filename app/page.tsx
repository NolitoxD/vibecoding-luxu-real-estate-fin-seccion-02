import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollection from "@/components/FeaturedCollection";
import NewInMarket from "@/components/NewInMarket";
import { createClient } from "@/lib/supabase/server";
import { Property } from "@/types/property";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 8;

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    propertyType?: string;
    amenities?: string;
    type?: string;
    is_featured?: string;
    mode?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const {
    page,
    search,
    minPrice,
    maxPrice,
    beds,
    baths,
    propertyType,
    amenities,
    type,
    is_featured,
    mode,
  } = resolvedParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const activeMode = mode || "infinite";
  const from = activeMode === "pagination" ? (currentPage - 1) * PAGE_SIZE : 0;
  const to = activeMode === "pagination" ? from + PAGE_SIZE - 1 : PAGE_SIZE - 1;

  const isFiltered = Boolean(
    search ||
    minPrice ||
    maxPrice ||
    beds ||
    baths ||
    (propertyType && propertyType !== "Any Type") ||
    amenities ||
    type ||
    is_featured === "true",
  );

  const supabase = await createClient();

  let query = supabase.from("properties").select("*", { count: "exact" }).eq("is_active", true);

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
  }
  if (minPrice) {
    query = query.gte("price", parseFloat(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price", parseFloat(maxPrice));
  }
  if (beds) {
    query = query.gte("beds", parseInt(beds, 10));
  }
  if (baths) {
    query = query.gte("baths", parseFloat(baths));
  }
  if (propertyType && propertyType !== "Any Type") {
    query = query.ilike("title", `%${propertyType}%`);
  }
  if (amenities) {
    const amenitiesList = amenities.split(",");
    query = query.contains("amenities", amenitiesList);
  }
  if (type) {
    query = query.eq("type", type);
  }
  if (is_featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data: rows, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  // Map Supabase rows to our Property type
  const properties: Property[] = (rows ?? []).map((p) => ({
    id: p.id,
    slug: p.slug ?? p.id,
    title: p.title,
    location: p.location,
    price: Number(p.price),
    images: p.images || [],
    beds: p.beds,
    baths: Number(p.baths),
    sqft: p.sqft,
    garage: p.garage ?? 0,
    type: p.type as "sale" | "rent",
    is_new: p.is_new ?? false,
    created_at: p.created_at,
    is_featured: p.is_featured ?? false,
    description: p.description,
    amenities: p.amenities ?? [],
    lat: p.lat ? Number(p.lat) : undefined,
    lng: p.lng ? Number(p.lng) : undefined,
    agent: p.agent ?? undefined,
  }));

  // Create a plain object for searchParams to avoid Promise issues in Client Components
  const plainParams: Record<string, string> = {};
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (value) plainParams[key] = value;
  });

  return (
    <>
      <Navbar currentType={type} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Hero />
        {!isFiltered && <FeaturedCollection searchParams={plainParams} />}
        <NewInMarket
          properties={properties}
          totalCount={count ?? 0}
          searchParams={plainParams}
          currentPage={currentPage}
        />
      </main>
    </>
  );
}

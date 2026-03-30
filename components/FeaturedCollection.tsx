import Link from "next/link";
import { Collection } from "@/data/mockData";
import CollectionCard from "./ui/CollectionCard";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/i18n/server";

interface FeaturedCollectionProps {
  searchParams?: Record<string, string>;
}

const FeaturedCollection = async ({
  searchParams = {},
}: FeaturedCollectionProps) => {
  const supabase = await createClient();
  const { t } = await getTranslation();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(2);

  const collections: Collection[] = (properties || []).map((p) => ({
    id: p.id,
    slug: p.slug ?? p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    images: p.images || [],
    beds: p.beds,
    baths: p.baths,
    sqft: p.sqft,
    tag: p.is_new ? "New Arrival" : "Exclusive",
  }));

  const currentMode = searchParams.mode || "infinite";
  const targetMode = currentMode === "pagination" ? "infinite" : "pagination";
  const linkText =
    targetMode === "pagination" ? "Pagination View" : "Infinite View";

  const createLink = () => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", targetMode);
    return `/?${params.toString()}`;
  };

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic">
            {t("featured.title")}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t("featured.subtitle")}
          </p>
        </div>
        <Link
          href={createLink()}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
        >
          {linkText}{" "}
          <span className="material-icons text-sm font-material-icons">
            swap_horiz
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;

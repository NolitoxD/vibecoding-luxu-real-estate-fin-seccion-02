import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/i18n/server";
import PropertyCard from "@/components/ui/PropertyCard";
import { Property } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function SavedPropertiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { t } = await getTranslation();

  // Fetch saved properties joined with the property details
  const { data: savedProperties, error } = await supabase
    .from("saved_properties")
    .select(
      `
      property_id,
      properties (*)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const labels = {
    saleLabel: t("property_card.sale") || "Sale",
    rentLabel: t("property_card.rent") || "Rent",
    newLabel: t("property_card.new") || "New",
    perMonth: t("property_card.per_month") || "/mo",
  };

  const hasSavedProperties = savedProperties && savedProperties.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-nordic mb-6">
        {t("profile.saved") || "Saved Properties"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          Failed to load saved properties.
        </div>
      )}

      {!hasSavedProperties && !error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-nordic/10 rounded-2xl bg-nordic/5">
          <span className="material-icons text-6xl text-nordic/20 mb-4 font-material-icons">
            favorite_border
          </span>
          <h3 className="text-xl font-medium text-nordic mb-2">
            No saved properties yet
          </h3>
          <p className="text-nordic/60 max-w-md">
            Click the heart icon on any property to save it here for quick
            access later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(
            savedProperties as unknown as {
              property_id: string;
              properties: Property | Property[];
            }[]
          )?.map(({ properties }) => {
            const property = Array.isArray(properties)
              ? properties[0]
              : properties;
            if (!property) return null;
            return (
              <PropertyCard
                key={property.id}
                property={property}
                labels={labels}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

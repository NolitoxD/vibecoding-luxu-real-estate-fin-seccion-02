import { Property } from "../types/property";
import CollapsibleDescription from "./CollapsibleDescription";
import { getTranslation } from "@/i18n/server";

interface PropertyFeaturesProps {
  property: Property;
}

export default async function PropertyFeatures({
  property,
}: PropertyFeaturesProps) {
  const { t } = await getTranslation();
  const { sqft, beds, baths, garage, description, amenities, price, type } =
    property;

  // Mortgage estimate: 20% down, 6.5% rate, 30 years (Computed on Server)
  const monthlyPayment =
    type === "sale"
      ? Math.round(
          (price * 0.8 * (0.065 / 12) * Math.pow(1 + 0.065 / 12, 360)) /
            (Math.pow(1 + 0.065 / 12, 360) - 1),
        )
      : null;

  const features = [
    {
      icon: "square_foot",
      value: sqft,
      label: t("property_details.square_meters"),
    },
    { icon: "bed", value: beds, label: t("property_details.bedrooms") },
    { icon: "shower", value: baths, label: t("property_details.bathrooms") },
    {
      icon: "directions_car",
      value: garage ?? 0,
      label: t("property_details.garage"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Property Features grid */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
        <h2 className="text-lg font-semibold mb-6 text-nordic">
          {t("property_details.property_features")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10"
            >
              <span className="material-icons text-mosque text-2xl mb-2">
                {f.icon}
              </span>
              <span className="text-xl font-bold text-nordic">{f.value}</span>
              <span className="text-xs uppercase tracking-wider text-nordic/50 text-center mt-0.5">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible About Section */}
      {description && <CollapsibleDescription description={description} />}

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
          <h2 className="text-lg font-semibold mb-6 text-nordic">
            {t("property_details.amenities")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {amenities.map((a) => (
              <div key={a} className="flex items-center gap-3 text-nordic/70">
                <span className="material-icons text-mosque/70 text-sm">
                  check_circle
                </span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mortgage banner */}
      {monthlyPayment && (
        <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
              <span className="material-icons">calculate</span>
            </div>
            <div>
              <h3 className="font-semibold text-nordic">
                {t("property_details.estimated_payment")}
              </h3>
              <p className="text-sm text-nordic/60">
                {t("property_details.starting_from")}{" "}
                <strong className="text-mosque">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(monthlyPayment)}
                  {t("property_details.per_month")}
                </strong>{" "}
                {t("property_details.with_20_down")}
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic">
            {t("property_details.calculate_mortgage")}
          </button>
        </div>
      )}
    </div>
  );
}

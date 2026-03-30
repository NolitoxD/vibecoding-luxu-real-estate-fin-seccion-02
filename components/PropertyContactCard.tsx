import Image from "next/image";
import { Property } from "../types/property";
import { getTranslation } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";
import ScheduleVisitModal from "./ui/ScheduleVisitModal";

interface PropertyContactCardProps {
  property: Property;
}

export default async function PropertyContactCard({
  property,
}: PropertyContactCardProps) {
  const { t } = await getTranslation();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { price, location, type, agent } = property;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  const priceLabel =
    type === "rent"
      ? `${formattedPrice}${t("property_details.per_month")}`
      : formattedPrice;

  return (
    <div className="sticky top-28 space-y-4">
      {/* Price + agent card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
        <div className="mb-4">
          <h1 className="text-4xl font-light text-nordic mb-1">{priceLabel}</h1>
          <p className="text-nordic/60 font-medium flex items-center gap-1 text-sm">
            <span className="material-icons text-mosque text-sm">
              location_on
            </span>
            {location}
          </p>
        </div>

        <div className="h-px bg-slate-100 my-5" />

        {/* Agent */}
        {agent && (
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm relative flex-shrink-0">
              <Image
                src={agent.photo}
                alt={agent.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-nordic truncate">
                {agent.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                <span className="material-icons text-[14px]">star</span>
                <span>{agent.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                <span className="material-icons text-sm">chat</span>
              </button>
              <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                <span className="material-icons text-sm">call</span>
              </button>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="space-y-3">
          <ScheduleVisitModal
            propertyId={property.id}
            propertyTitle={property.title}
            isLoggedIn={!!user}
            label={t("property_details.schedule_visit")}
          />
          <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
            <span className="material-icons text-xl">mail_outline</span>
            {t("property_details.contact_agent")}
          </button>
        </div>
      </div>

      {/* Map placeholder — map is rendered in page.tsx below */}
    </div>
  );
}

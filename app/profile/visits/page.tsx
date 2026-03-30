import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/i18n/server";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { t } = await getTranslation();

  const { data: scheduledVisits, error } = await supabase
    .from("scheduled_visits")
    .select(
      `
      *,
      properties (*)
    `,
    )
    .eq("user_id", user.id)
    .order("visit_date", { ascending: true });

  const hasVisits = scheduledVisits && scheduledVisits.length > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-nordic mb-6">
        {t("profile.visits") || "Scheduled Visits"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          Failed to load scheduled visits.
        </div>
      )}

      {!hasVisits && !error ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-nordic/10 rounded-2xl bg-nordic/5">
            <span className="material-icons text-6xl text-nordic/20 mb-4 font-material-icons">
              event
            </span>
            <h3 className="text-xl font-medium text-nordic mb-2">
              No visits scheduled yet
            </h3>
            <p className="text-nordic/60 max-w-md mb-6">
              To schedule a visit, browse our properties and click{" "}
              <strong>&quot;Schedule Visit&quot;</strong> on any property you
              like.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-mosque hover:bg-[#005544] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="material-icons text-base font-material-icons">
                search
              </span>
              Browse Properties
            </Link>
          </div>

          {/* How it works */}
          <div className="bg-mosque/5 border border-mosque/10 rounded-xl p-5">
            <p className="text-sm font-semibold text-mosque mb-3 flex items-center gap-2">
              <span className="material-icons text-base font-material-icons">
                info
              </span>
              How to schedule a visit
            </p>
            <ol className="space-y-2 text-sm text-nordic/70">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-mosque text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  1
                </span>
                Go to any property listing
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-mosque text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  2
                </span>
                Click the <strong>&quot;Schedule Visit&quot;</strong> button on
                the property details page
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-mosque text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  3
                </span>
                Pick your preferred date and time — your visit will appear here
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledVisits?.map((visit) => {
            const property: Property = visit.properties;
            if (!property) return null;

            const visitDate = new Date(visit.visit_date).toLocaleDateString();

            return (
              <div
                key={visit.id}
                className="flex flex-col md:flex-row gap-4 p-4 border border-nordic/10 rounded-xl hover:shadow-md transition-shadow bg-white"
              >
                <Link
                  href={`/properties/${property.slug}`}
                  className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 group"
                >
                  <Image
                    src={
                      property.images?.[0] ||
                      "https://images.unsplash.com/photo-1560411833-28929e74281f?w=800&q=80"
                    }
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </Link>

                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="hover:text-mosque transition-colors"
                      >
                        <h3 className="font-semibold text-lg text-nordic">
                          {property.title}
                        </h3>
                      </Link>
                      {getStatusBadge(visit.status)}
                    </div>
                    <p className="text-nordic/60 text-sm flex items-center gap-1 mb-3">
                      <span className="material-icons text-sm font-material-icons">
                        location_on
                      </span>
                      {property.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-6 bg-nordic/5 p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-xs text-nordic/60 uppercase font-semibold">
                          Date
                        </span>
                        <span className="font-medium text-nordic flex items-center gap-1">
                          <span className="material-icons text-sm text-mosque font-material-icons">
                            calendar_today
                          </span>
                          {visitDate}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-nordic/10"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-nordic/60 uppercase font-semibold">
                          Time
                        </span>
                        <span className="font-medium text-nordic flex items-center gap-1">
                          <span className="material-icons text-sm text-mosque font-material-icons">
                            schedule
                          </span>
                          {visit.visit_time}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/properties/${property.slug}`}
                      className="text-sm text-mosque hover:text-[#005544] font-medium flex items-center gap-1 transition-colors"
                    >
                      <span className="material-icons text-base font-material-icons">
                        open_in_new
                      </span>
                      View property
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

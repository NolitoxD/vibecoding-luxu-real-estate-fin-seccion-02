import { Property } from "@/types/property";
import PropertyCard from "./ui/PropertyCard";
import Link from "next/link";
import { getTranslation } from "@/i18n/server";

interface PaginatedPropertiesProps {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  searchParams: Record<string, string>;
}

const PAGE_SIZE = 8;

export default async function PaginatedProperties({
  properties,
  totalCount,
  currentPage,
  searchParams,
}: PaginatedPropertiesProps) {
  const { t } = await getTranslation();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const cardLabels = {
    saleLabel: t("property_card.sale"),
    rentLabel: t("property_card.rent"),
    newLabel: t("property_card.new"),
    perMonth: t("property_details.per_month"),
  };

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    params.set("mode", "pagination");
    return `/?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            labels={cardLabels}
          />
        ))}
      </div>

      {properties.length === 0 && (
        <p className="text-center text-nordic-muted text-sm py-8 border-t border-nordic/5">
          {t("common.error")}
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 p-8">
          <Link
            href={createPageUrl(Math.max(1, currentPage - 1))}
            className={`px-4 py-2 border border-nordic/20 rounded-md text-sm font-medium transition-colors ${
              currentPage === 1
                ? "opacity-50 pointer-events-none"
                : "hover:bg-nordic/5 text-nordic"
            }`}
          >
            {t("common.previous")}
          </Link>

          <div className="flex items-center gap-1 mx-2">
            {visiblePages.map((page) => (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-nordic text-white border border-nordic"
                    : "border border-nordic/20 hover:bg-nordic/5 text-nordic"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>

          <Link
            href={createPageUrl(Math.min(totalPages, currentPage + 1))}
            className={`px-4 py-2 border border-nordic/20 rounded-md text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "opacity-50 pointer-events-none"
                : "hover:bg-nordic/5 text-nordic"
            }`}
          >
            {t("common.next")}
          </Link>
        </div>
      )}
    </div>
  );
}

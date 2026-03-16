import { Property } from "@/types/property";
import InfiniteProperties from "./InfiniteProperties";
import PaginatedProperties from "./PaginatedProperties";
import Link from "next/link";
import { getTranslation } from "@/i18n/server";

interface NewInMarketProps {
  properties: Property[];
  totalCount: number;
  searchParams: Record<string, string>;
  currentPage: number;
}

const NewInMarket = async ({
  properties,
  totalCount,
  searchParams,
  currentPage,
}: NewInMarketProps) => {
  const { t } = await getTranslation();
  const currentType = searchParams.type;
  const mode = searchParams.mode || "infinite";

  const getChipClass = (type?: string) => {
    const isActive = currentType === type;
    return isActive
      ? "px-4 py-1.5 rounded-md text-sm font-medium bg-nordic text-white shadow-sm transition-all"
      : "px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic transition-all";
  };

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return `/?${params.toString()}`;
  };

  const cardLabels = {
    saleLabel: t("property_card.sale"),
    rentLabel: t("property_card.rent"),
    newLabel: t("property_card.new"),
    perMonth: t("property_details.per_month"),
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic">
            {t("new_market.title")}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t("new_market.subtitle")}
          </p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg border border-nordic/5 shadow-sm">
          <Link
            href={createQueryString("type", "")}
            className={getChipClass(undefined)}
          >
            {t("navbar.all")}
          </Link>
          <Link
            href={createQueryString("type", "sale")}
            className={getChipClass("sale")}
          >
            {t("navbar.buy")}
          </Link>
          <Link
            href={createQueryString("type", "rent")}
            className={getChipClass("rent")}
          >
            {t("navbar.rent")}
          </Link>
        </div>
      </div>

      {mode === "pagination" ? (
        <PaginatedProperties
          properties={properties}
          totalCount={totalCount}
          searchParams={searchParams}
          currentPage={currentPage}
        />
      ) : (
        <InfiniteProperties
          initialProperties={properties}
          totalCount={totalCount}
          searchParams={searchParams}
          translations={{
            loading: t("common.loading"),
            endOfList: t("common.end_of_list"),
            cardLabels,
          }}
        />
      )}
    </section>
  );
};

export default NewInMarket;

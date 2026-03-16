"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/context";

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchFilterModal = ({ isOpen, onClose }: SearchFilterModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // State for all filters
  const [location, setLocation] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(
    parseInt(searchParams.get("minPrice") || "0", 10),
  );
  const [maxPrice, setMaxPrice] = useState(
    parseInt(searchParams.get("maxPrice") || "10000000", 10),
  );
  const [beds, setBeds] = useState(
    parseInt(searchParams.get("beds") || "0", 10),
  );
  const [baths, setBaths] = useState(
    parseInt(searchParams.get("baths") || "0", 10),
  );
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") || "Any Type",
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  );

  // Keep track of the previous isOpen to reset state when it opens without a cascading render
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Sync state with URL params when modal opens
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setLocation(searchParams.get("search") || "");
      setMinPrice(parseInt(searchParams.get("minPrice") || "0", 10));
      setMaxPrice(parseInt(searchParams.get("maxPrice") || "10000000", 10));
      setBeds(parseInt(searchParams.get("beds") || "0", 10));
      setBaths(parseInt(searchParams.get("baths") || "0", 10));
      setPropertyType(searchParams.get("propertyType") || "Any Type");
      setSelectedAmenities(
        searchParams.get("amenities")?.split(",").filter(Boolean) || [],
      );
    }
  }

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (location) params.set("search", location);
    else params.delete("search");
    if (minPrice > 0) params.set("minPrice", minPrice.toString());
    else params.delete("minPrice");
    if (maxPrice < 10000000) params.set("maxPrice", maxPrice.toString());
    else params.delete("maxPrice");
    if (beds > 0) params.set("beds", beds.toString());
    else params.delete("beds");
    if (baths > 0) params.set("baths", baths.toString());
    else params.delete("baths");
    if (propertyType !== "Any Type") params.set("propertyType", propertyType);
    else params.delete("propertyType");
    if (selectedAmenities.length > 0)
      params.set("amenities", selectedAmenities.join(","));
    else params.delete("amenities");

    params.delete("page"); // Reset to first page
    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClearFilters = () => {
    setLocation("");
    setMinPrice(0);
    setMaxPrice(10000000);
    setBeds(0);
    setBaths(0);
    setPropertyType("Any Type");
    setSelectedAmenities([]);
    router.push("/");
    onClose();
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  };

  if (!isOpen) return null;

  // Max range for slider slider
  const PRICE_LIMIT = 10000000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-nordic/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <main className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <h1 className="text-2xl font-semibold tracking-tight text-nordic">
            {t("search_filter.title")}
          </h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-nordic-muted"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scroll p-8 space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-3">
              {t("search_filter.location")}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-nordic-muted group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-clear-day border-0 rounded-xl text-nordic placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm"
                placeholder={t("search_filter.location_placeholder")}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                {t("search_filter.price_range")}
              </label>
              <span className="text-sm font-medium text-mosque">
                ${(minPrice / 1000000).toFixed(1)}M – $
                {(maxPrice / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="relative h-12 flex items-center mb-6 px-2">
              {/* Dual Range Slider */}
              <div className="absolute w-full h-1 bg-gray-200 rounded-full">
                <div
                  className="absolute h-full bg-mosque"
                  style={{
                    left: `${(minPrice / PRICE_LIMIT) * 100}%`,
                    right: `${100 - (maxPrice / PRICE_LIMIT) * 100}%`,
                  }}
                ></div>
              </div>
              <input
                title="min price slider"
                type="range"
                min="0"
                max={PRICE_LIMIT}
                step="50000"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(
                    Math.min(parseInt(e.target.value), maxPrice - 50000),
                  )
                }
                className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-mosque [&::-moz-range-thumb]:shadow-md"
              />
              <input
                title="max price slider"
                type="range"
                min="0"
                max={PRICE_LIMIT}
                step="50000"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Math.max(parseInt(e.target.value), minPrice + 50000),
                  )
                }
                className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-mosque [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-mosque [&::-moz-range-thumb]:shadow-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-clear-day p-3 rounded-xl border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">
                  {t("search_filter.min_price")}
                </label>
                <div className="flex items-center">
                  <span className="text-nordic-muted mr-1">$</span>
                  <input
                    title="min price input"
                    className="w-full bg-transparent border-0 p-0 text-nordic font-medium focus:ring-0 text-sm"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="bg-clear-day p-3 rounded-xl border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">
                  {t("search_filter.max_price")}
                </label>
                <div className="flex items-center">
                  <span className="text-nordic-muted mr-1">$</span>
                  <input
                    title="max price input"
                    className="w-full bg-transparent border-0 p-0 text-nordic font-medium focus:ring-0 text-sm"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                {t("search_filter.property_type")}
              </label>
              <div className="relative">
                <select
                  className="w-full bg-clear-day border-0 rounded-xl py-3 pl-4 pr-10 text-nordic appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  aria-label={t("search_filter.property_type")}
                  title={t("search_filter.property_type")}
                >
                  <option value="Any Type">
                    {t("search_filter.any_type")}
                  </option>
                  <option value="House">{t("search_filter.house")}</option>
                  <option value="Apartment">
                    {t("search_filter.apartment")}
                  </option>
                  <option value="Condo">{t("search_filter.condo")}</option>
                  <option value="Townhouse">
                    {t("search_filter.townhouse")}
                  </option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-nordic-muted pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic">
                  {t("search_filter.bedrooms")}
                </span>
                <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                  <button
                    onClick={() => setBeds(Math.max(0, beds - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {beds}+
                  </span>
                  <button
                    onClick={() => setBeds(beds + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-nordic">
                  {t("search_filter.bathrooms")}
                </span>
                <div className="flex items-center space-x-3 bg-clear-day rounded-full p-1">
                  <button
                    onClick={() => setBaths(Math.max(0, baths - 1))}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-nordic-muted hover:text-mosque transition-colors"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {baths}+
                  </span>
                  <button
                    onClick={() => setBaths(baths + 1)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-4">
              {t("search_filter.amenities")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  id: "Swimming Pool",
                  name: t("search_filter.swimming_pool"),
                  icon: "pool",
                },
                {
                  id: "Gym",
                  name: t("search_filter.gym"),
                  icon: "fitness_center",
                },
                {
                  id: "Parking",
                  name: t("search_filter.parking"),
                  icon: "local_parking",
                },
                {
                  id: "Air Conditioning",
                  name: t("search_filter.air_conditioning"),
                  icon: "ac_unit",
                },
                {
                  id: "High-speed Wifi",
                  name: t("search_filter.high_speed_wifi"),
                  icon: "wifi",
                },
                {
                  id: "Patio / Terrace",
                  name: t("search_filter.patio_terrace"),
                  icon: "deck",
                },
              ].map((amenity) => (
                <label
                  key={amenity.id}
                  className="cursor-pointer group relative"
                >
                  <input
                    className="peer sr-only"
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                  />
                  <div className="h-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-nordic-muted text-sm flex items-center justify-center gap-2 transition-all hover:border-mosque/50 peer-checked:border-mosque peer-checked:bg-mosque/5 peer-checked:text-mosque font-medium">
                    <span className="material-icons text-lg text-nordic-muted group-hover:text-nordic peer-checked:text-mosque">
                      {amenity.icon}
                    </span>
                    {amenity.name}
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-nordic-muted hover:text-nordic transition-colors underline decoration-gray-300 underline-offset-4"
          >
            {t("search_filter.clear_all")}
          </button>
          <button
            onClick={handleApplyFilters}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
          >
            {t("search_filter.show_homes")}
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
};

export default SearchFilterModal;

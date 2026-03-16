"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchFilterModal from "./SearchFilterModal";
import { useTranslation } from "@/i18n/context";

const Hero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  const currentPropertyType = searchParams.get("propertyType") || "Any Type";

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to first page
    router.push(`/?${params.toString()}`);
  };

  const handleQuickFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "Any Type") {
      params.delete("propertyType");
      params.delete("search");
      setSearchQuery("");
    } else {
      params.set("propertyType", type);
    }
    params.delete("page"); // Reset to first page
    router.push(`/?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const categories = [
    { name: t("hero.filter_all"), value: "Any Type" },
    { name: t("hero.filter_house"), value: "House" },
    { name: t("hero.filter_apartment"), value: "Apartment" },
    { name: t("hero.filter_villa"), value: "Villa" },
    { name: t("hero.filter_penthouse"), value: "Penthouse" },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic leading-tight">
          {t("hero.title_base")}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">
              {t("hero.title_highlight")}
            </span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          {t("hero.title_punctuation")}
        </h1>

        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors font-material-icons">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
            placeholder={t("hero.search_placeholder")}
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
          >
            {t("hero.search_button")}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleQuickFilter(cat.value)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                currentPropertyType === cat.value
                  ? "bg-nordic text-white shadow-lg shadow-nordic/10 hover:-translate-y-0.5"
                  : "bg-white border border-nordic/5 text-nordic-muted hover:text-nordic hover:border-mosque/50 hover:bg-mosque/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
          <div className="w-px h-6 bg-nordic/10 mx-2"></div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic font-medium text-sm hover:bg-black/5 transition-colors"
          >
            <span className="material-icons text-base font-material-icons">
              tune
            </span>{" "}
            {t("hero.filters_button")}
          </button>
        </div>
      </div>

      <SearchFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Hero;

"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "@/i18n/context";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  isNew: boolean;
  type: "sale" | "rent";
}

export default function PropertyGallery({
  images,
  title,
  isNew,
  type,
}: PropertyGalleryProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const imageLabels = [
    t("property_details.exterior"),
    t("property_details.living_room"),
    t("property_details.kitchen"),
    t("property_details.master_bedroom"),
    t("property_details.terrace"),
    t("property_details.garden"),
  ];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
        <Image
          src={images[activeIndex]}
          alt={`${title} - ${imageLabels[activeIndex] ?? t("property_details.photo")}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            {type === "sale"
              ? t("property_details.for_sale")
              : t("property_details.for_rent")}
          </span>
          {isNew && (
            <span className="bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              {t("property_details.new")}
            </span>
          )}
        </div>

        {/* Photo count */}
        <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2 z-10">
          <span className="material-icons text-sm">grid_view</span>
          {images.length} {t("property_details.photos")}
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer transition-all snap-start relative ${
                i === activeIndex
                  ? "ring-2 ring-mosque ring-offset-2 ring-offset-clear-day opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={
                  imageLabels[i] ?? `${t("property_details.photo")} ${i + 1}`
                }
                fill
                className="object-cover"
                sizes="192px"
              />
              <div className="absolute bottom-1 left-2 text-white text-xs font-medium drop-shadow">
                {imageLabels[i] ?? `${t("property_details.photo")} ${i + 1}`}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

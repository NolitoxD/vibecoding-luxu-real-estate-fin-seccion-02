"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/context";

interface CollapsibleDescriptionProps {
  description: string;
}

export default function CollapsibleDescription({
  description,
}: CollapsibleDescriptionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const maxLength = 220;

  const isLong = description.length > maxLength;
  const displayedText = expanded
    ? description
    : description.slice(0, maxLength);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
      <h2 className="text-lg font-semibold mb-4 text-nordic">
        {t("property_details.about_home")}
      </h2>
      <div className="text-nordic/70 leading-relaxed font-light">
        <p>
          {displayedText}
          {!expanded && isLong && "..."}
        </p>
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
        >
          {expanded
            ? t("property_details.show_less")
            : t("property_details.read_more")}
          <span className="material-icons text-sm">
            {expanded ? "expand_less" : "arrow_forward"}
          </span>
        </button>
      )}
    </div>
  );
}

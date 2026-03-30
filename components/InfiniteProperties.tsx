"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import PropertyCard, { PropertyCardLabels } from "./ui/PropertyCard";
import { Property } from "@/types/property";

interface InfinitePropertiesTranslations {
  loading: string;
  endOfList: string;
  cardLabels: PropertyCardLabels;
}

interface InfinitePropertiesProps {
  initialProperties: Property[];
  totalCount: number;
  searchParams: Record<string, string>;
  translations: InfinitePropertiesTranslations;
  savedPropertyIds?: string[];
  isLoggedIn?: boolean;
}

const PAGE_SIZE = 8;

export default function InfiniteProperties({
  initialProperties,
  totalCount,
  searchParams,
  translations,
  savedPropertyIds = [],
  isLoggedIn = false,
}: InfinitePropertiesProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loadedCount, setLoadedCount] = useState(initialProperties.length);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProperties.length < totalCount);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  useEffect(() => {
    setProperties(initialProperties);
    setLoadedCount(initialProperties.length);
    setHasMore(initialProperties.length < totalCount);
  }, [initialProperties, totalCount]);

  const loadMoreProperties = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const from = loadedCount;
    const to = from + PAGE_SIZE - 1;

    const query = new URLSearchParams(searchParams);
    query.set("from", from.toString());
    query.set("to", to.toString());

    try {
      const response = await fetch(`/api/properties?${query.toString()}`);
      const data = await response.json();

      if (data.properties) {
        const newProperties = data.properties;
        setProperties((prev) => {
          const combined = [...prev, ...newProperties];
          const unique = Array.from(
            new Map(combined.map((p) => [p.id, p])).values(),
          );
          return unique;
        });
        setLoadedCount((prev) => prev + newProperties.length);
        setHasMore(
          loadedCount + newProperties.length < (data.totalCount ?? totalCount),
        );
      }
    } catch (error) {
      console.error("Error loading more properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, loadedCount, searchParams, totalCount]);

  useEffect(() => {
    if (inView) {
      loadMoreProperties();
    }
  }, [inView, loadMoreProperties]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            labels={translations.cardLabels}
            isFavorite={savedPropertyIds.includes(property.id)}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center p-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-nordic-muted">
              <span className="material-icons animate-spin text-lg font-material-icons">
                autorenew
              </span>
              <span>{translations.loading}</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && properties.length > 0 && (
        <p className="text-center text-nordic-muted text-sm py-8 border-t border-nordic/5">
          {translations.endOfList}
        </p>
      )}
    </div>
  );
}

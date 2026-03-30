import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import FavoriteButton from "./FavoriteButton";

export interface PropertyCardLabels {
  saleLabel: string;
  rentLabel: string;
  newLabel: string;
  perMonth: string;
}

interface PropertyCardProps {
  property: Property;
  labels: PropertyCardLabels;
  isFavorite?: boolean;
  isLoggedIn?: boolean;
}

export default function PropertyCard({ property, labels, isFavorite, isLoggedIn }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.slug}`} className="block h-full">
      <article className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={
              property.images[0] ||
              "https://images.unsplash.com/photo-1560411833-28929e74281f?w=800&q=80"
            }
            alt={property.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          <FavoriteButton 
            propertyId={property.id}
            initialFavorite={isFavorite}
            isLoggedIn={isLoggedIn}
          />

          {/* Type Tag */}
          <div
            className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${property.type === "sale" ? "bg-nordic/90" : "bg-mosque/90"}`}
          >
            {property.type === "sale" ? labels.saleLabel : labels.rentLabel}
          </div>

          {/* New badge */}
          {property.is_new && (
            <div className="absolute top-3 left-3 bg-white/90 text-nordic text-xs font-bold px-2 py-1 rounded">
              {labels.newLabel}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col grow">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-bold text-lg text-nordic">
              ${property.price.toLocaleString("en-US")}
              {property.type === "rent" && (
                <span className="text-sm font-normal text-nordic-muted">
                  {labels.perMonth}
                </span>
              )}
            </h3>
          </div>

          <h4 className="text-nordic font-medium truncate mb-1">
            {property.title}
          </h4>
          <p className="text-nordic-muted text-xs mb-4">{property.location}</p>

          {/* Footer Features */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-nordic-muted text-xs">
              <span className="material-icons text-sm text-mosque/80 font-material-icons">
                king_bed
              </span>{" "}
              {property.beds}
            </div>
            <div className="flex items-center gap-1 text-nordic-muted text-xs">
              <span className="material-icons text-sm text-mosque/80 font-material-icons">
                bathtub
              </span>{" "}
              {property.baths}
            </div>
            <div className="flex items-center gap-1 text-nordic-muted text-xs">
              <span className="material-icons text-sm text-mosque/80 font-material-icons">
                square_foot
              </span>{" "}
              {property.sqft}m²
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

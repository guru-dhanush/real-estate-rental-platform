import { Bath, Bed, Heart, Home, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-5 border border-gray-100">
      {/* Image with overlays */}
      <div className="relative h-100 w-full">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover"
          onError={() => setImgSrc("/placeholder.jpg")}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Top overlay: Price and favorite */}
        <div className="absolute top-3 left-3 flex items-center justify-between w-[calc(100%-1.5rem)]">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
            <p className="text-sm font-bold text-gray-900">
              ${property.pricePerMonth.toFixed(0)}
              <span className="text-gray-600 text-xs font-medium"> /month</span>
            </p>
          </div>

          {showFavoriteButton && (
            <button
              className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-1 shadow-sm transition-all duration-200"
              onClick={onFavoriteToggle}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
              />
            </button>
          )}
        </div>

        {/* Bottom overlay: Condensed content */}
        <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-xl space-y-1.5 text-white">
            {/* Property Name */}
            <h2 className="text-sm font-semibold line-clamp-1">
              {propertyLink ? (
                <Link href={propertyLink} scroll={false}>
                  <span className="hover:text-blue-300 transition-colors">
                    {property.name}
                  </span>
                </Link>
              ) : (
                property.name
              )}
            </h2>

            {/* Location */}
            <div className="flex items-center text-xs opacity-90">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">
                {property?.location?.address}, {property?.location?.city}
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-1 flex-wrap text-[10px] font-medium">
              {property.isPetsAllowed && (
                <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full border border-white/30">
                  Pets Allowed
                </span>
              )}
              {property.isParkingIncluded && (
                <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full border border-white/30">
                  Parking
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center text-xs">
              <div className="bg-yellow-500/20 rounded-full px-2 py-0.5 flex items-center text-white">
                <Star className="w-3 h-3 text-yellow-300 mr-1" />
                <span className="font-medium">{property.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-white/70 text-[10px] ml-2">
                ({property.numberOfReviews} reviews)
              </span>
            </div>

            {/* Features */}
            <div className="flex justify-between items-center gap-2 text-xs pt-2 border-t border-white/20">
              <div className="flex items-center">
                <Bed className="w-3 h-3 mr-1 text-white/70" />
                <span className="font-medium">{property.beds}</span>
                <span className="ml-1 text-[10px]">Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-3 h-3 mr-1 text-white/70" />
                <span className="font-medium">{property.baths}</span>
                <span className="ml-1 text-[10px]">Baths</span>
              </div>
              <div className="flex items-center">
                <Home className="w-3 h-3 mr-1 text-white/70" />
                <span className="font-medium">{property.squareFeet}</span>
                <span className="ml-1 text-[10px]">sq ft</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Card;

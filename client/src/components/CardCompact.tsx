import { Bath, Bed, Car, Heart, Home, MapPin, PawPrint, Square, Star } from "lucide-react";
import { LEGACY_PROPERTY_TYPES, AmenityIcons, HighlightIcons, PropertyTypeIcons } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CardCompact = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );
  const isLegacyProperty = LEGACY_PROPERTY_TYPES.includes(property.propertyType)

  return (
    <div className="bg-white w-max-[500px] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex h-40 mb-5 border border-gray-100">
      {/* Image Section */}
      <div className="relative w-1/3 overflow-hidden group">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
        />

        {/* Feature Tags */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          {property.isPetsAllowed && (
            <div className="flex items-center text-xs opacity-90">
              <PawPrint />
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full border border-white/30">
                Pets Allowed
              </span>
            </div>
          )}
          {property.isParkingIncluded && (
            <div className="flex items-center text-xs opacity-90">
              <Car />
              <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full border border-white/30">
                Parking
              </span>
            </div>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
          <p className="text-sm font-bold text-gray-900">
            ${property.pricePerMonth.toFixed(0)}
            <span className="text-gray-600 text-xs font-medium"> /mo</span>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold mb-1 line-clamp-1">
              {propertyLink ? (
                <Link
                  href={propertyLink}
                  className="hover:text-[#004B93] transition-colors duration-200"
                  scroll={false}
                >
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>
            {showFavoriteButton && (
              <button
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
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

          {/* Description (limited characters, CSS truncated) */}
          {property.description && (
            <p className="text-xs text-gray-600 line-clamp-2 max-h-[2.6em] overflow-hidden mb-1">
              {property.description}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs mb-1">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <p className="truncate">
              {property?.location?.address}, {property?.location?.city}
            </p>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-3 text-xs">
          {isLegacyProperty ? (
            <>
              <div className="flex items-center text-gray-700">
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                  <Bed className="w-3 h-3 text-gray-500 mr-1" />
                  <span className="font-medium">{property.beds}</span>
                  <span className="ml-1 text-[10px]">Beds</span>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                  <Bath className="w-3 h-3 text-gray-500 mr-1" />
                  <span className="font-medium">{property.baths}</span>
                  <span className="ml-1 text-[10px]">Baths</span>
                </div>
              </div>
            </>
          ) : null}
          {/* Property Type Icon and Label (matching Card) */}
          <div className="flex items-center text-gray-700">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <span className="font-medium">{property.squareFeet}</span>
              <span className="ml-1 text-[10px]">sq ft</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardCompact;

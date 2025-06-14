import { Bath, Bed, Heart, MapPin, Square, Star } from "lucide-react";
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
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
              Parking
            </span>
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
                  className="hover:text-blue-600 transition-colors duration-200"
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
                  className={`w-4 h-4 ${
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs mb-1">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <p className="truncate">
              {property?.location?.address}, {property?.location?.city}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center">
            <div className="bg-yellow-50 rounded-full px-2 py-0.5 flex items-center">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="font-semibold text-xs">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 text-xs ml-1">
              ({property.numberOfReviews})
            </span>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center text-gray-700">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <Bed className="w-3 h-3 text-gray-500 mr-1" />
              <span className="font-medium">{property.beds}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <Bath className="w-3 h-3 text-gray-500 mr-1" />
              <span className="font-medium">{property.baths}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
              <Square className="w-3 h-3 text-gray-500 mr-1" />
              <span className="font-medium">{property.squareFeet}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;

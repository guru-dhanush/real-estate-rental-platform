import { Bath, Bed, Car, Heart, Home, MapPin, PawPrint, Star, ChevronDown, ChevronUp, MapPinned } from "lucide-react";
import { LEGACY_PROPERTY_TYPES, AmenityIcons, HighlightIcons, PropertyTypeIcons } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
  className,
  defaultExpanded = false
}: CardProps & { defaultExpanded?: boolean }) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg"
  );
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isLegacyProperty = LEGACY_PROPERTY_TYPES.includes(property.propertyType);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])


  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-5 border border-gray-100  ${className} `} >
      {/* Image with overlays */}
      <div className={`relative ${className}`}>
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

        {/* Bottom overlay: Expandable content */}
        <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-xl space-y-1.5 text-white">
            {/* Always visible: Property Name and Expand/Collapse button */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold line-clamp-1 flex-1">
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
              <button
                onClick={toggleExpanded}
                className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Always visible: Basic info */}
            <div className="flex items-center justify-between text-xs opacity-90">
              <div className="flex items-center">
                <MapPinned className="w-3 h-3 mr-1" />
                <span className="truncate">
                  {property?.location?.city}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  {PropertyTypeIcons[property.propertyType as keyof typeof PropertyTypeIcons] ? (
                    React.createElement(PropertyTypeIcons[property.propertyType as keyof typeof PropertyTypeIcons], {
                      className: "w-3 h-3 mr-1 text-white/70"
                    })
                  ) : (
                    <Home className="w-3 h-3 mr-1 text-white/70" />
                  )}
                  <span className="text-white/80 font-medium">{property.propertyType}</span>
                </div>
                <div className="flex items-center">
                  <Home className="w-3 h-3 mr-1 text-white/70" />
                  <span className="text-white/80 font-medium">{property.squareFeet}</span>
                  <span className="ml-0.5 text-white/60 text-[10px]">sq ft</span>
                </div>
              </div>
            </div>

            {/* Expandable content */}
            {isExpanded && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                {/* Full Description */}
                {property.description && (
                  <p className="text-xs text-white/60 line-clamp-3">
                    {property.description}
                  </p>
                )}

                {/* Full Location */}
                <div className="flex items-center text-xs opacity-90">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">
                    {property?.location?.address}, {property?.location?.city}
                  </span>
                </div>

                {/* Features */}
                <div className="flex justify-between items-center gap-2 text-xs pt-2 border-t border-white/20">
                  {isLegacyProperty ? (
                    <>
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
                    </>
                  ) : (
                    <>
                    </>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div >
  );
};

export default Card;
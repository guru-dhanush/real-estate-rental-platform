import { Bath, Bed, Car, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Heart, Home, MapPin, MapPinned, PawPrint, Star } from "lucide-react";
import { LEGACY_PROPERTY_TYPES, AmenityIcons, HighlightIcons, PropertyTypeIcons } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
  className,
  defaultExpanded = false
}: CardProps & { defaultExpanded?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Enhanced Embla configuration for smooth transitions
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25, // Smooth transition duration (lower = faster)
    dragFree: false,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    skipSnaps: false,
    inViewThreshold: 0.7
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
  const isLegacyProperty = LEGACY_PROPERTY_TYPES.includes(property.propertyType);

  // Initialize loading states for all images
  useEffect(() => {
    const urls = property.photoUrls?.length ? property.photoUrls : ['/images/chat/chat.jpg'];
    setLoadingStates(Array(urls.length).fill(true));
  }, [property.photoUrls]);

  const handleImageLoad = (index: number) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const fallback = target.parentElement?.querySelector('[data-fallback]') as HTMLElement;
    if (fallback) {
      target.style.display = 'none';
      fallback.style.display = 'flex';
    } else {
      target.src = '/images/chat/chat.jpg';
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-5 border border-gray-100  ${className} `} >
      {/* Image slider with overlays */}
      <div className={`relative aspect-video ${className}`}>
        <div className="overflow-hidden rounded-t-2xl h-full" ref={emblaRef}>
          {/* Enhanced container with smooth transitions */}
          <div className="flex h-full transition-transform duration-500 ease-out">
            {(property.photoUrls && property.photoUrls.length > 0 ? property.photoUrls : ['/images/chat/chat.jpg']).map((url, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                {/* Loading Skeleton */}
                {loadingStates[index] && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-t-2xl" />
                )}

                {/* Actual Image */}
                <Image
                  src={url}
                  alt={`${property.name} - ${index + 1}`}
                  fill
                  className={`object-cover transition-opacity duration-300 ease-in-out ${loadingStates[index] ? 'opacity-0' : 'opacity-100'
                    }`}
                  onLoad={() => handleImageLoad(index)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/chat/chat.jpg';
                    handleImageLoad(index);
                  }}
                  priority={index === 0}
                />

                {/* Fallback for broken images */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hidden" data-fallback>
                  <Home className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider navigation dots with smooth transitions */}
        {(property.photoUrls?.length || 1) > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo(index);
                }}
                className={`rounded-full transition-all duration-300 ease-out ${index === selectedIndex
                  ? 'bg-white w-4 h-2 shadow-lg'
                  : 'bg-white/50 w-2 h-2 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation arrows with enhanced styling */}
        {(property.photoUrls?.length || 1) > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-all duration-200 z-10 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (emblaApi) {
                  emblaApi.scrollPrev();
                }
              }}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-all duration-200 z-10 hover:scale-110 active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (emblaApi) {
                  emblaApi.scrollNext();
                }
              }}
              aria-label="Next image"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

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
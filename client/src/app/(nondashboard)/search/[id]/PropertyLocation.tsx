"use client";
import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import React, { useEffect, useRef } from "react";

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (isLoading || isError || !property || !mapContainerRef.current) return;

    // Initialize the map
    const map = new google.maps.Map(mapContainerRef.current, {
      center: {
        lat: property.location.coordinates.latitude,
        lng: property.location.coordinates.longitude,
      },
      zoom: 14,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "labels.text.fill",
          stylers: [{ color: "#444444" }],
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ color: "#f2f2f2" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }, { lightness: 45 }],
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [{ visibility: "simplified" }],
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#c9e4f7" }, { visibility: "on" }],
        },
      ],
      zoomControl: false,
      // streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });
    mapRef.current = map;

    const markerIcon = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg height="256px" width="256px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-40.33 -40.33 584.78 584.78" xml:space="preserve" fill="#000000" transform="rotate(0)" stroke="#000000" stroke-width="0.00504123"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.008246"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#0CC18E;" d="M429.064,177.018C429.064,79.258,349.822,0,252.054,0C154.301,0,75.059,79.258,75.059,177.018 c0,49.451,21.638,105.614,53.035,149.323l123.975,177.782l124.006-177.814C413.452,272.864,429.064,226.438,429.064,177.018z"></path> <path style="fill:#17DD9F;" d="M252.054,0C154.301,0,75.059,79.258,75.059,177.018"></path> <path style="fill:#039176;" d="M252.069,504.123l124.006-177.814c37.368-53.445,52.988-99.872,52.988-149.291 C429.064,79.258,349.822,0,252.054,0"></path> <path style="fill:#047F73;" d="M429.064,177.018C429.064,79.258,349.822,0,252.054,0"></path> <circle style="fill:#F44D71;" cx="252.062" cy="166.936" r="79.557"></circle> <path style="fill:#FF6679;" d="M172.528,166.936c0-43.93,35.604-79.557,79.525-79.557"></path> <path style="fill:#D60949;" d="M252.054,87.387c43.922,0,79.557,35.619,79.557,79.557c0,43.922-35.627,79.525-79.557,79.525"></path> <path style="fill:#B50444;" d="M331.603,166.936c0,43.922-35.627,79.525-79.557,79.525"></path> </g></svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 32),
    };

    const marker = new google.maps.Marker({
      position: {
        lat: property.location.coordinates.latitude,
        lng: property.location.coordinates.longitude,
      },
      map: map,
      icon: markerIcon,
      title: property.name,
    });
    markerRef.current = marker;

    return () => {
      // Cleanup
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      mapRef.current = null;
    };
  }, [property, isError, isLoading]);

  if (isLoading)
    return (
      <div className="animate-pulse bg-slate-100 rounded-2xl p-6 h-64 mb-12"></div>
    );

  if (isError || !property) {
    return (
      <div className="bg-red-50 text-red-700 rounded-2xl p-6 flex items-center justify-center mb-12">
        Property not Found
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-primary-50 p-5 border-b border-primary-100">
        <h2 className="font-medium text-lg text-primary-900">
          Property Location
        </h2>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-primary-700" />
            <span>{property.location?.address || "Address not available"}</span>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              property.location?.address || ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
          >
            <span>Get Directions</span>
            <Compass className="w-4 h-4" />
          </a>
        </div>

        {/* Map Container */}
        <div
          className="relative h-[400px] rounded-lg overflow-hidden border border-gray-200"
          ref={mapContainerRef}
        />

        {/* Additional Location Info */}
        {property.location?.city && (
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Located in {property.location.city}, {property.location.state},{" "}
              {property.location.country}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyLocation;

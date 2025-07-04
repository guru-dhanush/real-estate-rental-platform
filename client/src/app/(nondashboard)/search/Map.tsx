"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";
import dynamic from 'next/dynamic';

// Dynamically import MapCard with no SSR
const MapCard = dynamic(() => import('./MapCard'), { ssr: false });

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  const mapViewEnabled = useAppSelector((state) => state.global.mapViewEnabled);

  useEffect(() => {
    if (isLoading || isError || !properties || !mapContainerRef.current) return;

    // Initialize the map
    const map = new google.maps.Map(mapContainerRef.current, {
      center: filters.coordinates
        ? { lat: filters.coordinates[1], lng: filters.coordinates[0] }
        : { lat: 12.87548, lng: 74.85366 },
      zoom: 12,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false, // Remove Map/Satellite option
      streetViewControl: false, // Remove Street View
    });
    mapRef.current = map;

    // Clear previous markers and info windows
    markersRef.current.forEach((marker) => marker.setMap(null));
    infoWindowsRef.current.forEach((window) => window.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    // --- New: Create LatLngBounds to fit all markers ---
    const bounds = new google.maps.LatLngBounds();

    // Add new markers
    properties.forEach((property) => {
      const { marker, infoWindow } = createPropertyMarker(property, map);
      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
      // Extend bounds for each marker
      bounds.extend(marker.getPosition()!);
    });

    // --- New: Smoothly fit all markers in view ---
    if (properties.length === 1) {
      // If only one marker, pan and zoom to it
      const marker = markersRef.current[0];
      if (marker) {
        map.panTo(marker.getPosition()!);
        map.setZoom(15);
      }
    } else if (properties.length > 1) {
      // Fit all markers
      map.fitBounds(bounds, 100); // 100px padding
    }

    const resizeMap = () => {
      if (map) {
        setTimeout(() => {
          const center = map.getCenter();
          if (center) {
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
          }
        }, 700);
      }
    };
    resizeMap();

    return () => {
      // Cleanup
      markersRef.current.forEach((marker) => marker.setMap(null));
      infoWindowsRef.current.forEach((window) => window.close());
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <div className="p-4">Loading map...</div>;
  if (isError || !properties)
    return <div className="p-4 text-red-500">Failed to fetch properties</div>;

  return (
    <div
      className={
        mapViewEnabled
          ? "basis-5/12 grow relative rounded-xl overflow-hidden h-full"
          : "w-full relative rounded-xl overflow-hidden"
      }
    >
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
          minHeight: "400px",
        }}
      />
    </div>
  );
};

// --- Fix: Ensure function boundary and export ---

const createPropertyMarker = (property: Property, map: google.maps.Map) => {
  // Custom emerald green marker icon with border
  const markerIcon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg height="256px" width="256px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-40.33 -40.33 584.78 584.78" xml:space="preserve" fill="#000000" transform="rotate(0)" stroke="#000000" stroke-width="0.00504123"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.008246"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#004b93;" d="M429.064,177.018C429.064,79.258,349.822,0,252.054,0C154.301,0,75.059,79.258,75.059,177.018 c0,49.451,21.638,105.614,53.035,149.323l123.975,177.782l124.006-177.814C413.452,272.864,429.064,226.438,429.064,177.018z"></path> <path style="fill:#004b93;opacity:0.8;" d="M252.054,0C154.301,0,75.059,79.258,75.059,177.018"></path> <path style="fill:#003366;" d="M252.069,504.123l124.006-177.814c37.368-53.445,52.988-99.872,52.988-149.291 C429.064,79.258,349.822,0,252.054,0"></path> <path style="fill:#002244;" d="M429.064,177.018C429.064,79.258,349.822,0,252.054,0"></path> <circle style="fill:#fff;" cx="252.062" cy="166.936" r="79.557"></circle> <path style="fill:#e5e7eb;" d="M172.528,166.936c0-43.93,35.604-79.557,79.525-79.557"></path> <path style="fill:#bfc9d1;" d="M252.054,87.387c43.922,0,79.557,35.619,79.557,79.557c0,43.922-35.627,79.525-79.557,79.525"></path> <path style="fill:#bfc9d1;opacity:0.7;" d="M331.603,166.936c0,43.922-35.627,79.525-79.557,79.525"></path> </g></svg>
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

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("en-IN").format(
    property.pricePerMonth
  );

  // Create a container for the InfoWindow content
  const content = document.createElement('div');
  content.style.position = 'relative';
  content.style.width = '250px';
  content.style.overflow = 'visible';

  // Create a close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '-10px';
  closeButton.style.right = '-10px';
  closeButton.style.background = '#fff';
  closeButton.style.border = '2px solid #e2e8f0';
  closeButton.style.borderRadius = '50%';
  closeButton.style.width = '28px';
  closeButton.style.height = '28px';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '1001';
  closeButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  closeButton.style.fontSize = '18px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.lineHeight = '1';
  closeButton.style.padding = '0';
  closeButton.style.outline = 'none';

  closeButton.title = 'Close';
  closeButton.style.transform = 'translate(0, 0)';
  // Hover effect
  closeButton.onmouseover = () => {
    closeButton.style.background = '#f8fafc';
    closeButton.style.transform = 'scale(1.1)';
  };
  closeButton.onmouseout = () => {
    closeButton.style.background = '#fff';
    closeButton.style.transform = 'scale(1)';
  };

  // Create a container for the card and close button
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'relative !h-[250px] !w-[250px]';

  // Create container for the MapCard
  const cardContainer = document.createElement('div');
  cardContainer.className = 'h-full w-full';

  // Position the close button absolutely within the wrapper
  closeButton.style.position = 'absolute';
  closeButton.style.top = '8px';
  closeButton.style.right = '8px';
  closeButton.style.zIndex = '10';

  // Append elements
  cardWrapper.appendChild(cardContainer);
  cardWrapper.appendChild(closeButton);
  content.appendChild(cardWrapper);

  // Import ReactDOM client-side only
  import('react-dom/client').then(({ createRoot }) => {
    const rootInstance = createRoot(cardContainer);
    rootInstance.render(
      <MapCard
        property={property}
        isFavorite={false}
        onFavoriteToggle={() => { }}
        showFavoriteButton={false}
        propertyLink={`/search/${property.id}`}
      />
    );
  });

  const infoWindow = new google.maps.InfoWindow({
    content: content,
    pixelOffset: new google.maps.Size(0, -45)
  });

  // Add click handler for the close button
  closeButton.addEventListener('click', () => {
    infoWindow.close();
  });

  // Add a class to the InfoWindow when it's opened
  infoWindow.addListener('domready', () => {
    const container = document.querySelector('.gm-style-iw-c');
    if (container) {
      container.classList.add('custom-infowindow');
      // Make sure the close button is on top
      const closeBtn = container.querySelector('button');
      if (closeBtn) {
        closeBtn.style.zIndex = '1000';
      }
    }
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  return { marker, infoWindow };
};

export default Map;

"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./Map";
import Listings from "./Listings";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(false);
  const mapViewEnabled = useAppSelector((state) => state.global.mapViewEnabled);

  // This effect handles URL parameters
  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {}
    );

    const cleanedFilters = cleanParams(initialFilters);

    // Only set filters from URL if there are parameters
    if (Object.keys(cleanedFilters).length > 0) {
      dispatch(setFilters(cleanedFilters));
      setIsGeolocationLoaded(true); // Skip geolocation if URL params exist
    }
  }, [searchParams, dispatch]);

  // This effect handles geolocation - now using Google Maps Geocoding
  useEffect(() => {
    // Skip if we already loaded filters from URL
    if (isGeolocationLoaded) return;

    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;

          // Reverse geocode to get location name using Google Maps Geocoding API
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();

            let locationName = "Current Location";
            if (data.results && data.results.length > 0) {
              // Find a result that has a locality (city) or neighborhood
              const cityResult = data.results.find(
                (r: any) =>
                  r.types.includes("locality") ||
                  r.types.includes("neighborhood")
              );
              if (cityResult) {
                locationName = cityResult.formatted_address;
              } else {
                locationName = data.results[0].formatted_address;
              }
            }

            // Set coordinates and location name in filters
            dispatch(
              setFilters({
                coordinates: [longitude, latitude] as [number, number],
                location: locationName,
              })
            );
          } catch (error) {
            console.error("Error during reverse geocoding:", error);
            // Fall back to just setting coordinates
            dispatch(
              setFilters({
                coordinates: [longitude, latitude] as [number, number],
                location: "Current Location",
              })
            );
          }

          setIsGeolocationLoaded(true);
        },
        (error) => {
          console.log("Geolocation error:", error);
          setIsGeolocationLoaded(true);
        },
        { timeout: 10000 }
      );
    } else {
      console.log("Geolocation not supported");
      setIsGeolocationLoaded(true);
    }
  }, [dispatch, isGeolocationLoaded]);
  return (
    <div
      className="w-full mx-auto px-4 flex flex-col"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />
      <div className="flex flex-1 overflow-hidden gap-4 pb-4 mt-4">
        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {mapViewEnabled ? (
            <>
              <div className="w-7/12 overflow-y-auto pr-2 scrollbar-hide">
                <Listings />
              </div>

              <Map />
            </>
          ) : (
            <div className="w-full overflow-y-auto">
              <Listings />
            </div>
          )}
        </div>

        {/* Filters panel */}
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${isFiltersFullOpen
            ? "w-72 opacity-100 visible ml-2"
            : "w-0 opacity-0 invisible"
            }`}
        >
          <FiltersFull />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
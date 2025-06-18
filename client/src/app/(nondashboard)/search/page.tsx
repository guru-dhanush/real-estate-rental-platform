"use client";

import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import { cleanParams } from "@/lib/utils";
import { FiltersState, setFilters } from "@/state";
import Listings from "./Listings";

const Map = dynamic(() => import('./Map'), {
  loading: () => <Loading />,
  ssr: false,
});

const SearchPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const [isGeolocationLoaded, setIsGeolocationLoaded] = useState(false);
  const mapViewEnabled = useAppSelector((state) => state.global.mapViewEnabled);

  // Handle URL parameters and geocoding
  useEffect(() => {
    const fetchLocationCoordinates = async (locationName: string) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            locationName
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return [lng, lat] as [number, number];
        }
        return undefined;
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        return undefined;
      }
    };

    const initializeFilters = async () => {
      const location = searchParams.get('location');
      const propertyType = searchParams.get('propertyType');
      let coordinates: [number, number] | undefined;

      if (location) {
        coordinates = await fetchLocationCoordinates(location);
      }

      const filters: Partial<FiltersState> = {
        location: location || undefined,
        propertyType: propertyType || undefined,
        coordinates,
      };

      dispatch(setFilters(filters));
      setIsGeolocationLoaded(true);
    };

    initializeFilters();
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
              <div className="w-7/12 lg:block hidden overflow-y-auto pr-2 scrollbar-hide">
                <Listings />
              </div>
              <div className="flex-1">
                <Map />
              </div>
            </>
          ) : (
            <div className="w-full overflow-y-auto">
              <Listings />
            </div>
          )}
        </div>

        {/* Filters panel */}
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${isFiltersFullOpen ? "w-72 opacity-100 visible ml-2" : "w-0 opacity-0 invisible"
            }`}
        >
          <FiltersFull />
        </div>
      </div>
    </div>
  );
};



const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPage />
    </Suspense>
  )
}

export default Page
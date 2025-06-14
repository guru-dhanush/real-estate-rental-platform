import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
  toggleMapView,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn } from "@/lib/utils";
import Button from "@/components/ui/button/Button";
import {
  Grid,
  List,
  Search,
  MapPin,
  Map,
  Sliders,
} from "lucide-react";
import Input from "@/components/ui/input/InputField";

const FiltersBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const mapViewEnabled = useAppSelector((state) => state.global.mapViewEnabled);
  const [searchInput, setSearchInput] = useState(filters.location || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  }, 300);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features) {
        setSuggestions(data.features);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (feature: any) => {
    const location = feature.place_name;
    const [lng, lat] = feature.center;

    setSearchInput(location);
    setSuggestions([]);
    setShowSuggestions(false);

    const coordinates: [number, number] = [lng, lat];

    const newFilters: FiltersState = {
      ...filters,
      location: location,
      coordinates: coordinates,
    };

    dispatch(
      setFilters({
        location: location,
        coordinates: coordinates,
      })
    );
    updateURL(newFilters);
  };

  const handleSearchSubmit = () => {
    if (searchInput && searchInput.length > 0) {
      fetchSuggestions(searchInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput) {
        fetchSuggestions(searchInput);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  console.log("searchInput", searchInput);

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 gap-2 sm:gap-4 lg:gap-6">
          {/* Left side - View Controls */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-2 sm:px-3 h-8 rounded-md hover:bg-white transition-all text-xs font-medium",
                  viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => dispatch(setViewMode("list"))}
              >
                <List className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "px-2 sm:px-3 h-8 rounded-md hover:bg-white transition-all text-xs font-medium",
                  viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => dispatch(setViewMode("grid"))}
              >
                <Grid className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4 lg:mx-8 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                placeholder="Search location..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKeyDown}
                className="pl-8 pr-8 h-10 !rounded-full border-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent shadow-sm text-sm"
              />
              {isLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                </div>
              )}
              <Button
                onClick={handleSearchSubmit}
                size="xs"
                className="absolute right-2 top-1.5 h-8 w-8 p-0 !rounded-full bg-primary-600 hover:bg-primary-700 shadow-md"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white !rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto border border-gray-200">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-100 last:border-0"
                      onMouseDown={() => handleLocationSelect(suggestion)}
                    >
                      <MapPin className="h-5 w-4 text-primary-600 mr-3" />
                      <span className="text-sm">{suggestion.place_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Filters */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Map Toggle */}
            <Button
              variant={mapViewEnabled ? "primary" : "outline"}
              size="sm"
              className={cn(
                "gap-1 sm:gap-2 h-9 px-2 sm:px-4 rounded-lg text-xs font-medium shadow-sm transition-all",
                mapViewEnabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              )}
              onClick={() => dispatch(toggleMapView())}
            >
              <Map className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Map</span>
            </Button>
            <Button
              variant={isFiltersFullOpen ? "primary" : "outline"}
              className={cn(
                "gap-1 sm:gap-2 h-9 px-2 sm:px-4 rounded-lg text-xs font-medium shadow-sm transition-all",
                isFiltersFullOpen
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              )}
              onClick={() => dispatch(toggleFiltersFullOpen())}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
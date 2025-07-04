import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
  toggleMapView,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
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
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Read location from URL on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const location = searchParams.get('location');
      if (location) {
        setSearchInput(decodeURIComponent(location));
      }
    }
  }, []);

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

  // Google Places AutocompleteService instance
  const autocompleteServiceRef = useRef<any>(null);

  // Simple in-memory cache for suggestions
  const suggestionsCache = useRef<{ [key: string]: any[] }>({});

  const fetchSuggestions = (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Check cache first
    if (suggestionsCache.current[query]) {
      setSuggestions(suggestionsCache.current[query]);
      return;
    }

    setIsLoading(true);
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      setIsLoading(false);
      return;
    }
    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    }
    autocompleteServiceRef.current.getPlacePredictions(
      { input: query },
      (predictions: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          suggestionsCache.current[query] = predictions;
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      }
    );
  };

  // Get coordinates for a place_id using Places Details API
  const getCoordinatesForPlaceId = (placeId: string) => {
    return new Promise<[number, number] | undefined>((resolve) => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        resolve(undefined);
        return;
      }
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId }, (place: any, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          resolve([lng, lat]);
        } else {
          resolve(undefined);
        }
      });
    });
  };

  const handleLocationSelect = async (prediction: any) => {
    const location = prediction.description;
    setSearchInput(location);
    setSuggestions([]);
    setShowSuggestions(false);

    let coordinates: [number, number] | undefined = undefined;
    if (prediction.place_id) {
      coordinates = await getCoordinatesForPlaceId(prediction.place_id);
    }

    const newFilters: FiltersState = {
      ...filters,
      location: location,
      coordinates: coordinates ? coordinates : filters.coordinates,
    };

    dispatch(
      setFilters({
        location: location,
        coordinates: coordinates ? coordinates : filters.coordinates,
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
    if (debouncedSearchInput) {
      fetchSuggestions(debouncedSearchInput);
    }
  }, [debouncedSearchInput]);


  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Mobile Search Bar */}
        <div className="block lg:hidden w-full py-3">
          <div className="relative w-full">
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
              className="w-full pl-8 pr-8 h-10 !rounded-full border-gray-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent shadow-sm text-sm"
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
                    <span className="text-gray-700">{suggestion.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between py-2 gap-2">
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

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-2 sm:mx-4 lg:mx-8 relative">
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
                      <span className="text-gray-700">{suggestion.description}</span>
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
                  ? "bg-[#004B93] hover:bg-[#004B93] text-white border-[#004B93]"
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
                  ? "bg-[#004B93] hover:bg-[#004B93] text-white border-[#004B93]"
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
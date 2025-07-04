"use client";

import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, MapPin } from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setFilters } from "@/state";

const HeroSection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Prefetch search routes
  useEffect(() => {
    router.prefetch('/search');
    ["Apartment", "House", "Villa", "Studio"].forEach(type => {
      router.prefetch(`/search?propertyType=${type}`);
    });
  }, [router]);

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

  // Debounced effect for search
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchSuggestions(debouncedSearchTerm);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
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
    setSearchTerm(location);
    setSuggestions([]);

    let coordinates: [number, number] | undefined = undefined;
    if (prediction.place_id) {
      coordinates = await getCoordinatesForPlaceId(prediction.place_id);
    }

    dispatch(
      setFilters({
        location: location,
        coordinates: coordinates,
      })
    );

    const params = new URLSearchParams({
      location: location,
      ...(coordinates && { lat: coordinates[1].toString(), lng: coordinates[0].toString() }),
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    if (suggestions.length > 0) {
      handleLocationSelect(suggestions[0]);
    }
  };

  const handlePropertyTypeClick = (type: string) => {
    setIsLoading(true); // Add loading state
    dispatch(
      setFilters({
        propertyType: type,
      })
    );
    router.push(`/search?propertyType=${type}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgb(37, 99, 235)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Hero background images at left and right, right side reversed */}
        <div className="absolute left-0 right-0 bottom-0 w-full h-full z-0 pointer-events-none select-none">
          {/* Left image */}
          <img
            src="/images/herosection/herosection_bg.png"
            alt="Hero background left"
            className="absolute bottom-0 left-[-10px] h-[25vh] md:h-[60vh] lg:h-[80vh] w-auto object-cover opacity-90 "
          />
        </div>

        {/* Subtle gradient circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-16">
        <div className="max-w-4xl mx-auto text-center lg:mt-0 mt-10">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-700 ${isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
              }`}
          >
            Find Your Space You Were Meant to <span className="text-[#004B93]">Dwell <span className="text-[#c9002b]">In.</span></span>
          </h1>
          <p
            className={`text-xl text-gray-600 mb-12 max-w-2xl mx-auto transition-all duration-700 delay-100 ${isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
              }`}
          >
            Discover premium rental properties with our advanced search platform.
            Find your ideal space from thousands of verified listings.
          </p>

          {/* Search Bar */}
          <div
            className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-2 transition-all duration-700 delay-200 relative ${isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
              }`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Where would you like to live?"
                  className="w-full py-4 pl-12 pr-4 text-gray-900 bg-transparent focus:outline-none border-0 rounded-xl placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                />
                {isLoading && (
                  <div className="absolute right-3 top-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#004B93]"></div>
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-y-scroll max-h-40">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-100 last:border-0"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        <MapPin className="h-4 w-4 text-[#004B93] mr-3" />
                        <span className="text-gray-700">{suggestion.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSearchSubmit}
                className="mt-2 md:mt-0 bg-[#004B93] hover:bg-[#004B93] rounded-xl text-white py-4 px-8 flex items-center justify-center gap-2 h-full font-medium"
              >
                <Search className="h-5 w-5" />
                <span>Search Properties</span>
              </Button>
            </div>
          </div>

          {/* Quick filters */}
          <div className={`mt-8 flex flex-wrap justify-center gap-3 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {["Apartment", "Rooms", "Villa", "Studio"].map((type) => (
              <button
                key={type}
                disabled={isLoading}
                onClick={() => handlePropertyTypeClick(type)}
                className={`px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-[#004B93] 
                  text-gray-700 rounded-full text-sm font-medium transition-colors 
                  border border-transparent hover:border-blue-200
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
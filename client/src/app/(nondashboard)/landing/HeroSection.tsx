"use client";

import { useEffect, useState } from "react";
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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
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
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationSelect = (feature: any) => {
    const location = feature.place_name;
    const [lng, lat] = feature.center;
    setSearchTerm(location);
    setSuggestions([]);

    dispatch(
      setFilters({
        location: location,
        coordinates: [lat, lng],
      })
    );

    const params = new URLSearchParams({
      location: location,
      lat: lat.toString(),
      lng: lng.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = () => {
    if (suggestions.length > 0) {
      handleLocationSelect(suggestions[0]);
    }
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

        {/* Subtle gradient circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 transition-all duration-700 ${isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
              }`}
          >
            Find Your <span className="text-blue-600">Perfect</span> Home
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
            className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-2 transition-all duration-700 delay-200 ${isVisible
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
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center border-b border-gray-100 last:border-0"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        <MapPin className="h-4 w-4 text-blue-600 mr-3" />
                        <span className="text-gray-700">{suggestion.place_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSearchSubmit}
                className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 rounded-xl text-white py-4 px-8 flex items-center justify-center gap-2 h-full font-medium"
              >
                <Search className="h-5 w-5" />
                <span>Search Properties</span>
              </Button>
            </div>
          </div>

          {/* Quick filters */}
          <div
            className={`mt-8 flex flex-wrap justify-center gap-3 transition-all duration-700 delay-300 ${isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
              }`}
          >
            {["Apartments", "Houses", "Villas", "Studio"].map((type) => (
              <button
                key={type}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-full text-sm font-medium transition-colors border border-transparent hover:border-blue-200"
              >
                {type}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div
            className={`mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto transition-all duration-700 delay-400 ${isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
              }`}
          >
            <div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Properties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
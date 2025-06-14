"use client";

import { LEGACY_PROPERTY_TYPES } from "@/lib/constants";
import { useGetPropertyQuery } from "@/state/api";
import {
  MapPin,
  Star,
  Home,
  BedDouble,
  Bath,
  SquareCode,
  CheckCircle,
} from "lucide-react";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading)
    return (
      <div className="animate-pulse bg-slate-100 rounded-2xl p-6 h-64"></div>
    );

  if (isError || !property) {
    return (
      <div className="bg-red-50 text-red-700 rounded-2xl p-6 flex items-center justify-center">
        Property not Found
      </div>
    );
  }

  const isLegacyProperty = LEGACY_PROPERTY_TYPES.includes(
    property.propertyType
  );

  return (
    <div className="mb-12">
      {/* Property Card */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Header with Title */}
        <div className="bg-primary-50 p-5 border-b border-primary-100 flex justify-between items-start">
          <h1 className="text-2xl font-bold text-primary-900">
            {property.name}
          </h1>
          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <CheckCircle size={14} className="mr-1" />
            <span>Verified</span>
          </div>
        </div>

        {/* Address & Rating */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center text-gray-600 mb-2 sm:mb-0">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {property.location?.city}, {property.location?.state},{" "}
                {property.location?.country}
              </span>
            </div>

            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-amber-500" />
              <span className="font-medium text-gray-800">
                {property.averageRating?.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600 ml-1">
                ({property.numberOfReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Monthly Rent */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                <Home className="text-primary-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="text-lg font-medium text-primary-900">
                  ${property.pricePerMonth.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Bedrooms (only for legacy properties) */}
            {isLegacyProperty && (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                  <BedDouble className="text-primary-700" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="text-lg font-medium text-primary-900">
                    {property.beds}
                  </p>
                </div>
              </div>
            )}

            {/* Bathrooms (only for legacy properties) */}
            {isLegacyProperty && (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                  <Bath className="text-primary-700" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="text-lg font-medium text-primary-900">
                    {property.baths}
                  </p>
                </div>
              </div>
            )}

            {/* Size */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                <SquareCode className="text-primary-700" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Square Feet</p>
                <p className="text-lg font-medium text-primary-900">
                  {property.squareFeet.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Description */}
      <div className="mt-8">
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="bg-primary-50 p-5 border-b border-primary-100">
            <h2 className="font-medium text-lg text-primary-900">
              About this property
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverview;

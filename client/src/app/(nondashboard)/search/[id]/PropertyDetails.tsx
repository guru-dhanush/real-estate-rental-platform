"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import {
  AmenityIcons,
  HighlightIcons,
  LEGACY_PROPERTY_TYPES,
} from "@/lib/constants";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { HelpCircle, Sparkles, Coffee } from "lucide-react";
import React from "react";

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
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
    <div className="space-y-8 mb-12">
      {/* Amenities Section */}
      <section>
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="bg-primary-50 p-5 border-b border-primary-100">
            <div className="flex items-center gap-3">
              <Coffee className="text-primary-600" size={20} />
              <h2 className="font-medium text-lg text-primary-900">
                Property Amenities
              </h2>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {property.amenities.map((amenity: AmenityEnum) => {
                const Icon = AmenityIcons[amenity as AmenityEnum] || HelpCircle;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                      <Icon className="w-5 h-5 text-primary-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatEnumString(amenity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section>
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="bg-primary-50 p-5 border-b border-primary-100">
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary-600" size={20} />
              <h2 className="font-medium text-lg text-primary-900">
                Property Highlights
              </h2>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {property.highlights.map((highlight: HighlightEnum) => {
                const Icon =
                  HighlightIcons[highlight as HighlightEnum] || HelpCircle;
                return (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
                      <Icon className="w-5 h-5 text-primary-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatEnumString(highlight)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Fees and Policies Section - Only for legacy properties */}
      {isLegacyProperty && (
        <section>
          <div className="bg-white shadow-md rounded-2xl overflow-hidden">
            <div className="bg-primary-50 p-5 border-b border-primary-100">
              <div className="flex items-center gap-3">
                <HelpCircle className="text-primary-600" size={20} />
                <h2 className="font-medium text-lg text-primary-900">
                  Fees and Policies
                </h2>
              </div>
            </div>
            <div className="p-5 pb-4">
              <p className="text-sm text-gray-500 mb-4">
                The fees below are based on community-supplied data and may
                exclude additional fees and utilities.
              </p>

              <Tabs defaultValue="required-fees" className="w-full">
                <TabsList className="w-full grid grid-cols-3 rounded-none border-b border-gray-100">
                  <TabsTrigger
                    value="required-fees"
                    className="data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 text-sm"
                  >
                    Required Fees
                  </TabsTrigger>
                  <TabsTrigger
                    value="pets"
                    className="data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 text-sm"
                  >
                    Pets
                  </TabsTrigger>
                  <TabsTrigger
                    value="parking"
                    className="data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 text-sm"
                  >
                    Parking
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="required-fees" className="p-4">
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 p-4 border-b border-gray-100">
                      <p className="font-medium text-gray-700">
                        One time move in fees
                      </p>
                    </div>
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-gray-600">Application Fee</span>
                      <span className="font-medium text-primary-900">
                        ${property.applicationFee}
                      </span>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-medium text-primary-900">
                        ${property.securityDeposit}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pets" className="p-4">
                  <div className="flex items-center p-4 rounded-xl border border-gray-100">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        property.isPetsAllowed ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-gray-700">
                      Pets are{" "}
                      {property.isPetsAllowed ? "allowed" : "not allowed"} at
                      this property
                    </span>
                  </div>
                </TabsContent>

                <TabsContent value="parking" className="p-4">
                  <div className="flex items-center p-4 rounded-xl border border-gray-100">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        property.isParkingIncluded
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-gray-700">
                      Parking is{" "}
                      {property.isParkingIncluded ? "included" : "not included"}{" "}
                      with this property
                    </span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetails;

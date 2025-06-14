// client\src\app\(dashboard)\properties\[id]\page.tsx
"use client";

import {
  useGetPropertyQuery,
} from "@/state/api";
import { useParams } from "next/navigation";
import React from "react";
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ContactWidget from "./ContactWidget";

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const {
    data: property,
    // isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-white shadow-md rounded-2xl overflow-hidden m-4">
        <ImagePreviews
          images={
            property?.photoUrls
              ? [...property.photoUrls]
              : ["/singlelisting-2.jpg"]
          }
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
        <div className="order-2 md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        {property && (
          <div className="order-1 md:order-2">
            <ContactWidget
              managerCognitoId={property.managerCognitoId}
              propertyId={propertyId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleListing;
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { CustomFormField } from "@/components/FormField";
import { Form } from "@/components/ui/form/form";
import Button from "@/components/ui/button/Button";
import { useGetPropertyQuery, useUpdatePropertyMutation } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { AmenityEnum, HighlightEnum, LEGACY_PROPERTY_TYPES, PropertyTypeEnum } from "@/lib/constants";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";

const EditProperty = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: property, isLoading } = useGetPropertyQuery(Number(id));
  const [updateProperty] = useUpdatePropertyMutation();
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 0,
      securityDeposit: 0,
      applicationFee: 0,
      isPetsAllowed: false,
      isParkingIncluded: false,
      photoUrls: [],
      amenities: "",
      highlights: "",
      beds: 0,
      baths: 0,
      squareFeet: 0,
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      propertyType: PropertyTypeEnum.Apartment,
    },
  });

  useEffect(() => {
    if (property) {
      setExistingImages(property.photoUrls || []);

      form.reset({
        name: property.name || "",
        description: property.description || "",
        pricePerMonth: property.pricePerMonth || 0,
        securityDeposit: property.securityDeposit || 0,
        applicationFee: property.applicationFee || 0,
        isPetsAllowed: property.isPetsAllowed || false,
        isParkingIncluded: property.isParkingIncluded || false,
        photoUrls: property.photoUrls || [],
        amenities: property.amenities?.join(",") || "",
        highlights: property.highlights?.join(",") || "",
        beds: property.beds || 0,
        baths: property.baths || 0,
        squareFeet: property.squareFeet || 0,
        propertyType: property.propertyType || PropertyTypeEnum.Apartment,
        address: property.location?.address || "",
        city: property.location?.city || "",
        state: property.location?.state || "",
        country: property.location?.country || "",
        postalCode: property.location?.postalCode || "",
      });
    }
  }, [property, form]);

  const selectedPropertyType = form.watch("propertyType");
  const showLegacyFields = LEGACY_PROPERTY_TYPES.includes(selectedPropertyType);

  const handleImageDelete = (url: string) => {
    setDeletedImages([...deletedImages, url]);
    setExistingImages(existingImages.filter(img => img !== url));
  };

  const handleNewImages = (files: File[]) => {
    setNewImages(files);
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      const formData = new FormData();

      // Add all non-image fields
      for (const key in data) {
        if (key === 'photoUrls') continue;

        const value = data[key as keyof PropertyFormData];
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'boolean' ? String(value) : String(value));
        }
      }

      // Add image information
      formData.append('existingPhotoUrls', JSON.stringify(existingImages));
      formData.append('deletedPhotoUrls', JSON.stringify(deletedImages));

      // Add new image files
      newImages.forEach(file => {
        formData.append('photos', file);
      });

      await updateProperty({
        id: Number(id),
        formData
      }).unwrap();

      router.push("/managers/properties");
    } catch (error) {
      console.error("Failed to update property:", error);
    }
  };

  if (isLoading) return <Loading />

  return (
    <div className="dashboard-container">
      <Header
        title="Edit Property"
        subtitle="Update your property listing information"
      />
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-10"
          >
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField name="name" label="Property Name" type="text" />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fees */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Fees</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Price per Month"
                type="number"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  name="securityDeposit"
                  label="Security Deposit"
                  type="number"
                />
                <CustomFormField
                  name="applicationFee"
                  label="Application Fee"
                  type="number"
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {showLegacyFields && (
                  <>
                    <CustomFormField
                      name="beds"
                      label="Number of Beds"
                      type="number"
                    />
                    <CustomFormField
                      name="baths"
                      label="Number of Baths"
                      type="number"
                    />
                  </>
                )}
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                  className={showLegacyFields ? "" : "md:col-span-3"}
                />
              </div>

              {showLegacyFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <CustomFormField
                    name="isPetsAllowed"
                    label="Pets Allowed"
                    type="switch"
                  />
                  <CustomFormField
                    name="isParkingIncluded"
                    label="Parking Included"
                    type="switch"
                  />
                </div>
              )}
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Amenities and Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Amenities and Highlights
              </h2>
              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  type="select"
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity,
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  type="select"
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <ImageUploader
                existingImages={existingImages}
                newImages={newImages}
                onDelete={handleImageDelete}
                onNewImages={handleNewImages}
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                Additional Information
              </h2>
              <CustomFormField name="address" label="Address" />
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="City" className="w-full" />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                />
              </div>
              <CustomFormField name="country" label="Country" />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#004B93] rounded-lg hover:bg-[#004B93] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-[#004B93] disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-[#004B93]"
              >
                Update Property
              </button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/managers/properties")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div >
  );
};

export default EditProperty;
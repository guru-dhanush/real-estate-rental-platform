"use client";

import Card from "@/components/Card";
import ComponentCard from "@/components/common/ComponentCard";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery, useGetManagerPropertiesQuery, useDeletePropertyMutation } from "@/state/api";
import React from "react";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Plus } from "lucide-react";
import { toast } from "sonner";

const Properties = () => {
  const router = useRouter();
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isLoading,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  const [deleteProperty] = useDeletePropertyMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteProperty(id).unwrap();
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
      console.error("Failed to delete property", error)
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading manager properties</div>;

  return (
    <ComponentCard
      title="My Properties"
      desc="View and manage your property listings"
      className="dashboard-container"
      actionButton={
        <Button
          variant="outline"
          onClick={() => router.push("/managers/newproperty")}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create Property</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <div key={property.id} className="relative group">
            <Card
              property={property}
              isFavorite={false}
              onFavoriteToggle={() => { }}
              showFavoriteButton={false}
              propertyLink={`/managers/properties/${property.id}`}
              className="h-100 w-full"
            />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                onClick={() => router.push(`/managers/properties/${property.id}`)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(property.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {(!managerProperties || managerProperties.length === 0) && (
        <p>You don&lsquo;t manage any properties</p>
      )}
    </ComponentCard>
  );
};

export default Properties;
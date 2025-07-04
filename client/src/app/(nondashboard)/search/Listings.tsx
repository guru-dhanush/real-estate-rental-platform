import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { Property } from "@/types/prismaTypes";
import Card from "@/components/Card";
import React, { useState } from "react";
import CardCompact from "@/components/CardCompact";
import Loading from "@/components/Loading";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ToggleSwitch } from "@/components/ui/toggle/ToggleSwitch";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Listings = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const [areAllExpanded, setAreAllExpanded] = useLocalStorage<boolean>('cardExpandedState', false);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser) return;

    const isFavorite = tenant?.favorites?.some(
      (fav: Property) => fav.id === propertyId
    );

    if (isFavorite) {
      await removeFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    } else {
      await addFavorite({
        cognitoId: authUser.cognitoInfo.userId,
        propertyId,
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 pt-1">
        <h3 className="text-sm font-bold w-[90%]">
          {properties.length}{" "}
          <span className="text-gray-700 font-normal">
            Properties in {filters.location}
          </span>
        </h3>
        <div className="w-[10%] flex justify-end">
          <ToggleSwitch
            isOn={areAllExpanded}
            onToggle={setAreAllExpanded}
            onIcon={null}
            offIcon={null}
            label={""}
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          />
        </div>
      </div>


      <div className="p-4 w-full">
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {properties?.map((property) =>
            viewMode === "grid" ? (
              <Card
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
                className="h-100 w-full"
                defaultExpanded={areAllExpanded}
              />
            ) : (
              <CardCompact
                key={property.id}
                property={property}
                isFavorite={
                  tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser}
                propertyLink={`/search/${property.id}`}
              />
            )
          )}
        </div>
      </div>
    </div>

  );
};

export default Listings;

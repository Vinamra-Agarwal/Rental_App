import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/src/state/api";
import Card from "@/src/components/Card";
import CardCompact from "@/src/components/CardCompact";
import { useAppSelector } from "@/src/state/redux";
import { Property } from "@/src/types/prismaTypes";
import React from "react";
import Loading from "@/src/components/Loading";

const Listings = () => {
  const { data: authUser, isError: isAuthError } = useGetAuthUserQuery();
  const { data: tenant } = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId || isAuthError,
    }
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: number) => {
    if (!authUser || isAuthError) return;

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
  if (isError || !properties) return <>Failed to fetch properties</>;

  return (
    <div className="w-full">
      <h3 className="text-sm px-4 font-bold">
        {properties.length}{" "}
        <span className="text-gray-700 font-normal">
          Places in {filters.location || "all locations"}
        </span>
      </h3>
      <div className="flex">
        <div className="p-4 w-full">
          {properties?.map((property) =>
            viewMode === "grid" ? (
              <Card
                key={property.id}
                property={property}
                isFavorite={
                  !isAuthError && tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser && !isAuthError}
                propertyLink={`/search/${property.id}`}
              />
            ) : (
              <CardCompact
                key={property.id}
                property={property}
                isFavorite={
                  !isAuthError && tenant?.favorites?.some(
                    (fav: Property) => fav.id === property.id
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                showFavoriteButton={!!authUser && !isAuthError}
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

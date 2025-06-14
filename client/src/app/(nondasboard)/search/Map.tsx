"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/src/state/redux";
import { useGetPropertiesQuery } from "@/src/state/api";
import { Property } from "@/src/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);
  console.log("properties:", properties);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/vinxmra/cmbktj4n200j501se1icp9p7n",
      center: filters.coordinates || [77.216721, 28.644800],
      zoom: 9,
    });
    
    map.on('load', () => {
      properties.forEach((property) => {
        const marker = createPropertyMarker(property, map);
        const markerElement = marker.getElement();
        const path = markerElement.querySelector("path[fill='#3FB1CE']");
        if (path) path.setAttribute("fill", "#000000");
      });

      // Resize after map is loaded
      setTimeout(() => map.resize(), 700);
    });

    return () => map.remove();
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <>Loading..</>;
  if (isError || !properties) return <>Failed to fetch properties</>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
          <div class="marker-popup">
            <div class="marker-popup-image"></div>
            <div>
              <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
              <p class="marker-popup-price">
                ₹${property.pricePerMonth}
                <span class="marker-popup-price-unit"> / month</span>
              </p>
            </div>
          </div>
          `
      )
    )
    .addTo(map);
  return marker;
};

export default Map;

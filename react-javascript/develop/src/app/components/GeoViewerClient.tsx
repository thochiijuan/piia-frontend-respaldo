// src/app/components/GeoViewerClient.tsx
"use client";

import { MapContainer, TileLayer, LayersControl } from "react-leaflet";

export default function GeoViewerClient() {
  return (
    <div className="w-full h-full min-h-[600px]">
      <MapContainer
        center={[4.5709, -74.2973]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[600px] z-0"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
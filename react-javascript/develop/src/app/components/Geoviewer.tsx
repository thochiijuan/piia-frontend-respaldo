// src/app/components/Geoviewer.tsx
"use client";

import dynamic from "next/dynamic";

const GeoViewerClient = dynamic(() => import("./GeoViewerClient"), {
  ssr: false,
});

export default function GeoViewer() {
  return <GeoViewerClient />;
}
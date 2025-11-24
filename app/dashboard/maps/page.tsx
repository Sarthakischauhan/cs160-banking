"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import ChaseMap from "@/components/ui/ChaseMap";

export default function Home() {
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <ChaseMap />
    </>
  );
}

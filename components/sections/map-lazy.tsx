"use client";
import dynamic from "next/dynamic";
import SectionSkeleton from "./section-skeleton";

const MapAddress = dynamic(() => import("./map-location"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

export default function MapLazy({ lang }: { lang?: string }) {
  return <MapAddress lang={lang} />;
}

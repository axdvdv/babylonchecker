"use client";

import { type ProjectCardProps } from "../types";
import { useGardensCheck } from "./useGardensCheck";
import { GardensList } from "./GardensList";
import { TotalSummary } from "./TotalSummary";

export function BabylonCard({ address, enabled, chainId }: ProjectCardProps) {
  const gardens = useGardensCheck(address, enabled);

  if (!enabled) return null;
  if (!gardens.isLoading && !gardens.isError && gardens.results.length === 0) return null;

  return (
    <div className="space-y-3">
      <GardensList
        results={gardens.results}
        isLoading={gardens.isLoading}
        isError={gardens.isError}
        userAddress={address}
        chainId={chainId}
      />
      {!gardens.isLoading && (
        <TotalSummary gardenResults={gardens.results} />
      )}
    </div>
  );
}

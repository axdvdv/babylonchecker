"use client";

import { type GardenResult } from "./useGardensCheck";
import { GardenCard } from "./GardenCard";

interface GardensListProps {
  results: GardenResult[];
  isLoading: boolean;
  isError: boolean;
  userAddress?: string;
}

export function GardensList({ results, isLoading, isError, userAddress }: GardensListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Babylon Gardens</span>
        </div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-uf-border bg-uf-surface px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 rounded bg-uf-border" />
              <div className="h-4 w-24 rounded bg-uf-border" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-uf-danger/30 bg-uf-surface px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Babylon Gardens</span>
          <span className="text-xs text-uf-danger">Failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Babylon Gardens</span>
        <span className="text-xs text-uf-muted">
          {results.length} garden{results.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-uf-border bg-uf-surface px-4 py-3 text-center">
          <p className="text-xs text-uf-muted">
            No garden positions found
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {results.map((result) => (
            <GardenCard key={result.address} result={result} userAddress={userAddress} />
          ))}
        </div>
      )}
    </div>
  );
}

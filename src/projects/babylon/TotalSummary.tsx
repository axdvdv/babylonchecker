"use client";

import { type GardenResult } from "./useGardensCheck";
import { formatTokenAmount } from "@/lib/formatting";

interface TotalSummaryProps {
  gardenResults: GardenResult[];
}

export function TotalSummary({ gardenResults }: TotalSummaryProps) {
  const tokenTotals = new Map<string, { amount: bigint; decimals: number }>();

  for (const r of gardenResults) {
    const key = r.reserveSymbol;
    const existing = tokenTotals.get(key);
    if (existing) {
      existing.amount += r.withdrawable;
    } else {
      tokenTotals.set(key, { amount: r.withdrawable, decimals: r.reserveDecimals });
    }
  }

  const entries = Array.from(tokenTotals.entries());
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-uf-accent/30 bg-uf-surface px-5 py-3">
      <span className="text-sm font-medium text-uf-accent">Total Recoverable</span>
      <div className="flex items-center gap-4">
        {entries.map(([token, { amount, decimals }]) => (
          <span key={token} className="text-base font-bold">
            {formatTokenAmount(amount, decimals)}{" "}
            <span className="text-sm font-normal text-uf-muted">{token}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import { type GardenResult } from "@/hooks/useGardensCheck";
import { formatTokenAmount } from "@/lib/formatting";

interface TotalSummaryProps {
  gardenResults: GardenResult[];
  rariDaiAmount: bigint;
  rariClaimed: boolean;
}

export function TotalSummary({
  gardenResults,
  rariDaiAmount,
  rariClaimed,
}: TotalSummaryProps) {
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

  if (rariDaiAmount > 0n && !rariClaimed) {
    const existing = tokenTotals.get("DAI");
    if (existing) {
      existing.amount += rariDaiAmount;
    } else {
      tokenTotals.set("DAI", { amount: rariDaiAmount, decimals: 18 });
    }
  }

  const entries = Array.from(tokenTotals.entries());
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-babylon-gold/30 bg-babylon-card px-5 py-3">
      <span className="text-sm font-medium text-babylon-gold">Total Recoverable</span>
      <div className="flex items-center gap-4">
        {entries.map(([token, { amount, decimals }]) => (
          <span key={token} className="text-base font-bold">
            {formatTokenAmount(amount, decimals)}{" "}
            <span className="text-sm font-normal text-babylon-muted">{token}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { type Address } from "viem";
import { useReadContracts } from "wagmi";
import { projects } from "@/projects/registry";
import { type ProjectModule } from "@/projects/types";
import { formatTokenAmount } from "@/lib/formatting";
import { TokenIcons } from "@/components/TokenIcon";

const ERC20_BALANCE_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface ProjectGridProps {
  address: Address | undefined;
  checkEnabled: boolean;
}

export function ProjectGrid({ address, checkEnabled }: ProjectGridProps) {
  // Build a single flat list of all TVL contract calls
  const tvlQueries = useMemo(() => {
    const contracts: {
      address: `0x${string}`;
      abi: readonly Record<string, unknown>[];
      functionName: string;
      args?: readonly [`0x${string}`];
    }[] = [];
    const meta: { projectId: string; role: "balance" | "rate" }[] = [];

    for (const p of projects) {
      const tvl = p.meta.tvl;
      if (!tvl || (tvl.type !== "balance" && tvl.type !== "balance-with-rate"))
        continue;

      // Balance query (both types)
      contracts.push({
        address: tvl.tokenAddress,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf",
        args: [tvl.contractAddress],
      });
      meta.push({ projectId: p.meta.id, role: "balance" });

      // Rate query (only "balance-with-rate")
      if (tvl.type === "balance-with-rate") {
        contracts.push({
          address: tvl.rateAddress,
          abi: [
            {
              inputs: [],
              name: tvl.rateFn,
              outputs: [
                { internalType: "uint256", name: "", type: "uint256" },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: tvl.rateFn,
        });
        meta.push({ projectId: p.meta.id, role: "rate" });
      }
    }

    return { contracts, meta };
  }, []);

  // Single multicall for all TVL data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tvlData, isLoading: isTvlLoading } = useReadContracts({
    contracts: tvlQueries.contracts as any,
    query: { enabled: tvlQueries.contracts.length > 0 },
  });

  // Process results into tvlMap
  const tvlMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!tvlData) return map;

    // Collect raw values by project
    const balances = new Map<string, bigint>();
    const rates = new Map<string, bigint>();

    tvlQueries.meta.forEach((m, i) => {
      const result = tvlData[i];
      if (result?.status !== "success") return;
      const value = result.result as bigint;
      if (m.role === "balance") balances.set(m.projectId, value);
      else rates.set(m.projectId, value);
    });

    // Compute formatted TVL per project
    for (const p of projects) {
      const tvl = p.meta.tvl;
      if (!tvl || (tvl.type !== "balance" && tvl.type !== "balance-with-rate"))
        continue;

      const balance = balances.get(p.meta.id);
      if (balance === undefined) continue;

      if (tvl.type === "balance") {
        map.set(
          p.meta.id,
          `${formatTokenAmount(balance, tvl.decimals, 0)} ${tvl.symbol}`
        );
      } else if (tvl.type === "balance-with-rate") {
        const rate = rates.get(p.meta.id);
        if (rate === undefined) continue;
        const converted =
          (balance * rate) / 10n ** BigInt(tvl.rateDecimals);
        map.set(
          p.meta.id,
          `${formatTokenAmount(converted, tvl.decimals, 0)} ${tvl.symbol}`
        );
      }
    }

    return map;
  }, [tvlData, tvlQueries]);

  function getTvlDisplay(project: ProjectModule): string | undefined {
    if (!project.meta.tvl) return undefined;
    if (project.meta.tvl.type === "static") return project.meta.tvl.display;
    if (isTvlLoading) return "...";
    return tvlMap.get(project.meta.id);
  }

  return (
    <div className="space-y-8">
      {/* Project info cards — 3 per row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const tvl = getTvlDisplay(project);
          const isPlaceholder = !project.meta.tvl;

          return (
            <div
              key={project.meta.id}
              className={`flex flex-col rounded-2xl border bg-uf-surface p-5 transition-colors ${
                isPlaceholder
                  ? "border-dashed border-uf-border/60"
                  : "border-uf-border hover:border-uf-primary/40"
              }`}
            >
              {/* Chain badge */}
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full border border-uf-border px-2 py-0.5 text-xs text-uf-muted">
                  {project.meta.chain}
                </span>
                {project.meta.asset && (
                  <TokenIcons asset={project.meta.asset} size={20} />
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold leading-tight">{project.meta.name}</h3>

              {/* Description */}
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-uf-muted">
                {project.meta.description}
              </p>

              {/* TVL */}
              {tvl && (
                <div className="mt-4 rounded-lg bg-uf-bg px-3 py-2">
                  <span className="text-xs text-uf-muted">Unclaimed TVL</span>
                  <p className="text-lg font-bold text-uf-accent">{tvl}</p>
                </div>
              )}

              {/* Placeholder CTA instead of TVL */}
              {isPlaceholder && (
                <div className="mt-4 rounded-lg bg-uf-bg px-3 py-2 text-center">
                  <p className="text-xs text-uf-muted">More projects coming soon</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Results — shown after check */}
      {checkEnabled && address && (
        <div className="space-y-3">
          {projects.map((project) => (
            <project.Card key={project.meta.id} address={address} enabled={checkEnabled} />
          ))}
        </div>
      )}
    </div>
  );
}

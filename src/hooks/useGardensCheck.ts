"use client";

import { useMemo } from "react";
import { useReadContracts } from "wagmi";
import { type Address } from "viem";
import {
  GARDEN_ADDRESSES,
  GARDEN_ABI,
  ERC20_ABI,
} from "@/config/gardens";
import { calculateWithdrawable } from "@/lib/calculations";

export interface GardenResult {
  address: Address;
  name: string;
  userShares: bigint;
  lastPricePerShare: bigint;
  gardenDecimals: number;
  withdrawable: bigint;
  reserveAsset: Address;
  reserveSymbol: string;
  reserveDecimals: number;
}

/**
 * Two-phase garden check:
 *   Phase 1: balanceOf for all gardens (1 call per garden)
 *   Phase 2: details only for gardens with balance > 0
 *            name, decimals, lastPricePerShare, reserveAsset
 *   Phase 2b: reserve token symbol + decimals
 */
export function useGardensCheck(
  address: Address | undefined,
  enabled: boolean
) {
  // --- Phase 1: check balances ---
  const balanceContracts = GARDEN_ADDRESSES.map((gardenAddr) => ({
    address: gardenAddr,
    abi: GARDEN_ABI,
    functionName: "balanceOf" as const,
    args: address ? ([address] as const) : undefined,
  }));

  const {
    data: balanceData,
    isLoading: balancesLoading,
    isError: balancesError,
  } = useReadContracts({
    contracts: balanceContracts,
    query: { enabled: enabled && !!address },
  });

  const gardensWithBalance = useMemo(() => {
    if (!balanceData) return [];
    return GARDEN_ADDRESSES.map((addr, i) => ({
      address: addr,
      balance:
        balanceData[i]?.status === "success"
          ? (balanceData[i].result as bigint)
          : 0n,
    })).filter((g) => g.balance > 0n);
  }, [balanceData]);

  // --- Phase 2: fetch details (4 calls per garden) ---
  const detailContracts = useMemo(() => {
    return gardensWithBalance.flatMap((g) => [
      { address: g.address, abi: GARDEN_ABI, functionName: "name" as const },
      { address: g.address, abi: GARDEN_ABI, functionName: "decimals" as const },
      { address: g.address, abi: GARDEN_ABI, functionName: "lastPricePerShare" as const },
      { address: g.address, abi: GARDEN_ABI, functionName: "reserveAsset" as const },
    ]);
  }, [gardensWithBalance]);

  const {
    data: detailData,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useReadContracts({
    contracts: detailContracts,
    query: { enabled: gardensWithBalance.length > 0 },
  });

  // Collect unique reserve asset addresses
  const reserveAssets = useMemo(() => {
    if (!detailData) return [] as Address[];
    const set = new Set<Address>();
    for (let i = 0; i < gardensWithBalance.length; i++) {
      const reserveAddr = detailData[i * 4 + 3];
      if (reserveAddr?.status === "success") {
        set.add(reserveAddr.result as Address);
      }
    }
    return Array.from(set);
  }, [detailData, gardensWithBalance]);

  // --- Phase 2b: reserve token info ---
  const tokenInfoContracts = useMemo(() => {
    return reserveAssets.flatMap((addr) => [
      { address: addr, abi: ERC20_ABI, functionName: "symbol" as const },
      { address: addr, abi: ERC20_ABI, functionName: "decimals" as const },
    ]);
  }, [reserveAssets]);

  const {
    data: tokenInfoData,
    isLoading: tokenInfoLoading,
    isError: tokenInfoError,
  } = useReadContracts({
    contracts: tokenInfoContracts,
    query: { enabled: reserveAssets.length > 0 },
  });

  const tokenInfoMap = useMemo(() => {
    const map = new Map<Address, { symbol: string; decimals: number }>();
    if (!tokenInfoData) return map;
    for (let i = 0; i < reserveAssets.length; i++) {
      const symbol =
        tokenInfoData[i * 2]?.status === "success"
          ? (tokenInfoData[i * 2].result as string)
          : "???";
      const decimals =
        tokenInfoData[i * 2 + 1]?.status === "success"
          ? Number(tokenInfoData[i * 2 + 1].result)
          : 18;
      map.set(reserveAssets[i], { symbol, decimals });
    }
    return map;
  }, [tokenInfoData, reserveAssets]);

  // --- Assemble results ---
  const results: GardenResult[] = useMemo(() => {
    if (!detailData || gardensWithBalance.length === 0) return [];

    return gardensWithBalance.map((g, i) => {
      const base = i * 4;
      const name =
        detailData[base]?.status === "success"
          ? (detailData[base].result as string)
          : g.address;
      const gardenDecimals =
        detailData[base + 1]?.status === "success"
          ? Number(detailData[base + 1].result)
          : 18;
      const lastPricePerShare =
        detailData[base + 2]?.status === "success"
          ? (detailData[base + 2].result as bigint)
          : 0n;
      const reserveAsset =
        detailData[base + 3]?.status === "success"
          ? (detailData[base + 3].result as Address)
          : ("0x0000000000000000000000000000000000000000" as Address);

      const tokenInfo = tokenInfoMap.get(reserveAsset);
      const withdrawable = calculateWithdrawable(
        g.balance,
        lastPricePerShare,
        gardenDecimals
      );

      return {
        address: g.address,
        name,
        userShares: g.balance,
        lastPricePerShare,
        gardenDecimals,
        withdrawable,
        reserveAsset,
        reserveSymbol: tokenInfo?.symbol ?? "???",
        reserveDecimals: tokenInfo?.decimals ?? 18,
      };
    });
  }, [detailData, gardensWithBalance, tokenInfoMap]);

  const isLoading = balancesLoading || detailsLoading || tokenInfoLoading;
  const isError = balancesError || detailsError || tokenInfoError;

  return { results, isLoading, isError };
}

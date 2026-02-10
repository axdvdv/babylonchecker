"use client";

import { useReadContracts } from "wagmi";
import { type Address } from "viem";
import {
  CSAI_ADDRESS,
  CSAI_ABI,
  SAI_ADDRESS,
  SAI_ABI,
  CAGE_FREE_ADDRESS,
  SAI_TAP_ADDRESS,
  SAI_TAP_ABI,
} from "./config";

/** Compound exchange rate scale: 10^(18 - 8 + 18) = 10^28, divisor = 10^18 */
const EXCHANGE_RATE_DIVISOR = 10n ** 18n;

/** MakerDAO ray: 10^27 */
const RAY = 10n ** 27n;

export function useCsaiCheck(address: Address | undefined, enabled: boolean) {
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        address: CSAI_ADDRESS,
        abi: CSAI_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
      },
      {
        address: CSAI_ADDRESS,
        abi: CSAI_ABI,
        functionName: "exchangeRateStored",
      },
      {
        address: SAI_TAP_ADDRESS,
        abi: SAI_TAP_ABI,
        functionName: "fix",
      },
      {
        address: SAI_ADDRESS,
        abi: SAI_ABI,
        functionName: "allowance",
        args: address ? [address, CAGE_FREE_ADDRESS] : undefined,
      },
    ],
    query: {
      enabled: enabled && !!address,
    },
  });

  const cSaiBalance =
    data?.[0]?.status === "success" ? (data[0].result as bigint) : 0n;
  const exchangeRate =
    data?.[1]?.status === "success" ? (data[1].result as bigint) : 0n;
  const fix =
    data?.[2]?.status === "success" ? (data[2].result as bigint) : 0n;
  const allowance =
    data?.[3]?.status === "success" ? (data[3].result as bigint) : 0n;

  // cSAI (8 dec) → SAI (18 dec): saiAmount = cSaiBalance * exchangeRate / 1e18
  const saiAmount =
    exchangeRate > 0n
      ? (cSaiBalance * exchangeRate) / EXCHANGE_RATE_DIVISOR
      : 0n;

  // SAI (18 dec) → WETH (18 dec): wethAmount = saiAmount * fix / 1e27
  const wethAmount =
    fix > 0n ? (saiAmount * fix) / RAY : 0n;

  const needsApprove = saiAmount > 0n && allowance < saiAmount;

  return {
    cSaiBalance,
    saiAmount,
    wethAmount,
    needsApprove,
    isLoading,
    isError,
  };
}

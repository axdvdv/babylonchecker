"use client";

import { useReadContracts } from "wagmi";
import { type Address } from "viem";
import {
  SAI_ADDRESS,
  SAI_ABI,
  CAGE_FREE_ADDRESS,
  WETH_ADDRESS,
  SAI_TAP_ADDRESS,
  SAI_WETH_RATE,
  RATE_DIVISOR,
} from "./config";

const ERC20_BALANCE_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useSaiCheck(address: Address | undefined, enabled: boolean) {
  // User-specific calls: SAI balance + allowance
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        address: SAI_ADDRESS,
        abi: SAI_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
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

  // Separate call: WETH liquidity in SaiTap (no user dependency)
  const { data: tapData } = useReadContracts({
    contracts: [
      {
        address: WETH_ADDRESS,
        abi: ERC20_BALANCE_ABI,
        functionName: "balanceOf",
        args: [SAI_TAP_ADDRESS],
      },
    ],
    query: {
      enabled,
    },
  });

  const saiBalance =
    data?.[0]?.status === "success" ? (data[0].result as bigint) : 0n;
  const allowance =
    data?.[1]?.status === "success" ? (data[1].result as bigint) : 0n;
  const tapWethBalance =
    tapData?.[0]?.status === "success" ? (tapData[0].result as bigint) : 0n;

  const wethAmount = saiBalance * SAI_WETH_RATE / RATE_DIVISOR;
  const needsApprove = saiBalance > 0n && allowance < saiBalance;

  return {
    saiBalance,
    wethAmount,
    needsApprove,
    tapWethBalance,
    isLoading,
    isError,
  };
}

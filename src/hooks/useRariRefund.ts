"use client";

import { useReadContracts } from "wagmi";
import { type Address } from "viem";
import { RARI_REFUND_ADDRESS, RARI_REFUND_ABI } from "@/config/rariRefund";

export function useRariRefund(address: Address | undefined, enabled: boolean) {
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        address: RARI_REFUND_ADDRESS,
        abi: RARI_REFUND_ABI,
        functionName: "daiReimbursementAmount",
        args: address ? [address] : undefined,
      },
      {
        address: RARI_REFUND_ADDRESS,
        abi: RARI_REFUND_ABI,
        functionName: "claimed",
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: enabled && !!address,
    },
  });

  const daiAmount =
    data?.[0]?.status === "success" ? (data[0].result as bigint) : 0n;
  const claimed =
    data?.[1]?.status === "success" ? (data[1].result as boolean) : false;

  return {
    daiAmount,
    claimed,
    isLoading,
    isError,
  };
}

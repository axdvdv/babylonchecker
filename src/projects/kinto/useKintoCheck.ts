"use client";

import { useReadContracts } from "wagmi";
import { type Address } from "viem";
import { KINTO_LEFTOVER_ADDRESS, KINTO_LEFTOVER_ABI } from "./config";

export function useKintoCheck(address: Address | undefined, enabled: boolean) {
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        address: KINTO_LEFTOVER_ADDRESS,
        abi: KINTO_LEFTOVER_ABI,
        functionName: "userInfos",
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: enabled && !!address,
    },
  });

  const result = data?.[0];
  const amount =
    result?.status === "success" ? (result.result as [bigint, boolean])[0] : 0n;
  const claimed =
    result?.status === "success" ? (result.result as [bigint, boolean])[1] : false;

  return {
    amount,
    claimed,
    isLoading,
    isError,
  };
}

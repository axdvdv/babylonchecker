import { getAddress } from "viem";

export const KINTO_LEFTOVER_ADDRESS = getAddress("0x47A56a558892De88367108183Df913852617e77C");

export const KINTO_LEFTOVER_ABI = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "userInfos",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bool", name: "claimed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptAndClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

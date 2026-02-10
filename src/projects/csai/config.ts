import { getAddress } from "viem";

// --- Addresses ---

/** Compound v2 cSAI token */
export const CSAI_ADDRESS = getAddress("0xF5DCe57282A584D2746FaF1593d3121Fcac444dC");

export const SAI_ADDRESS = getAddress("0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359");

export const CAGE_FREE_ADDRESS = getAddress("0x9fdc15106da755f9FfD5b0BA9854Cfb89602E0fd");

/** SaiTap — holds WETH liquidity, exposes fix() rate */
export const SAI_TAP_ADDRESS = getAddress("0xBda109309f9FafA6Dd6A9CB9f1Df4085B27Ee8eF");

// --- ABIs ---

export const CSAI_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeRateStored",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "redeemTokens", type: "uint256" }],
    name: "redeem",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const SAI_ABI = [
  {
    inputs: [
      { internalType: "address", name: "guy", type: "address" },
      { internalType: "uint256", name: "wad", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "src", type: "address" },
      { internalType: "address", name: "guy", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const SAI_TAP_ABI = [
  {
    inputs: [],
    name: "fix",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const CAGE_FREE_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "wad", type: "uint256" }],
    name: "freeCash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

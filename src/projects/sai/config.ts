import { getAddress } from "viem";

// --- Addresses ---

export const SAI_ADDRESS = getAddress("0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359");

export const CAGE_FREE_ADDRESS = getAddress("0x9FDc15106da755F9fFd5b0BA9854cfb89602E0fd");

export const WETH_ADDRESS = getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");

/** SaiTap — holds WETH liquidity for redemptions */
export const SAI_TAP_ADDRESS = getAddress("0xBda109309f9FafA6Dd6A9CB9f1Df4085B27Ee8eF");

// --- Rate ---

/** 1 SAI = 0.005285 WETH (fixed post-shutdown) */
export const SAI_WETH_RATE = 5285n;
export const RATE_DIVISOR = 1_000_000n;

// --- ABIs ---

export const SAI_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
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

import { type Address } from "viem";

// TODO: Replace with actual contract address
export const RARI_REFUND_ADDRESS: Address =
  "0x2c1270a714F650F68f80e83850d85d003082B456";

// Only functions used by the UI (read + claim)
export const RARI_REFUND_ABI = [
  {
    inputs: [],
    name: "claimReimbursement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "claimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "daiReimbursementAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

import { getAddress } from "viem";

export const RARI_REFUND_ADDRESS = getAddress("0x2c1270a714F650F68f80e83850d85d003082B456");

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

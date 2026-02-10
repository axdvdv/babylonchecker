import { type ProjectModule } from "../types";
import { KintoCard } from "./KintoCard";

export const kintoProject: ProjectModule = {
  meta: {
    id: "kinto",
    name: "Kinto",
    description: "Leftover USDC claim from Kinto protocol",
    incident: "Unclaimed USDC leftovers available for eligible users.",
    chain: "Ethereum",
    chainId: 1,
    asset: "USDC",
    tvl: {
      type: "balance",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      contractAddress: "0x47A56a558892De88367108183Df913852617e77C",
      decimals: 6,
      symbol: "USDC",
    },
  },
  Card: KintoCard,
};

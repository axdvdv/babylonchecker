import { type ProjectModule } from "../types";
import { SaiCard } from "./SaiCard";

export const saiProject: ProjectModule = {
  meta: {
    id: "sai-redemption",
    name: "SAI Redemption",
    description: "Redeem deprecated SAI for WETH at a fixed rate",
    incident:
      "MakerDAO migrated from Single-Collateral DAI (SAI) to Multi-Collateral DAI in Nov 2019. SAI holders can still redeem via CageFree contract at 1 SAI = 0.005285 WETH.",
    chain: "Ethereum",
    asset: "WETH",
    tvl: {
      type: "balance",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      contractAddress: "0xBda109309f9FafA6Dd6A9CB9f1Df4085B27Ee8eF",
      decimals: 18,
      symbol: "WETH",
    },
  },
  Card: SaiCard,
};

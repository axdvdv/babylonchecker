import { type ProjectModule } from "../types";
import { BabylonCard } from "./BabylonCard";

export const babylonProject: ProjectModule = {
  meta: {
    id: "babylon-gardens",
    name: "Babylon Gardens",
    description: "DeFi asset management vaults from Babylon Finance",
    incident: "Babylon Finance shut down Nov 2022. ~50 garden vaults still hold withdrawable positions (WETH, USDC, DAI).",
    chain: "Ethereum",
    asset: "WETH / USDC / DAI",
    website: "https://www.babylon.finance/",
    tvl: {
      type: "static",
      display: "$100K+",
    },
  },
  Card: BabylonCard,
};

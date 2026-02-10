import { type ProjectModule } from "../types";
import { CsaiCard } from "./CsaiCard";

export const csaiProject: ProjectModule = {
  meta: {
    id: "csai-redemption",
    name: "cSAI Redemption",
    description:
      "Redeem Compound SAI (cSAI) to WETH via SAI and CageFree contract",
    incident:
      "Compound v2 cSAI holders can still redeem their tokens: exit Compound to get SAI, then convert SAI to WETH via MakerDAO CageFree at a fixed rate.",
    chain: "Ethereum",
    asset: "WETH",
    tvl: {
      type: "balance-with-rate",
      tokenAddress: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359", // SAI
      contractAddress: "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC", // cSAI contract holds SAI
      rateAddress: "0xBda109309f9FafA6Dd6A9CB9f1Df4085B27Ee8eF", // SaiTap
      rateFn: "fix",
      rateDecimals: 27, // ray
      decimals: 18, // WETH
      symbol: "WETH",
    },
  },
  Card: CsaiCard,
};

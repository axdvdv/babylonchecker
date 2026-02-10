import { type ProjectModule } from "../types";
import { RariRefundCard } from "./RariRefundCard";

export const rariRefundProject: ProjectModule = {
  meta: {
    id: "rari-refund",
    name: "Rari Capital Reimbursement",
    description: "Reimbursement for Rari Capital hack victims via Babylon Finance",
    incident: "Rari Capital was hacked in April 2022. Babylon Finance allocated DAI reimbursements for affected users. Unclaimed funds remain in the contract.",
    chain: "Ethereum",
    asset: "DAI",
    website: "https://medium.com/babylon-finance/rari-hack-reimbursement-a47560999b9c",
    tvl: {
      type: "balance",
      tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      contractAddress: "0x2c1270a714F650F68f80e83850d85d003082B456",
      decimals: 18,
      symbol: "DAI",
    },
  },
  Card: RariRefundCard,
};

import { type Address } from "viem";
import { type ComponentType } from "react";

/** TVL source — either on-chain ERC20 balanceOf or a static string */
export type TvlConfig =
  | {
      type: "balance";
      tokenAddress: Address;
      contractAddress: Address;
      decimals: number;
      symbol: string;
    }
  | {
      type: "balance-with-rate";
      tokenAddress: Address;
      contractAddress: Address;
      rateAddress: Address;
      rateFn: string;
      rateDecimals: number;
      decimals: number;
      symbol: string;
    }
  | {
      type: "static";
      display: string;
    };

export interface ProjectMeta {
  id: string;
  name: string;
  description: string;
  incident: string;
  chain: string;
  asset: string;
  website?: string;
  tvl?: TvlConfig;
}

export interface ProjectCardProps {
  address: Address;
  enabled: boolean;
}

export interface ProjectModule {
  meta: ProjectMeta;
  Card: ComponentType<ProjectCardProps>;
}

"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { truncateAddress } from "@/lib/formatting";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-xl border border-babylon-border bg-babylon-card px-4 py-2
          text-sm font-mono transition-colors hover:border-babylon-coral"
      >
        {truncateAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="rounded-xl bg-babylon-purple px-4 py-2 text-sm font-medium
        transition-colors hover:brightness-110"
    >
      Connect Wallet
    </button>
  );
}

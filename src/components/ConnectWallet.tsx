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
        className="rounded-xl border border-uf-border bg-uf-surface px-4 py-2
          text-sm font-mono transition-colors hover:border-uf-danger"
      >
        {truncateAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="rounded-xl bg-uf-link px-4 py-2 text-sm font-medium
        transition-colors hover:brightness-110"
    >
      Connect Wallet
    </button>
  );
}

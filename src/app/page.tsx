"use client";

import { useState, useCallback } from "react";
import { isAddress, getAddress } from "viem";
import { useAccount } from "wagmi";

import { AddressSearch } from "@/components/AddressSearch";
import { ConnectWallet } from "@/components/ConnectWallet";
import { ProjectGrid } from "@/components/ProjectGrid";
import { CopyField } from "@/components/CopyField";

const DONATION_ADDRESS = "0x1B75525aCD9C5E9E93b4AAD0E596E464e86FF5aF";

export default function Home() {
  const { address: connectedAddress } = useAccount();
  const [inputAddress, setInputAddress] = useState("");
  const [checkEnabled, setCheckEnabled] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const targetAddress = isAddress(inputAddress)
    ? getAddress(inputAddress)
    : undefined;

  const handleCheck = useCallback(() => {
    if (targetAddress) {
      setCheckEnabled(true);
      setIsChecking(true);
      setTimeout(() => setIsChecking(false), 500);
    }
  }, [targetAddress]);

  const handleAddressChange = useCallback((value: string) => {
    setInputAddress(value);
    setCheckEnabled(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-uf-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="text-uf-primary">Unclaimed</span>{" "}
            <span className="text-uf-text">Finance</span>
          </h1>
          <ConnectWallet />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Hero */}
        <div className={`text-center space-y-3 ${checkEnabled ? "mb-6" : "mb-8"}`}>
          {!checkEnabled && (
            <>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your Lost Crypto May Still Be Waiting
              </h2>
              <p className="text-uf-muted max-w-xl mx-auto">
                Over <span className="text-uf-accent font-semibold">$30M</span> in unclaimed funds are locked in
                abandoned smart contracts. Enter your address to check if you have recoverable assets.
              </p>
            </>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <AddressSearch
            value={inputAddress}
            onChange={handleAddressChange}
            onCheck={handleCheck}
            isLoading={isChecking}
            connectedAddress={connectedAddress}
          />
        </div>

        {/* Project Grid */}
        <ProjectGrid
          address={targetAddress}
          checkEnabled={checkEnabled}
        />

        {/* Donation */}
        {checkEnabled && (
          <div className="mt-8 space-y-1.5">
            <p className="text-center text-xs text-uf-muted">
              Found this useful? Consider supporting the project
            </p>
            <div className="mx-auto max-w-md">
              <CopyField label="Donate (ETH/ERC-20)" value={DONATION_ADDRESS} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-uf-border py-3 text-center text-xs text-uf-muted/50">
        Unclaimed Finance &mdash; open source, no fees
      </footer>
    </div>
  );
}

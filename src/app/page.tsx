"use client";

import { useState, useCallback } from "react";
import { isAddress, type Address } from "viem";
import { useAccount } from "wagmi";

import { AddressInput } from "@/components/AddressInput";
import { ConnectWallet } from "@/components/ConnectWallet";
import { RariRefundCard } from "@/components/RariRefundCard";
import { GardensList } from "@/components/GardensList";
import { TotalSummary } from "@/components/TotalSummary";
import { CopyField } from "@/components/CopyField";
import { useRariRefund } from "@/hooks/useRariRefund";
import { useGardensCheck } from "@/hooks/useGardensCheck";

// TODO: Replace with actual donation address
const DONATION_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function Home() {
  const { address: connectedAddress } = useAccount();
  const [inputAddress, setInputAddress] = useState("");
  const [checkEnabled, setCheckEnabled] = useState(false);

  const targetAddress = isAddress(inputAddress)
    ? (inputAddress as Address)
    : undefined;

  const rari = useRariRefund(targetAddress, checkEnabled);
  const gardens = useGardensCheck(targetAddress, checkEnabled);

  const isLoading = rari.isLoading || gardens.isLoading;
  const hasResults = checkEnabled && !isLoading;

  const handleCheck = useCallback(() => {
    if (targetAddress) {
      setCheckEnabled(true);
    }
  }, [targetAddress]);

  const handleAddressChange = useCallback((value: string) => {
    setInputAddress(value);
    setCheckEnabled(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-babylon-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">
            <span className="text-babylon-gold">Babylon Finance</span>{" "}
            <span className="font-normal text-babylon-muted">Recovery Check</span>
          </h1>
          <ConnectWallet />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {/* About */}
        <div className="mb-5 space-y-2 text-sm text-babylon-muted leading-relaxed">
          <p>
            <a href="https://www.babylon.finance/" target="_blank" rel="noopener noreferrer" className="text-babylon-gold hover:underline">Babylon Finance</a>{" "}
            &mdash; community-led DeFi asset management protocol that shut down in November 2022
            after the{" "}
            <a href="https://medium.com/babylon-finance/rari-hack-reimbursement-a47560999b9c" target="_blank" rel="noopener noreferrer" className="text-babylon-purple hover:underline">Rari Capital hack</a>{" "}
            caused $3.4M in losses across multiple gardens.
          </p>
          <p>
            The website is gone, but all smart contracts are still live on Ethereum.
            This tool helps you check and recover:{" "}
            <span className="text-babylon-text">Rari hack reimbursement</span> (DAI) and{" "}
            <span className="text-babylon-text">garden positions</span> (WETH, USDC, etc.).
            You can claim directly through this site or manually via Etherscan &mdash;{" "}
            <a href="https://medium.com/babylon-finance/babylon-finance-is-shutting-down-b58abf1bc251" target="_blank" rel="noopener noreferrer" className="text-babylon-purple hover:underline">read the shutdown guide</a>.
          </p>
        </div>

        {/* Input + Check inline */}
        <div className="mb-6 flex gap-2">
          <div className="flex-1">
            <AddressInput
              value={inputAddress}
              onChange={handleAddressChange}
              onCheck={handleCheck}
              connectedAddress={connectedAddress}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={!targetAddress || isLoading}
            className="shrink-0 rounded-xl bg-babylon-gold px-5 py-3 text-sm font-semibold
              text-babylon-bg transition-all hover:brightness-110
              disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "..." : "Check"}
          </button>
        </div>

        {/* Results */}
        {(checkEnabled || isLoading) && (
          <div className="space-y-3">
            <RariRefundCard
              daiAmount={rari.daiAmount}
              claimed={rari.claimed}
              isLoading={rari.isLoading}
              isError={rari.isError}
            />

            <GardensList
              results={gardens.results}
              isLoading={gardens.isLoading}
              isError={gardens.isError}
              userAddress={inputAddress}
            />

            {hasResults && (
              <>
                <TotalSummary
                  gardenResults={gardens.results}
                  rariDaiAmount={rari.daiAmount}
                  rariClaimed={rari.claimed}
                />

                {/* Donation */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-center text-xs text-babylon-muted">
                    Found this useful? Consider supporting the project
                  </p>
                  <div className="mx-auto max-w-md">
                    <CopyField label="Donate (ETH/ERC-20)" value={DONATION_ADDRESS} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-babylon-border py-3 text-center text-xs text-babylon-muted/50">
        Babylon Finance Recovery Check &mdash; open source, no fees
      </footer>
    </div>
  );
}

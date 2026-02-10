"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { type Address, zeroAddress } from "viem";
import { type GardenResult } from "./useGardensCheck";
import { GARDEN_ABI } from "./config";
import { formatTokenAmount, truncateAddress } from "@/lib/formatting";
import { CopyField } from "@/components/CopyField";

const GARDEN_ARTICLE_URL =
  "https://medium.com/babylon-finance/babylon-finance-is-shutting-down-b58abf1bc251";

interface GardenCardProps {
  result: GardenResult;
  userAddress?: string;
}

export function GardenCard({ result, userAddress }: GardenCardProps) {
  const { address: connectedAddress } = useAccount();
  const [expanded, setExpanded] = useState(false);
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleWithdraw = () => {
    if (!userAddress) return;
    writeContract({
      address: result.address,
      abi: GARDEN_ABI,
      functionName: "withdraw",
      args: [result.userShares, 1n, userAddress as Address, false, zeroAddress],
    });
  };

  return (
    <div className="rounded-xl border border-uf-border bg-uf-surface transition-colors hover:border-uf-link/40">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium">{result.name}</span>
          <span className="ml-2 font-mono text-xs text-uf-muted">
            {truncateAddress(result.address)}
          </span>
        </div>
        <div className="ml-3 flex items-center gap-2">
          <span className="text-base font-bold text-uf-success">
            {formatTokenAmount(result.withdrawable, result.reserveDecimals)}{" "}
            <span className="text-sm font-normal text-uf-muted">{result.reserveSymbol}</span>
          </span>
          <svg
            className={`h-3.5 w-3.5 text-uf-muted transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded: claim actions */}
      {expanded && (
        <div className="border-t border-uf-border px-4 py-3 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={connectedAddress ? handleWithdraw : undefined}
              disabled={!connectedAddress || isPending || isTxConfirming || isTxConfirmed}
              className="flex-1 rounded-lg bg-uf-success px-4 py-2 text-sm font-semibold
                text-uf-bg transition-all hover:brightness-110
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!connectedAddress
                ? "Connect Wallet"
                : isPending
                  ? "Confirm in wallet..."
                  : isTxConfirming
                    ? "Confirming..."
                    : isTxConfirmed
                      ? "Withdrawn!"
                      : "Withdraw via Wallet"}
            </button>
            <a
              href={GARDEN_ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-lg border border-uf-border px-3 py-2
                text-xs text-uf-link/80 transition-colors hover:border-uf-link hover:text-uf-link"
            >
              Guide
            </a>
          </div>
          {txError && (
            <p className="text-xs text-uf-danger">
              {"shortMessage" in txError ? txError.shortMessage : txError.message}
            </p>
          )}

          {isTxConfirmed && txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-uf-success hover:underline"
            >
              View on Etherscan &rarr;
            </a>
          )}

          {/* Etherscan manual params */}
          <details className="group">
            <summary className="cursor-pointer text-xs text-uf-muted hover:text-uf-text">
              Etherscan manual: call <code className="text-uf-text">withdraw</code> with params
            </summary>
            <div className="mt-1.5 space-y-1">
              <CopyField label="Contract" value={result.address} />
              <CopyField label="_amountIn" value={result.userShares.toString()} />
              <CopyField label="_minAmountOut" value="1" />
              <CopyField label="_to" value={userAddress || "paste your address"} />
              <CopyField label="_withPenalty" value="false" />
              <CopyField label="_unwindStrategy" value={zeroAddress} />
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

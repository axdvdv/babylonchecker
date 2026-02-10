"use client";

import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { formatTokenAmount } from "@/lib/formatting";
import { CopyField } from "@/components/CopyField";
import { RARI_REFUND_ADDRESS, RARI_REFUND_ABI } from "./config";
import { type ProjectCardProps } from "../types";
import { useRariRefund } from "./useRariRefund";

const RARI_ARTICLE_URL =
  "https://medium.com/babylon-finance/rari-hack-reimbursement-a47560999b9c";

export function RariRefundCard({ address, enabled, chainId }: ProjectCardProps) {
  const { address: connectedAddress } = useAccount();
  const { daiAmount, claimed, isLoading, isError } = useRariRefund(address, enabled);
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  if (!enabled) return null;

  const handleClaim = () => {
    writeContract({
      chainId,
      address: RARI_REFUND_ADDRESS,
      abi: RARI_REFUND_ABI,
      functionName: "claimReimbursement",
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-uf-border bg-uf-surface p-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-uf-border" />
          <div className="h-5 w-32 rounded bg-uf-border" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-uf-danger/30 bg-uf-surface px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Reimbursement Check</span>
          <span className="text-xs text-uf-danger">Failed to load</span>
        </div>
      </div>
    );
  }

  if (daiAmount === 0n) return null;

  const hasRefund = daiAmount > 0n;
  const canClaim = hasRefund && !claimed;

  return (
    <div
      className={`rounded-xl border bg-uf-surface transition-colors ${
        hasRefund ? "border-uf-success/30" : "border-uf-border"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Reimbursement</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              claimed
                ? "bg-uf-muted/20 text-uf-muted"
                : hasRefund
                  ? "bg-uf-success/20 text-uf-success"
                  : "bg-uf-border text-uf-muted"
            }`}
          >
            {claimed ? "Claimed" : hasRefund ? "Unclaimed" : "Not Eligible"}
          </span>
        </div>
        {hasRefund && (
          <span className="text-base font-bold text-uf-accent">
            {formatTokenAmount(daiAmount, 18)} <span className="text-sm font-normal text-uf-muted">DAI</span>
          </span>
        )}
      </div>

      {/* Claim actions */}
      {canClaim && (
        <div className="border-t border-uf-border px-4 py-3 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={connectedAddress ? handleClaim : undefined}
              disabled={!connectedAddress || isPending || isTxConfirming}
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
                      ? "Claimed!"
                      : "Claim via Wallet"}
            </button>
            <a
              href={RARI_ARTICLE_URL}
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

          <div className="space-y-1">
            <p className="text-xs text-uf-muted">
              Via Etherscan: Write &rarr; <code className="text-uf-text">claimReimbursement</code>
            </p>
            <CopyField label="Contract" value={RARI_REFUND_ADDRESS} />
          </div>
        </div>
      )}
    </div>
  );
}

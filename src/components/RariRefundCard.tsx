"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatTokenAmount } from "@/lib/formatting";
import { CopyField } from "./CopyField";
import { RARI_REFUND_ADDRESS, RARI_REFUND_ABI } from "@/config/rariRefund";

const RARI_ARTICLE_URL =
  "https://medium.com/babylon-finance/rari-hack-reimbursement-a47560999b9c";

interface RariRefundCardProps {
  daiAmount: bigint;
  claimed: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function RariRefundCard({
  daiAmount,
  claimed,
  isLoading,
  isError,
}: RariRefundCardProps) {
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleClaim = () => {
    writeContract({
      address: RARI_REFUND_ADDRESS,
      abi: RARI_REFUND_ABI,
      functionName: "claimReimbursement",
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl border border-babylon-border bg-babylon-card p-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-babylon-border" />
          <div className="h-5 w-32 rounded bg-babylon-border" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-babylon-coral/30 bg-babylon-card px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Rari Refund</span>
          <span className="text-xs text-babylon-coral">Failed to load</span>
        </div>
      </div>
    );
  }

  const hasRefund = daiAmount > 0n;
  const canClaim = hasRefund && !claimed;

  return (
    <div
      className={`rounded-xl border bg-babylon-card transition-colors ${
        hasRefund ? "border-babylon-teal/30" : "border-babylon-border"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Rari Refund</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              claimed
                ? "bg-babylon-muted/20 text-babylon-muted"
                : hasRefund
                  ? "bg-babylon-teal/20 text-babylon-teal"
                  : "bg-babylon-border text-babylon-muted"
            }`}
          >
            {claimed ? "Claimed" : hasRefund ? "Unclaimed" : "Not Eligible"}
          </span>
        </div>
        {hasRefund && (
          <span className="text-base font-bold text-babylon-gold">
            {formatTokenAmount(daiAmount, 18)} <span className="text-sm font-normal text-babylon-muted">DAI</span>
          </span>
        )}
      </div>

      {/* Claim actions */}
      {canClaim && (
        <div className="border-t border-babylon-border px-4 py-3 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleClaim}
              disabled={isPending || isTxConfirming}
              className="flex-1 rounded-lg bg-babylon-teal px-4 py-2 text-sm font-semibold
                text-babylon-bg transition-all hover:brightness-110
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
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
              className="flex items-center rounded-lg border border-babylon-border px-3 py-2
                text-xs text-babylon-purple/80 transition-colors hover:border-babylon-purple hover:text-babylon-purple"
            >
              Guide
            </a>
          </div>

          {isTxConfirmed && txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-babylon-teal hover:underline"
            >
              View on Etherscan &rarr;
            </a>
          )}

          <div className="space-y-1">
            <p className="text-xs text-babylon-muted">
              Via Etherscan: Write &rarr; <code className="text-babylon-text">claimReimbursement</code>
            </p>
            <CopyField label="Contract" value={RARI_REFUND_ADDRESS} />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatTokenAmount } from "@/lib/formatting";
import { CopyField } from "@/components/CopyField";
import { ActionButton } from "@/components/ActionButton";
import { KINTO_LEFTOVER_ADDRESS, KINTO_LEFTOVER_ABI } from "./config";
import { type ProjectCardProps } from "../types";
import { useKintoCheck } from "./useKintoCheck";

export function KintoCard({ address, enabled, chainId }: ProjectCardProps) {
  const { amount, claimed, isLoading, isError } = useKintoCheck(address, enabled);
  const { writeContract, data: txHash, isPending, error: txError } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  if (!enabled) return null;

  const handleClaim = () => {
    writeContract({
      chainId,
      address: KINTO_LEFTOVER_ADDRESS,
      abi: KINTO_LEFTOVER_ABI,
      functionName: "acceptAndClaim",
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
          <span className="text-sm font-semibold">Kinto Leftover Check</span>
          <span className="text-xs text-uf-danger">Failed to load</span>
        </div>
      </div>
    );
  }

  if (amount === 0n) return null;

  const hasAmount = amount > 0n;
  const canClaim = hasAmount && !claimed;

  return (
    <div
      className={`rounded-xl border bg-uf-surface transition-colors ${
        hasAmount ? "border-uf-success/30" : "border-uf-border"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Leftover Claim</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              claimed
                ? "bg-uf-muted/20 text-uf-muted"
                : hasAmount
                  ? "bg-uf-success/20 text-uf-success"
                  : "bg-uf-border text-uf-muted"
            }`}
          >
            {claimed ? "Claimed" : hasAmount ? "Unclaimed" : "Not Eligible"}
          </span>
        </div>
        {hasAmount && (
          <span className="text-base font-bold text-uf-accent">
            {formatTokenAmount(amount, 6)} <span className="text-sm font-normal text-uf-muted">USDC</span>
          </span>
        )}
      </div>

      {/* Claim actions */}
      {canClaim && (
        <div className="border-t border-uf-border px-4 py-3 space-y-2">
          <ActionButton
            onClick={handleClaim}
            label="Claim via Wallet"
            confirmedLabel="Claimed!"
            isPending={isPending}
            isConfirming={isTxConfirming}
            isConfirmed={isTxConfirmed}
            error={txError}
            txHash={txHash}
          />

          <div className="space-y-1">
            <p className="text-xs text-uf-muted">
              Via Etherscan: Write &rarr; <code className="text-uf-text">acceptAndClaim</code>
            </p>
            <CopyField label="Contract" value={KINTO_LEFTOVER_ADDRESS} />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatTokenAmount } from "@/lib/formatting";
import { CopyField } from "@/components/CopyField";
import { ActionButton } from "@/components/ActionButton";
import {
  SAI_ADDRESS,
  SAI_ABI,
  CAGE_FREE_ADDRESS,
  CAGE_FREE_ABI,
} from "./config";
import { type ProjectCardProps } from "../types";
import { useSaiCheck } from "./useSaiCheck";

export function SaiCard({ address, enabled, chainId }: ProjectCardProps) {
  const { saiBalance, wethAmount, needsApprove, tapWethBalance, isLoading, isError } =
    useSaiCheck(address, enabled);

  // Approve tx
  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApprovePending,
    error: approveError,
  } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  // Cash tx
  const {
    writeContract: writeCash,
    data: cashTxHash,
    isPending: isCashPending,
    error: cashError,
  } = useWriteContract();
  const { isLoading: isCashConfirming, isSuccess: isCashConfirmed } =
    useWaitForTransactionReceipt({ hash: cashTxHash });

  if (!enabled) return null;

  const handleApprove = () => {
    writeApprove({
      chainId,
      address: SAI_ADDRESS,
      abi: SAI_ABI,
      functionName: "approve",
      args: [CAGE_FREE_ADDRESS, saiBalance],
    });
  };

  const handleCash = () => {
    writeCash({
      chainId,
      address: CAGE_FREE_ADDRESS,
      abi: CAGE_FREE_ABI,
      functionName: "freeCash",
      args: [saiBalance],
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
          <span className="text-sm font-semibold">SAI Redemption</span>
          <span className="text-xs text-uf-danger">Failed to load</span>
        </div>
      </div>
    );
  }

  if (saiBalance === 0n) return null;

  const hasSai = saiBalance > 0n;
  const showApprove = hasSai && needsApprove && !isApproveConfirmed;
  const showCash = hasSai && (!needsApprove || isApproveConfirmed);

  return (
    <div
      className={`rounded-xl border bg-uf-surface transition-colors ${
        hasSai ? "border-uf-success/30" : "border-uf-border"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">SAI &rarr; WETH</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
              hasSai
                ? "bg-uf-success/20 text-uf-success"
                : "bg-uf-border text-uf-muted"
            }`}
          >
            {hasSai ? "Unclaimed" : "Not Eligible"}
          </span>
        </div>
        {hasSai && (
          <span className="text-sm font-bold text-uf-accent">
            {formatTokenAmount(wethAmount, 18)}{" "}
            <span className="text-xs font-normal text-uf-muted">WETH</span>
          </span>
        )}
      </div>

      {/* Balance detail */}
      {hasSai && (
        <div className="border-t border-uf-border px-3 py-1.5">
          <span className="text-[10px] text-uf-muted">
            {formatTokenAmount(saiBalance, 18)} SAI at 1 SAI = 0.005285 WETH
          </span>
        </div>
      )}

      {/* Unclaimed pool */}
      <div className="border-t border-uf-border px-3 py-1.5">
        <span className="text-[10px] text-uf-muted">
          Pool:{" "}
          <span className="text-uf-text">
            {formatTokenAmount(tapWethBalance, 18, 0)} WETH
          </span>
        </span>
      </div>

      {/* Approve step */}
      {showApprove && (
        <div className="border-t border-uf-border px-4 py-3">
          <p className="text-xs text-uf-muted mb-2">
            Step 1: Approve SAI for CageFree contract
          </p>
          <ActionButton
            onClick={handleApprove}
            label="Approve SAI"
            confirmedLabel="Approved!"
            isPending={isApprovePending}
            isConfirming={isApproveConfirming}
            isConfirmed={isApproveConfirmed}
            error={approveError}
            txHash={approveTxHash}
            variant="primary"
          />
        </div>
      )}

      {/* Cash step */}
      {showCash && (
        <div className="border-t border-uf-border px-4 py-3">
          {needsApprove && isApproveConfirmed && (
            <p className="text-xs text-uf-success mb-2">
              Step 2: Redeem SAI for WETH
            </p>
          )}
          <ActionButton
            onClick={handleCash}
            label="Redeem WETH"
            confirmedLabel="Redeemed!"
            isPending={isCashPending}
            isConfirming={isCashConfirming}
            isConfirmed={isCashConfirmed}
            error={cashError}
            txHash={cashTxHash}
          />
        </div>
      )}

      {/* Etherscan fallback */}
      {hasSai && (
        <details className="border-t border-uf-border">
          <summary className="cursor-pointer px-4 py-2 text-xs text-uf-muted hover:text-uf-text">
            Manual via Etherscan
          </summary>
          <div className="space-y-1 px-4 pb-3">
            <p className="text-xs text-uf-muted">
              1. Approve: SAI &rarr; Write &rarr;{" "}
              <code className="text-uf-text">approve</code>(CageFree, amount)
            </p>
            <CopyField label="SAI Contract" value={SAI_ADDRESS} />
            <CopyField label="Spender (CageFree)" value={CAGE_FREE_ADDRESS} />
            <CopyField label="Amount (wei)" value={saiBalance.toString()} />
            <p className="mt-2 text-xs text-uf-muted">
              2. Redeem: CageFree &rarr; Write &rarr;{" "}
              <code className="text-uf-text">freeCash</code>(amount)
            </p>
            <CopyField label="CageFree Contract" value={CAGE_FREE_ADDRESS} />
            <CopyField label="wad (SAI amount)" value={saiBalance.toString()} />
          </div>
        </details>
      )}
    </div>
  );
}

"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatTokenAmount } from "@/lib/formatting";
import { CopyField } from "@/components/CopyField";
import { ActionButton } from "@/components/ActionButton";
import {
  CSAI_ADDRESS,
  CSAI_ABI,
  SAI_ADDRESS,
  SAI_ABI,
  CAGE_FREE_ADDRESS,
  CAGE_FREE_ABI,
} from "./config";
import { type ProjectCardProps } from "../types";
import { useCsaiCheck } from "./useCsaiCheck";

export function CsaiCard({ address, enabled }: ProjectCardProps) {
  const { cSaiBalance, saiAmount, wethAmount, needsApprove, isLoading, isError } =
    useCsaiCheck(address, enabled);

  // Step 1: Redeem cSAI → SAI
  const {
    writeContract: writeRedeem,
    data: redeemTxHash,
    isPending: isRedeemPending,
    error: redeemError,
  } = useWriteContract();
  const { isLoading: isRedeemConfirming, isSuccess: isRedeemConfirmed } =
    useWaitForTransactionReceipt({ hash: redeemTxHash });

  // Step 2: Approve SAI → CageFree
  const {
    writeContract: writeApprove,
    data: approveTxHash,
    isPending: isApprovePending,
    error: approveError,
  } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  // Step 3: Cash SAI → WETH
  const {
    writeContract: writeCash,
    data: cashTxHash,
    isPending: isCashPending,
    error: cashError,
  } = useWriteContract();
  const { isLoading: isCashConfirming, isSuccess: isCashConfirmed } =
    useWaitForTransactionReceipt({ hash: cashTxHash });

  if (!enabled) return null;

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
          <span className="text-sm font-semibold">cSAI Redemption</span>
          <span className="text-xs text-uf-danger">Failed to load</span>
        </div>
      </div>
    );
  }

  if (cSaiBalance === 0n) return null;

  const handleRedeem = () => {
    writeRedeem({
      address: CSAI_ADDRESS,
      abi: CSAI_ABI,
      functionName: "redeem",
      args: [cSaiBalance],
    });
  };

  const handleApprove = () => {
    writeApprove({
      address: SAI_ADDRESS,
      abi: SAI_ABI,
      functionName: "approve",
      args: [CAGE_FREE_ADDRESS, saiAmount],
    });
  };

  const handleCash = () => {
    writeCash({
      address: CAGE_FREE_ADDRESS,
      abi: CAGE_FREE_ABI,
      functionName: "freeCash",
      args: [saiAmount],
    });
  };

  const showRedeem = !isRedeemConfirmed;
  const showApprove = isRedeemConfirmed && needsApprove && !isApproveConfirmed;
  const showCash =
    isRedeemConfirmed && (!needsApprove || isApproveConfirmed) && !isCashConfirmed;

  return (
    <div className="rounded-xl border border-uf-success/30 bg-uf-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">cSAI &rarr; SAI &rarr; WETH</span>
          <span className="rounded-full bg-uf-success/20 px-1.5 py-0.5 text-[10px] font-medium text-uf-success">
            Unclaimed
          </span>
        </div>
        <span className="text-sm font-bold text-uf-accent">
          {formatTokenAmount(wethAmount, 18)}{" "}
          <span className="text-xs font-normal text-uf-muted">WETH</span>
        </span>
      </div>

      {/* Balance detail */}
      <div className="border-t border-uf-border px-3 py-1.5">
        <span className="text-[10px] text-uf-muted">
          {formatTokenAmount(cSaiBalance, 8)} cSAI &rarr;{" "}
          {formatTokenAmount(saiAmount, 18)} SAI
        </span>
      </div>

      {/* Step 1: Redeem cSAI → SAI */}
      {showRedeem && (
        <div className="border-t border-uf-border px-4 py-3">
          <p className="text-xs text-uf-muted mb-2">
            Step 1: Redeem cSAI &rarr; SAI (no approve needed)
          </p>
          <ActionButton
            onClick={handleRedeem}
            label="Redeem cSAI"
            confirmedLabel="Redeemed!"
            isPending={isRedeemPending}
            isConfirming={isRedeemConfirming}
            isConfirmed={isRedeemConfirmed}
            error={redeemError}
            txHash={redeemTxHash}
            variant="primary"
          />
        </div>
      )}

      {/* Step 2: Approve SAI */}
      {showApprove && (
        <div className="border-t border-uf-border px-4 py-3">
          <p className="text-xs text-uf-muted mb-2">
            Step 2: Approve SAI for CageFree
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

      {/* Step 3: Cash SAI → WETH */}
      {showCash && (
        <div className="border-t border-uf-border px-4 py-3">
          <p className="text-xs text-uf-success mb-2">
            Step 3: Redeem SAI for WETH
          </p>
          <ActionButton
            onClick={handleCash}
            label="Redeem WETH"
            confirmedLabel="All done!"
            isPending={isCashPending}
            isConfirming={isCashConfirming}
            isConfirmed={isCashConfirmed}
            error={cashError}
            txHash={cashTxHash}
          />
        </div>
      )}

      {/* Etherscan fallback */}
      <details className="border-t border-uf-border">
        <summary className="cursor-pointer px-4 py-2 text-xs text-uf-muted hover:text-uf-text">
          Manual via Etherscan
        </summary>
        <div className="space-y-1 px-4 pb-3">
          <p className="text-xs text-uf-muted">
            1. Redeem: cSAI &rarr; Write &rarr;{" "}
            <code className="text-uf-text">redeem</code>(amount)
          </p>
          <CopyField label="cSAI Contract" value={CSAI_ADDRESS} />
          <CopyField label="redeemTokens" value={cSaiBalance.toString()} />

          <p className="mt-2 text-xs text-uf-muted">
            2. Approve: SAI &rarr; Write &rarr;{" "}
            <code className="text-uf-text">approve</code>(CageFree, amount)
          </p>
          <CopyField label="SAI Contract" value={SAI_ADDRESS} />
          <CopyField label="Spender (CageFree)" value={CAGE_FREE_ADDRESS} />
          <CopyField label="Amount (wei)" value={saiAmount.toString()} />

          <p className="mt-2 text-xs text-uf-muted">
            3. Cash: CageFree &rarr; Write &rarr;{" "}
            <code className="text-uf-text">freeCash</code>(amount)
          </p>
          <CopyField label="CageFree Contract" value={CAGE_FREE_ADDRESS} />
          <CopyField label="wad (SAI amount)" value={saiAmount.toString()} />
        </div>
      </details>
    </div>
  );
}

"use client";

import { useAccount } from "wagmi";

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  confirmedLabel?: string;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed?: boolean;
  error?: { message: string } | null;
  txHash?: `0x${string}`;
  variant?: "primary" | "success";
  className?: string;
}

export function ActionButton({
  onClick,
  label,
  confirmedLabel = "Done!",
  isPending,
  isConfirming,
  isConfirmed = false,
  error,
  txHash,
  variant = "success",
  className = "w-full",
}: ActionButtonProps) {
  const { address: connectedAddress } = useAccount();

  const bg = variant === "primary"
    ? "bg-uf-primary text-white"
    : "bg-uf-success text-uf-bg";

  return (
    <div className="space-y-2">
      <button
        onClick={connectedAddress ? onClick : undefined}
        disabled={!connectedAddress || isPending || isConfirming || isConfirmed}
        className={`${className} rounded-lg px-4 py-2 text-sm font-semibold
          transition-all hover:brightness-110
          disabled:cursor-not-allowed disabled:opacity-50 ${bg}`}
      >
        {!connectedAddress
          ? "Connect Wallet"
          : isPending
            ? "Confirm in wallet..."
            : isConfirming
              ? "Confirming..."
              : isConfirmed
                ? confirmedLabel
                : label}
      </button>
      {error && (
        <p className="text-xs text-uf-danger">
          {"shortMessage" in error
            ? (error as { shortMessage: string }).shortMessage
            : error.message}
        </p>
      )}
      {isConfirmed && txHash && (
        <a
          href={`https://etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-xs text-uf-success hover:underline"
        >
          View on Etherscan &rarr;
        </a>
      )}
    </div>
  );
}

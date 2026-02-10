"use client";

import { useState, useCallback } from "react";
import { isAddress } from "viem";
import { Search } from "lucide-react";

interface AddressSearchProps {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  isLoading: boolean;
  connectedAddress?: string;
}

export function AddressSearch({
  value,
  onChange,
  onCheck,
  isLoading,
  connectedAddress,
}: AddressSearchProps) {
  const [touched, setTouched] = useState(false);
  const isValid = !touched || !value || isAddress(value);
  const canCheck = isAddress(value) && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canCheck) onCheck();
  };

  const handleUseWallet = useCallback(() => {
    if (connectedAddress) {
      onChange(connectedAddress);
      setTouched(true);
    }
  }, [connectedAddress, onChange]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-2">
      <div
        className={`flex items-center rounded-2xl border bg-uf-surface transition-all
          focus-within:ring-2 focus-within:ring-uf-primary/50
          ${isValid ? "border-uf-border" : "border-uf-danger focus-within:ring-uf-danger/50"}`}
      >
        <Search className="ml-4 h-4 w-4 shrink-0 text-uf-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setTouched(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter Ethereum address (0x...)"
          className="flex-1 bg-transparent px-3 py-4 font-mono text-sm
            placeholder:text-uf-muted focus:outline-none"
        />
        {connectedAddress && !value && (
          <button
            onClick={handleUseWallet}
            className="shrink-0 px-3 text-xs text-uf-link hover:text-uf-text transition-colors"
          >
            Use Wallet
          </button>
        )}
        <button
          onClick={onCheck}
          disabled={!canCheck}
          className="m-1.5 shrink-0 cursor-pointer rounded-xl bg-uf-primary px-6 py-2.5 text-sm
            font-semibold text-white transition-all hover:brightness-110
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Checking..." : "Check"}
        </button>
      </div>
      {!isValid && (
        <p className="text-center text-xs text-uf-danger">Invalid Ethereum address</p>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { isAddress } from "viem";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  connectedAddress?: string;
}

export function AddressInput({
  value,
  onChange,
  onCheck,
  connectedAddress,
}: AddressInputProps) {
  const [touched, setTouched] = useState(false);
  const isValid = !touched || !value || isAddress(value);

  const handlePasteConnected = useCallback(() => {
    if (connectedAddress) {
      onChange(connectedAddress);
      setTouched(true);
    }
  }, [connectedAddress, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isAddress(value)) {
      onCheck();
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setTouched(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="0x... Enter Ethereum address"
          className={`w-full rounded-xl border bg-babylon-card px-4 py-3 font-mono text-sm
            placeholder:text-babylon-muted focus:outline-none focus:ring-2
            ${
              isValid
                ? "border-babylon-border focus:ring-babylon-gold/50"
                : "border-babylon-coral focus:ring-babylon-coral/50"
            }`}
        />
        {connectedAddress && (
          <button
            onClick={handlePasteConnected}
            className="shrink-0 rounded-xl border border-babylon-border bg-babylon-card px-3 py-3
              text-xs text-babylon-muted transition-colors hover:border-babylon-purple hover:text-babylon-text"
            title="Use connected wallet address"
          >
            Use Wallet
          </button>
        )}
      </div>
      {!isValid && (
        <p className="text-xs text-babylon-coral">Invalid Ethereum address</p>
      )}
    </div>
  );
}

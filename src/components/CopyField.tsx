"use client";

import { useState, useCallback } from "react";

interface CopyFieldProps {
  label: string;
  value: string;
}

export function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <div
      onClick={handleCopy}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-uf-border
        bg-uf-bg px-2.5 py-1.5 transition-colors hover:border-uf-link/40"
    >
      <span className="shrink-0 text-xs text-uf-muted">{label}:</span>
      <span className="min-w-0 flex-1 truncate font-mono text-xs">{value}</span>
      <span className="shrink-0 text-xs">
        {copied ? (
          <span className="text-uf-success">ok</span>
        ) : (
          <span className="text-uf-muted">copy</span>
        )}
      </span>
    </div>
  );
}

/**
 * Format a bigint token amount to human-readable string.
 * e.g. 1500000000000000000n with decimals=18 → "1.5"
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  displayDecimals: number = 4
): string {
  const divisor = 10n ** BigInt(decimals);
  const wholePart = amount / divisor;
  const fractionalPart = amount % divisor;

  if (fractionalPart === 0n) {
    return wholePart.toString();
  }

  const fractionalStr = fractionalPart
    .toString()
    .padStart(decimals, "0")
    .slice(0, displayDecimals)
    .replace(/0+$/, "");

  if (!fractionalStr) {
    return wholePart.toString();
  }

  return `${wholePart}.${fractionalStr}`;
}

/**
 * Truncate an Ethereum address: 0x1234...abcd
 */
export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Calculate withdrawable amount from garden shares using pricePerShare.
 *
 * Formula: userShares * lastPricePerShare / 10^gardenDecimals
 *
 * Result is in reserve asset smallest units (wei for WETH, 1e6 units for USDC, etc.)
 */
export function calculateWithdrawable(
  userShares: bigint,
  lastPricePerShare: bigint,
  gardenDecimals: number
): bigint {
  if (lastPricePerShare === 0n) return 0n;
  const precision = 10n ** BigInt(gardenDecimals);
  return (userShares * lastPricePerShare) / precision;
}

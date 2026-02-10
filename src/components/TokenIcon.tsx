import Image from "next/image";

const TOKEN_ICONS: Record<string, string> = {
  USDC: "/tokens/usdc.svg",
  USDT: "/tokens/usdt.svg",
  DAI: "/tokens/dai.svg",
  ETH: "/tokens/eth.svg",
  WETH: "/tokens/weth.svg",
};

interface TokenIconProps {
  symbol: string;
  size?: number;
}

export function TokenIcon({ symbol, size = 20 }: TokenIconProps) {
  const src = TOKEN_ICONS[symbol.toUpperCase()];

  if (!src) {
    // Fallback: colored circle with first letter
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        className="shrink-0"
        aria-label={symbol}
      >
        <circle cx="10" cy="10" r="10" fill="#64748B" />
        <text
          x="10"
          y="10"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize="10"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          {symbol.charAt(0).toUpperCase()}
        </text>
      </svg>
    );
  }

  return (
    <Image
      src={src}
      alt={symbol}
      width={size}
      height={size}
      className="shrink-0"
    />
  );
}

interface TokenIconsProps {
  asset: string;
  size?: number;
}

/** Renders icons for space/slash separated token list, e.g. "WETH / USDC / DAI" */
export function TokenIcons({ asset, size = 20 }: TokenIconsProps) {
  const tokens = asset.split(/\s*\/\s*/).map((s) => s.trim()).filter(Boolean);

  return (
    <div className="flex items-center -space-x-1.5">
      {tokens.map((token) => (
        <TokenIcon key={token} symbol={token} size={size} />
      ))}
    </div>
  );
}

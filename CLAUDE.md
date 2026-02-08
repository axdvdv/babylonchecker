# Babylon Finance Recovery Check

## Project Overview

Web3 dApp that checks if an Ethereum address has recoverable funds from the defunct Babylon Finance protocol (shut down Nov 2022 after the Rari Capital hack). Two types of checks:

1. **Rari Refund** — check `daiReimbursementAmount` and `claimed` status on RariRefund contract
2. **Babylon Gardens** (~45 contracts) — check `balanceOf` across all garden vaults, fetch details for non-zero balances, calculate withdrawable amount

Users can claim funds directly via connected wallet or manually through Etherscan using displayed parameters.

## Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (`@theme inline` syntax in globals.css)
- **wagmi v3 + viem** for Ethereum interaction
- **@tanstack/react-query** for caching
- **Wallet**: injected connector only (MetaMask/browser extensions). No WalletConnect, no RainbowKit (still in package.json but unused — can be removed)
- **RPC**: Public fallback RPCs (eth.public-rpc.com, ankr, publicnode, 1rpc.io) — no API keys needed
- **Deploy target**: Vercel

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── providers.tsx       # WagmiProvider + QueryClientProvider
│   ├── page.tsx            # Main page — input, results, donation
│   └── globals.css         # Tailwind v4 @theme with babylon-* color tokens
├── components/
│   ├── AddressInput.tsx    # Address input with validation, "Use Wallet" button
│   ├── ConnectWallet.tsx   # Custom wallet connect (injected() connector)
│   ├── CopyField.tsx       # Single-line clickable copy widget
│   ├── GardenCard.tsx      # Expandable garden card — withdraw + Etherscan params
│   ├── GardensList.tsx     # Garden results list with loading skeletons
│   ├── RariRefundCard.tsx  # Rari refund card — claim + Etherscan instructions
│   └── TotalSummary.tsx    # Aggregated totals by token
├── config/
│   ├── gardens.ts          # Garden addresses (~45), GARDEN_ABI, ERC20_ABI
│   ├── rariRefund.ts       # RariRefund address + ABI
│   └── wagmi.ts            # Wagmi config (mainnet, injected, fallback RPCs)
├── hooks/
│   ├── useGardensCheck.ts  # Two-phase multicall garden checker
│   └── useRariRefund.ts    # Rari refund data reader
└── lib/
    ├── calculations.ts     # withdrawable = shares * lastPricePerShare / 10^decimals
    └── formatting.ts       # formatTokenAmount, truncateAddress
```

## Key Technical Details

### Garden Check — Two-Phase Multicall

Phase 1: `balanceOf(address)` for all ~45 gardens (single multicall)
Phase 2: For gardens with balance > 0, fetch: `name`, `decimals`, `lastPricePerShare`, `reserveAsset`
Phase 2b: For unique reserve assets, fetch ERC20 `symbol` + `decimals`

### Withdrawable Calculation

```
withdrawable = userShares * lastPricePerShare / 10^gardenDecimals
```
Result is in reserve asset units (wei for WETH, 1e6 for USDC, etc.)

### Claim Methods

- **Rari**: `claimReimbursement()` — no params, calls RariRefund contract
- **Garden**: `withdraw(balance, 1, userAddress, false, 0x0...0)` — on the garden contract itself

### Smart Contracts

- **RariRefund**: `0x2c1270a714F650F68f80e83850d85d003082B456`
- **Gardens**: ~45 addresses listed in `src/config/gardens.ts` (DAI, USDC, WETH categories)

## Design System

Babylon-themed dark web3 UI. Color tokens defined in globals.css:

- `babylon-bg`: #0B0D2E (deep navy background)
- `babylon-card`: #111340 (card background)
- `babylon-border`: #1A1F4E
- `babylon-gold`: #F0C040 (primary accent, check button, totals)
- `babylon-teal`: #2DD4A0 (positive/claim actions)
- `babylon-purple`: #6C5CE7 (links, connect wallet)
- `babylon-coral`: #E85D75 (errors, disconnect)
- `babylon-text`: #F5F5F5
- `babylon-muted`: #8B8FAD

## Conventions

- All components are `"use client"` (wagmi hooks require client-side)
- BigInt for all token amounts — tsconfig target is ES2020
- Compact UI: token symbol inline with amount, minimal vertical spacing
- Show only gardens with balance > 0
- Display amounts in reserve token (not USD)
- Etherscan manual claim params always available as fallback (builds trust)
- Donation address in page.tsx is placeholder `0x000...` — to be replaced

## Known Issues / TODO

- `@rainbow-me/rainbowkit` in package.json but unused — safe to remove
- RainbowKit CSS override in globals.css (`[data-rk]`) — can be removed
- Donation address is placeholder zero address
- `layout.tsx` metadata title says "Babylon Checker" — could update to "Babylon Finance Recovery Check"

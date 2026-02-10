# Unclaimed Finance

## Project Overview

Multi-project web3 dApp that checks if an Ethereum address has recoverable funds from failed DeFi protocols. Modular architecture — each project is a self-contained module with its own hooks, components, and config.

Currently supports:
1. **Babylon Finance** — Rari refund (DAI) + ~50 garden vaults (WETH, USDC, DAI)
2. **Placeholder** — template for adding new projects

Users can claim funds directly via connected wallet or manually through Etherscan using displayed parameters.

## Tech Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** (`@theme inline` syntax in globals.css) + **shadcn/ui** deps (clsx, tailwind-merge, cva, lucide-react)
- **wagmi v3 + viem** for Ethereum interaction
- **@tanstack/react-query** for caching
- **Wallet**: injected connector only (MetaMask/browser extensions). No WalletConnect, no RainbowKit
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
│   ├── page.tsx            # Main page — hero, search, project grid
│   └── globals.css         # Tailwind v4 @theme with uf-* color tokens
├── components/
│   ├── AddressSearch.tsx   # Centered search bar with Check button
│   ├── ConnectWallet.tsx   # Custom wallet connect (injected() connector)
│   ├── CopyField.tsx       # Single-line clickable copy widget
│   └── ProjectGrid.tsx     # Iterates over project registry, renders cards
├── projects/
│   ├── types.ts            # ProjectModule, ProjectMeta, ProjectCardProps
│   ├── registry.ts         # Central registry — add new projects here
│   ├── babylon/
│   │   ├── index.ts        # Project metadata + Card export
│   │   ├── config.ts       # Garden addresses, ABIs, Rari contract
│   │   ├── useGardensCheck.ts  # Two-phase multicall garden checker
│   │   ├── useRariRefund.ts    # Rari refund data reader
│   │   ├── BabylonCard.tsx # Wrapper card — orchestrates sub-components
│   │   ├── GardenCard.tsx  # Expandable garden card with withdraw
│   │   ├── GardensList.tsx # Garden results list with loading skeletons
│   │   ├── RariRefundCard.tsx  # Rari refund card with claim
│   │   └── TotalSummary.tsx    # Aggregated totals by token
│   └── placeholder/
│       ├── index.ts        # Example project metadata
│       └── PlaceholderCard.tsx  # "Coming Soon" stub card
├── config/
│   └── wagmi.ts            # Wagmi config (mainnet, injected, fallback RPCs)
└── lib/
    ├── calculations.ts     # withdrawable = shares * lastPricePerShare / 10^decimals
    ├── formatting.ts       # formatTokenAmount, truncateAddress
    └── utils.ts            # cn() helper (clsx + tailwind-merge)
```

## Adding a New Project

1. Create `src/projects/<name>/`
2. Define `config.ts` with contract addresses and ABIs
3. Create a check hook (e.g., `useCheck.ts`)
4. Create a `Card` component implementing `ProjectCardProps` (`{ address, enabled }`)
5. Export a `ProjectModule` from `index.ts`
6. Add to `src/projects/registry.ts`

Each project Card is self-contained: it calls its own hooks, manages loading/error states, and renders results + claim UI.

## Key Technical Details

### Project Module Interface

```typescript
interface ProjectModule {
  meta: ProjectMeta;  // id, name, description, incident, chain
  Card: ComponentType<ProjectCardProps>;  // { address: Address, enabled: boolean }
}
```

### Babylon: Garden Check — Two-Phase Multicall

Phase 1: `balanceOf(address)` for all gardens (single multicall)
Phase 2: For gardens with balance > 0, fetch: `name`, `decimals`, `lastPricePerShare`, `reserveAsset`
Phase 2b: For unique reserve assets, fetch ERC20 `symbol` + `decimals`

### Withdrawable Calculation

```
withdrawable = userShares * lastPricePerShare / 10^gardenDecimals
```

### Claim Methods

- **Rari**: `claimReimbursement()` — no params, calls RariRefund contract
- **Garden**: `withdraw(balance, 1, userAddress, false, 0x0...0)` — on the garden contract itself

## Design System

Dark finance-themed UI. Color tokens defined in globals.css with `uf-*` prefix:

- `uf-bg`: #0A0C1A (deep dark background)
- `uf-surface`: #111327 (card/surface background)
- `uf-border`: #1E2245
- `uf-primary`: #3B82F6 (blue — buttons, brand)
- `uf-accent`: #F59E0B (amber — monetary amounts, highlights)
- `uf-success`: #22C55E (green — claim actions, positive states)
- `uf-link`: #818CF8 (indigo — links, wallet connect)
- `uf-danger`: #EF4444 (red — errors, destructive actions)
- `uf-text`: #F1F5F9 (primary text)
- `uf-muted`: #64748B (secondary text)

## Conventions

- All components are `"use client"` (wagmi hooks require client-side)
- BigInt for all token amounts — tsconfig target is ES2020
- Each project is a self-contained module under `src/projects/`
- Show only items with balance > 0
- Display amounts in native token (not USD)
- Etherscan manual claim params always available as fallback
- Donation address: `0x1B75525aCD9C5E9E93b4AAD0E596E464e86FF5aF`

## Deployment

- **Repo**: https://github.com/axdvdv/babylonchecker
- **Live**: https://babylonchecker-rho.vercel.app/
- **Platform**: Vercel (auto-deploy from main branch)

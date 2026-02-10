import { type Address } from "viem";

// Babylon Finance garden addresses with >$1 in recoverable assets
export const GARDEN_ADDRESSES: Address[] = [
  // DAI gardens
  "0x1d50c4f18d7af4fce2ea93c7942aae6260788596",
  "0x8595898f0d2501fa321f92d2325ad4c798f209fd",
  "0x8174e96f7f7e14b252f20de1e5f932cb5a1a911c",
  "0x3d100406e929bf5bcea8bdb0813e09001640f37c",
  "0xb05241ea50e9f5f240168cebf7ec7cfc57afa003",
  "0xe7dfa1e4e601f8f2cb942d910e01f5b040280a16",
  "0xb0ee8c61c78aa9b7ed138bcc6bce7abec8470038",
  "0x3d97a5e6b4c5a6dd1eae15d34c26e18efb086408",
  "0xa6bc0d8281820d44556b7ef63d5f6102b166b201",
  "0xa699fd71a98ecbf81fe2252bd9868417d5600a14",
  "0xb7175d9a884f90de500212ff70859d8ce49956dd",
  "0x2c186b7ed8efe8cdbe252c98b768a9155df4654f",
  "0x5ff1821d04aed1b2509af88edbc0c726d6c9319e",
  "0xf5cae5c0e3a08645b656c68225512d5a7e23f114",
  "0xf622c56481a6d99dee0ff4e311eb6226e6c7f655",
  "0xdcce3308017d675781d15520809e9e87d6b2cdc4",
  "0xf0c38ae1fcd1d8bd72579187a070b703582acfd7",
  "0x8dabe02ecf2518091b1d6072759500e7206a5d67",
  "0xf0af08d7bc6e4ae42b84771ae3f9da7d8e58b083",
  "0xc63e67cbd56c3e825f0d6ae64a10a8e4345faa90",
  "0x13fc90e1d3374f046cd9a03fd52f99fb21a0d2dc",
  "0x8e6dafcace886235e2c5e93d72d85230b449926d",
  "0xeed7932dfe87d1ee44fc98aed8566a5cd4a94a93",
  "0x3eec6ac8675ab1b4768f6032f0598e36ac64f415",
  "0xc34d75b2e593f3c1c65be9265ff0289f9351ba4c",
  "0x54334c1e4e8899faf49255da40e432f6151924d5",
  "0x445ad6f8549c3de03e18bba70aa5bb7670fcf90e",
  "0x740449c03b079a3033475d86308db9c3db4abb39",
  "0x2156d3f282ee0bb63059e8f3464d994e7c4979a9",
  "0x47eb6318902311070024dbcec859deb494ffb6c2",
  "0x055f3b13512817db9e3b43e88778c9d623bd7d22",
  "0xa4e524391a878346a168aabfa984b9b8f94a3db4",
  // USDC gardens
  "0xcbaf0360d7ba83cac29a8926ca01e6a10c5d6da8",
  "0x0a3ef75631fb7afa08fa2f1b9fc72ef72242ac4e",
  "0x26533b903d88221c2eb00182402cf5233dfea371",
  // WETH gardens
  "0x22a591793a9dd506bb3009522dec919120dc3087",
  "0xb5bd20248cfe9480487cc0de0d72d0e19ee0acb6",
  "0x1ec8c3369e166f40f13d296d357ef5fe8eb7161c",
  "0x6bdd40c8e96a0c16111daf97ab1fa37fe84583c4",
  "0xbc201f2153078c6f59e9b2f0b85711669949e5b8",
  "0xdd26a135412b8b4253f5a2bf216ff65c0bbdbf32",
  "0x30c83dd5a31fef1bc6e6cb4eb7cc5aa6a37dfff1",
  "0x5c97b58d345036c861e788b9e970df7594aae551",
  "0x60329a9561da48d65700f0a8380c7fff28f9029f",
  "0x07687a8d0e04a86699b122aa379041793f0a0283",
  "0x01d8a34842d59843628dd213c761034e0313d99e",
  "0xed4bb7f90a1a02bfb2c008dbe6de2c41da08433a",
  "0x5e4792452fbb0d981d97223feb24f58e6c83a543",
];

// Unified Garden ABI — balanceOf, details, and withdraw
export const GARDEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastPricePerShare",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reserveAsset",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_amountIn", type: "uint256" },
      { internalType: "uint256", name: "_minAmountOut", type: "uint256" },
      { internalType: "address payable", name: "_to", type: "address" },
      { internalType: "bool", name: "_withPenalty", type: "bool" },
      { internalType: "address", name: "_unwindStrategy", type: "address" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ERC20 ABI — for fetching reserve token symbol & decimals
export const ERC20_ABI = [
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

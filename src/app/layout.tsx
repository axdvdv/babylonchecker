import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://unclaimed.finance";

export const metadata: Metadata = {
  title: {
    default: "Unclaimed Finance — Recover Lost DeFi Funds",
    template: "%s | Unclaimed Finance",
  },
  description:
    "Over $30M in unclaimed funds are locked in abandoned smart contracts. Check your Ethereum address and recover assets from Babylon Finance, MakerDAO SAI, Compound cSAI, Kinto and more.",
  keywords: [
    "unclaimed crypto",
    "recover DeFi funds",
    "Babylon Finance recovery",
    "SAI redemption",
    "cSAI WETH",
    "lost ethereum tokens",
    "abandoned smart contracts",
    "DeFi fund recovery",
    "claim crypto",
    "Rari refund",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Unclaimed Finance",
    title: "Unclaimed Finance — Recover Lost DeFi Funds",
    description:
      "Over $30M locked in abandoned smart contracts. Enter your Ethereum address to check if you have recoverable assets.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unclaimed Finance — Recover Lost DeFi Funds",
    description:
      "Over $30M locked in abandoned smart contracts. Check your address now.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

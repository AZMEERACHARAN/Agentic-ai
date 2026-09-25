import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecosphere — Global Economic Intelligence",
  description:
    "Ecosphere is an economic intelligence platform for exploring global GDP, trade, inflation, investment, and AI-generated economic analysis.",
  keywords: [
    "economic intelligence",
    "GDP",
    "trade",
    "inflation",
    "FDI",
    "economic data",
    "global economy",
  ],
  authors: [{ name: "Ecosphere" }],
  openGraph: {
    title: "Ecosphere — Global Economic Intelligence",
    description: "Explore the global economy with Ecosphere.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

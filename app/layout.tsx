import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenStacker | Calculate SaaS Waste & Find Open-Source Swaps",
  description:
    "Stop overpaying for software. Calculate how much your startup saves by swapping Slack, Zoom, Notion, Airtable, and Zapier for free open-source tools.",
  openGraph: {
    title: "OpenStacker — Open-Source SaaS Savings Calculator",
    description:
      "Calculate your annual software waste and discover vetted open-source alternatives in 30 seconds.",
    url: "https://openstacker.vercel.app",
    siteName: "OpenStacker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenStacker — Open-Source SaaS Savings Calculator",
    description: "Calculate how much money your startup wastes on proprietary SaaS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white selection:bg-green-500/30 selection:text-green-300 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
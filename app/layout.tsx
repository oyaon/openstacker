import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { GitBranch } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenStacker | Calculate SaaS Waste & Find Open-Source Swaps",
  description:
    "Stop overpaying for software. Calculate your savings by swapping Slack, Zoom, Notion, Airtable for free open-source tools.",
  openGraph: {
    title: "OpenStacker — Open-Source SaaS Savings Calculator",
    description:
      "Calculate your annual software waste and discover vetted open-source alternatives in 30 seconds.",
    url: "https://openstacker.vercel.app",
    siteName: "OpenStacker",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen flex flex-col`}>
        {/* Navigation Bar */}
        <nav className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                <GitBranch className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="font-bold text-lg tracking-tight">OpenStacker</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link href="/directory" className="hover:text-white transition-colors">
                Directory
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Calculator
              </Link>
              <Link href="/migration-guides" className="hover:text-white transition-colors">
                Guides
              </Link>
              <Link href="/submit" className="hover:text-white transition-colors">
                Submit Tool
              </Link>
            </div>

            <Link
              href="/directory"
              className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Browse All
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Global Fat Footer */}
        <footer className="border-t border-zinc-800/60 bg-zinc-900/20 pt-16 pb-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* Brand Column */}
              <div>
                <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-bold text-white">OpenStacker</span>
                </Link>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Helping bootstrapped startups save money by switching to open-source alternatives.
                </p>
              </div>

              {/* Platform Column */}
              <div>
                <h4 className="font-semibold text-sm mb-4 text-white">Platform</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li>
                    <Link href="/directory" className="hover:text-green-400 transition-colors">
                      Directory
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="hover:text-green-400 transition-colors">
                      Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/migration-guides" className="hover:text-green-400 transition-colors">
                      Migration Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/submit" className="hover:text-green-400 transition-colors">
                      Submit Tool
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Top Searches Column */}
              <div>
                <h4 className="font-semibold text-sm mb-4 text-white">Top Searches</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li>
                    <Link href="/alternatives/slack" className="hover:text-green-400 transition-colors">
                      Slack Alternatives
                    </Link>
                  </li>
                  <li>
                    <Link href="/alternatives/notion" className="hover:text-green-400 transition-colors">
                      Notion Alternatives
                    </Link>
                  </li>
                  <li>
                    <Link href="/alternatives/airtable" className="hover:text-green-400 transition-colors">
                      Airtable Alternatives
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Column (NOW FULLY CLICKABLE) */}
              <div>
                <h4 className="font-semibold text-sm mb-4 text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li>
                    <Link href="/privacy" className="hover:text-green-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-green-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zinc-800/60 pt-8 text-xs text-zinc-600 text-center">
              © {new Date().getFullYear()} OpenStacker — Built for bootstrappers.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
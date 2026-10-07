import SavingsCalculator from "@/components/SavingsCalculator";
import Link from "next/link";
import {
  DollarSign,
  ArrowRight,
  GitBranch,
  BookOpen,
  HelpCircle,
  PlusCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-grid-pattern bg-radial-glow">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full text-xs text-green-400 font-semibold mb-6 shadow-lg shadow-green-500/5">
          <DollarSign className="w-3.5 h-3.5" />
          The average startup burns over $4,000/yr on proprietary SaaS
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          Stop burning cash on software.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500">
            Switch to open-source.
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Calculate how much money your startup can save this year by swapping expensive subscriptions for community-vetted open-source tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="#calculator"
            className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
          >
            Calculate Your Waste <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/directory"
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            Browse 30+ Tools
          </Link>
        </div>
      </section>

      {/* 2. Honest Live Metrics Counter Bar */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center backdrop-blur-md shadow-2xl">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">30+</div>
            <div className="text-zinc-500 text-xs font-medium mt-1">Indexed Tools</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-green-400 font-mono">15+</div>
            <div className="text-zinc-500 text-xs font-medium mt-1">Open-Source Swaps</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">100%</div>
            <div className="text-zinc-500 text-xs font-medium mt-1">Free & Self-Hostable</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-green-400 font-mono">9</div>
            <div className="text-zinc-500 text-xs font-medium mt-1">Software Categories</div>
          </div>
        </div>
      </section>

      {/* 3. Main Calculator Container */}
      <section id="calculator" className="max-w-6xl mx-auto px-6 py-12 scroll-mt-20">
        <SavingsCalculator />
      </section>

      {/* 4. Trending Open-Source Swaps Spotlight Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" /> Trending Comparisons
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Popular Open-Source Swaps</h2>
          </div>
          <Link href="/directory" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
            View all 30+ comparisons →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { from: "Slack", to: "Mattermost", cost: "$8.75/user", savings: "$1,050/yr", slug: "slack", domain: "slack.com" },
            { from: "Notion", to: "AppFlowy", cost: "$10.00/user", savings: "$1,200/yr", slug: "notion", domain: "notion.so" },
            { from: "Airtable", to: "NocoDB", cost: "$20.00/user", savings: "$2,400/yr", slug: "airtable", domain: "airtable.com" },
            { from: "Zapier", to: "n8n", cost: "$29.99/mo", savings: "$360/yr", slug: "zapier", domain: "zapier.com" },
          ].map((swap) => (
            <Link
              key={swap.slug}
              href={`/alternatives/${swap.slug}`}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:bg-zinc-900 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 flex items-center justify-center">
                    <img src={`https://www.google.com/s2/favicons?domain=${swap.domain}&sz=128`} alt={swap.from} className="w-5 h-5 object-contain rounded" />
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full">
                    {swap.savings}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-green-400 transition-colors">
                  {swap.from} → {swap.to}
                </h3>
                <p className="text-zinc-500 text-xs">Proprietary cost: {swap.cost}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400 font-medium flex items-center justify-between">
                <span>View Comparison</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-green-400" />
            Simple 3-Step Process
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">How OpenStacker Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-400 font-bold font-mono">
              01
            </div>
            <h3 className="font-bold text-white text-base mb-2">Select Your Stack</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Pick the proprietary tools your team pays for every month (Slack, Notion, Zapier, etc.).
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-400 font-bold font-mono">
              02
            </div>
            <h3 className="font-bold text-white text-base mb-2">Discover Swaps</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Get an instant breakdown of your annual software waste and community-vetted open-source alternatives.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-green-400 font-bold font-mono">
              03
            </div>
            <h3 className="font-bold text-white text-base mb-2">Self-Host & Save</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Use our migration playbooks to deploy open-source tools on a $5/mo VPS and cut your software bill to $0.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Migration Guides Teaser */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-xs text-green-400 font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Step-by-Step Playbooks
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">Need help migrating off SaaS?</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Read our technical guides on exporting data, setting up Docker containers, and configuring open-source software in under 2 hours.
            </p>
          </div>
          <Link href="/migration-guides" className="bg-white hover:bg-zinc-200 text-black font-bold text-sm px-6 py-3.5 rounded-xl transition-all whitespace-nowrap shadow-lg flex items-center gap-2">
            Explore Migration Playbooks →
          </Link>
        </div>
      </section>

      {/* 7. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400 font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-green-400" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Everything You Need to Know</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "Are all the alternatives listed 100% free?", a: "Yes! Every open-source tool listed offers a 100% free, self-hosted community edition." },
            { q: "How do I self-host these tools?", a: "Most provide official Docker images. You can deploy them on a $5/mo cloud VPS in just a few terminal commands." },
            { q: "How accurate are the SaaS pricing calculations?", a: "We regularly verify standard per-seat pricing directly from official vendor pricing pages." },
            { q: "Can I submit my open-source project?", a: "Absolutely! We welcome submissions from indie developers. Visit our Submit page to submit your tool." },
          ].map((faq, idx) => (
            <div key={idx} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> {faq.q}
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Creator CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="border border-green-500/30 bg-gradient-to-r from-green-500/10 via-zinc-900 to-zinc-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">Built an open-source tool?</h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            Get your project featured in front of thousands of bootstrapped founders looking for SaaS swaps.
          </p>
          <Link href="/submit" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-green-500/20">
            <PlusCircle className="w-4 h-4" /> Submit Your Tool for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
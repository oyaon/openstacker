import SavingsCalculator from "@/components/SavingsCalculator";
import { DollarSign, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-full text-xs text-green-400 font-medium mb-6">
          <DollarSign className="w-3.5 h-3.5" />
          The average startup wastes over $4,000/yr on proprietary SaaS
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] mb-6">
          Stop burning cash on software.
          <br />
          <span className="text-green-400">Switch to open-source.</span>
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto">
          Calculate how much money your startup could save this year by swapping expensive SaaS subscriptions for vetted open-source alternatives.
        </p>
      </section>

      {/* Main Interactive Calculator */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <SavingsCalculator />
      </section>

      {/* Features Grid */}
      <section className="border-t border-zinc-800/60 bg-zinc-900/30 py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1.5">100% Free & Open-Source</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Every alternative listed can be self-hosted on your own infrastructure or run for free.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1.5">Accurate Per-Seat Calculations</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              We track official standard pricing from proprietary vendors to calculate exact annual waste.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1.5">Zero Data Lock-in</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Retain full control over your enterprise data, database security, and user privacy.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
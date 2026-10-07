import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: tool } = await supabase
    .from("tools")
    .select("name, tagline")
    .eq("slug", params.slug)
    .single();

  if (!tool) {
    return {
      title: "Tool Not Found | OpenStacker",
    };
  }

  return {
    title: `Best Open-Source Alternatives to ${tool.name} (2026) | OpenStacker`,
    description: `Stop overpaying for ${tool.name}. Discover free, self-hosted, and open-source alternatives to ${tool.name} with real pricing breakdowns.`,
  };
}

export default async function AlternativePage({ params }: Props) {
  const { data: mainTool } = await supabase
    .from("tools")
    .select("*, categories(name)")
    .eq("slug", params.slug)
    .single();

  if (!mainTool) {
    notFound();
  }

  const { data: rawAlternatives } = await supabase
    .from("tool_alternatives")
    .select("key_benefit, estimated_annual_savings, alternative:alternative_tool_id(*)")
    .eq("proprietary_tool_id", mainTool.id);

  const alternatives = rawAlternatives || [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <img
                  src={mainTool.logo_url || `https://www.google.com/s2/favicons?domain=${mainTool.website_url}&sz=128`}
                  alt={mainTool.name}
                  className="w-4 h-4 object-contain rounded"
                />
                <span>{mainTool.name} Alternatives</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
                Best Open-Source Swaps for <span className="text-green-400">{mainTool.name}</span>
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                {mainTool.name} costs ${mainTool.monthly_cost_per_user}
                {mainTool.pricing_type === "per_user" ? "/user" : ""}/mo. Switch to open-source to cut your bill to $0 while retaining 100% data ownership.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-center min-w-[200px]">
              <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                Potential Savings
              </div>
              <div className="text-3xl font-black text-green-400">100% Free</div>
              <div className="text-zinc-500 text-xs mt-1">If self-hosted</div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            Vetted Open-Source Alternatives ({alternatives.length})
          </h2>
        </div>

        {alternatives.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 text-center">
            <p className="text-zinc-400 text-sm mb-4">
              We are currently reviewing open-source alternatives for {mainTool.name}.
            </p>
            <Link
              href="/"
              className="inline-block bg-green-500 text-black font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-green-400 transition-colors"
            >
              Use Savings Calculator →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {alternatives.map((item) => {
              const rawAlt = item.alternative;
              const alt = Array.isArray(rawAlt) ? rawAlt[0] : rawAlt;
              if (!alt) return null;

              return (
                <div
                  key={alt.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex items-center justify-center">
                        <img
                          src={alt.logo_url || `https://www.google.com/s2/favicons?domain=${alt.website_url}&sz=128`}
                          alt={alt.name}
                          className="w-6 h-6 object-contain rounded"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{alt.name}</h3>
                          <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                            Open Source
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-0.5">{alt.tagline}</p>
                      </div>
                    </div>

                    <a
                      href={alt.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      Visit {alt.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                      <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-400" /> Key Advantage over {mainTool.name}
                      </div>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        {item.key_benefit || "100% data control and zero license restrictions."}
                      </p>
                    </div>

                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <div className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4" /> Annual Savings Potential
                      </div>
                      <p className="text-green-300 font-bold text-base">
                        Save ~${item.estimated_annual_savings ? item.estimated_annual_savings.toLocaleString() : "1,000"}/yr
                      </p>
                      <p className="text-zinc-500 text-[11px] mt-0.5">Based on standard team deployment</p>
                    </div>
                  </div>

                  {alt.github_url && (
                    <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
                      <span>Source Code Repository</span>
                      <a
                        href={alt.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors underline"
                      >
                        View on GitHub →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">
            Calculate your custom team savings
          </h3>
          <p className="text-zinc-400 text-xs mb-6 max-w-md mx-auto">
            Select {mainTool.name} along with your other team subscriptions to calculate exact annual waste.
          </p>
          <Link
            href="/"
            className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            Launch Savings Calculator →
          </Link>
        </div>
      </div>
    </main>
  );
}
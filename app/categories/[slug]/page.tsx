import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, ExternalLink, Filter } from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!category) {
    return {
      title: "Category Not Found | OpenStacker",
    };
  }

  return {
    title: `Best Open-Source ${category.name} Tools (2026) | OpenStacker`,
    description: `Browse curated open-source, free, and self-hosted alternatives for ${category.name}. Cut software bills and keep full data control.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  // 1. Fetch category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch tools belonging to this category
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("category_id", category.id)
    .order("is_open_source", { ascending: false });

  const categoryTools = tools || [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/directory"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>

        {/* Category Hero */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 mb-10 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-xs font-semibold text-green-400 mb-4">
            <span>{category.icon}</span>
            <span>Category Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Open-Source <span className="text-green-400">{category.name}</span> Tools
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
            {category.description ||
              `Discover and compare top open-source, self-hosted, and budget-friendly tools in the ${category.name} ecosystem.`}
          </p>
        </div>

        {/* Tools Counter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            Vetted Tools ({categoryTools.length})
          </h2>
        </div>

        {/* Tools List Grid */}
        {categoryTools.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
            <Filter className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-1">No tools listed in this category yet</h3>
            <p className="text-zinc-500 text-xs mb-6">Be the first to submit a tool for this category.</p>
            <Link
              href="/submit"
              className="inline-block bg-green-500 text-black font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-green-400 transition-colors"
            >
              Submit a Tool →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                        {tool.icon}
                      </span>
                      <div>
                        <h3 className="text-white font-bold text-base">{tool.name}</h3>
                        <span className="text-[11px] text-zinc-500 font-medium">
                          {tool.is_open_source ? "Open Source" : "Proprietary"}
                        </span>
                      </div>
                    </div>

                    {tool.is_open_source ? (
                      <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                        Self-Hostable
                      </span>
                    ) : (
                      <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono">
                        Proprietary
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">{tool.tagline}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-zinc-500 block text-[10px]">Price</span>
                    <span className="text-white font-bold">
                      {tool.monthly_cost_per_user === 0
                        ? "Free / $0"
                        : `$${tool.monthly_cost_per_user}${tool.pricing_type === "per_user" ? "/user" : ""}/mo`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tool.is_proprietary && (
                      <Link
                        href={`/alternatives/${tool.slug}`}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Swaps →
                      </Link>
                    )}
                    <a
                      href={tool.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
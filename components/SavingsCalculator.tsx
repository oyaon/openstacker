"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  Check,
  TrendingDown,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

interface DBTool {
  id: string;
  name: string;
  slug: string;
  monthly_cost_per_user: number;
  pricing_type: "per_user" | "flat";
  logo_url: string;
  website_url: string;
  icon: string;
  category_id: string;
  categories?: { name: string } | { name: string }[];
  alternative?: {
    name: string;
    website_url: string;
    logo_url: string;
  };
}

interface Selection {
  toolId: string;
  seats: number;
}

// Helper to strip https:// and www for the Google Favicon API
const getBaseDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export default function SavingsCalculator() {
  const [dbTools, setDbTools] = useState<DBTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCalculatorData() {
      const { data: proprietaryTools } = await supabase
        .from("tools")
        .select("*, categories(name)")
        .eq("is_proprietary", true)
        .order("name", { ascending: true });

      if (proprietaryTools) {
        const { data: mappings } = await supabase
          .from("tool_alternatives")
          .select("proprietary_tool_id, alternative:alternative_tool_id(name, website_url, logo_url)");

        const mappedTools = proprietaryTools.map((tool) => {
          const match = mappings?.find((m) => m.proprietary_tool_id === tool.id);
          const rawAlt = match?.alternative;
          const alt = Array.isArray(rawAlt) ? rawAlt[0] : rawAlt;

          return {
            ...tool,
            alternative: alt || {
              name: "Open-Source Alternative",
              website_url: tool.website_url,
              logo_url: tool.logo_url,
            },
          };
        });

        setDbTools(mappedTools);
      }
      setLoading(false);
    }

    loadCalculatorData();
  }, []);

  const toggleTool = (toolId: string) => {
    if (selections.find((s) => s.toolId === toolId)) {
      setSelections(selections.filter((s) => s.toolId !== toolId));
    } else {
      setSelections([...selections, { toolId, seats: 5 }]);
    }
  };

  const updateSeats = (toolId: string, seats: number) => {
    setSelections(
      selections.map((s) =>
        s.toolId === toolId ? { ...s, seats: Math.max(1, seats) } : s
      )
    );
  };

  const results = useMemo(() => {
    let totalCurrentMonthly = 0;
    const breakdown = selections.map((sel) => {
      const tool = dbTools.find((t) => t.id === sel.toolId)!;
      const currentMonthly =
        tool?.pricing_type === "per_user"
          ? tool.monthly_cost_per_user * sel.seats
          : tool?.monthly_cost_per_user || 0;

      totalCurrentMonthly += currentMonthly;

      return {
        tool,
        seats: sel.seats,
        currentMonthly,
        savingsMonthly: currentMonthly,
        savingsYearly: currentMonthly * 12,
      };
    });

    return {
      breakdown,
      totalCurrentMonthly,
      totalCurrentYearly: totalCurrentMonthly * 12,
      totalSavingsYearly: totalCurrentMonthly * 12,
    };
  }, [selections, dbTools]);

  const getCategoryName = (t: DBTool): string => {
    if (!t.categories) return "General";
    if (Array.isArray(t.categories)) return t.categories[0]?.name || "General";
    return t.categories.name || "General";
  };

  const categories = ["All", ...Array.from(new Set(dbTools.map(getCategoryName)))];

  const filteredTools = useMemo(() => {
    if (activeCategory === "All") return dbTools;
    return dbTools.filter((t) => getCategoryName(t) === activeCategory);
  }, [dbTools, activeCategory]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "3d226848-18e3-4d03-b09e-31d79ff4b901",
          email: email,
          subject: "New OpenStacker Lead!",
          message: `Lead calculated $${Math.round(results.totalSavingsYearly).toLocaleString()}/yr savings across ${selections.length} tools.`,
        }),
      });
      setEmailSubmitted(true);
    } catch (err) {
      console.error(err);
      setEmailSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSelections([]);
    setShowResults(false);
    setEmail("");
    setEmailSubmitted(false);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl backdrop-blur-md">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-zinc-500 text-xs font-mono">Loading tools from database...</p>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (showResults && selections.length > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto text-left">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <TrendingDown className="w-4 h-4" />
            Estimated Annual Savings
          </div>
          <div className="text-6xl md:text-8xl font-black text-white tracking-tight">
            ${Math.round(results.totalSavingsYearly).toLocaleString()}
          </div>
          <div className="text-zinc-400 text-base mt-2">
            per year by switching to open-source alternatives
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden mb-8 shadow-2xl backdrop-blur-md">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Software Breakdown</h3>
            <span className="text-xs text-zinc-500 font-mono">{results.breakdown.length} tools analyzed</span>
          </div>
          <div className="divide-y divide-zinc-800">
            {results.breakdown.map((item) => {
              if (!item.tool) return null;
              return (
                <div key={item.tool.id}>
                  <button
                    onClick={() => setExpandedTool(expandedTool === item.tool.id ? null : item.tool.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex items-center justify-center">
                        <img
                          src={item.tool.logo_url || `https://www.google.com/s2/favicons?domain=${getBaseDomain(item.tool.website_url)}&sz=128`}
                          alt={item.tool.name}
                          className="w-6 h-6 object-contain rounded"
                        />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold text-sm flex items-center gap-2">
                          {item.tool.name}
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                            {item.seats} {item.tool.pricing_type === "per_user" ? "seats" : "plan"}
                          </span>
                        </div>
                        <div className="text-zinc-400 text-xs mt-0.5 flex items-center gap-1.5">
                          Swap for: <span className="text-green-400 font-medium">{item.tool.alternative?.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-sm">
                          +${Math.round(item.savingsYearly).toLocaleString()}/yr
                        </div>
                        <div className="text-zinc-600 text-xs line-through">
                          ${Math.round(item.currentMonthly)}/mo
                        </div>
                      </div>
                      {expandedTool === item.tool.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </div>
                  </button>

                  {expandedTool === item.tool.id && (
                    <div className="px-5 pb-5 pt-2 bg-zinc-950/60">
                      <div className="grid grid-cols-3 gap-3 text-center mb-4">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                          <div className="text-zinc-500 text-[10px] uppercase font-semibold mb-1">Proprietary Cost</div>
                          <div className="text-red-400 font-bold text-sm">
                            ${Math.round(item.currentMonthly * 12).toLocaleString()}/yr
                          </div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                          <div className="text-zinc-500 text-[10px] uppercase font-semibold mb-1">With {item.tool.alternative?.name}</div>
                          <div className="text-green-400 font-bold text-sm">Free / $0</div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3">
                          <div className="text-green-400 text-[10px] uppercase font-semibold mb-1">Your Savings</div>
                          <div className="text-green-300 font-bold text-sm">
                            ${Math.round(item.savingsYearly).toLocaleString()}/yr
                          </div>
                        </div>
                      </div>
                      <a
                        href={item.tool.alternative?.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm py-2.5 rounded-xl transition-colors"
                      >
                        Visit {item.tool.alternative?.name} <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-center mb-6 shadow-2xl">
          <Sparkles className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white mb-1">Get Free Open-Source Migration Guides</h3>
          <p className="text-zinc-400 text-xs mb-4 max-w-sm mx-auto">
            Get step-by-step instructions to move your team off paid SaaS this weekend.
          </p>
          {emailSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
              <Check className="w-4 h-4" /> Migration checklist sent to your inbox!
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={isSubmitting}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Guides"}
              </button>
            </form>
          )}
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium mx-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Start new calculation
        </button>
      </div>
    );
  }

  // --- SELECTION VIEW (DENSE GRID) ---
  return (
    <div className="w-full max-w-5xl mx-auto text-left">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
          Select the software tools you pay for
        </h2>
        <p className="text-zinc-400 text-sm">
          Click tools to add them to your stack and adjust team seat counts.
        </p>
      </div>

      {/* Horizontal Category Pill Tabs */}
      <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Balanced Dense Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {filteredTools.map((tool) => {
          const isSelected = !!selections.find((s) => s.toolId === tool.id);
          const sel = selections.find((s) => s.toolId === tool.id);

          return (
            <div
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`relative cursor-pointer rounded-2xl border p-4 transition-all select-none flex flex-col justify-between ${
                isSelected
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                  : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex items-center justify-center shadow-inner">
                    <img
                      src={tool.logo_url || `https://www.google.com/s2/favicons?domain=${getBaseDomain(tool.website_url)}&sz=128`}
                      alt={tool.name}
                      className="w-6 h-6 object-contain rounded"
                    />
                  </div>
                  {isSelected ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg font-mono">
                      {getCategoryName(tool)}
                    </span>
                  )}
                </div>

                <div className="text-white font-bold text-base mb-0.5">{tool.name}</div>
                <div className="text-zinc-400 text-xs font-mono">
                  ${tool.monthly_cost_per_user}
                  {tool.pricing_type === "per_user" ? "/user" : ""}/mo
                </div>
              </div>

              {/* Swap Tag */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 text-[11px]">Swap:</span>
                <span className="text-green-400 font-semibold text-xs truncate pl-2">
                  {tool.alternative?.name}
                </span>
              </div>

              {/* Seat Counter */}
              {isSelected && (
                <div
                  className="mt-3 pt-3 border-t border-zinc-700/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300 font-medium">Team Seats:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateSeats(tool.id, (sel?.seats || 5) - 1)}
                        className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 text-xs font-bold"
                      >
                        −
                      </button>
                      <span className="text-white font-bold text-xs w-6 text-center">
                        {sel?.seats || 5}
                      </span>
                      <button
                        onClick={() => updateSeats(tool.id, (sel?.seats || 5) + 1)}
                        className="w-7 h-7 rounded-lg bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      {selections.length > 0 && (
        <div className="text-center bg-zinc-900/95 border border-zinc-800 p-4 rounded-2xl sticky bottom-6 backdrop-blur-md shadow-2xl z-40">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            <div className="text-left">
              <div className="text-zinc-400 text-xs">Selected Software Stack</div>
              <div className="text-white font-bold text-sm">{selections.length} tools added</div>
            </div>
            <button
              onClick={() => setShowResults(true)}
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg shadow-green-500/20"
            >
              Calculate Savings <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
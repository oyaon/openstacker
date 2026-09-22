"use client";

import { useState, useMemo } from "react";
import { tools } from "@/data/tools";
import {
  ArrowRight,
  Check,
  TrendingDown,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Selection {
  toolId: string;
  seats: number;
}

export default function SavingsCalculator() {
  const [selections, setSelections] = useState<Selection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

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
    let totalAlternativeMonthly = 0;

    const breakdown = selections.map((sel) => {
      const tool = tools.find((t) => t.id === sel.toolId)!;
      const currentMonthly =
        tool.pricingType === "per_user"
          ? tool.monthlyCostPerUser * sel.seats
          : tool.monthlyCostPerUser;
      const altMonthly = tool.alternative.cost * sel.seats;

      totalCurrentMonthly += currentMonthly;
      totalAlternativeMonthly += altMonthly;

      return {
        tool,
        seats: sel.seats,
        currentMonthly,
        altMonthly,
        savingsMonthly: currentMonthly - altMonthly,
        savingsYearly: (currentMonthly - altMonthly) * 12,
      };
    });

    return {
      breakdown,
      totalCurrentMonthly,
      totalCurrentYearly: totalCurrentMonthly * 12,
      totalAlternativeYearly: totalAlternativeMonthly * 12,
      totalSavingsYearly: (totalCurrentMonthly - totalAlternativeMonthly) * 12,
    };
  }, [selections]);

  const categories = Array.from(new Set(tools.map((t) => t.category)));

  const reset = () => {
    setSelections([]);
    setShowResults(false);
    setEmail("");
    setEmailSubmitted(false);
  };

  if (showResults && selections.length > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto text-left">
        {/* Big Savings Card */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingDown className="w-4 h-4" />
            Estimated Annual Savings
          </div>
          <div className="text-6xl md:text-7xl font-black text-white tracking-tight">
            ${Math.round(results.totalSavingsYearly).toLocaleString()}
          </div>
          <div className="text-zinc-400 text-base mt-2">
            per year by switching to open-source
          </div>
        </div>

        {/* Breakdown List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8">
          <div className="p-5 border-b border-zinc-800 bg-zinc-900/80">
            <h3 className="text-base font-bold text-white">
              Your Software Breakdown
            </h3>
          </div>
          <div className="divide-y divide-zinc-800">
            {results.breakdown.map((item) => (
              <div key={item.tool.id}>
                <button
                  onClick={() =>
                    setExpandedTool(
                      expandedTool === item.tool.id ? null : item.tool.id
                    )
                  }
                  className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.tool.icon}</span>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">
                        {item.tool.name}
                      </div>
                      <div className="text-zinc-500 text-xs">
                        {item.seats}{" "}
                        {item.tool.pricingType === "per_user"
                          ? "seats"
                          : "plan"}{" "}
                        →{" "}
                        <span className="text-zinc-300 font-medium">
                          {item.tool.alternative.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-sm">
                        +${Math.round(item.savingsYearly).toLocaleString()}/yr
                      </div>
                      <div className="text-zinc-600 text-xs line-through">
                        ${item.currentMonthly.toFixed(2)}/mo
                      </div>
                    </div>
                    {expandedTool === item.tool.id ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </button>

                {expandedTool === item.tool.id && (
                  <div className="px-5 pb-5 pt-2 bg-zinc-950/50">
                    <div className="grid grid-cols-3 gap-3 text-center mb-4">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                        <div className="text-zinc-500 text-[10px] uppercase font-medium mb-1">
                          Current Cost
                        </div>
                        <div className="text-red-400 font-bold text-sm">
                          $
                          {Math.round(item.currentMonthly * 12).toLocaleString()}
                          /yr
                        </div>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                        <div className="text-zinc-500 text-[10px] uppercase font-medium mb-1">
                          With {item.tool.alternative.name}
                        </div>
                        <div className="text-green-400 font-bold text-sm">
                          {item.altMonthly === 0
                            ? "Free"
                            : `$${Math.round(
                                item.altMonthly * 12
                              ).toLocaleString()}/yr`}
                        </div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                        <div className="text-green-400 text-[10px] uppercase font-medium mb-1">
                          You Save
                        </div>
                        <div className="text-green-300 font-bold text-sm">
                          $
                          {Math.round(item.savingsYearly).toLocaleString()}/yr
                        </div>
                      </div>
                    </div>
                    <a
                      href={item.tool.alternative.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-green-500 hover:bg-green-400 text-black font-bold text-sm py-2.5 rounded-xl transition-colors"
                    >
                      Explore {item.tool.alternative.name} →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Capture */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center mb-6">
          <Sparkles className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white mb-1">
            Get Free Open-Source Migration Guides
          </h3>
          <p className="text-zinc-400 text-xs mb-4 max-w-sm mx-auto">
            Get step-by-step instructions to move your team from paid SaaS to
            self-hosted tools.
          </p>
          {emailSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
              <Check className="w-4 h-4" /> Check your inbox soon!
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setEmailSubmitted(true);
              }}
              className="flex gap-2 max-w-sm mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                Send Guides
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

  return (
    <div className="w-full max-w-4xl mx-auto text-left">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
          Select the tools you currently pay for
        </h2>
        <p className="text-zinc-400 text-sm">
          Click any tool to select it and adjust team sizes.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {tools
                .filter((t) => t.category === category)
                .map((tool) => {
                  const isSelected = !!selections.find(
                    (s) => s.toolId === tool.id
                  );
                  const sel = selections.find((s) => s.toolId === tool.id);

                  return (
                    <div
                      key={tool.id}
                      onClick={() => toggleTool(tool.id)}
                      className={`relative cursor-pointer rounded-xl border p-3.5 transition-all select-none ${
                        isSelected
                          ? "border-green-500 bg-green-500/10"
                          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                        </div>
                      )}
                      <div className="text-2xl mb-1.5">{tool.icon}</div>
                      <div className="text-white font-semibold text-sm">
                        {tool.name}
                      </div>
                      <div className="text-zinc-500 text-xs mt-0.5">
                        ${tool.monthlyCostPerUser}
                        {tool.pricingType === "per_user" ? "/user" : ""}/mo
                      </div>

                      {isSelected && (
                        <div
                          className="mt-3 pt-2.5 border-t border-zinc-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="text-[10px] text-zinc-400 block mb-1 font-medium">
                            {tool.pricingType === "per_user"
                              ? "Seats"
                              : "Units"}
                          </label>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                updateSeats(tool.id, (sel?.seats || 5) - 1)
                              }
                              className="w-6 h-6 rounded bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 text-xs font-bold"
                            >
                              −
                            </button>
                            <span className="text-white font-bold text-xs">
                              {sel?.seats || 5}
                            </span>
                            <button
                              onClick={() =>
                                updateSeats(tool.id, (sel?.seats || 5) + 1)
                              }
                              className="w-6 h-6 rounded bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {selections.length > 0 && (
        <div className="text-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl sticky bottom-6 backdrop-blur-md bg-zinc-900/90 shadow-2xl">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            <div className="text-left">
              <div className="text-zinc-400 text-xs">Selected Tools</div>
              <div className="text-white font-bold text-sm">
                {selections.length} tools added
              </div>
            </div>
            <button
              onClick={() => setShowResults(true)}
              className="bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              Calculate Savings <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
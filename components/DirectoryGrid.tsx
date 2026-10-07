"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, ExternalLink, ShieldCheck } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  website_url: string;
  github_url?: string;
  logo_url?: string;
  icon: string;
  is_proprietary: boolean;
  is_open_source: boolean;
  is_self_hosted: boolean;
  pricing_model: string;
  monthly_cost_per_user: number;
  pricing_type: string;
  category_id: string;
  categories?: Category;
}

interface DirectoryGridProps {
  initialTools: Tool[];
  categories: Category[];
}

export default function DirectoryGrid({ initialTools, categories }: DirectoryGridProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [typeFilter, setFilterType] = useState<"all" | "open_source" | "proprietary">("all");

  const filteredTools = useMemo(() => {
    return initialTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || tool.category_id === selectedCategory;

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "open_source" && tool.is_open_source) ||
        (typeFilter === "proprietary" && tool.is_proprietary);

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [initialTools, search, selectedCategory, typeFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 mb-10 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Slack, Notion, Mattermost..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === "all" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All Tools ({initialTools.length})
            </button>
            <button
              onClick={() => setFilterType("open_source")}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === "open_source" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Open Source
            </button>
            <button
              onClick={() => setFilterType("proprietary")}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                typeFilter === "proprietary" ? "bg-zinc-800 text-zinc-300" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Proprietary
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-white text-black font-bold"
                : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? "bg-white text-black font-bold"
                  : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-zinc-400 text-sm font-medium">
          Showing <span className="text-white font-bold">{filteredTools.length}</span> tools
        </h3>
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <Filter className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h4 className="text-white font-bold mb-1">No matching tools found</h4>
          <p className="text-zinc-500 text-xs mb-4">Try adjusting your search or category filters.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setFilterType("all");
            }}
            className="text-green-400 text-xs font-bold hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:bg-zinc-900/90 group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <img
                        src={tool.logo_url || `https://www.google.com/s2/favicons?domain=${tool.website_url}&sz=128`}
                        alt={tool.name}
                        className="w-6 h-6 object-contain rounded"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base group-hover:text-green-400 transition-colors">
                        {tool.name}
                      </h4>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {tool.categories?.name || "Software"}
                      </span>
                    </div>
                  </div>

                  {tool.is_open_source ? (
                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Open Source
                    </span>
                  ) : (
                    <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono">
                      Proprietary
                    </span>
                  )}
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2">
                  {tool.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-zinc-500 block text-[10px]">Pricing</span>
                  <span className="text-white font-bold">
                    {tool.monthly_cost_per_user === 0
                      ? "Free / Self-Hosted"
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
                    className="bg-green-500 hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
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
  );
}
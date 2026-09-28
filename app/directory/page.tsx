import { supabase } from "@/lib/supabase";
import DirectoryGrid from "@/components/DirectoryGrid";
import { GitBranch } from "lucide-react";

export const metadata = {
  title: "Software Directory & Open-Source Swaps | OpenStacker",
  description:
    "Browse vetted software tools and discover free, self-hosted open-source alternatives for your tech stack.",
};

export const revalidate = 0;

export default async function DirectoryPage() {
  // 1. Fetch categories
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  // 2. Fetch tools
  const { data: tools, error: toolError } = await supabase
    .from("tools")
    .select("*")
    .order("name", { ascending: true });

  if (catError) console.error("Categories fetch error:", catError);
  if (toolError) console.error("Tools fetch error:", toolError);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-10">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs text-zinc-400 font-medium mb-4">
          <GitBranch className="w-3.5 h-3.5 text-green-400" />
          Live Software Index
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          Software & Open-Source Directory
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Explore proprietary SaaS tools alongside their community-vetted open-source alternatives.
        </p>
      </section>

      {/* Interactive Directory Grid */}
      <DirectoryGrid
        initialTools={tools || []}
        categories={categories || []}
      />
    </main>
  );
}
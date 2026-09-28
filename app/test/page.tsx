import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data: tools, error } = await supabase.from("tools").select("name, slug, is_open_source");

  if (error) {
    return (
      <div className="p-10 text-red-500 font-bold">
        ❌ Connection Failed: {error.message}
      </div>
    );
  }

  return (
    <div className="p-10 font-mono text-sm bg-zinc-950 text-white min-h-screen">
      <h1 className="text-xl font-bold text-green-400 mb-4">
        ✅ Supabase Connection Successful!
      </h1>
      <p className="text-zinc-400 mb-6">
        Retrieved {tools?.length} tools directly from PostgreSQL:
      </p>
      <ul className="space-y-2 border border-zinc-800 p-4 rounded-xl max-w-md bg-zinc-900">
        {tools?.map((tool) => (
          <li key={tool.slug} className="flex justify-between">
            <span>{tool.name}</span>
            <span className={tool.is_open_source ? "text-green-400" : "text-zinc-500"}>
              {tool.is_open_source ? "Open Source" : "Proprietary"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
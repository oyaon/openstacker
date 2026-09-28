import Link from "next/link";
import { BookOpen, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "SaaS to Open-Source Migration Guides | OpenStacker",
  description: "Step-by-step guides for technical teams and startups migrating off proprietary SaaS to self-hosted tools.",
};

const guides = [
  {
    title: "How to Migrate from Slack to Mattermost in Under 2 Hours",
    slug: "slack-to-mattermost",
    description: "Export channels, message history, and user roles from Slack into a self-hosted Mattermost Docker instance.",
    category: "Communication",
    readTime: "8 min read",
    icon: "💬",
  },
  {
    title: "Replacing Airtable with NocoDB on Postgres",
    slug: "airtable-to-nocodb",
    description: "Connect your existing database to NocoDB and recreate relational spreadsheet views without row limits.",
    category: "Database",
    readTime: "6 min read",
    icon: "🗄️",
  },
  {
    title: "Self-Hosting n8n: The Complete Zapier Alternative Guide",
    slug: "zapier-to-n8n",
    description: "Deploy n8n using Docker Compose and migrate multi-step automated webhooks without paying per-task execution costs.",
    category: "Automation",
    readTime: "10 min read",
    icon: "⚡",
  },
];

export default function MigrationGuidesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-full text-xs text-green-400 font-medium mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Step-by-Step Playbooks
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            SaaS Migration Guides
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Practical technical playbooks to move your team off expensive SaaS subscriptions cleanly.
          </p>
        </div>

        <div className="space-y-4">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/migration-guides/${guide.slug}`}
              className="block bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all group hover:bg-zinc-900/80"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
                    {guide.icon}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">
                      {guide.category} · {guide.readTime}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors mt-0.5">
                      {guide.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed mb-4 pl-12">
                {guide.description}
              </p>

              <div className="pl-12 flex items-center justify-between">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Verified Migration Path
                </span>
                <span className="text-xs font-bold text-green-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
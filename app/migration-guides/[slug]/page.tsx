import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Props {
  params: {
    slug: string;
  };
}

const guideData: Record<string, {
  title: string;
  category: string;
  readTime: string;
  icon: string;
  summary: string;
  steps: { step: string; title: string; content: string }[];
}> = {
  "slack-to-mattermost": {
    title: "How to Migrate from Slack to Mattermost in Under 2 Hours",
    category: "Communication",
    readTime: "8 min read",
    icon: "💬",
    summary: "Complete walkthrough to export channels, user accounts, and attachments from Slack and import them into a self-hosted Mattermost Docker instance.",
    steps: [
      {
        step: "01",
        title: "Export Your Slack Data",
        content: "Go to Slack Workspace Settings -> Administration -> Workspace Settings -> Import/Export Data. Select 'Export' for all public channels."
      },
      {
        step: "02",
        title: "Deploy Mattermost via Docker",
        content: "Spin up a basic Mattermost instance on your server using: `docker run -d --name mattermost -p 8065:8065 mattermost/mattermost-team-edition`"
      },
      {
        step: "03",
        title: "Run Mattermost Bulk Import",
        content: "Use the built-in Mattermost CLI tool `mctl import slack` to transform your Slack JSON export file into native Mattermost team records."
      }
    ]
  },
  "airtable-to-nocodb": {
    title: "Replacing Airtable with NocoDB on Postgres",
    category: "Database",
    readTime: "6 min read",
    icon: "🗄️",
    summary: "How to connect NocoDB to an existing PostgreSQL database and migrate Airtable CSV exports without hit row limits.",
    steps: [
      {
        step: "01",
        title: "Download Airtable Views as CSV",
        content: "In Airtable, open each base view and click 'Download CSV'. Store them in a local folder."
      },
      {
        step: "02",
        title: "Launch NocoDB Engine",
        content: "Run NocoDB locally or on Docker: `docker run -d -p 8080:8080 nocodb/nocodb:latest`"
      },
      {
        step: "03",
        title: "Import CSVs and Re-establish Foreign Keys",
        content: "In NocoDB, click 'Create New Table from CSV'. Upload your files and map relational columns to rebuild your Airtable base."
      }
    ]
  },
  "zapier-to-n8n": {
    title: "Self-Hosting n8n: The Complete Zapier Alternative Guide",
    category: "Automation",
    readTime: "10 min read",
    icon: "⚡",
    summary: "Set up n8n for unlimited automated workflows and webhook executions without task limits.",
    steps: [
      {
        step: "01",
        title: "Deploy n8n with Persistence",
        content: "Set up n8n on Docker with environment variables for WEBHOOK_URL and N8N_PORT."
      },
      {
        step: "02",
        title: "Map Zapier Triggers to n8n Nodes",
        content: "Recreate your Zapier triggers (Webhooks, Gmail, Typeform, Slack) using n8n's 400+ built-in node integrations."
      },
      {
        step: "03",
        title: "Test Execution and Switch Webhooks",
        content: "Update production API endpoints to point to your new n8n webhook URLs and turn off your paid Zapier zaps."
      }
    ]
  }
};

export default function GuideDetailPage({ params }: Props) {
  const guide = guideData[params.slug];

  if (!guide) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/migration-guides"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Guides
        </Link>

        <article className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-3 text-xs text-green-400 font-semibold mb-4">
            <span className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {guide.category}
            </span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {guide.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
            {guide.title}
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed mb-8 pb-8 border-b border-zinc-800">
            {guide.summary}
          </p>

          <div className="space-y-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              Step-by-Step Playbook
            </h2>

            {guide.steps.map((item) => (
              <div key={item.step} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg">
                    STEP {item.step}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed pl-1">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
            <div className="inline-flex items-center gap-2 text-green-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Ready to calculate team savings?
            </div>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-6 py-3 rounded-xl transition-colors"
              >
                Launch Savings Calculator →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
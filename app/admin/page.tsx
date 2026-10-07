"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  LogOut,
  Sparkles,
} from "lucide-react";

interface Submission {
  id: string;
  tool_name: string;
  website_url: string;
  category_name: string;
  description: string;
  is_open_source: boolean;
  github_url: string | null;
  contact_email: string;
  plan: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const getBaseDomain = (url: string): string => {
  if (!url) return "slack.com";
  try {
    const validUrl = url.startsWith("http") ? url : `https://${url}`;
    const hostname = new URL(validUrl).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
};

export default function AdminDashboard() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Default Passcode: "admin123" (You can change this anytime)
  const ADMIN_PASSCODE = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAuthorized(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch submissions error:", error);
    if (data) setSubmissions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchSubmissions();
    }
  }, [isAuthorized, fetchSubmissions]);

  // ONE-CLICK APPROVE & PUBLISH TO DIRECTORY
  const approveAndPublish = async (sub: Submission) => {
    setActionMessage(`Publishing ${sub.tool_name}...`);

    try {
      // 1. Fetch matching category ID
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("name", sub.category_name)
        .single();

      // 2. Generate clean slug from tool_name
      const generatedSlug = sub.tool_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // 3. Insert tool directly into live tools table
      const logoUrl = `https://www.google.com/s2/favicons?domain=${getBaseDomain(sub.website_url)}&sz=128`;

      const { error: insertError } = await supabase.from("tools").insert([
        {
          name: sub.tool_name,
          slug: generatedSlug,
          tagline: sub.description,
          website_url: sub.website_url,
          github_url: sub.github_url || null,
          logo_url: logoUrl,
          is_proprietary: !sub.is_open_source,
          is_open_source: sub.is_open_source,
          is_self_hosted: sub.is_open_source,
          pricing_model: sub.is_open_source ? "open_source" : "paid",
          monthly_cost_per_user: 0,
          category_id: catData?.id || null,
          featured: sub.plan === "featured",
        },
      ]);

      if (insertError) {
        console.error("Tool insert error:", insertError);
        alert(`Error inserting tool: ${insertError.message}`);
        return;
      }

      // 4. Update submission status to 'approved'
      await supabase
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", sub.id);

      setActionMessage(`✅ ${sub.tool_name} published to live Directory!`);
      fetchSubmissions();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // REJECT SUBMISSION
  const rejectSubmission = async (id: string) => {
    await supabase.from("submissions").update({ status: "rejected" }).eq("id", id);
    fetchSubmissions();
  };

  // PASSCODE LOCK SCREEN
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">OpenStacker Admin</h1>
          <p className="text-zinc-500 text-xs mb-6">Enter passkey to manage submissions</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (default: admin123)"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-center text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors font-mono"
            />
            {passcodeError && (
              <p className="text-red-400 text-xs font-semibold">Incorrect passcode</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold text-sm py-2.5 rounded-xl transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  const filteredSubmissions = submissions.filter((s) => s.status === filterStatus);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Tool Submissions Manager</h1>
          </div>

          <button
            onClick={() => setIsAuthorized(false)}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Lock Dashboard
          </button>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-xs font-semibold mb-6 animate-fade-in flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {actionMessage}
          </div>
        )}

        {/* Status Filters */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "pending"
                ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Pending ({submissions.filter((s) => s.status === "pending").length})
          </button>

          <button
            onClick={() => setFilterStatus("approved")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "approved"
                ? "bg-white text-black font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Approved ({submissions.filter((s) => s.status === "approved").length})
          </button>

          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "rejected"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            Rejected ({submissions.filter((s) => s.status === "rejected").length})
          </button>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-zinc-500 text-xs font-mono">Fetching submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
            <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-white font-bold text-sm mb-1">No {filterStatus} submissions</h3>
            <p className="text-zinc-500 text-xs">New user submissions from /submit will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{sub.tool_name}</h3>
                    <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono">
                      {sub.category_name}
                    </span>
                    {sub.plan === "featured" && (
                      <span className="bg-green-500 text-black font-bold px-2 py-0.5 rounded text-[10px]">
                        FEATURED PLAN ($49)
                      </span>
                    )}
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed">{sub.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
                    <a
                      href={sub.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      {sub.website_url} <ExternalLink className="w-3 h-3" />
                    </a>
                    {sub.github_url && (
                      <a
                        href={sub.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white underline font-mono"
                      >
                        GitHub Repo
                      </a>
                    )}
                    <span>Contact: {sub.contact_email}</span>
                  </div>
                </div>

                {/* Actions */}
                {sub.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveAndPublish(sub)}
                      className="bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" /> Approve & Publish
                    </button>
                    <button
                      onClick={() => rejectSubmission(sub.id)}
                      className="bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
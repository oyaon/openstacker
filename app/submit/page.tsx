"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    toolName: "",
    websiteUrl: "",
    category: "Communication",
    description: "",
    isOpenSource: "yes",
    githubUrl: "",
    contactEmail: "",
    plan: "free",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert into Supabase Submissions Table
      const { error: dbError } = await supabase.from("submissions").insert([
        {
          tool_name: formData.toolName,
          website_url: formData.websiteUrl,
          category_name: formData.category,
          description: formData.description,
          is_open_source: formData.isOpenSource === "yes",
          github_url: formData.githubUrl || null,
          contact_email: formData.contactEmail,
          plan: formData.plan,
          status: "pending",
        },
      ]);

      if (dbError) console.error("Database submission error:", dbError);

      // 2. Email Notification via Web3Forms
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "3d226848-18e3-4d03-b09e-31d79ff4b901",
          subject: `New Tool Submission: ${formData.toolName} (${formData.plan.toUpperCase()})`,
          from_name: "OpenStacker Submissions",
          message: `
            Tool Name: ${formData.toolName}
            Website: ${formData.websiteUrl}
            Category: ${formData.category}
            Tagline: ${formData.description}
            Open Source: ${formData.isOpenSource}
            GitHub: ${formData.githubUrl || "N/A"}
            Contact Email: ${formData.contactEmail}
            Requested Plan: ${formData.plan}
          `,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-12 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-full text-xs text-green-400 font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Get Your Tool Listed
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Submit Your Open-Source Tool
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
            Reach thousands of bootstrapped founders, indie hackers, and developers actively looking for SaaS alternatives.
          </p>
        </div>

        {submitted ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Submission Received!</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Our team will review <span className="text-white font-semibold">{formData.toolName}</span> within 24 hours. We&apos;ll notify you at <span className="text-green-400 font-semibold">{formData.contactEmail}</span> when it goes live.
            </p>
            <Link
              href="/directory"
              className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-6 py-3 rounded-xl transition-colors"
            >
              Browse Directory →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div
                onClick={() => setFormData({ ...formData, plan: "free" })}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                  formData.plan === "free"
                    ? "border-green-500 bg-green-500/10"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                }`}
              >
                <div className="text-xs text-zinc-400 font-medium mb-1">Standard Listing</div>
                <div className="text-xl font-bold text-white mb-1">Free</div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Indexed in directory and alternative search pages. Reviewed within 3 business days.
                </p>
              </div>

              <div
                onClick={() => setFormData({ ...formData, plan: "featured" })}
                className={`relative cursor-pointer rounded-2xl border p-5 transition-all ${
                  formData.plan === "featured"
                    ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/10"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700"
                }`}
              >
                <span className="absolute -top-2.5 right-4 bg-green-500 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  MOST POPULAR
                </span>
                <div className="text-xs text-green-400 font-medium mb-1">Featured Listing</div>
                <div className="text-xl font-bold text-white mb-1">
                  $49 <span className="text-xs text-zinc-500 font-normal">one-time</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Pinned to top of category page with a &quot;Featured&quot; badge. Priority review.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tool Name *</label>
                <input
                  type="text"
                  required
                  value={formData.toolName}
                  onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                  placeholder="e.g. Mattermost, NocoDB, Plausible"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Website URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://yourtool.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="Communication">Communication</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Database">Database</option>
                    <option value="Automation">Automation</option>
                    <option value="Project Management">Project Management</option>
                    <option value="CRM">CRM</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Support">Support</option>
                    <option value="Design">Design</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Developer Tools">Developer Tools</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tagline *</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Open-source Slack alternative for technical teams"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Is it Open Source? *</label>
                  <select
                    value={formData.isOpenSource}
                    onChange={(e) => setFormData({ ...formData, isOpenSource: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="yes">Yes, Open Source / Self-Hosted</option>
                    <option value="no">No, Proprietary / Affordable SaaS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">GitHub Repository (Optional)</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/org/repo"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="founder@yourtool.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold text-sm py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
            >
              {loading ? "Submitting Tool..." : "Submit Tool for Review"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
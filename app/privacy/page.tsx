import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | OpenStacker",
  description: "Privacy Policy for OpenStacker software directory and calculator.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-12 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
              <p className="text-zinc-500 text-xs">Last updated: January 2026</p>
            </div>
          </div>

          <div className="prose prose-invert text-zinc-400 text-sm space-y-6 leading-relaxed">
            <p>
              At OpenStacker (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), accessible from openstacker.vercel.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by OpenStacker and how we use it.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">1. Information We Collect</h2>
            <p>
              We collect information in two main ways:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Email Addresses:</strong> When you request migration guides or submit a tool, we collect your email address strictly to fulfill your request.</li>
              <li><strong className="text-white">Usage Analytics:</strong> Standard non-personally identifiable log files including browser type, referring pages, and timestamp to improve site UX.</li>
            </ul>

            <h2 className="text-base font-bold text-white mt-6 mb-2">2. How We Use Your Information</h2>
            <p>
              We use collected information to send requested open-source migration guides, process tool submissions, communicate updates regarding featured listings, and analyze site performance.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">3. Third-Party Services & Affiliate Links</h2>
            <p>
              OpenStacker contains outbound links to third-party software websites and repositories. We do not control or accept responsibility for third-party privacy practices. Some links may be affiliate links where we earn a small commission at no additional cost to you.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">4. Data Security</h2>
            <p>
              We do not sell, rent, or trade your email address or submitted information to third parties under any circumstances.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">5. Contact Us</h2>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us via our <Link href="/submit" className="text-green-400 underline">submission form</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
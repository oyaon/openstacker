import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | OpenStacker",
  description: "Terms of Service for OpenStacker software directory.",
};

export default function TermsPage() {
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
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
              <p className="text-zinc-500 text-xs">Last updated: January 2026</p>
            </div>
          </div>

          <div className="prose prose-invert text-zinc-400 text-sm space-y-6 leading-relaxed">
            <p>
              By accessing OpenStacker (openstacker.vercel.app), you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">1. Directory Information & Estimations</h2>
            <p>
              Software pricing estimates, savings calculations, and tool comparisons provided on OpenStacker are for informational purposes only. We make every effort to maintain accurate pricing data, but proprietary SaaS vendors may update their pricing at any time.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">2. Tool Submissions & Featured Listings</h2>
            <p>
              By submitting a tool to OpenStacker, you represent that you have the right to submit the software listing. We reserve the right to approve, reject, re-categorize, or edit tool submissions to maintain directory quality.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">3. Disclaimer & Limitation of Liability</h2>
            <p>
              In no event shall OpenStacker or its owners be liable for any damages or software migration issues arising out of the use or inability to use the recommendations or tools listed on our website.
            </p>

            <h2 className="text-base font-bold text-white mt-6 mb-2">4. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with applicable standard web operating laws.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
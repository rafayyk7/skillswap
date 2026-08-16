import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative rounded-3xl overflow-hidden p-16 sm:p-24">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/15 to-cyan-600/10" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-indigo-500/60 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-violet-500/60 to-transparent" />

          {/* Glow orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-sm font-medium mb-8">
              <Sparkles size={14} />
              Your next skill is one swap away
            </div>

            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to start <span className="gradient-text">swapping</span>?
            </h2>

            <p className="text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Join 25,000+ learners who have discovered the most rewarding way to grow — by teaching others.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
              >
                Join SkillSwap
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white/8 border border-white/12 text-white font-semibold text-lg hover:bg-white/12 hover:border-white/20 transition-all"
              >
                Browse Skills First
              </Link>
            </div>

            <p className="text-sm text-slate-600 mt-8">
              Free forever · No credit card required · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


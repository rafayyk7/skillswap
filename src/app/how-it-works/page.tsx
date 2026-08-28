import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import {
  UserPlus,
  BookOpen,
  Search,
  Send,
  Calendar,
  GraduationCap,
  Star,
  ArrowRight,
  Zap,
  Users,
  ArrowLeftRight,
  MessageSquare,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <UserPlus size={24} />,
    title: "Create Your Profile",
    description: "Sign up and build your SkillSwap profile. Share who you are, where you're from, and what makes you unique.",
    color: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/20",
  },
  {
    step: "02",
    icon: <BookOpen size={24} />,
    title: "Add Skills You Can Teach",
    description: "List the skills you're confident teaching — from coding to cooking, design to languages. Be specific about your expertise level.",
    color: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
  },
  {
    step: "03",
    icon: <Search size={24} />,
    title: "Add Skills You Want to Learn",
    description: "Tell us what you want to learn. Our matching system uses this to find the perfect teaching partners for you.",
    color: "from-purple-500 to-pink-500",
    glow: "shadow-purple-500/20",
  },
  {
    step: "04",
    icon: <Users size={24} />,
    title: "Discover People",
    description: "Browse matches based on complementary skills. Our algorithm finds people whose teaching perfectly matches your learning goals.",
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/20",
  },
  {
    step: "05",
    icon: <Send size={24} />,
    title: "Send a Swap Request",
    description: "Found someone interesting? Send a swap request proposing which skills you'll exchange and when you're available.",
    color: "from-blue-500 to-indigo-500",
    glow: "shadow-blue-500/20",
  },
  {
    step: "06",
    icon: <Calendar size={24} />,
    title: "Connect & Schedule",
    description: "Once your request is accepted, schedule a session that works for both of you. Choose your preferred time and duration.",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  {
    step: "07",
    icon: <GraduationCap size={24} />,
    title: "Learn & Exchange",
    description: "Meet online, teach what you know, learn what you don't. Both of you grow — that's the power of skill swapping.",
    color: "from-teal-500 to-cyan-500",
    glow: "shadow-teal-500/20",
  },
  {
    step: "08",
    icon: <Star size={24} />,
    title: "Leave a Review",
    description: "After each session, rate your experience. Reviews help build trust and help others find great learning partners.",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99,102,241,0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,102,241,0.12) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-sm font-medium mb-8">
            <Zap size={14} />
            Simple Process
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            How <span className="gradient-text">SkillSwap</span> Works
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Getting started takes minutes. Finding your match takes seconds. Learning together lasts a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25"
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Explore Skills
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Your Journey in 8 Steps
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              From signing up to mastering new skills — here's how SkillSwap works.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {steps.map((step, i) => (
              <div key={step.step} className="relative group">
                <div className="relative bg-surface-2 border border-black/6 dark:border-white/6 rounded-2xl p-6 sm:p-7 hover:border-black/10 dark:hover:border-white/15 hover:bg-surface-3 transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <div className="flex items-start gap-5">
                    {/* Step number + icon */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-600 tracking-wider">
                        STEP {step.step}
                      </div>
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow} flex items-center justify-center text-white`}
                      >
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Flow Section */}
      <section className="py-16 sm:py-24 bg-surface-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              The Complete Flow
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              From profile to proficiency — every step is designed for seamless learning.
            </p>
          </div>

          {/* Flow diagram */}
          <div className="flex flex-col items-center gap-4">
            {[
              { icon: <UserPlus size={20} />, label: "Create Profile", color: "bg-indigo-500" },
              { icon: <BookOpen size={20} />, label: "Add Skills", color: "bg-violet-500" },
              { icon: <Search size={20} />, label: "Find Matches", color: "bg-cyan-500" },
              { icon: <ArrowLeftRight size={20} />, label: "Swap Request", color: "bg-blue-500" },
              { icon: <MessageSquare size={20} />, label: "Connect", color: "bg-emerald-500" },
              { icon: <GraduationCap size={20} />, label: "Learn Together", color: "bg-teal-500" },
              { icon: <Star size={20} />, label: "Review", color: "bg-amber-500" },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                {i < arr.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-cyan-600/10" />
            <div className="absolute inset-0 border border-black/8 dark:border-white/8 rounded-3xl" />

            <div className="relative px-8 py-14 sm:px-16 sm:py-18">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Start <span className="gradient-text">Swapping</span>?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                Join thousands of learners and teachers exchanging knowledge worldwide. It&apos;s free to get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/25"
                >
                  Create Your Account
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Browse Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

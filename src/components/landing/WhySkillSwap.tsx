import { DollarSign, Users, BookOpen, Heart, Lightbulb, Repeat2 } from "lucide-react";

const reasons = [
  {
    icon: <DollarSign size={22} />,
    title: "No Money Required",
    description: "Knowledge is the currency. Exchange skills directly — no subscription fees, no payment barriers, no premium walls.",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: <Users size={22} />,
    title: "Learn from Real People",
    description: "Learn from someone actively using the skill professionally — not pre-recorded videos or generic tutorials.",
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Teach What You Know",
    description: "Teaching reinforces your own expertise. Share your knowledge while learning something entirely new.",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: <Heart size={22} />,
    title: "Build Meaningful Connections",
    description: "Skill swaps create genuine relationships. You're not just a student or teacher — you're a peer.",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: <Lightbulb size={22} />,
    title: "Learn Practical Skills",
    description: "Every session is hands-on, personalized, and goal-driven. Learn exactly what you need for real-world application.",
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: <Repeat2 size={22} />,
    title: "Teacher & Learner",
    description: "Be both simultaneously. The SkillSwap model means you grow in two directions at once — always.",
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
];

export default function WhySkillSwap() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-600/6 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
              Why SkillSwap?
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Knowledge exchanged is knowledge <span className="gradient-text">multiplied</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Traditional learning costs time and money. SkillSwap rewrites that equation — turning every person into both a teacher and a student in a self-sustaining community of knowledge.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <span className="text-slate-900 dark:text-white font-semibold">12,847</span> skill swaps completed this month
              </p>
            </div>
          </div>

          {/* Right grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className={`rounded-2xl p-5 border ${reason.bg} hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className={`${reason.color} mb-3`}>{reason.icon}</div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{reason.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

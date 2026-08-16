import { UserPlus, BookOpen, Repeat2, GraduationCap } from "lucide-react";

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
    title: "Add Your Skills",
    description: "List the skills you can teach and the ones you want to learn. Be specific — the better your profile, the better your matches.",
    color: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
  },
  {
    step: "03",
    icon: <Repeat2 size={24} />,
    title: "Find Your Perfect Match",
    description: "Our matching system analyzes your skills and finds people whose teaching perfectly complements what you want to learn.",
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/20",
  },
  {
    step: "04",
    icon: <GraduationCap size={24} />,
    title: "Learn Together",
    description: "Schedule sessions, meet online, and exchange knowledge. You teach, they teach — both of you grow.",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            How SkillSwap Works
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Getting started takes minutes. Finding your match takes seconds. Learning together lasts a lifetime.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.step} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
              )}

              <div className="relative z-10 bg-surface-2 border border-white/6 rounded-2xl p-6 hover:border-white/15 hover:bg-surface-3 transition-all duration-300 group-hover:-translate-y-1">
                {/* Step number */}
                <div className="text-xs font-bold text-slate-600 tracking-wider mb-4">
                  STEP {step.step}
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow} flex items-center justify-center text-white mb-5`}
                >
                  {step.icon}
                </div>

                <h3 className="text-base font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

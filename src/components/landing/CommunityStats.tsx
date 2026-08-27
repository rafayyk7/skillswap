import { Users, Globe, Star, Repeat2 } from "lucide-react";

const stats = [
  { value: "25,000+", label: "Active Learners", sublabel: "from 80+ countries", icon: <Users size={24} />, color: "from-indigo-500 to-violet-500", iconBg: "bg-indigo-500/15", iconColor: "text-indigo-500 dark:text-indigo-400" },
  { value: "12,400+", label: "Skills Exchanged", sublabel: "and counting daily", icon: <Repeat2 size={24} />, color: "from-violet-500 to-purple-500", iconBg: "bg-violet-500/15", iconColor: "text-violet-500 dark:text-violet-400" },
  { value: "80+", label: "Countries", sublabel: "truly global community", icon: <Globe size={24} />, color: "from-cyan-500 to-blue-500", iconBg: "bg-cyan-500/15", iconColor: "text-cyan-500 dark:text-cyan-400" },
  { value: "4.9/5", label: "Avg. Experience", sublabel: "rated by our users", icon: <Star size={24} />, color: "from-amber-500 to-orange-500", iconBg: "bg-amber-500/15", iconColor: "text-amber-500 dark:text-amber-400" },
];

export default function CommunityStats() {
  return (
    <section id="community" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-indigo-500 dark:text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Our Community
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            A Global Learning <span className="gradient-text">Community</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Real numbers from real people exchanging real knowledge every single day.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative bg-surface-2 border border-black/6 dark:border-white/6 rounded-2xl p-6 sm:p-7 text-center hover:border-black/10 dark:hover:border-white/15 hover:bg-surface-3 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Subtle top accent line */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.iconBg} mb-5`}>
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>

              {/* Value */}
              <div className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2 tabular-nums">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {stat.label}
              </div>

              {/* Sublabel */}
              <div className="text-xs text-slate-400 dark:text-slate-600">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-10">
          * Statistics shown are demo values for this frontend preview
        </p>
      </div>
    </section>
  );
}

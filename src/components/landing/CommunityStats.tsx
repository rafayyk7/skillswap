import { Users, Globe, Star, Repeat2 } from "lucide-react";

const stats = [
  { value: "25,000+", label: "Active Learners", sublabel: "from 80+ countries", icon: <Users size={20} />, color: "text-indigo-400" },
  { value: "12,400+", label: "Skills Exchanged", sublabel: "and counting daily", icon: <Repeat2 size={20} />, color: "text-violet-400" },
  { value: "80+", label: "Countries", sublabel: "truly global community", icon: <Globe size={20} />, color: "text-cyan-400" },
  { value: "4.9/5", label: "Avg. Experience", sublabel: "rated by our users", icon: <Star size={20} />, color: "text-amber-400" },
];

export default function CommunityStats() {
  return (
    <section id="community" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Decorative container */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-cyan-600/10" />
          <div className="absolute inset-0 border border-white/8 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                A Global Learning Community
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Real numbers from real people exchanging real knowledge every single day.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`flex items-center justify-center gap-2 mb-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-300 mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-600">{stat.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="text-center text-xs text-slate-600 mt-10">
              * Statistics shown are demo values for this frontend preview
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

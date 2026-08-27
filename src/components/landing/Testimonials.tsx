import { Star } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "UX Designer → Python Developer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc",
    country: "India",
    stars: 5,
    quote: "I traded Figma lessons for Python sessions with someone in Seattle. Within 3 months I automated my entire design workflow. SkillSwap literally changed my career trajectory.",
    skill: "Taught: Figma · Learned: Python",
  },
  {
    id: 2,
    name: "James Okafor",
    role: "Data Scientist",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=james&backgroundColor=b6e3f4",
    country: "Nigeria",
    stars: 5,
    quote: "The matching algorithm is incredible. It found me someone in Berlin who needed exactly what I could teach — SQL and data viz — and could teach me German in return. We became friends.",
    skill: "Taught: SQL · Learned: German",
  },
  {
    id: 3,
    name: "Sofia Rossi",
    role: "Language Teacher",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sofia&backgroundColor=d1f4e0",
    country: "Italy",
    stars: 5,
    quote: "As a language teacher I always wanted to understand digital marketing. Found the perfect swap in 2 days. My Italian lessons for their growth marketing expertise. Brillante!",
    skill: "Taught: Italian · Learned: Marketing",
  },
  {
    id: 4,
    name: "Ryan Park",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ryan&backgroundColor=c0aede",
    country: "South Korea",
    stars: 5,
    quote: "I've completed 15 swaps so far. The sessions are so much better than online courses because you're learning with someone who actually cares. No teacher is more motivated than a learner.",
    skill: "Taught: React · Learned: Photography",
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Fitness Coach",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=emma&backgroundColor=ffdfba",
    country: "Australia",
    stars: 5,
    quote: "Who knew I could exchange workout plans for video editing skills? Now I produce all my own content professionally. The community here is incredibly supportive and genuine.",
    skill: "Taught: Fitness · Learned: Video Editing",
  },
  {
    id: 6,
    name: "Lucas Novak",
    role: "Music Producer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=lucas&backgroundColor=b6e3f4",
    country: "Czech Republic",
    stars: 5,
    quote: "Learning web development through SkillSwap while teaching music production was the best decision I made this year. My swap partner is now my business collaborator.",
    skill: "Taught: Music Production · Learned: Web Dev",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-rose-500 dark:text-rose-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Community Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Real People. Real Swaps. Real Growth.
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Every swap creates a story. Here are some from our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-surface-2 border border-black/6 dark:border-white/6 rounded-2xl p-6 hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 group"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="pt-4 border-t border-black/6 dark:border-white/6">
                <div className="flex items-center gap-3">
                  <Avatar src={t.avatar} name={t.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.country}</p>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-3 font-medium">{t.skill}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

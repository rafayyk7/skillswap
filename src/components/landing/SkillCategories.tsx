"use client";

import Link from "next/link";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Monitor,
  Smartphone,
  Palette,
  PenTool,
  Film,
  Megaphone,
  Search,
  UtensilsCrossed,
  Camera,
  Mic,
  Globe,
  Music,
  Dumbbell,
  BrainCircuit,
  ShieldCheck,
  BarChart3,
  Briefcase,
  DollarSign,
  PenLine,
  Code2,
  Sprout,
} from "lucide-react";
import type { ReactNode } from "react";

const categoryIcons: Record<string, ReactNode> = {
  "web-dev": <Monitor size={18} />,
  "mobile": <Smartphone size={18} />,
  "design": <Palette size={18} />,
  "uiux": <PenTool size={18} />,
  "video": <Film size={18} />,
  "marketing": <Megaphone size={18} />,
  "seo": <Search size={18} />,
  "cooking": <UtensilsCrossed size={18} />,
  "photography": <Camera size={18} />,
  "speaking": <Mic size={18} />,
  "languages": <Globe size={18} />,
  "music": <Music size={18} />,
  "fitness": <Dumbbell size={18} />,
  "ai": <BrainCircuit size={18} />,
  "cybersec": <ShieldCheck size={18} />,
  "data": <BarChart3 size={18} />,
  "business": <Briefcase size={18} />,
  "finance": <DollarSign size={18} />,
  "writing": <PenLine size={18} />,
  "programming": <Code2 size={18} />,
  "personal": <Sprout size={18} />,
};

export function getCategoryIcon(id: string): ReactNode {
  return categoryIcons[id] ?? <Monitor size={18} />;
}

export default function SkillCategories() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-600/6 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-violet-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
              Explore Categories
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Every Skill You <span className="gradient-text">Can Imagine</span>
            </h2>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors whitespace-nowrap"
          >
            Browse all categories
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {skillCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className={cn(
                "group relative rounded-2xl border border-white/6 bg-surface-2 p-4",
                "hover:border-white/15 hover:bg-surface-3 transition-all duration-200 hover:-translate-y-0.5",
                "flex flex-col items-center text-center gap-2"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                  `bg-gradient-to-br ${cat.color} opacity-90`
                )}
              >
                {getCategoryIcon(cat.id)}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200 leading-snug group-hover:text-white transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{cat.count.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


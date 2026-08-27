"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Users, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const floatingCards = [
  { id: 1, name: "Sarah Chen", role: "UI/UX Designer", skill: "Teaching: Figma", want: "Wants: Python", match: "98%", color: "from-indigo-500/20 to-violet-500/20", border: "border-indigo-500/30", x: "-left-4 md:-left-12", y: "top-12", delay: "0s" },
  { id: 2, name: "Alex Rodriguez", role: "Full-Stack Dev", skill: "Teaching: React", want: "Wants: Figma", match: "95%", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30", x: "-right-4 md:-right-12", y: "top-24", delay: "1s" },
  { id: 3, name: "Mia Thompson", role: "Video Creator", skill: "Teaching: Video Editing", want: "Wants: TypeScript", match: "87%", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", x: "-left-4 md:-left-16", y: "bottom-16", delay: "2s" },
  { id: 4, name: "Kai Nakamura", role: "Data Scientist", skill: "Teaching: Python", want: "Wants: Design", match: "91%", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", x: "-right-4 md:-right-16", y: "bottom-8", delay: "0.5s" },
];

const stats = [
  { value: "25K+", label: "Learners", icon: <Users size={16} /> },
  { value: "80+", label: "Countries", icon: <Globe size={16} /> },
  { value: "12K+", label: "Swaps Done", icon: <Sparkles size={16} /> },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/4 rounded-full blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-8">
              <Sparkles size={14} />
              The Future of Peer Learning
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
              Learn a skill.{" "}
              <span className="gradient-text">Teach a skill.</span>{" "}
              Swap knowledge.
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              SkillSwap connects people who want to learn with people who want to teach — creating meaningful skill exchanges without money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
              >
                Start Swapping
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/6 dark:bg-white/6 border border-black/12 dark:border-white/12 text-slate-700 dark:text-white font-semibold text-base hover:bg-black/5 dark:hover:bg-white/10 hover:border-black/15 dark:hover:border-white/20 transition-all"
              >
                Explore Skills
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center lg:justify-start">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="flex items-center gap-1.5 justify-center lg:justify-start text-indigo-500 dark:text-indigo-400 mb-1">
                    {stat.icon}
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                  </div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative flex items-center justify-center h-[500px] lg:h-[600px]">
            {/* Center orb */}
            <div className="relative z-10 w-40 h-40 rounded-full flex items-center justify-center animate-pulse-glow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600/30 to-violet-600/30 blur-xl" />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex flex-col items-center justify-center shadow-2xl shadow-indigo-500/40">
                <Zap size={32} className="text-white mb-1" />
                <span className="text-white text-xs font-bold">SWAP</span>
              </div>
            </div>

            {/* Connection lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 500">
              <line x1="200" y1="250" x2="50" y2="80" stroke="url(#g1)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="200" y1="250" x2="350" y2="100" stroke="url(#g1)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="200" y1="250" x2="50" y2="420" stroke="url(#g1)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="200" y1="250" x2="350" y2="400" stroke="url(#g1)" strokeWidth="1" strokeDasharray="4 4" />
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating profile cards */}
            {floatingCards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  "absolute w-52 glass-strong rounded-2xl p-3 border",
                  `bg-gradient-to-br ${card.color}`,
                  card.border,
                  card.x,
                  card.y
                )}
                style={{
                  animation: `float 4s ease-in-out infinite`,
                  animationDelay: card.delay,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {card.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{card.name}</p>
                    <p className="text-slate-400 text-xs">{card.role}</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-indigo-300 bg-indigo-500/20 rounded-full px-2 py-0.5">
                    {card.match}
                  </span>
                </div>
                <p className="text-xs text-emerald-400">{card.skill}</p>
                <p className="text-xs text-indigo-300">{card.want}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  );
}

function Zap({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}


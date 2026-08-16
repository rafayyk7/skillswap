"use client";

import { TrendingUp, Clock, BookOpen, Star, Zap, Award, Calendar } from "lucide-react";
import { mockProgressStats, mockLearningEntries } from "@/data/progress";
import { mockSessions } from "@/data/sessions";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

function ProgressBar({ value, max = 100, color = "bg-indigo-500" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-white/6 rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const stats = mockProgressStats;
  const completedSessions = mockSessions.filter((s) => s.status === "completed");

  const statCards = [
    { label: "Learning Hours", value: stats.totalLearningHours, unit: "hrs", icon: <BookOpen size={18} />, color: "from-indigo-500 to-violet-500", bg: "bg-indigo-500/10" },
    { label: "Teaching Hours", value: stats.totalTeachingHours, unit: "hrs", icon: <Zap size={18} />, color: "from-violet-500 to-purple-500", bg: "bg-violet-500/10" },
    { label: "Completed Sessions", value: stats.completedSessions, unit: "", icon: <Calendar size={18} />, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/10" },
    { label: "Skills Learned", value: stats.skillsLearned, unit: "", icon: <TrendingUp size={18} />, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10" },
    { label: "Skills Taught", value: stats.skillsTaught, unit: "", icon: <Award size={18} />, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10" },
    { label: "Avg Rating", value: stats.averageRating, unit: "/5", icon: <Star size={18} />, color: "from-rose-500 to-pink-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Learning Progress</h1>
        <p className="text-slate-400">Track your growth as both a teacher and learner on SkillSwap.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface-2 border border-white/6 rounded-2xl p-5">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", card.bg)}>
              <div className={cn("bg-gradient-to-br text-transparent bg-clip-text", card.color)}>
                {/* fallback: use color text */}
              </div>
              <span className="text-slate-300">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {card.value}{card.unit}
            </p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Active swaps + streak */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-white mb-1">{stats.activeSwaps}</p>
              <p className="text-slate-400 text-sm">Active Swaps</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
              <Zap size={28} className="text-indigo-400" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            You have {stats.activeSwaps} ongoing skill exchanges
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-white mb-1">{stats.streak} 🔥</p>
              <p className="text-slate-400 text-sm">Day Streak</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Award size={28} className="text-amber-400" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Keep going! You&apos;re on a {stats.streak}-day learning streak
          </div>
        </div>
      </div>

      {/* Learning journey */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-5">Active Learning Journeys</h2>
        <div className="space-y-4">
          {mockLearningEntries.map((entry) => (
            <div key={entry.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-white">{entry.skill.name}</h3>
                  <p className="text-sm text-slate-500">{entry.skill.categoryName}</p>
                </div>
                <Badge variant="info" size="sm">{entry.progress}% complete</Badge>
              </div>

              <div className="mb-3">
                <ProgressBar value={entry.progress} color="bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={11} />{entry.hoursCompleted}h completed</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{entry.sessions} sessions</span>
                <span>Last: {entry.lastSessionDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session history */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-5">Session History</h2>
        <div className="space-y-3">
          {completedSessions.map((session) => {
            const partner = session.teacherId === "current" ? session.learner : session.teacher;
            const role = session.teacherId === "current" ? "Taught" : "Learned";

            return (
              <div key={session.id} className="bg-surface-2 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <Avatar src={partner.avatar} name={partner.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{session.skill.name}</p>
                  <p className="text-xs text-slate-500">{role} with {partner.name} · {session.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={role === "Taught" ? "info" : "purple"} size="sm">{role}</Badge>
                  <span className="text-xs text-slate-500">{session.duration}min</span>
                </div>
              </div>
            );
          })}

          {completedSessions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No completed sessions yet. Start your first swap!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

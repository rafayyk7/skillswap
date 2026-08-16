"use client";

import Link from "next/link";
import {
  ArrowRight,
  Video,
  Clock,
  TrendingUp,
  Star,
  BookOpen,
  Users,
  ArrowLeftRight,
  Calendar,
  Bell,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import MatchRing from "@/components/ui/MatchRing";
import Button from "@/components/ui/Button";
import { currentUser } from "@/data/users";
import { mockSessions } from "@/data/sessions";
import { mockRequests } from "@/data/requests";
import { mockMatches } from "@/data/matches";
import { mockNotifications } from "@/data/notifications";
import { mockConversations } from "@/data/messages";
import { mockProgressStats } from "@/data/progress";

export default function DashboardPage() {
  const upcomingSessions = mockSessions.filter((s) => s.status === "scheduled");
  const pendingRequests = mockRequests.filter((r) => r.status === "pending" && r.toUserId === "current");
  const topMatches = mockMatches.slice(0, 3);
  const recentNotifs = mockNotifications.filter((n) => !n.read).slice(0, 3);
  const recentConvos = mockConversations.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Skills Taught", value: mockProgressStats.skillsTaught, icon: <BookOpen size={16} />, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Skills Learned", value: mockProgressStats.skillsLearned, icon: <TrendingUp size={16} />, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Sessions Done", value: mockProgressStats.completedSessions, icon: <Calendar size={16} />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Hours Swapped", value: mockProgressStats.totalLearningHours + mockProgressStats.totalTeachingHours, icon: <Clock size={16} />, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Average Rating", value: mockProgressStats.averageRating, icon: <Star size={16} />, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "Active Swaps", value: mockProgressStats.activeSwaps, icon: <ArrowLeftRight size={16} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting}, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your skill swaps.</p>
        </div>
        <Link href="/matches">
          <Button icon={<Sparkles size={16} />}>Find New Match</Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-2 border border-white/6 rounded-2xl p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming sessions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming Sessions</h2>
            <Link href="/sessions" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingSessions.slice(0, 3).map((session) => {
            const partner = session.teacherId === "current" ? session.learner : session.teacher;
            const role = session.teacherId === "current" ? "Teaching" : "Learning";
            return (
              <div key={session.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all">
                <div className="flex items-start gap-4">
                  <Avatar src={partner.avatar} name={partner.name} size="lg" isOnline={partner.isOnline} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{partner.name}</h3>
                      <Badge variant={role === "Teaching" ? "info" : "purple"} size="sm">{role}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {session.skill.name} · {session.duration} min
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={12} />{session.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{session.time}</span>
                    </div>
                  </div>
                  <Link href={`/sessions/${session.id}`}>
                    <Button size="sm" icon={<Video size={14} />}>Join</Button>
                  </Link>
                </div>
              </div>
            );
          })}

          {upcomingSessions.length === 0 && (
            <div className="bg-surface-2 border border-white/6 rounded-2xl p-10 text-center">
              <Calendar size={32} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">No upcoming sessions</p>
              <Link href="/matches" className="text-sm text-indigo-400 mt-2 block">Find a swap partner →</Link>
            </div>
          )}

          {/* Pending requests */}
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-lg font-semibold text-white">Pending Requests</h2>
            <Link href="/requests" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {pendingRequests.slice(0, 2).map((req) => (
            <div key={req.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start gap-4">
                <Avatar src={req.fromUser.avatar} name={req.fromUser.name} size="md" isOnline={req.fromUser.isOnline} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{req.fromUser.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">wants to swap <span className="text-indigo-300">{req.learnSkill.name}</span> for <span className="text-violet-300">{req.teachSkill.name}</span></p>
                  <p className="text-xs text-slate-500 line-clamp-1">{req.message}</p>
                </div>
                <MatchRing percentage={req.matchPercentage} size="sm" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="primary" className="flex-1">Accept</Button>
                <Button size="sm" variant="danger" className="flex-1">Decline</Button>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="bg-surface-2 border border-white/6 rounded-2xl p-8 text-center">
              <ArrowLeftRight size={28} className="mx-auto text-slate-600 mb-2" />
              <p className="text-slate-400 text-sm">No pending requests</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Top matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Suggested Matches</h2>
              <Link href="/matches" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {topMatches.map((match) => (
                <Link key={match.userId} href={`/profile/${match.user.username}`}>
                  <div className="bg-surface-2 border border-white/6 rounded-xl p-4 hover:border-white/15 transition-all group">
                    <div className="flex items-center gap-3">
                      <Avatar src={match.user.avatar} name={match.user.name} size="md" isOnline={match.user.isOnline} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{match.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{match.teachingSkill.name} ↔ {match.learningSkill.name}</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-300 shrink-0">{match.matchPercentage}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <Link href="/notifications" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentNotifs.map((notif) => (
                <Link key={notif.id} href={notif.actionUrl ?? "/notifications"}>
                  <div className="bg-surface-2 border border-white/6 rounded-xl p-3 hover:border-white/15 transition-all">
                    <div className="flex items-start gap-2">
                      {notif.fromUser && (
                        <Avatar src={notif.fromUser.avatar} name={notif.fromUser.name} size="xs" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{notif.message}</p>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent messages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
              <Link href="/messages" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-2">
              {recentConvos.map((conv) => {
                const other = conv.participants.find((p) => p.id !== "current")!;
                return (
                  <Link key={conv.id} href="/messages">
                    <div className="bg-surface-2 border border-white/6 rounded-xl p-3 hover:border-white/15 transition-all">
                      <div className="flex items-center gap-3">
                        <Avatar src={other.avatar} name={other.name} size="sm" isOnline={other.isOnline} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white">{other.name}</p>
                          <p className="text-xs text-slate-500 truncate">{conv.lastMessage?.content}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center font-bold">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


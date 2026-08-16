"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, User, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { mockSessions } from "@/data/sessions";
import type { SessionStatus } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "upcoming" | "today" | "completed" | "cancelled";

const statusConfig: Record<SessionStatus, { label: string; variant: "success" | "warning" | "danger" | "default" | "info" | "purple" }> = {
  scheduled: { label: "Scheduled", variant: "info" },
  ongoing: { label: "Ongoing", variant: "success" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "danger" },
  rescheduled: { label: "Rescheduled", variant: "warning" },
};

const TODAY = "2024-12-28";

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const filtered = mockSessions.filter((s) => {
    if (activeTab === "upcoming") return s.status === "scheduled" && s.date >= TODAY;
    if (activeTab === "today") return s.date === TODAY;
    if (activeTab === "completed") return s.status === "completed";
    if (activeTab === "cancelled") return s.status === "cancelled";
    return false;
  });

  const tabs: { id: Tab; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "today", label: "Today" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sessions</h1>
        <p className="text-slate-400">Manage your teaching and learning sessions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 border border-white/6 rounded-xl p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/25"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sessions */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Calendar size={40} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No {activeTab} sessions</h3>
            <p className="text-slate-600">
              {activeTab === "upcoming" ? "Schedule a session with one of your swap partners." : `No ${activeTab} sessions found.`}
            </p>
          </div>
        )}

        {filtered.map((session) => {
          const partner = session.teacherId === "current" ? session.learner : session.teacher;
          const role = session.teacherId === "current" ? "Teaching" : "Learning";

          return (
            <div key={session.id} className="bg-surface-2 border border-white/6 rounded-2xl p-6 hover:border-white/12 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar src={partner.avatar} name={partner.name} size="lg" isOnline={partner.isOnline} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-white">{partner.name}</h3>
                      <Badge variant={role === "Teaching" ? "info" : "purple"} size="sm">{role}</Badge>
                      <Badge variant={statusConfig[session.status].variant} size="sm">
                        {statusConfig[session.status].label}
                      </Badge>
                    </div>

                    <p className="text-base font-medium text-slate-300 mb-3">{session.skill.name}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5"><Calendar size={14} />{session.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} />{session.time} · {session.duration} min</span>
                    </div>

                    {session.objectives.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-slate-500 mb-2 font-medium">OBJECTIVES</p>
                        <ul className="space-y-1">
                          {session.objectives.slice(0, 2).map((obj, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                              <span className="text-indigo-400 mt-0.5">•</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {session.status === "scheduled" && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/6">
                  <Link href={`/sessions/${session.id}`}>
                    <Button size="sm" icon={<Video size={14} />}>Join Session</Button>
                  </Link>
                  <Link href={`/sessions/${session.id}`}>
                    <Button variant="secondary" size="sm" icon={<User size={14} />}>View Details</Button>
                  </Link>
                  <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />}>Reschedule</Button>
                  <Button variant="danger" size="sm" icon={<XCircle size={14} />}>Cancel</Button>
                </div>
              )}

              {session.status === "completed" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/6">
                  <Link href={`/sessions/${session.id}`}>
                    <Button variant="secondary" size="sm">View Details</Button>
                  </Link>
                  <Link href="/reviews">
                    <Button variant="outline" size="sm" icon={<CheckCircle size={14} />}>Leave Review</Button>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


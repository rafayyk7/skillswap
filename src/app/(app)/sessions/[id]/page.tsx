"use client";

import { use } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, Users, CheckCircle, ArrowLeft, FileText, Target } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { mockSessions } from "@/data/sessions";

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const session = mockSessions.find((s) => s.id === id) ?? mockSessions[0];
  const partner = session.teacherId === "current" ? session.learner : session.teacher;
  const role = session.teacherId === "current" ? "Teaching" : "Learning";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Link href="/sessions" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft size={16} />
        Back to Sessions
      </Link>

      {/* Session header */}
      <div className="bg-surface-2 border border-white/8 rounded-2xl overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {role === "Teaching" ? "Teaching" : "Learning"} {session.skill.name}
              </h1>
              <p className="text-slate-400 text-sm">{session.skill.categoryName}</p>
            </div>
            <Badge
              variant={session.status === "scheduled" ? "info" : session.status === "completed" ? "success" : "danger"}
              size="md"
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
          </div>

          {/* Partner */}
          <div className="flex items-center gap-4 p-4 bg-surface-3 rounded-xl border border-white/6 mb-6">
            <Avatar src={partner.avatar} name={partner.name} size="xl" isOnline={partner.isOnline} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-white">{partner.name}</h2>
                <Badge variant={role === "Teaching" ? "info" : "purple"} size="sm">
                  {role === "Teaching" ? "Learner" : "Teacher"}
                </Badge>
              </div>
              <p className="text-sm text-slate-400">{partner.country} · {partner.languages[0]}</p>
            </div>
          </div>

          {/* Session details */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface-3 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Calendar size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">Date</span>
              </div>
              <p className="text-white font-semibold">{session.date}</p>
            </div>
            <div className="bg-surface-3 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-violet-400 mb-2">
                <Clock size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">Time</span>
              </div>
              <p className="text-white font-semibold">{session.time}</p>
            </div>
            <div className="bg-surface-3 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Clock size={16} />
                <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
              </div>
              <p className="text-white font-semibold">{session.duration} minutes</p>
            </div>
          </div>

          {/* Meeting link */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <Video size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Video Meeting Room</p>
                  <p className="text-xs text-slate-500 font-mono">{session.meetingLink}</p>
                </div>
              </div>
              {session.status === "scheduled" && (
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Video size={16} />
                  Join Session
                </a>
              )}
            </div>
          </div>

          {/* Objectives */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Learning Objectives</h3>
            </div>
            <div className="space-y-2">
              {session.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-surface-3 rounded-xl border border-white/5">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-300">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Session Notes</h3>
              </div>
              <p className="text-sm text-slate-400 bg-surface-3 rounded-xl p-4 border border-white/5 leading-relaxed">
                {session.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/6">
            {session.status === "scheduled" && (
              <>
                <a href={session.meetingLink} target="_blank" rel="noreferrer">
                  <Button icon={<Video size={16} />} size="lg">Join Session Now</Button>
                </a>
                <Button variant="secondary" size="lg">Reschedule</Button>
                <Button variant="danger" size="lg">Cancel Session</Button>
              </>
            )}
            {session.status === "completed" && (
              <>
                <Link href="/reviews">
                  <Button icon={<CheckCircle size={16} />}>Leave Review</Button>
                </Link>
                <Button variant="secondary">View Recording</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

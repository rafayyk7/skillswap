"use client";

import { useState } from "react";
import { CheckCircle2, ArrowLeftRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import type { Match } from "@/types";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface SwapRequestModalProps {
  match: Match;
  onClose: () => void;
}

export default function SwapRequestModal({ match, onClose }: SwapRequestModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({
    days: [] as string[],
    time: "19:00",
    duration: "60",
    message: "",
  });

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const handleSend = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setStep("success");
  };

  return (
    <Modal open title={step === "form" ? "Request a Skill Swap" : undefined} onClose={onClose} size="md">
      {step === "success" ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Swap Request Sent! 🎉</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your request has been sent to <strong className="text-slate-900 dark:text-white">{match.user.name}</strong>. 
            They&apos;ll be notified and can accept or propose a different time.
          </p>
          <Button onClick={onClose} fullWidth>Done</Button>
        </div>
      ) : (
        <div className="p-6 space-y-5">
          {/* Participants */}
          <div className="bg-surface-3 rounded-xl p-4 border border-black/6 dark:border-white/6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={match.user.avatar} name={match.user.name} size="lg" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{match.user.name}</p>
                  <p className="text-xs text-slate-500">{match.user.country}</p>
                </div>
              </div>
              <div className="text-center">
                <ArrowLeftRight size={20} className="text-indigo-500 dark:text-indigo-400 mx-auto" />
                <span className="text-xs text-indigo-600 dark:text-indigo-300 font-bold">{match.matchPercentage}% match</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">You</p>
                <p className="text-xs text-slate-500">Alex Kim</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-2">You want to learn</p>
              <Badge variant="info" size="md">{match.teachingSkill.name}</Badge>
            </div>
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-2">You will teach</p>
              <Badge variant="purple" size="md">{match.learningSkill.name}</Badge>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Preferred days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                    form.days.includes(day)
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-600 dark:text-indigo-300"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-black/20 dark:hover:border-white/20"
                  )}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Preferred time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Session duration</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Message</label>
            <textarea
              rows={3}
              placeholder={`Hi ${match.user.name.split(" ")[0]}! I'd love to swap ${match.teachingSkill.name} for ${match.learningSkill.name}...`}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          <Button fullWidth size="lg" onClick={handleSend}>
            Send Swap Request
          </Button>
        </div>
      )}
    </Modal>
  );
}

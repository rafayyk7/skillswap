"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  BookOpen,
  GraduationCap,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Zap,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { skillCategories, skills } from "@/data/skills";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "About You", icon: <User size={18} /> },
  { id: 2, label: "I Can Teach", icon: <BookOpen size={18} /> },
  { id: 3, label: "I Want to Learn", icon: <GraduationCap size={18} /> },
  { id: 4, label: "Availability", icon: <Clock size={18} /> },
  { id: 5, label: "Complete!", icon: <CheckCircle2 size={18} /> },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type SkillEntry = { name: string; category: string; level: string; years: string; description: string };

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ name: "", bio: "", country: "", languages: ["English"] });
  const [teachSkills, setTeachSkills] = useState<SkillEntry[]>([]);
  const [learnSkills, setLearnSkills] = useState<SkillEntry[]>([]);
  const [availability, setAvailability] = useState({ days: [] as string[], timeStart: "18:00", timeEnd: "21:00", timezone: "UTC", duration: "60" });
  const [newTeach, setNewTeach] = useState<SkillEntry>({ name: "", category: "", level: "intermediate", years: "1", description: "" });
  const [newLearn, setNewLearn] = useState<SkillEntry>({ name: "", category: "", level: "beginner", years: "", description: "" });

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const addTeachSkill = () => {
    if (!newTeach.name) return;
    setTeachSkills([...teachSkills, newTeach]);
    setNewTeach({ name: "", category: "", level: "intermediate", years: "1", description: "" });
  };

  const addLearnSkill = () => {
    if (!newLearn.name) return;
    setLearnSkills([...learnSkills, newLearn]);
    setNewLearn({ name: "", category: "", level: "beginner", years: "", description: "" });
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">SkillSwap</span>
        </Link>
        <p className="text-sm text-slate-500">Step {step} of {STEPS.length}</p>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 right-0 top-5 h-px bg-white/6" />
          {STEPS.map((s) => (
            <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300",
                  step === s.id
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 border-transparent text-white shadow-lg shadow-indigo-500/30"
                    : step > s.id
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-surface-3 border-white/10 text-slate-600"
                )}
              >
                {step > s.id ? <CheckCircle2 size={18} /> : s.icon}
              </div>
              <span className={cn("text-xs hidden sm:block", step === s.id ? "text-white font-medium" : "text-slate-600")}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-surface-2 border border-white/8 rounded-2xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Tell us about yourself</h2>
                <p className="text-slate-400">This helps other swappers know who you are.</p>
              </div>
              <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" fullWidth />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Tell the community a bit about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
              <Input label="Country" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="e.g. United States" fullWidth />
              <Input label="Languages" value={profile.languages.join(", ")} onChange={(e) => setProfile({ ...profile, languages: e.target.value.split(",").map(l => l.trim()) })} placeholder="English, Spanish, French" fullWidth hint="Separate with commas" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Skills you can teach</h2>
                <p className="text-slate-400">Add the skills you&apos;re confident enough to share with others.</p>
              </div>
              {teachSkills.length > 0 && (
                <div className="space-y-2">
                  {teachSkills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <div>
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                        <span className="text-xs text-slate-500 ml-2">· {skill.level} · {skill.years}yr{parseInt(skill.years) !== 1 ? "s" : ""}</span>
                      </div>
                      <button onClick={() => setTeachSkills(teachSkills.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-surface-3 rounded-xl p-4 space-y-3 border border-white/6">
                <p className="text-sm font-medium text-slate-300">Add a skill</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Skill name (e.g. React)" value={newTeach.name} onChange={(e) => setNewTeach({ ...newTeach, name: e.target.value })} />
                  <select
                    value={newTeach.category}
                    onChange={(e) => setNewTeach({ ...newTeach, category: e.target.value })}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="">Category</option>
                    {skillCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select
                    value={newTeach.level}
                    onChange={(e) => setNewTeach({ ...newTeach, level: e.target.value })}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <Input placeholder="Years exp." type="number" value={newTeach.years} onChange={(e) => setNewTeach({ ...newTeach, years: e.target.value })} />
                </div>
                <Button onClick={addTeachSkill} variant="outline" size="sm" icon={<Plus size={14} />} fullWidth>
                  Add Skill
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Skills you want to learn</h2>
                <p className="text-slate-400">What are you excited to learn? Be specific for better matches.</p>
              </div>
              {learnSkills.length > 0 && (
                <div className="space-y-2">
                  {learnSkills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                      <div>
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                        <span className="text-xs text-slate-500 ml-2">· target: {skill.level}</span>
                      </div>
                      <button onClick={() => setLearnSkills(learnSkills.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-surface-3 rounded-xl p-4 space-y-3 border border-white/6">
                <p className="text-sm font-medium text-slate-300">Add a skill to learn</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Skill name" value={newLearn.name} onChange={(e) => setNewLearn({ ...newLearn, name: e.target.value })} />
                  <select
                    value={newLearn.category}
                    onChange={(e) => setNewLearn({ ...newLearn, category: e.target.value })}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="">Category</option>
                    {skillCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select
                    value={newLearn.level}
                    onChange={(e) => setNewLearn({ ...newLearn, level: e.target.value })}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 col-span-2"
                  >
                    <option value="beginner">Beginner (just starting)</option>
                    <option value="intermediate">Intermediate (some basics)</option>
                    <option value="advanced">Advanced (want to master)</option>
                  </select>
                </div>
                <Button onClick={addLearnSkill} variant="outline" size="sm" icon={<Plus size={14} />} fullWidth>
                  Add Skill
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Your availability</h2>
                <p className="text-slate-400">When can you meet for swap sessions?</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300 mb-3">Available days</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        availability.days.includes(day)
                          ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Available from"
                  type="time"
                  value={availability.timeStart}
                  onChange={(e) => setAvailability({ ...availability, timeStart: e.target.value })}
                  fullWidth
                />
                <Input
                  label="Available until"
                  type="time"
                  value={availability.timeEnd}
                  onChange={(e) => setAvailability({ ...availability, timeEnd: e.target.value })}
                  fullWidth
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Timezone</label>
                  <select
                    value={availability.timezone}
                    onChange={(e) => setAvailability({ ...availability, timezone: e.target.value })}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {["UTC", "UTC-5 (EST)", "UTC-8 (PST)", "UTC+1 (CET)", "UTC+5:30 (IST)", "UTC+9 (JST)"].map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Session duration</label>
                  <select
                    value={availability.duration}
                    onChange={(e) => setAvailability({ ...availability, duration: e.target.value })}
                    className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Your SkillSwap profile is ready! 🎉</h2>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                You&apos;re all set. We&apos;ve found {Math.floor(Math.random() * 30) + 10} potential matches for you based on your skills.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10 max-w-xs mx-auto">
                {[
                  { label: "Skills to teach", value: Math.max(teachSkills.length, 2) },
                  { label: "Skills to learn", value: Math.max(learnSkills.length, 2) },
                  { label: "Matches found", value: Math.floor(Math.random() * 20) + 15 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-3 rounded-xl p-3 text-center border border-white/6">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-500/25"
              >
                Find My Matches
                <ArrowRight size={20} />
              </Link>
              <div className="mt-4">
                <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
                  Go to Dashboard instead →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < 5 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              icon={<ChevronLeft size={16} />}
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(Math.min(STEPS.length, step + 1))}
              icon={<ChevronRight size={16} />}
              iconPosition="right"
            >
              {step === 4 ? "Complete Setup" : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

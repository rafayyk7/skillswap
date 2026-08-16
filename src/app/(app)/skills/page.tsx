"use client";

import { useState } from "react";
import { Plus, X, BookOpen, GraduationCap, Edit2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { currentUser } from "@/data/users";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";
import type { SkillOffer, SkillRequest } from "@/types";

export default function SkillsPage() {
  const [teachSkills, setTeachSkills] = useState<SkillOffer[]>(currentUser.skillsTeach);
  const [learnSkills, setLearnSkills] = useState<SkillRequest[]>(currentUser.skillsLearn);
  const [showAddTeach, setShowAddTeach] = useState(false);
  const [showAddLearn, setShowAddLearn] = useState(false);
  const [newTeach, setNewTeach] = useState({ name: "", category: "", level: "intermediate", years: "1", description: "" });
  const [newLearn, setNewLearn] = useState({ name: "", category: "", level: "beginner", description: "" });

  const levelColors: Record<string, "success" | "info" | "purple" | "cyan"> = {
    beginner: "success",
    intermediate: "info",
    advanced: "purple",
    expert: "cyan",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Skills</h1>
        <p className="text-slate-400">Manage the skills you teach and want to learn.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Teaching skills */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Skills I Teach</h2>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{teachSkills.length}</span>
            </div>
            <Button size="sm" variant="outline" icon={<Plus size={14} />} onClick={() => setShowAddTeach(true)}>
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {teachSkills.map((offer) => (
              <div key={offer.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 group hover:border-white/15 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{offer.skill.name}</h3>
                    <p className="text-xs text-slate-500">{offer.skill.categoryName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={levelColors[offer.level] ?? "default"} size="sm">{offer.level}</Badge>
                    <button
                      onClick={() => setTeachSkills(teachSkills.filter((s) => s.id !== offer.id))}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-3 leading-relaxed">{offer.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{offer.yearsOfExperience} year{offer.yearsOfExperience !== 1 ? "s" : ""} of experience</span>
                  <button className="flex items-center gap-1 text-slate-600 hover:text-indigo-400 transition-colors">
                    <Edit2 size={11} /> Edit
                  </button>
                </div>
              </div>
            ))}

            {teachSkills.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <BookOpen size={28} className="mx-auto text-slate-700 mb-2" />
                <p className="text-slate-500 text-sm">No teaching skills added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning skills */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Skills I Want to Learn</h2>
              <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">{learnSkills.length}</span>
            </div>
            <Button size="sm" variant="outline" icon={<Plus size={14} />} onClick={() => setShowAddLearn(true)}>
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {learnSkills.map((req) => (
              <div key={req.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 group hover:border-white/15 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{req.skill.name}</h3>
                    <p className="text-xs text-slate-500">{req.skill.categoryName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="sm">Target: {req.desiredLevel}</Badge>
                    <button
                      onClick={() => setLearnSkills(learnSkills.filter((s) => s.id !== req.id))}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{req.description}</p>
              </div>
            ))}

            {learnSkills.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <GraduationCap size={28} className="mx-auto text-slate-700 mb-2" />
                <p className="text-slate-500 text-sm">No learning goals added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Teach Skill Modal */}
      <Modal open={showAddTeach} onClose={() => setShowAddTeach(false)} title="Add Teaching Skill" size="sm">
        <div className="p-6 space-y-4">
          <Input label="Skill Name" placeholder="e.g. React, Figma, Spanish" value={newTeach.name} onChange={(e) => setNewTeach({ ...newTeach, name: e.target.value })} fullWidth />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Category</label>
            <select value={newTeach.category} onChange={(e) => setNewTeach({ ...newTeach, category: e.target.value })} className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="">Select category</option>
              {skillCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Proficiency</label>
              <select value={newTeach.level} onChange={(e) => setNewTeach({ ...newTeach, level: e.target.value })} className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <Input label="Years of Exp." type="number" value={newTeach.years} onChange={(e) => setNewTeach({ ...newTeach, years: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea rows={3} placeholder="What will you teach?" value={newTeach.description} onChange={(e) => setNewTeach({ ...newTeach, description: e.target.value })} className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-600" />
          </div>
          <Button fullWidth onClick={() => setShowAddTeach(false)} disabled={!newTeach.name}>Add Skill</Button>
        </div>
      </Modal>

      {/* Add Learn Skill Modal */}
      <Modal open={showAddLearn} onClose={() => setShowAddLearn(false)} title="Add Learning Goal" size="sm">
        <div className="p-6 space-y-4">
          <Input label="Skill Name" placeholder="e.g. Python, Photography" value={newLearn.name} onChange={(e) => setNewLearn({ ...newLearn, name: e.target.value })} fullWidth />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Target Level</label>
            <select value={newLearn.level} onChange={(e) => setNewLearn({ ...newLearn, level: e.target.value })} className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Why do you want to learn this?</label>
            <textarea rows={3} placeholder="Describe what you hope to achieve..." value={newLearn.description} onChange={(e) => setNewLearn({ ...newLearn, description: e.target.value })} className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-600" />
          </div>
          <Button fullWidth onClick={() => setShowAddLearn(false)} disabled={!newLearn.name}>Add Goal</Button>
        </div>
      </Modal>
    </div>
  );
}


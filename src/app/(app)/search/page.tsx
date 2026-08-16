"use client";

import { useState } from "react";
import { Search, Users, BookOpen, Tag } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import MatchRing from "@/components/ui/MatchRing";
import { mockUsers } from "@/data/users";
import { skills, skillCategories } from "@/data/skills";
import { mockMatches } from "@/data/matches";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ResultType = "people" | "skills" | "categories";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ResultType>("people");

  const searchPeople = mockUsers.filter((u) =>
    query === "" ||
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.skillsTeach.some((s) => s.skill.name.toLowerCase().includes(query.toLowerCase())) ||
    u.skillsLearn.some((s) => s.skill.name.toLowerCase().includes(query.toLowerCase()))
  );

  const searchSkills = skills.filter((s) =>
    query === "" ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.categoryName.toLowerCase().includes(query.toLowerCase())
  );

  const searchCategories = skillCategories.filter((c) =>
    query === "" ||
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const tabs: { id: ResultType; label: string; count: number; icon: React.ReactNode }[] = [
    { id: "people", label: "People", count: searchPeople.length, icon: <Users size={14} /> },
    { id: "skills", label: "Skills", count: searchSkills.length, icon: <BookOpen size={14} /> },
    { id: "categories", label: "Categories", count: searchCategories.length, icon: <Tag size={14} /> },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search SkillSwap</h1>
        <p className="text-slate-400">Find people, skills, and categories across the community.</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for skills, people, categories..."
          className="w-full h-14 bg-surface-2 border border-white/10 rounded-2xl pl-12 pr-5 text-slate-100 text-base placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30"
        />
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveType(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
              activeType === tab.id
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
            )}
          >
            {tab.icon}
            {tab.label}
            <span className="text-xs bg-white/10 rounded-full px-1.5">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {activeType === "people" && (
        <div className="space-y-3">
          {searchPeople.length === 0 && (
            <div className="text-center py-16">
              <Users size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">No people found for &ldquo;{query}&rdquo;</p>
            </div>
          )}
          {searchPeople.map((user) => {
            const match = mockMatches.find((m) => m.userId === user.id);
            return (
              <Link key={user.id} href={`/profile/${user.username}`}>
                <div className="bg-surface-2 border border-white/6 rounded-2xl p-4 hover:border-white/15 transition-all flex items-start gap-4">
                  <Avatar src={user.avatar} name={user.name} size="lg" isOnline={user.isOnline} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      {match && <span className="text-xs font-bold text-indigo-300">{match.matchPercentage}% match</span>}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{user.city}, {user.country}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skillsTeach.slice(0, 3).map((s) => (
                        <Badge key={s.id} variant="info" size="sm">{s.skill.name}</Badge>
                      ))}
                      {user.skillsLearn.slice(0, 2).map((s) => (
                        <Badge key={s.id} variant="purple" size="sm">wants: {s.skill.name}</Badge>
                      ))}
                    </div>
                  </div>
                  {match && <MatchRing percentage={match.matchPercentage} size="sm" />}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {activeType === "skills" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {searchSkills.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <BookOpen size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">No skills found for &ldquo;{query}&rdquo;</p>
            </div>
          )}
          {searchSkills.map((skill) => (
            <Link key={skill.id} href={`/explore?skill=${skill.id}`}>
              <div className="bg-surface-2 border border-white/6 rounded-xl p-4 hover:border-white/15 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{skill.name}</h3>
                    <p className="text-xs text-slate-500">{skill.categoryName}</p>
                  </div>
                  <Badge variant={skill.level === "expert" ? "purple" : skill.level === "advanced" ? "info" : "success"} size="sm">
                    {skill.level}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{skill.description}</p>
                <p className="text-xs text-slate-600 mt-2">{skill.teacherCount} teachers</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeType === "categories" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {searchCategories.map((cat) => (
            <Link key={cat.id} href={`/explore?category=${cat.id}`}>
              <div className="bg-surface-2 border border-white/6 rounded-xl p-5 hover:border-white/15 transition-all text-center">
                <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl bg-gradient-to-br", cat.color)}>
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.count.toLocaleString()} skills</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


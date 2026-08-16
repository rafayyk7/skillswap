"use client";

import { useState } from "react";
import { Search, Filter, Users, ArrowRight, X } from "lucide-react";
import { skills, skillCategories } from "@/data/skills";
import { mockUsers } from "@/data/users";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.categoryName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || s.categoryId === selectedCategory;
    const matchesLevel = !selectedLevel || s.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSearch("");
  };

  const hasFilters = search || selectedCategory || selectedLevel;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explore Skills</h1>
        <p className="text-slate-400">Discover skills taught by our community — and find your next learning partner.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search skills, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<Search size={16} />}
            fullWidth
            iconRight={
              search ? (
                <button onClick={() => setSearch("")}><X size={14} /></button>
              ) : undefined
            }
          />
        </div>
        <Button
          variant="secondary"
          icon={<Filter size={16} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-indigo-400 ml-1" />}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="md" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-surface-2 border border-white/8 rounded-2xl p-5 mb-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-300 mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {skillCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                      selectedCategory === cat.id
                        ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    )}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300 mb-3">Skill Level</p>
              <div className="flex flex-wrap gap-2">
                {["beginner", "intermediate", "advanced", "expert"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize",
                      selectedLevel === level
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all shrink-0",
            !selectedCategory
              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}
        >
          All Categories
        </button>
        {skillCategories.slice(0, 10).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all shrink-0",
              selectedCategory === cat.id
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
            )}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Skill cards grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-24">
          <Search size={40} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No skills found</h3>
          <p className="text-slate-500">Try different keywords or clear your filters.</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => {
            const teachers = mockUsers.filter((u) => u.skillsTeach.some((s) => s.skill.id === skill.id));

            return (
              <div
                key={skill.id}
                className="bg-surface-2 border border-white/6 rounded-2xl p-5 hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{skill.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{skill.categoryName}</p>
                  </div>
                  <Badge
                    variant={
                      skill.level === "expert" ? "purple" :
                      skill.level === "advanced" ? "info" :
                      skill.level === "intermediate" ? "success" : "default"
                    }
                    size="sm"
                  >
                    {skill.level}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{skill.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {mockUsers.slice(0, 3).map((u, i) => (
                        <Avatar key={i} src={u.avatar} name={u.name} size="xs" className="ring-2 ring-surface-2" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{skill.teacherCount ?? (Math.floor(Math.random() * 100) + 50)} teaching</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users size={12} />
                    {teachers.length > 0 ? teachers.length : Math.floor(Math.random() * 20) + 5} local
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/10 hover:border-indigo-400 transition-all">
                  Find Teachers
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

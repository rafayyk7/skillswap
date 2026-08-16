"use client";

import { useState } from "react";
import { Search, MapPin, Star, Filter, X, Globe } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { mockUsers } from "@/data/users";
import { cn } from "@/lib/utils";

export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);

  const filtered = mockUsers.filter((u) => {
    const matchesSearch = search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase()) ||
      u.skillsTeach.some((s) => s.skill.name.toLowerCase().includes(search.toLowerCase()));
    const matchesOnline = !filterOnline || u.isOnline;
    return matchesSearch && matchesOnline;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Find People</h1>
        <p className="text-slate-400">Browse SkillSwap community members and discover potential swap partners.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by name, skill, country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<Search size={16} />}
            fullWidth
            iconRight={search ? <button onClick={() => setSearch("")}><X size={14} /></button> : undefined}
          />
        </div>
        <button
          onClick={() => setFilterOnline(!filterOnline)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
            filterOnline
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Online Only
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-6">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((user) => (
          <div key={user.id} className="bg-surface-2 border border-white/6 rounded-2xl p-6 hover:border-white/15 transition-all hover:-translate-y-0.5 duration-200">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <Avatar src={user.avatar} name={user.name} size="lg" isOnline={user.isOnline} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{user.name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={11} />
                  {user.city}, {user.country}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs text-white font-medium">{user.rating}</span>
                  <span className="text-xs text-slate-500">({user.reviewCount})</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{user.bio}</p>

            {/* Teaching */}
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-2 font-medium">TEACHES</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skillsTeach.slice(0, 3).map((s) => (
                  <Badge key={s.id} variant="info" size="sm">{s.skill.name}</Badge>
                ))}
              </div>
            </div>

            {/* Learning */}
            <div className="mb-5">
              <p className="text-xs text-slate-500 mb-2 font-medium">WANTS TO LEARN</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skillsLearn.slice(0, 3).map((s) => (
                  <Badge key={s.id} variant="purple" size="sm">{s.skill.name}</Badge>
                ))}
              </div>
            </div>

            {/* Languages & swaps */}
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-5">
              <span className="flex items-center gap-1"><Globe size={11} />{user.languages.slice(0, 2).join(", ")}</span>
              <span>{user.completedSwaps} swaps</span>
            </div>

            <Link href={`/profile/${user.username}`}>
              <button className="w-full py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/10 hover:border-indigo-400 transition-all">
                View Profile
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

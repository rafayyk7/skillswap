"use client";

import { useState } from "react";
import { Search, MapPin, Star, ArrowRight, Filter, Clock, Globe, X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import MatchRing from "@/components/ui/MatchRing";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { mockMatches } from "@/data/matches";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";
import Link from "next/link";
import SwapRequestModal from "@/components/skills/SwapRequestModal";

export default function MatchesPage() {
  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [requestTarget, setRequestTarget] = useState<Match | null>(null);

  const filtered = mockMatches.filter((m) => {
    const matchesSearch = search === "" ||
      m.user.name.toLowerCase().includes(search.toLowerCase()) ||
      m.teachingSkill.name.toLowerCase().includes(search.toLowerCase()) ||
      m.learningSkill.name.toLowerCase().includes(search.toLowerCase());
    const matchesPct = m.matchPercentage >= minMatch;
    return matchesSearch && matchesPct;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Skill Matches</h1>
        <p className="text-slate-400">People whose skills perfectly complement yours — ranked by compatibility.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search by name, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<Search size={16} />}
            fullWidth
            iconRight={search ? <button onClick={() => setSearch("")}><X size={14} /></button> : undefined}
          />
        </div>
        <div className="flex items-center gap-3 bg-surface-2 border border-white/8 rounded-xl px-4">
          <span className="text-xs text-slate-500 whitespace-nowrap">Min match:</span>
          <input
            type="range"
            min={0}
            max={95}
            step={5}
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
            className="w-24 accent-indigo-500"
          />
          <span className="text-xs text-indigo-300 font-medium w-8">{minMatch}%</span>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6">
        {filtered.length} match{filtered.length !== 1 ? "es" : ""} found
      </p>

      {/* Match cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((match) => {
          const user = match.user;
          return (
            <div
              key={match.userId}
              className="bg-surface-2 border border-white/6 rounded-2xl p-6 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <Avatar src={user.avatar} name={user.name} size="lg" isOnline={user.isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin size={11} />
                        {user.city}, {user.country}
                      </div>
                    </div>
                    <MatchRing percentage={match.matchPercentage} size="md" />
                  </div>
                </div>
              </div>

              {/* Skills exchange visualization */}
              <div className="bg-surface-3 rounded-xl p-4 mb-4 border border-white/5">
                <p className="text-xs text-slate-500 mb-3 font-medium">SKILL EXCHANGE</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">They teach you</span>
                    <Badge variant="info" size="sm">{match.teachingSkill.name}</Badge>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-px w-8 bg-white/10" />
                      <span className="text-xs">↕</span>
                      <div className="h-px w-8 bg-white/10" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">You teach them</span>
                    <Badge variant="purple" size="sm">{match.learningSkill.name}</Badge>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between text-xs mb-5">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-white font-medium">{user.rating}</span>
                  <span className="text-slate-500">({user.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={11} />
                  {user.availability.preferredDuration}min sessions
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Globe size={11} />
                  {user.languages[0]}
                </div>
              </div>

              {/* Why we match */}
              {match.compatibilityReasons.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-medium text-slate-500 mb-2">WHY YOU MATCH</p>
                  <ul className="space-y-1">
                    {match.compatibilityReasons.slice(0, 2).map((reason, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Link href={`/profile/${user.username}`} className="flex-1">
                  <button className="w-full py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all">
                    View Profile
                  </button>
                </Link>
                <Button
                  className="flex-1"
                  size="md"
                  onClick={() => setRequestTarget(match)}
                >
                  Request Swap
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <Search size={40} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No matches found</h3>
          <p className="text-slate-500">Try adjusting your search or minimum match percentage.</p>
        </div>
      )}

      {/* Swap Request Modal */}
      {requestTarget && (
        <SwapRequestModal
          match={requestTarget}
          onClose={() => setRequestTarget(null)}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { mockUsers } from "@/data/users";
import { mockMatches } from "@/data/matches";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import MatchRing from "@/components/ui/MatchRing";

export default function FeaturedMatches() {
  const featured = mockMatches.slice(0, 3);

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            Skill Matches
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            People Ready to Swap
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            These are real-time matches waiting to connect. Your perfect learning partner is already here.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featured.map((match) => {
            const user = match.user;
            return (
              <div
                key={match.userId}
                className="bg-surface-2 border border-white/6 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} name={user.name} size="lg" isOnline={user.isOnline} />
                    <div>
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <MapPin size={11} />
                        {user.city}, {user.country}
                      </div>
                    </div>
                  </div>
                  <MatchRing percentage={match.matchPercentage} size="sm" />
                </div>

                {/* Skills exchange */}
                <div className="bg-surface-3 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">They teach</span>
                    <Badge variant="info" size="sm">{match.teachingSkill.name}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">They want</span>
                    <Badge variant="purple" size="sm">{match.learningSkill.name}</Badge>
                  </div>
                </div>

                {/* Rating & swaps */}
                <div className="flex items-center justify-between text-sm mb-5">
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-white font-medium">{user.rating}</span>
                    <span className="text-slate-500">({user.reviewCount})</span>
                  </div>
                  <span className="text-slate-500 text-xs">{user.completedSwaps} swaps done</span>
                </div>

                <Link
                  href={`/profile/${user.username}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/10 hover:border-indigo-400 transition-all"
                >
                  View Profile
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-500/20"
          >
            Find All Matches
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

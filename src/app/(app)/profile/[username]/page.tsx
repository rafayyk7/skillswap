"use client";

import { useState } from "react";
import { use } from "react";
import {
  MapPin, Star, Calendar, Globe, Clock, CheckCircle, ArrowLeftRight,
  Briefcase, ExternalLink, MessageSquare
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { mockUsers, currentUser } from "@/data/users";
import { mockReviews } from "@/data/reviews";
import { mockMatches } from "@/data/matches";
import SwapRequestModal from "@/components/skills/SwapRequestModal";
import type { User, AvailabilityDay } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const levelColors: Record<string, string> = {
  beginner: "success",
  intermediate: "info",
  advanced: "purple",
  expert: "cyan",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState<"teach" | "learn" | "portfolio" | "reviews">("teach");
  const [showSwapModal, setShowSwapModal] = useState(false);

  const user: User = mockUsers.find((u) => u.username === username) ?? currentUser;
  const isCurrentUser = user.id === "current" || user.id === currentUser.id;
  const reviews = mockReviews.filter((r) => r.revieweeId === user.id || r.revieweeId === "current");
  const match = mockMatches.find((m) => m.userId === user.id);

  const tabs = [
    { id: "teach", label: "Skills I Teach", count: user.skillsTeach.length },
    { id: "learn", label: "Want to Learn", count: user.skillsLearn.length },
    { id: "portfolio", label: "Portfolio", count: user.portfolio?.length ?? 0 },
    { id: "reviews", label: "Reviews", count: reviews.length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Profile header */}
      <div className="bg-surface-2 border border-white/8 rounded-2xl overflow-hidden mb-6">
        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-r from-indigo-600/30 via-violet-600/20 to-cyan-600/15" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className="relative">
              <Avatar src={user.avatar} name={user.name} size="2xl" isOnline={user.isOnline} className="ring-4 ring-surface-2" />
              {match && (
                <div className="absolute -right-2 -bottom-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  {match.matchPercentage}% match
                </div>
              )}
            </div>
            <div className="flex gap-2 mb-2">
              {isCurrentUser ? (
                <Link href="/settings">
                  <Button variant="secondary" size="sm">Edit Profile</Button>
                </Link>
              ) : (
                <>
                  <Link href="/messages">
                    <Button variant="secondary" size="sm" icon={<MessageSquare size={14} />}>Message</Button>
                  </Link>
                  <Button size="sm" icon={<ArrowLeftRight size={14} />} onClick={() => setShowSwapModal(true)}>
                    Request Swap
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {user.isPremium && <Badge variant="cyan" size="sm">⭐ Premium</Badge>}
              <Badge variant={user.isOnline ? "success" : "default"} dot>
                {user.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mb-3">@{user.username}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-indigo-400" />{user.city}, {user.country}</span>
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-violet-400" />{user.languages.join(", ")}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-cyan-400" />Joined {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-5">{user.bio}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {[
                { label: "Rating", value: user.rating, suffix: "/5" },
                { label: "Reviews", value: user.reviewCount },
                { label: "Swaps Done", value: user.completedSwaps },
                { label: "Teach Skills", value: user.skillsTeach.length },
                { label: "Learning", value: user.skillsLearn.length },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-surface-3 rounded-xl p-3 border border-white/5">
                  <p className="text-xl font-bold text-white">{stat.value}{stat.suffix}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Availability banner */}
      <div className="bg-surface-2 border border-white/6 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Clock size={16} className="text-indigo-400" />
          <span className="text-sm font-semibold text-white">Availability</span>
          <span className="text-xs text-slate-500">{user.availability.timezone}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day, i) => {
            const isAvailable = user.availability.days.includes(fullDays[i] as AvailabilityDay);
            return (
              <div
                key={day}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium border",
                  isAvailable
                    ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                    : "bg-white/3 border-white/6 text-slate-600"
                )}
              >
                {day}
              </div>
            );
          })}
          <div className="px-3 py-1.5 rounded-xl text-xs border bg-white/3 border-white/6 text-slate-400">
            {user.availability.timeStart} – {user.availability.timeEnd}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs border bg-white/3 border-white/6 text-slate-400">
            {user.availability.preferredDuration} min sessions
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 border border-white/6 rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/25"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[tab.label.split(" ").length - 1]}</span>
            <span className="text-xs bg-white/10 rounded-full px-1.5">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "teach" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {user.skillsTeach.map((offer) => (
            <div key={offer.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{offer.skill.name}</h3>
                  <p className="text-xs text-slate-500">{offer.skill.categoryName}</p>
                </div>
                <Badge variant={levelColors[offer.level] as "success" | "info" | "purple" | "cyan"} size="sm">
                  {offer.level}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Briefcase size={11} />{offer.yearsOfExperience} yr{offer.yearsOfExperience !== 1 ? "s" : ""}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{offer.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "learn" && (
        <div className="grid sm:grid-cols-2 gap-4">
          {user.skillsLearn.map((req) => (
            <div key={req.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{req.skill.name}</h3>
                  <p className="text-xs text-slate-500">{req.skill.categoryName}</p>
                </div>
                <Badge variant="warning" size="sm">wants: {req.desiredLevel}</Badge>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{req.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "portfolio" && (
        <div>
          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {user.portfolio.map((item) => (
                <div key={item.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5 hover:border-white/15 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500">No portfolio items yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="bg-surface-2 border border-white/6 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <Avatar src={review.reviewer.avatar} name={review.reviewer.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white text-sm">{review.reviewer.name}</h4>
                    <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <StarRating value={review.overallExperience} />
                  <Badge variant="default" size="sm" className="mt-2">{review.skill.name}</Badge>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { label: "Teaching", value: review.teachingQuality },
                  { label: "Knowledge", value: review.knowledge },
                  { label: "Communication", value: review.communication },
                  { label: "Punctuality", value: review.punctuality },
                ].map((dim) => (
                  <div key={dim.label} className="text-center">
                    <p className="text-xs text-slate-500 mb-1">{dim.label}</p>
                    <StarRating value={dim.value} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-16">
              <Star size={32} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-500">No reviews yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Swap modal */}
      {showSwapModal && match && (
        <SwapRequestModal match={match} onClose={() => setShowSwapModal(false)} />
      )}
    </div>
  );
}

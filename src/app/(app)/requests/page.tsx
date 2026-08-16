"use client";

import { useState } from "react";
import { Clock, CheckCircle, XCircle, ArrowLeftRight, MessageSquare, Calendar } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import MatchRing from "@/components/ui/MatchRing";
import Button from "@/components/ui/Button";
import { mockRequests } from "@/data/requests";
import type { SwapRequestStatus } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Tab = "incoming" | "sent" | "accepted" | "declined" | "history";

const tabs: { id: Tab; label: string; badge?: SwapRequestStatus[] }[] = [
  { id: "incoming", label: "Incoming", badge: ["pending"] },
  { id: "sent", label: "Sent" },
  { id: "accepted", label: "Accepted", badge: ["accepted"] },
  { id: "declined", label: "Declined", badge: ["declined"] },
  { id: "history", label: "History" },
];

const statusConfig: Record<SwapRequestStatus, { label: string; variant: "success" | "warning" | "danger" | "default" | "info"; icon: React.ReactNode }> = {
  pending: { label: "Pending", variant: "warning", icon: <Clock size={12} /> },
  accepted: { label: "Accepted", variant: "success", icon: <CheckCircle size={12} /> },
  declined: { label: "Declined", variant: "danger", icon: <XCircle size={12} /> },
  cancelled: { label: "Cancelled", variant: "default", icon: <XCircle size={12} /> },
  completed: { label: "Completed", variant: "info", icon: <CheckCircle size={12} /> },
};

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("incoming");
  const [accepted, setAccepted] = useState<string[]>([]);
  const [declined, setDeclined] = useState<string[]>([]);

  const getFilteredRequests = () => {
    return mockRequests.filter((r) => {
      if (activeTab === "incoming") return r.toUserId === "current" && r.status === "pending" && !declined.includes(r.id);
      if (activeTab === "sent") return r.fromUserId === "current" && r.status === "pending";
      if (activeTab === "accepted") return r.status === "accepted" || accepted.includes(r.id);
      if (activeTab === "declined") return r.status === "declined" || declined.includes(r.id);
      if (activeTab === "history") return r.status === "completed" || r.status === "cancelled";
      return false;
    });
  };

  const filtered = getFilteredRequests();

  const incomingCount = mockRequests.filter((r) => r.toUserId === "current" && r.status === "pending" && !declined.includes(r.id)).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Swap Requests</h1>
        <p className="text-slate-400">Manage your incoming and outgoing skill swap requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 border border-white/6 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const count = tab.id === "incoming" ? incomingCount : 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/25"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Requests */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <ArrowLeftRight size={40} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No {activeTab} requests</h3>
            <p className="text-slate-600 mb-6">
              {activeTab === "incoming" ? "No one has sent you a swap request yet." : "You haven't sent any requests yet."}
            </p>
            {activeTab === "sent" && (
              <Link href="/matches">
                <Button>Find Matches</Button>
              </Link>
            )}
          </div>
        )}

        {filtered.map((req) => {
          const isIncoming = req.toUserId === "current";
          const partner = isIncoming ? req.fromUser : req.toUser;

          return (
            <div key={req.id} className="bg-surface-2 border border-white/6 rounded-2xl p-6 hover:border-white/12 transition-all">
              <div className="flex items-start gap-4">
                <Avatar src={partner.avatar} name={partner.name} size="lg" isOnline={partner.isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-white">{partner.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{partner.city}, {partner.country}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusConfig[req.status].variant} size="sm">
                        {statusConfig[req.status].label}
                      </Badge>
                      <MatchRing percentage={req.matchPercentage} size="sm" />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Badge variant="info" size="sm">{req.teachSkill.name}</Badge>
                      <ArrowLeftRight size={12} className="text-slate-600" />
                      <Badge variant="purple" size="sm">{req.learnSkill.name}</Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={11} />{req.sessionDuration} min sessions</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />{req.proposedDays.slice(0, 2).join(", ")}</span>
                    <span>{req.proposedTime}</span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed line-clamp-2">{req.message}</p>
                </div>
              </div>

              {/* Actions */}
              {isIncoming && req.status === "pending" && !declined.includes(req.id) && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-white/6">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    icon={<CheckCircle size={14} />}
                    onClick={() => setAccepted([...accepted, req.id])}
                  >
                    Accept Swap
                  </Button>
                  <Link href="/messages" className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth icon={<MessageSquare size={14} />}>
                      Message
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<XCircle size={14} />}
                    onClick={() => setDeclined([...declined, req.id])}
                  >
                    Decline
                  </Button>
                </div>
              )}

              {!isIncoming && req.status === "pending" && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-white/6">
                  <Link href="/messages" className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth icon={<MessageSquare size={14} />}>
                      Message
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" icon={<XCircle size={14} />}>
                    Cancel Request
                  </Button>
                </div>
              )}

              {req.status === "accepted" && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-white/6">
                  <Link href="/sessions">
                    <Button size="sm" icon={<Calendar size={14} />}>Schedule Session</Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="secondary" size="sm" icon={<MessageSquare size={14} />}>Message</Button>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


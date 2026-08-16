"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Star,
  CheckCheck,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { mockNotifications } from "@/data/notifications";
import type { NotificationType } from "@/types";
import { cn } from "@/lib/utils";

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string }> = {
  swap_request: { icon: <ArrowLeftRight size={16} />, color: "text-indigo-400", bg: "bg-indigo-500/15" },
  request_accepted: { icon: <CheckCircle size={16} />, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  request_declined: { icon: <XCircle size={16} />, color: "text-red-400", bg: "bg-red-500/15" },
  session_reminder: { icon: <Calendar size={16} />, color: "text-amber-400", bg: "bg-amber-500/15" },
  new_message: { icon: <MessageSquare size={16} />, color: "text-violet-400", bg: "bg-violet-500/15" },
  review_received: { icon: <Star size={16} />, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  session_completed: { icon: <CheckCircle size={16} />, color: "text-cyan-400", bg: "bg-cyan-500/15" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Notifications</h1>
          <p className="text-slate-400">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" icon={<CheckCheck size={14} />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-surface-2 border border-white/6 rounded-xl p-1 mb-6 w-fit">
        {["all", "unread"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as typeof filter)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize",
              filter === f ? "bg-indigo-500/20 text-indigo-300" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {f}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-2 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs inline-flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <Bell size={40} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">All caught up!</h3>
            <p className="text-slate-600">No {filter === "unread" ? "unread " : ""}notifications.</p>
          </div>
        )}

        {filtered.map((notif) => {
          const config = typeConfig[notif.type];
          return (
            <Link
              key={notif.id}
              href={notif.actionUrl ?? "#"}
              onClick={() => markRead(notif.id)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl border transition-all",
                notif.read
                  ? "bg-surface-2 border-white/5 hover:border-white/12"
                  : "bg-surface-2 border-indigo-500/20 hover:border-indigo-500/30"
              )}
            >
              {/* Icon */}
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.bg, config.color)}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-semibold", notif.read ? "text-slate-300" : "text-white")}>
                    {notif.title}
                  </p>
                  <span className="text-xs text-slate-600 shrink-0">{formatTime(notif.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>

                {notif.fromUser && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar src={notif.fromUser.avatar} name={notif.fromUser.name} size="xs" />
                    <span className="text-xs text-slate-500">{notif.fromUser.name}</span>
                  </div>
                )}
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


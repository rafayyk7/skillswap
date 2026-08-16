"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Users,
  ArrowLeftRight,
  Calendar,
  MessageSquare,
  Bell,
  TrendingUp,
  Star,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { currentUser } from "@/data/users";
import { mockNotifications } from "@/data/notifications";
import { mockConversations } from "@/data/messages";
import { mockRequests } from "@/data/requests";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: `/profile/${currentUser.username}`, label: "My Profile", icon: <User size={18} /> },
  { href: "/skills", label: "My Skills", icon: <BookOpen size={18} /> },
  { href: "/matches", label: "Matches", icon: <Users size={18} /> },
  { href: "/requests", label: "Requests", icon: <ArrowLeftRight size={18} />, badge: "requests" },
  { href: "/sessions", label: "Sessions", icon: <Calendar size={18} /> },
  { href: "/messages", label: "Messages", icon: <MessageSquare size={18} />, badge: "messages" },
  { href: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: "notifs" },
  { href: "/progress", label: "Progress", icon: <TrendingUp size={18} /> },
  { href: "/reviews", label: "Reviews", icon: <Star size={18} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const unreadNotifs = mockNotifications.filter((n) => !n.read).length;
  const unreadMsgs = mockConversations.reduce((s, c) => s + c.unreadCount, 0);
  const pendingReqs = mockRequests.filter((r) => r.status === "pending" && r.toUserId === "current").length;

  const getBadgeCount = (badge?: string) => {
    if (badge === "notifs") return unreadNotifs;
    if (badge === "messages") return unreadMsgs;
    if (badge === "requests") return pendingReqs;
    return 0;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/6 bg-surface-1 min-h-screen fixed top-0 left-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">SkillSwap</span>
        </Link>
      </div>

      {/* User summary */}
      <div className="px-4 py-4 border-b border-white/6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="md" isOnline={currentUser.isOnline} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500">@{currentUser.username}</p>
          </div>
          <Link href="/settings" className="ml-auto text-slate-600 hover:text-slate-400 transition-colors shrink-0">
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const badgeCount = getBadgeCount(item.badge);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <span className={cn(isActive ? "text-indigo-400" : "text-slate-600")}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold">
                  {badgeCount > 9 ? "9+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-white/6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/15">
          <Star size={16} className="text-amber-400 fill-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">{currentUser.rating} rating</p>
            <p className="text-xs text-slate-500">{currentUser.completedSwaps} swaps done</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


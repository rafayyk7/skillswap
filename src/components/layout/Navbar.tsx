"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  Zap,
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { currentUser } from "@/data/users";
import { mockNotifications } from "@/data/notifications";
import { mockConversations } from "@/data/messages";

const publicNav = [
  { label: "Home", href: "/" },
  { label: "Explore Skills", href: "/explore" },
  { label: "Find People", href: "/matches" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Community", href: "/#community" },
];

const authNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Explore", href: "/explore" },
  { label: "Matches", href: "/matches" },
];

// Demo: treat as authenticated if on dashboard-like pages
const AUTH_PATHS = ["/dashboard", "/sessions", "/requests", "/messages", "/notifications", "/progress", "/settings"];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const unreadNotifs = mockNotifications.filter((n) => !n.read).length;
  const unreadMsgs = mockConversations.reduce((s, c) => s + c.unreadCount, 0);

  const navLinks = isAuth ? authNav : publicNav;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="glass border-b border-white/6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">SkillSwap</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-white bg-white/8"
                      : "text-slate-400 hover:text-white hover:bg-white/6"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {isAuth ? (
                <>
                  {/* Search */}
                  <Link href="/search" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                    <Search size={18} />
                  </Link>

                  {/* Notifications */}
                  <Link href="/notifications" className="relative hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                    <Bell size={18} />
                    {unreadNotifs > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {unreadNotifs > 9 ? "9+" : unreadNotifs}
                      </span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link href="/messages" className="relative hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                    <MessageSquare size={18} />
                    {unreadMsgs > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-violet-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                        {unreadMsgs}
                      </span>
                    )}
                  </Link>

                  {/* Profile dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/8 transition-colors"
                    >
                      <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" isOnline={currentUser.isOnline} />
                      <ChevronDown size={14} className={cn("text-slate-400 transition-transform", profileOpen && "rotate-180")} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-surface-3 border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                        <div className="px-4 py-3 border-b border-white/8">
                          <p className="text-sm font-medium text-white">{currentUser.name}</p>
                          <p className="text-xs text-slate-500">@{currentUser.username}</p>
                        </div>
                        {[
                          { href: "/dashboard", icon: <LayoutDashboard size={15} />, label: "Dashboard" },
                          { href: `/profile/${currentUser.username}`, icon: <User size={15} />, label: "My Profile" },
                          { href: "/settings", icon: <Settings size={15} />, label: "Settings" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/6 transition-colors"
                          >
                            <span className="text-slate-500">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-white/8 mt-1 pt-1">
                          <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/8 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="hidden sm:block px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/6 py-4 px-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-white bg-white/8"
                    : "text-slate-400 hover:text-white hover:bg-white/6"
                )}
              >
                {link.label}
              </Link>
            ))}

            {isAuth ? (
              <div className="pt-3 border-t border-white/8 flex items-center gap-3 px-3">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" isOnline />
                <div>
                  <p className="text-sm font-medium text-white">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">@{currentUser.username}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Link href="/notifications" className="relative">
                    <Bell size={18} className="text-slate-400" />
                    {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full text-xs text-white flex items-center justify-center">{unreadNotifs}</span>}
                  </Link>
                  <Link href="/messages" className="relative">
                    <MessageSquare size={18} className="text-slate-400" />
                    {unreadMsgs > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-violet-500 rounded-full text-xs text-white flex items-center justify-center">{unreadMsgs}</span>}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full text-center px-4 py-2.5 rounded-xl text-sm text-slate-300 border border-white/10 hover:border-white/20 transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/20">
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Search, MoreVertical, Video, Phone } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { mockConversations, mockMessages } from "@/data/messages";
import type { Conversation, Message } from "@/types";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/users";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState<Conversation>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[mockConversations[0].id] ?? []);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectConv = (conv: Conversation) => {
    setSelectedConv(conv);
    setMessages(mockMessages[conv.id] ?? []);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      conversationId: selectedConv.id,
      senderId: "current",
      content: input.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate typing indicator + response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const other = selectedConv.participants.find((p) => p.id !== "current");
      if (other) {
        const reply: Message = {
          id: `m_${Date.now() + 1}`,
          conversationId: selectedConv.id,
          senderId: other.id,
          content: "Thanks for reaching out! I'll get back to you soon 😊",
          timestamp: new Date().toISOString(),
          read: false,
        };
        setMessages((prev) => [...prev, reply]);
      }
    }, 2000);
  };

  const otherUser = selectedConv.participants.find((p) => p.id !== "current");

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation list */}
      <div className="w-full sm:w-80 lg:w-96 border-r border-white/6 flex flex-col bg-surface-1">
        {/* Header */}
        <div className="px-4 py-4 border-b border-white/6">
          <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              placeholder="Search conversations..."
              className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => {
            const other = conv.participants.find((p) => p.id !== "current");
            if (!other) return null;
            const isSelected = conv.id === selectedConv.id;

            return (
              <button
                key={conv.id}
                onClick={() => selectConv(conv)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 text-left transition-all border-b border-white/4",
                  isSelected ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : "hover:bg-white/4"
                )}
              >
                <Avatar src={other.avatar} name={other.name} size="md" isOnline={other.isOnline} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-sm font-semibold truncate", conv.unreadCount > 0 ? "text-white" : "text-slate-300")}>
                      {other.name}
                    </p>
                    <span className="text-xs text-slate-600 shrink-0 ml-2">
                      {conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={cn("text-xs truncate", conv.unreadCount > 0 ? "text-slate-300" : "text-slate-600")}>
                      {conv.lastMessage?.content ?? "No messages yet"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 hidden sm:flex">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-surface-1">
          {otherUser && (
            <>
              <div className="flex items-center gap-3">
                <Avatar src={otherUser.avatar} name={otherUser.name} size="md" isOnline={otherUser.isOnline} />
                <div>
                  <p className="font-semibold text-white">{otherUser.name}</p>
                  <p className={cn("text-xs", otherUser.isOnline ? "text-emerald-400" : "text-slate-500")}>
                    {otherUser.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                  <Phone size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                  <Video size={18} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((msg) => {
            const isMine = msg.senderId === "current";
            return (
              <div key={msg.id} className={cn("flex gap-3", isMine ? "flex-row-reverse" : "flex-row")}>
                {!isMine && otherUser && (
                  <Avatar src={otherUser.avatar} name={otherUser.name} size="sm" className="shrink-0 mt-auto" />
                )}
                <div className={cn("max-w-[70%]", isMine ? "items-end" : "items-start", "flex flex-col gap-1")}>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                      isMine
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-sm"
                        : "bg-surface-3 text-slate-200 border border-white/6 rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-slate-600">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && otherUser && (
            <div className="flex gap-3">
              <Avatar src={otherUser.avatar} name={otherUser.name} size="sm" />
              <div className="bg-surface-3 border border-white/6 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="px-6 py-4 border-t border-white/6 bg-surface-1">
          <div className="flex items-end gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/6 transition-colors shrink-0">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Write a message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none min-h-[48px] max-h-32"
              />
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/6 transition-colors shrink-0">
              <Smile size={18} />
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-all shrink-0",
                input.trim()
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              )}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { User, Lock, BookOpen, Clock, Bell, Shield, Save, Camera } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { currentUser } from "@/data/users";
import { cn } from "@/lib/utils";

type Section = "account" | "profile" | "skills" | "availability" | "notifications" | "privacy";

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "account", label: "Account", icon: <User size={16} /> },
  { id: "profile", label: "Profile", icon: <User size={16} /> },
  { id: "skills", label: "Skills", icon: <BookOpen size={16} /> },
  { id: "availability", label: "Availability", icon: <Clock size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "privacy", label: "Privacy", icon: <Shield size={16} /> },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("account");
  const [saved, setSaved] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    emailSwapRequests: true,
    emailMessages: true,
    emailSessionReminders: true,
    emailReviews: false,
    pushAll: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    locationVisible: true,
    onlineStatus: true,
  });

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <nav className="lg:col-span-1">
          <div className="bg-surface-2 border border-white/6 rounded-2xl p-2 space-y-0.5">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                  activeSection === sec.id
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <span className={activeSection === sec.id ? "text-indigo-400" : "text-slate-600"}>
                  {sec.icon}
                </span>
                {sec.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-surface-2 border border-white/8 rounded-2xl p-6">
            {activeSection === "account" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Account Settings</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar src={currentUser.avatar} name={currentUser.name} size="2xl" />
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg hover:bg-indigo-400 transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Profile Photo</p>
                    <p className="text-xs text-slate-500 mb-2">JPG, PNG or GIF. Max 5MB.</p>
                    <Button variant="secondary" size="sm">Upload Photo</Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={currentUser.name} fullWidth />
                  <Input label="Username" defaultValue={currentUser.username} fullWidth />
                </div>
                <Input label="Email Address" type="email" defaultValue={currentUser.email} fullWidth />

                <div className="border-t border-white/8 pt-6">
                  <h3 className="text-base font-semibold text-white mb-4">Change Password</h3>
                  <div className="space-y-3">
                    <Input label="Current Password" type="password" placeholder="••••••••" fullWidth iconLeft={<Lock size={14} />} />
                    <Input label="New Password" type="password" placeholder="••••••••" fullWidth iconLeft={<Lock size={14} />} />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" fullWidth iconLeft={<Lock size={14} />} />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue={currentUser.bio}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Country" defaultValue={currentUser.country} fullWidth />
                  <Input label="City" defaultValue={currentUser.city} fullWidth />
                </div>
                <Input label="Languages" defaultValue={currentUser.languages.join(", ")} fullWidth hint="Separate languages with commas" />
              </div>
            )}

            {activeSection === "availability" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Availability Settings</h2>
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-3">Available Days</p>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const isSelected = currentUser.availability.days.some((d) =>
                        d.toLowerCase() === day.toLowerCase()
                      );
                      return (
                        <button
                          key={day}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                            isSelected
                              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Available From" type="time" defaultValue={currentUser.availability.timeStart} fullWidth />
                  <Input label="Available Until" type="time" defaultValue={currentUser.availability.timeEnd} fullWidth />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Timezone</label>
                    <select defaultValue={currentUser.availability.timezone} className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                      {["UTC", "UTC-5 (EST)", "UTC-8 (PST)", "UTC+1 (CET)", "UTC+5:30 (IST)", "UTC+9 (JST)", "KST"].map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Preferred Session Duration</label>
                    <select defaultValue={currentUser.availability.preferredDuration} className="h-11 rounded-xl bg-white/5 border border-white/10 text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: "emailSwapRequests", label: "New swap requests", desc: "Get notified when someone wants to swap with you" },
                      { key: "emailMessages", label: "New messages", desc: "Receive emails for new direct messages" },
                      { key: "emailSessionReminders", label: "Session reminders", desc: "24h and 1h before your sessions" },
                      { key: "emailReviews", label: "Reviews received", desc: "When someone leaves you a review" },
                    ].map((setting) => (
                      <label key={setting.key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/4 transition-colors">
                        <input
                          type="checkbox"
                          checked={notifSettings[setting.key as keyof typeof notifSettings] as boolean}
                          onChange={(e) => setNotifSettings({ ...notifSettings, [setting.key]: e.target.checked })}
                          className="mt-0.5 accent-indigo-500 w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{setting.label}</p>
                          <p className="text-xs text-slate-500">{setting.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Privacy Settings</h2>
                <div className="space-y-3">
                  {[
                    { key: "profilePublic", label: "Public Profile", desc: "Allow anyone to view your profile" },
                    { key: "locationVisible", label: "Show Location", desc: "Display your city and country on your profile" },
                    { key: "onlineStatus", label: "Online Status", desc: "Show when you're active on SkillSwap" },
                  ].map((setting) => (
                    <label key={setting.key} className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-surface-3 border border-white/5 hover:border-white/12 transition-colors">
                      <input
                        type="checkbox"
                        checked={privacySettings[setting.key as keyof typeof privacySettings]}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, [setting.key]: e.target.checked })}
                        className="mt-0.5 accent-indigo-500 w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{setting.label}</p>
                        <p className="text-xs text-slate-500">{setting.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="border-t border-white/8 pt-6">
                  <h3 className="text-base font-semibold text-red-400 mb-3">Danger Zone</h3>
                  <Button variant="danger" size="sm">Delete Account</Button>
                </div>
              </div>
            )}

            {activeSection === "skills" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Skills Settings</h2>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Skills I Teach</h3>
                  <div className="space-y-2 mb-4">
                    {currentUser.skillsTeach.map((offer) => (
                      <div key={offer.id} className="flex items-center justify-between p-3 bg-surface-3 rounded-xl border border-white/6">
                        <span className="text-sm text-white">{offer.skill.name}</span>
                        <span className="text-xs text-slate-500">{offer.level}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">+ Add Teaching Skill</Button>
                </div>

                <div className="border-t border-white/8 pt-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Skills I Want to Learn</h3>
                  <div className="space-y-2 mb-4">
                    {currentUser.skillsLearn.map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-3 bg-surface-3 rounded-xl border border-white/6">
                        <span className="text-sm text-white">{req.skill.name}</span>
                        <span className="text-xs text-slate-500">target: {req.desiredLevel}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">+ Add Learning Goal</Button>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="mt-8 flex items-center gap-3">
              <Button onClick={handleSave} icon={<Save size={16} />}>
                {saved ? "Saved!" : "Save Changes"}
              </Button>
              {saved && <span className="text-sm text-emerald-400">✓ Changes saved successfully</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


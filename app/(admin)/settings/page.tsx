"use client";

import { useState } from "react";
import {
  User, Lock, Bell, Palette, Globe, Trash2, Check,
  Eye, EyeOff, Sun, Moon, Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "security" | "notifications" | "appearance" | "advanced";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Profile",       icon: User    },
  { key: "security",      label: "Security",      icon: Lock    },
  { key: "notifications", label: "Notifications", icon: Bell    },
  { key: "appearance",    label: "Appearance",    icon: Palette },
  { key: "advanced",      label: "Advanced",      icon: Globe   },
];

const inputCls = "w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors";
const labelCls = "block text-xs font-medium text-zinc-700 mb-1.5";

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
      <div className="mb-4 pb-4 border-b border-zinc-100">
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        {desc && <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0",
        checked ? "bg-violet-500" : "bg-zinc-200"
      )}
    >
      <span className={cn(
        "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform",
        checked ? "translate-x-[22px]" : "translate-x-[3px]"
      )} />
    </button>
  );
}

function NotifRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-zinc-50 last:border-0">
      <div>
        <p className="text-sm text-zinc-800 font-medium">{label}</p>
        <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SaveButton({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onSave}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          saved ? "bg-emerald-50 text-emerald-700" : "bg-violet-600 text-white hover:bg-violet-700 active:scale-[.98]"
        )}
      >
        {saved ? <><Check size={14} /> Saved!</> : "Save changes"}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  // Profile state
  const [profile, setProfile] = useState({ name: "Shahbaz Ali", email: "shahbaz@example.com", bio: "Full-stack developer. Building admin tools.", timezone: "Asia/Karachi", language: "English" });
  const [profileSaved, setProfileSaved] = useState(false);

  // Security state
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaved, setPwSaved]         = useState(false);
  const [twoFa, setTwoFa]             = useState(false);

  // Notifications state
  const [notifPrefs, setNotifPrefs] = useState({
    emailNewUser:     true,
    emailPayment:     true,
    emailAlert:       false,
    emailWeekly:      true,
    pushNewUser:      false,
    pushPayment:      true,
    pushAlert:        true,
    pushMaintenance:  true,
  });

  // Appearance state
  const [theme, setTheme]         = useState<"light" | "dark" | "system">("light");
  const [density, setDensity]     = useState<"compact" | "default" | "comfortable">("default");
  const [accentColor, setAccent]  = useState<"violet" | "blue" | "emerald" | "rose">("violet");
  const [appearSaved, setAppearSaved] = useState(false);

  function save(setFn: (v: boolean) => void) {
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  }

  const accentOptions = [
    { key: "violet",  color: "bg-violet-500"  },
    { key: "blue",    color: "bg-blue-500"    },
    { key: "emerald", color: "bg-emerald-500" },
    { key: "rose",    color: "bg-rose-500"    },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Settings</h2>
        <p className="text-zinc-400 text-sm mt-0.5">Manage your account, security, and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Tab list */}
        <nav className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-2 space-y-0.5 lg:self-start">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                tab === key
                  ? "bg-violet-50 text-violet-700 font-medium"
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
              )}
            >
              <Icon size={15} className={tab === key ? "text-violet-500" : "text-zinc-400"} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">

          {/* PROFILE */}
          {tab === "profile" && (
            <>
              <SectionCard title="Personal information" desc="Update your name, email, and bio.">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 text-xl font-bold flex-shrink-0">
                    SA
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Profile photo</p>
                    <p className="text-xs text-zinc-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                    <button className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-700">
                      Upload photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email address</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Timezone</label>
                    <select value={profile.timezone} onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))} className={inputCls}>
                      <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Language</label>
                    <select value={profile.language} onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))} className={inputCls}>
                      <option>English</option>
                      <option>Urdu</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                <SaveButton onSave={() => save(setProfileSaved)} saved={profileSaved} />
              </SectionCard>
            </>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <>
              <SectionCard title="Change password" desc="Use a strong password — at least 8 characters.">
                <div className="space-y-3">
                  {[
                    { label: "Current password",  show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
                    { label: "New password",       show: showNew,     toggle: () => setShowNew((v) => !v)     },
                    { label: "Confirm new password", show: showConfirm, toggle: () => setShowConfirm((v) => !v) },
                  ].map(({ label, show, toggle }) => (
                    <div key={label}>
                      <label className={labelCls}>{label}</label>
                      <div className="relative">
                        <input type={show ? "text" : "password"} placeholder="••••••••" className={cn(inputCls, "pr-9")} />
                        <button onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                          {show ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <SaveButton onSave={() => save(setPwSaved)} saved={pwSaved} />
              </SectionCard>

              <SectionCard title="Two-factor authentication" desc="Add an extra layer of security to your account.">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-800">Authenticator app</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Use an app like Google Authenticator for 2FA codes.</p>
                  </div>
                  <Toggle checked={twoFa} onChange={() => setTwoFa((v) => !v)} />
                </div>
                {twoFa && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-xl ring-1 ring-emerald-100">
                    <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                      <Check size={12} /> Two-factor authentication is enabled.
                    </p>
                  </div>
                )}
              </SectionCard>

              <SectionCard title="Active sessions" desc="Manage devices logged into your account.">
                {[
                  { device: "Chrome on Windows", ip: "121.52.x.x", location: "Islamabad, PK", current: true  },
                  { device: "Safari on iPhone",  ip: "172.16.x.x", location: "Karachi, PK",   current: false },
                ].map((s) => (
                  <div key={s.device} className="flex items-center justify-between py-2.5 border-b border-zinc-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-zinc-800">{s.device}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{s.ip} · {s.location}</p>
                    </div>
                    {s.current
                      ? <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full">Current</span>
                      : <button className="text-xs text-red-500 hover:text-red-700 font-medium">Revoke</button>
                    }
                  </div>
                ))}
              </SectionCard>
            </>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notifications" && (
            <>
              <SectionCard title="Email notifications" desc="Choose which emails you want to receive.">
                <NotifRow label="New user registration"  desc="Get notified when someone creates an account."  checked={notifPrefs.emailNewUser} onChange={() => setNotifPrefs((p) => ({ ...p, emailNewUser: !p.emailNewUser }))} />
                <NotifRow label="Payment received"       desc="Get notified when an invoice is paid."           checked={notifPrefs.emailPayment} onChange={() => setNotifPrefs((p) => ({ ...p, emailPayment: !p.emailPayment }))} />
                <NotifRow label="System alerts"          desc="Critical alerts and outage notifications."       checked={notifPrefs.emailAlert}   onChange={() => setNotifPrefs((p) => ({ ...p, emailAlert: !p.emailAlert }))} />
                <NotifRow label="Weekly digest"          desc="A weekly summary of platform activity."         checked={notifPrefs.emailWeekly}  onChange={() => setNotifPrefs((p) => ({ ...p, emailWeekly: !p.emailWeekly }))} />
              </SectionCard>

              <SectionCard title="Push notifications" desc="In-app alerts shown in the notification center.">
                <NotifRow label="New user registration" desc="Show a badge when new users sign up."             checked={notifPrefs.pushNewUser}     onChange={() => setNotifPrefs((p) => ({ ...p, pushNewUser: !p.pushNewUser }))} />
                <NotifRow label="Payment events"        desc="Alert on payment received or overdue."            checked={notifPrefs.pushPayment}     onChange={() => setNotifPrefs((p) => ({ ...p, pushPayment: !p.pushPayment }))} />
                <NotifRow label="System alerts"         desc="High CPU, memory, or uptime events."              checked={notifPrefs.pushAlert}       onChange={() => setNotifPrefs((p) => ({ ...p, pushAlert: !p.pushAlert }))} />
                <NotifRow label="Maintenance windows"   desc="Notifications before scheduled maintenance."     checked={notifPrefs.pushMaintenance} onChange={() => setNotifPrefs((p) => ({ ...p, pushMaintenance: !p.pushMaintenance }))} />
              </SectionCard>
            </>
          )}

          {/* APPEARANCE */}
          {tab === "appearance" && (
            <SectionCard title="Appearance" desc="Customize how the admin panel looks.">
              {/* Theme */}
              <div className="mb-5">
                <label className={labelCls}>Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: "light",  icon: Sun,     label: "Light"  },
                    { key: "dark",   icon: Moon,    label: "Dark"   },
                    { key: "system", icon: Monitor, label: "System" },
                  ] as const).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={cn(
                        "flex flex-col items-center gap-2 py-3 rounded-xl border text-xs font-medium transition-all",
                        theme === key
                          ? "border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-200"
                          : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div className="mb-5">
                <label className={labelCls}>Density</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["compact", "default", "comfortable"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={cn(
                        "py-2 rounded-xl border text-xs font-medium capitalize transition-all",
                        density === d
                          ? "border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-200"
                          : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div className="mb-5">
                <label className={labelCls}>Accent color</label>
                <div className="flex items-center gap-2">
                  {accentOptions.map(({ key, color }) => (
                    <button
                      key={key}
                      onClick={() => setAccent(key)}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        color,
                        accentColor === key && "ring-2 ring-offset-2 ring-zinc-400"
                      )}
                    >
                      {accentColor === key && <Check size={12} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <SaveButton onSave={() => save(setAppearSaved)} saved={appearSaved} />
            </SectionCard>
          )}

          {/* ADVANCED */}
          {tab === "advanced" && (
            <>
              <SectionCard title="Data & privacy" desc="Manage your data and export options.">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-zinc-800">Export all data</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Download a copy of all your account data as a JSON file.</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors">
                      Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-zinc-50">
                    <div>
                      <p className="text-sm font-medium text-zinc-800">Analytics tracking</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Help us improve by sending anonymous usage data.</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>
              </SectionCard>

              <div className="bg-red-50 rounded-2xl ring-1 ring-inset ring-red-100 p-5">
                <div className="mb-4 pb-4 border-b border-red-100">
                  <p className="text-sm font-semibold text-red-700">Danger zone</p>
                  <p className="text-xs text-red-400 mt-0.5">Irreversible actions. Proceed with caution.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-800">Deactivate account</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Temporarily disable your account. You can reactivate any time.</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors">
                      Deactivate
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-red-100">
                    <div>
                      <p className="text-sm font-medium text-red-700">Delete account permanently</p>
                      <p className="text-xs text-zinc-400 mt-0.5">All your data will be permanently deleted. This cannot be undone.</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

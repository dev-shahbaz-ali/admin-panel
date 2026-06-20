"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, UserPlus, Check, Eye, EyeOff,
  Mail, Phone, Building2, MapPin,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/usersData";
import type { User } from "@/lib/types";

const inputCls =
  "w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors";
const labelCls = "block text-xs font-medium text-zinc-700 mb-1.5";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

const roleInfo: Record<string, { desc: string; color: string; ring: string; text: string }> = {
  Admin:  { desc: "Full access — users, settings, billing.",    color: "bg-violet-50", ring: "ring-violet-300", text: "text-violet-700" },
  Editor: { desc: "Create and edit content. No admin access.",  color: "bg-sky-50",    ring: "ring-sky-300",    text: "text-sky-700"    },
  Viewer: { desc: "Read-only access across the platform.",      color: "bg-zinc-50",   ring: "ring-zinc-300",   text: "text-zinc-600"   },
};

export default function NewUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name:     "",
    email:    "",
    phone:    "",
    company:  "",
    location: "",
    role:     "Viewer" as User["role"],
    password: "",
    sendInvite: true,
  });
  const [showPw,   setShowPw]   = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);

  function set(key: string, value: string | boolean) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.sendInvite && !form.password.trim()) e.password = "Set a password or enable email invite.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push("/users"), 1200);
    }, 900);
  }

  const initials = getInitials(form.name);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/users"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <ArrowLeft size={15} /> Back to users
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Add new user</h2>
          <p className="text-zinc-400 text-sm mt-0.5">Fill in the details below and assign a role.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Preview card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 text-xl font-bold mb-3">
              {initials}
            </div>
            <p className={cn("font-semibold text-sm", form.name ? "text-zinc-900" : "text-zinc-300")}>
              {form.name || "Full name"}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5 break-all">
              {form.email || "email@example.com"}
            </p>
            {form.company && (
              <p className="text-xs text-zinc-400 mt-0.5">{form.company}</p>
            )}
            <span className={cn(
              "mt-3 text-xs font-medium px-2.5 py-1 rounded-full ring-1 ring-inset",
              roleInfo[form.role].color,
              roleInfo[form.role].ring,
              roleInfo[form.role].text
            )}>
              {form.role}
            </span>
          </div>

          {/* Role selector */}
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-4">
            <p className="text-xs font-semibold text-zinc-700 mb-3">Role</p>
            <div className="space-y-2">
              {ROLES.map((r) => {
                const info = roleInfo[r];
                const selected = form.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => set("role", r)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border text-sm transition-all",
                      selected
                        ? `${info.color} ${info.ring} ring-1 ring-inset`
                        : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
                    )}
                  >
                    <p className={cn("font-medium text-xs", selected ? info.text : "text-zinc-700")}>{r}</p>
                    <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">{info.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic info */}
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
            <p className="text-sm font-semibold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">
              Basic information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Full name <span className="text-red-400">*</span></label>
                <input
                  autoFocus
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  className={cn(inputCls, errors.name && "border-red-300 focus:border-red-400 focus:ring-red-200/50")}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={labelCls}>Email address <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="sarah@company.com"
                    className={cn(inputCls, "pl-8", errors.email && "border-red-300 focus:border-red-400")}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className={labelCls}>Phone number</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+92 300 0000000"
                    className={cn(inputCls, "pl-8")}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Company / Organisation</label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Acme Corp"
                    className={cn(inputCls, "pl-8")}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Location</label>
                <div className="relative">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Islamabad, PK"
                    className={cn(inputCls, "pl-8")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Access & password */}
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
            <p className="text-sm font-semibold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">
              Access & password
            </p>

            {/* Send invite toggle */}
            <div
              onClick={() => set("sendInvite", !form.sendInvite)}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors mb-4",
                form.sendInvite ? "bg-violet-50 border-violet-200" : "bg-zinc-50 border-zinc-200"
              )}
            >
              <div>
                <p className="text-sm font-medium text-zinc-800">Send email invite</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  User sets their own password via a secure invite link.
                </p>
              </div>
              <div className={cn(
                "w-10 h-[22px] rounded-full transition-colors flex items-center relative flex-shrink-0",
                form.sendInvite ? "bg-violet-500" : "bg-zinc-300"
              )}>
                <span className={cn(
                  "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform",
                  form.sendInvite ? "translate-x-[22px]" : "translate-x-[3px]"
                )} />
              </div>
            </div>

            {/* Manual password */}
            {!form.sendInvite && (
              <div>
                <label className={labelCls}>
                  Set password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className={cn(inputCls, "pr-9", errors.password && "border-red-300")}
                  />
                  <button
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/users"
              className="px-4 py-2.5 rounded-xl text-sm text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || saved}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-[.98]",
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : saving
                  ? "bg-violet-400 text-white cursor-wait"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200"
              )}
            >
              {saved ? (
                <><Check size={15} /> User created! Redirecting…</>
              ) : saving ? (
                <>Creating user…</>
              ) : (
                <><UserPlus size={15} /> {form.sendInvite ? "Create & send invite" : "Create user"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

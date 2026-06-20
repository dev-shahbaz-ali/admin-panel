"use client";

import { useState, useRef, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";
import { ROLES } from "@/lib/usersData";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: Omit<User, "id" | "sessions" | "avatar">) => void;
}

const AVATAR_COLORS = [
  "purple", "teal", "coral", "blue", "green", "amber",
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const inputClass =
  "w-full h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors";

const labelClass = "block text-xs font-medium text-zinc-700 mb-1.5";

export function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState<User["role"]>("Viewer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef             = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 50);
    } else {
      setName(""); setEmail(""); setRole("Viewer"); setErrors({});
    }
  }, [open]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      name:   name.trim(),
      email:  email.trim(),
      role,
      status: "Active",
      joined: new Date().toISOString().split("T")[0],
    });
    onClose();
  }

  if (!open) return null;

  return (
    /* Faux viewport overlay — normal-flow div so iframe height works */
    <div
      style={{ minHeight: 420 }}
      className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl ring-1 ring-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100">
          <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
            <UserPlus size={16} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Add new user</h2>
            <p className="text-xs text-zinc-400">They'll receive an invite email.</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Preview avatar */}
        <div className="flex items-center gap-3 px-5 py-4 bg-zinc-50 border-b border-zinc-100">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-sm font-semibold flex-shrink-0">
            {name ? getInitials(name) : "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">
              {name || <span className="text-zinc-400">Full name</span>}
            </p>
            <p className="text-xs text-zinc-400">{email || "email@example.com"}</p>
          </div>
          <span className={cn(
            "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
            role === "Admin"  && "bg-violet-100 text-violet-700",
            role === "Editor" && "bg-sky-100 text-sky-700",
            role === "Viewer" && "bg-zinc-100 text-zinc-600",
          )}>
            {role}
          </span>
        </div>

        {/* Form */}
        <div className="px-5 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Full name</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="e.g. Sarah Chen"
              className={cn(inputClass, errors.name && "border-red-300 focus:ring-red-200 focus:border-red-400")}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
              placeholder="e.g. sarah@company.com"
              className={cn(inputClass, errors.email && "border-red-300 focus:ring-red-200 focus:border-red-400")}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Role */}
          <div>
            <label className={labelClass}>Role</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "py-2 rounded-lg text-xs font-medium border transition-all",
                    role === r
                      ? r === "Admin"
                        ? "border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-200"
                        : r === "Editor"
                        ? "border-sky-400 bg-sky-50 text-sky-700 ring-2 ring-sky-200"
                        : "border-zinc-400 bg-zinc-50 text-zinc-700 ring-2 ring-zinc-200"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">
              {role === "Admin"  && "Full access — can manage users, settings, and billing."}
              {role === "Editor" && "Can create and edit content, but not manage users."}
              {role === "Viewer" && "Read-only access across the platform."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 active:scale-[.98] transition-all"
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}

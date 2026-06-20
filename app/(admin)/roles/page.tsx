"use client";

import { useState } from "react";
import { Shield, Plus, Check, X, Users, Edit3, Eye, Settings, CreditCard, BarChart2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type PermKey = "manageUsers" | "editContent" | "viewReports" | "manageSettings" | "manageBilling" | "viewAnalytics" | "manageNotifications";

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  userCount: number;
  permissions: Record<PermKey, boolean>;
  isSystem: boolean;
}

const PERMISSIONS: { key: PermKey; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "manageUsers",         label: "Manage users",         desc: "Create, edit, delete users and roles",        icon: Users    },
  { key: "editContent",         label: "Edit content",         desc: "Create and modify platform content",          icon: Edit3    },
  { key: "viewReports",         label: "View reports",         desc: "Access all analytics and reports",            icon: BarChart2},
  { key: "manageSettings",      label: "Manage settings",      desc: "Change platform-wide configuration",          icon: Settings },
  { key: "manageBilling",       label: "Manage billing",       desc: "Access invoices and payment methods",         icon: CreditCard},
  { key: "viewAnalytics",       label: "View analytics",       desc: "Read-only access to dashboards",              icon: Eye      },
  { key: "manageNotifications", label: "Notifications",        desc: "Send and manage system notifications",        icon: Bell     },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to everything. Handles users, billing, and config.",
    color: "violet",
    userCount: 4,
    isSystem: true,
    permissions: { manageUsers: true,  editContent: true,  viewReports: true,  manageSettings: true,  manageBilling: true,  viewAnalytics: true,  manageNotifications: true  },
  },
  {
    id: "editor",
    name: "Editor",
    description: "Can create and edit content and view analytics. No admin access.",
    color: "sky",
    userCount: 8,
    isSystem: true,
    permissions: { manageUsers: false, editContent: true,  viewReports: true,  manageSettings: false, manageBilling: false, viewAnalytics: true,  manageNotifications: false },
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only across the platform. Cannot modify anything.",
    color: "zinc",
    userCount: 8,
    isSystem: true,
    permissions: { manageUsers: false, editContent: false, viewReports: false, manageSettings: false, manageBilling: false, viewAnalytics: true,  manageNotifications: false },
  },
  {
    id: "billing-mgr",
    name: "Billing Manager",
    description: "Access to invoices and payments only.",
    color: "emerald",
    userCount: 2,
    isSystem: false,
    permissions: { manageUsers: false, editContent: false, viewReports: true,  manageSettings: false, manageBilling: true,  viewAnalytics: true,  manageNotifications: false },
  },
];

const colorMap: Record<string, { badge: string; icon: string; ring: string }> = {
  violet:  { badge: "bg-violet-50 text-violet-700",  icon: "text-violet-500",  ring: "ring-violet-200"  },
  sky:     { badge: "bg-sky-50 text-sky-700",         icon: "text-sky-500",     ring: "ring-sky-200"     },
  zinc:    { badge: "bg-zinc-100 text-zinc-600",      icon: "text-zinc-400",    ring: "ring-zinc-200"    },
  emerald: { badge: "bg-emerald-50 text-emerald-700", icon: "text-emerald-500", ring: "ring-emerald-200" },
};

export default function RolesPage() {
  const [roles, setRoles]           = useState<Role[]>(INITIAL_ROLES);
  const [selectedId, setSelectedId] = useState<string>("admin");
  const [showNew, setShowNew]       = useState(false);
  const [newName, setNewName]       = useState("");
  const [newDesc, setNewDesc]       = useState("");
  const [saved, setSaved]           = useState(false);

  const selected = roles.find((r) => r.id === selectedId)!;
  const colors   = colorMap[selected.color] ?? colorMap.zinc;

  function togglePermission(key: PermKey) {
    if (selected.isSystem && selected.id === "admin") return; // admin always has all
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedId
          ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }
          : r
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addRole() {
    if (!newName.trim()) return;
    const newRole: Role = {
      id:          newName.toLowerCase().replace(/\s+/g, "-"),
      name:        newName.trim(),
      description: newDesc.trim() || "Custom role.",
      color:       "emerald",
      userCount:   0,
      isSystem:    false,
      permissions: { manageUsers: false, editContent: false, viewReports: false, manageSettings: false, manageBilling: false, viewAnalytics: true, manageNotifications: false },
    };
    setRoles((prev) => [...prev, newRole]);
    setSelectedId(newRole.id);
    setNewName(""); setNewDesc(""); setShowNew(false);
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Roles & permissions</h2>
          <p className="text-zinc-400 text-sm mt-0.5">Define what each role can access across the platform.</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-all shadow-sm shadow-violet-200 active:scale-[.98]"
        >
          <Plus size={15} /> Create role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Role list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1 mb-3">
            {roles.length} roles
          </p>
          {roles.map((role) => {
            const c = colorMap[role.color] ?? colorMap.zinc;
            const isSelected = role.id === selectedId;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedId(role.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl ring-1 ring-inset transition-all",
                  isSelected
                    ? `bg-white ${c.ring} shadow-sm`
                    : "bg-white ring-zinc-100 hover:ring-zinc-200"
                )}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <Shield size={15} className={c.icon} />
                  <span className="text-sm font-semibold text-zinc-900">{role.name}</span>
                  {role.isSystem && (
                    <span className="ml-auto text-[10px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                      system
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{role.description}</p>
                <div className="flex items-center gap-1 mt-2.5">
                  <Users size={11} className="text-zinc-300" />
                  <span className="text-[11px] text-zinc-400">{role.userCount} users</span>
                </div>
              </button>
            );
          })}

          {/* New role inline form */}
          {showNew && (
            <div className="bg-white rounded-2xl ring-1 ring-inset ring-violet-200 p-4 space-y-3">
              <p className="text-xs font-semibold text-zinc-700">New role</p>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Role name"
                className="w-full h-8 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Short description (optional)"
                className="w-full h-8 px-3 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400"
              />
              <div className="flex gap-2">
                <button onClick={addRole} className="flex-1 py-1.5 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700">
                  Create
                </button>
                <button onClick={() => setShowNew(false)} className="flex-1 py-1.5 text-xs font-medium border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Permission matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
          {/* Role header */}
          <div className="flex items-start justify-between mb-5 pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorMap[selected.color]?.badge ?? "bg-zinc-100")}>
                <Shield size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-zinc-900 font-semibold text-sm">{selected.name}</h3>
                  {selected.isSystem && (
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-md font-medium">system</span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs mt-0.5">{selected.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">{selected.userCount} users</span>
              {!selected.isSystem && (
                <button
                  onClick={handleSave}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    saved
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  )}
                >
                  {saved ? <><Check size={12} /> Saved!</> : "Save changes"}
                </button>
              )}
            </div>
          </div>

          {/* Permissions list */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Permissions</p>
            {PERMISSIONS.map(({ key, label, desc, icon: Icon }) => {
              const granted = selected.permissions[key];
              const locked  = selected.id === "admin";
              return (
                <div
                  key={key}
                  onClick={() => !locked && togglePermission(key)}
                  className={cn(
                    "flex items-center gap-4 p-3.5 rounded-xl transition-colors",
                    locked ? "cursor-default" : "cursor-pointer hover:bg-zinc-50",
                    granted ? "bg-zinc-50" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    granted ? "bg-violet-50" : "bg-zinc-100"
                  )}>
                    <Icon size={14} className={granted ? "text-violet-600" : "text-zinc-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", granted ? "text-zinc-900" : "text-zinc-400")}>{label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
                  </div>
                  {/* Toggle */}
                  <div className={cn(
                    "w-10 h-5.5 rounded-full transition-colors flex items-center flex-shrink-0 relative",
                    "h-[22px]",
                    granted ? "bg-violet-500" : "bg-zinc-200",
                    locked && "opacity-60"
                  )}>
                    <span className={cn(
                      "absolute w-4 h-4 rounded-full bg-white shadow transition-transform top-[3px]",
                      granted ? "translate-x-[22px]" : "translate-x-[3px]"
                    )} />
                  </div>
                </div>
              );
            })}
          </div>

          {selected.id === "admin" && (
            <p className="text-xs text-zinc-400 mt-4 flex items-center gap-1.5">
              <Shield size={11} /> Admin permissions are fixed and cannot be modified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

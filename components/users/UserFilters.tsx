"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";
import { ROLES, STATUSES } from "@/lib/usersData";

interface UserFiltersProps {
  search:        string;
  roleFilter:    User["role"] | "All";
  statusFilter:  User["status"] | "All";
  onSearch:      (v: string) => void;
  onRoleChange:  (v: User["role"] | "All") => void;
  onStatusChange:(v: User["status"] | "All") => void;
  totalShown:    number;
  totalAll:      number;
}

const roleColors: Record<string, string> = {
  All:    "bg-zinc-100   text-zinc-600",
  Admin:  "bg-violet-100 text-violet-700",
  Editor: "bg-sky-100    text-sky-700",
  Viewer: "bg-zinc-100   text-zinc-600",
};

export function UserFilters({
  search, roleFilter, statusFilter,
  onSearch, onRoleChange, onStatusChange,
  totalShown, totalAll,
}: UserFiltersProps) {
  const hasFilters = search || roleFilter !== "All" || statusFilter !== "All";

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value as User["role"] | "All")}
          className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors cursor-pointer"
        >
          <option value="All">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as User["status"] | "All")}
          className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors cursor-pointer"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Active filter pills + result count */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-400">
          Showing {totalShown} of {totalAll} users
        </span>

        {roleFilter !== "All" && (
          <button
            onClick={() => onRoleChange("All")}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
              roleColors[roleFilter]
            )}
          >
            {roleFilter} <X size={10} />
          </button>
        )}
        {statusFilter !== "All" && (
          <button
            onClick={() => onStatusChange("All")}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600"
          >
            {statusFilter} <X size={10} />
          </button>
        )}
        {hasFilters && (
          <button
            onClick={() => { onSearch(""); onRoleChange("All"); onStatusChange("All"); }}
            className="text-xs text-violet-600 hover:text-violet-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

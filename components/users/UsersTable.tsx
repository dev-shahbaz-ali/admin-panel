"use client";

import { useState } from "react";
import {
  ChevronUp, ChevronDown, ChevronsUpDown,
  MoreHorizontal, Pencil, Trash2, ShieldAlert,
} from "lucide-react";
import { cn, avatarColors } from "@/lib/utils";
import { RoleBadge, StatusBadge } from "./Badges";
import type { User } from "@/lib/types";

type SortKey = "name" | "email" | "role" | "status" | "joined" | "sessions";
type SortDir = "asc" | "desc";

interface UsersTableProps {
  users:    User[];
  onDelete: (id: string) => void;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={12} className="text-zinc-300" />;
  return sortDir === "asc"
    ? <ChevronUp   size={12} className="text-violet-500" />
    : <ChevronDown size={12} className="text-violet-500" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function UsersTable({ users, onDelete }: UsersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  function toggleSort(col: SortKey) {
    if (col === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(col); setSortDir("asc"); }
  }

  const sorted = [...users].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    const cmp  = typeof valA === "number"
      ? (valA as number) - (valB as number)
      : String(valA).localeCompare(String(valB));
    return sortDir === "asc" ? cmp : -cmp;
  });

  function toggleAll() {
    setSelected(selected.size === users.length
      ? new Set()
      : new Set(users.map((u) => u.id))
    );
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  const allSelected = users.length > 0 && selected.size === users.length;

  const thClass = "text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap select-none";
  const tdClass = "px-4 py-3 text-sm text-zinc-700 whitespace-nowrap";

  return (
    <div className="relative bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 overflow-hidden">
      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-violet-50 border-b border-violet-100">
          <span className="text-xs font-medium text-violet-700">
            {selected.size} user{selected.size > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => { selected.forEach((id) => onDelete(id)); setSelected(new Set()); }}
            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 ml-auto"
          >
            <Trash2 size={13} /> Delete selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-zinc-500 hover:text-zinc-700"
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-zinc-100 bg-zinc-50/60">
            <tr>
              {/* Checkbox */}
              <th className="pl-4 pr-2 py-3 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500/30 cursor-pointer"
                />
              </th>
              {(
                [
                  { key: "name",     label: "User"     },
                  { key: "role",     label: "Role"     },
                  { key: "status",   label: "Status"   },
                  { key: "sessions", label: "Sessions" },
                  { key: "joined",   label: "Joined"   },
                ] as { key: SortKey; label: string }[]
              ).map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className={cn(thClass, "cursor-pointer hover:text-zinc-600 transition-colors")}
                >
                  <span className="inline-flex items-center gap-1">
                    {label}
                    <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th className={thClass}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-50">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-400 text-sm">
                  No users match your filters.
                </td>
              </tr>
            )}
            {sorted.map((user) => {
              const isSelected = selected.has(user.id);
              const colors     = avatarColors[
                ["purple","teal","coral","blue","green","amber"][
                  user.id.charCodeAt(1) % 6
                ] as keyof typeof avatarColors
              ];

              return (
                <tr
                  key={user.id}
                  className={cn(
                    "transition-colors",
                    isSelected ? "bg-violet-50/60" : "hover:bg-zinc-50"
                  )}
                >
                  {/* Checkbox */}
                  <td className="pl-4 pr-2 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(user.id)}
                      className="rounded border-zinc-300 text-violet-600 focus:ring-violet-500/30 cursor-pointer"
                    />
                  </td>

                  {/* User name + email */}
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                        colors.bg, colors.text
                      )}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 text-sm">{user.name}</p>
                        <p className="text-zinc-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className={tdClass}>
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Status */}
                  <td className={tdClass}>
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Sessions */}
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-400 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((user.sessions / 210) * 100))}%` }}
                        />
                      </div>
                      <span className="text-zinc-500 text-xs">{user.sessions}</span>
                    </div>
                  </td>

                  {/* Joined */}
                  <td className={cn(tdClass, "text-zinc-400 text-xs")}>
                    {formatDate(user.joined)}
                  </td>

                  {/* Actions */}
                  <td className={tdClass}>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {openMenu === user.id && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenu(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-xl ring-1 ring-zinc-200 shadow-lg py-1 overflow-hidden">
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                              <Pencil size={13} className="text-zinc-400" /> Edit user
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors">
                              <ShieldAlert size={13} className="text-zinc-400" /> Change role
                            </button>
                            <div className="border-t border-zinc-100 my-1" />
                            <button
                              onClick={() => { onDelete(user.id); setOpenMenu(null); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={13} /> Remove user
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

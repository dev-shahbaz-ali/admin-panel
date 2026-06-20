import { cn } from "@/lib/utils";
import type { User } from "@/lib/types";

const roleStyles: Record<User["role"], string> = {
  Admin:  "bg-violet-50  text-violet-700  ring-violet-200",
  Editor: "bg-sky-50     text-sky-700     ring-sky-200",
  Viewer: "bg-zinc-100   text-zinc-600    ring-zinc-200",
};

const statusStyles: Record<User["status"], string> = {
  Active:    "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Inactive:  "bg-zinc-100  text-zinc-500   ring-zinc-200",
  Suspended: "bg-red-50    text-red-600    ring-red-200",
};

const statusDot: Record<User["status"], string> = {
  Active:    "bg-emerald-500",
  Inactive:  "bg-zinc-400",
  Suspended: "bg-red-500",
};

export function RoleBadge({ role }: { role: User["role"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset",
        roleStyles[role]
      )}
    >
      {role}
    </span>
  );
}

export function StatusBadge({ status }: { status: User["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset",
        statusStyles[status]
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", statusDot[status])} />
      {status}
    </span>
  );
}

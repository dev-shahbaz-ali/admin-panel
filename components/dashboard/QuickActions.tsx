import Link from "next/link";
import {
  UserPlus,
  Download,
  BarChart2,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { quickActions, topUsersData } from "@/lib/mockData";
import { avatarColors, cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  download:    Download,
  "chart-bar": BarChart2,
  terminal:    Terminal,
};

const actionStyles = [
  { bg: "bg-violet-50 hover:bg-violet-100", icon: "text-violet-600", border: "border-violet-100" },
  { bg: "bg-emerald-50 hover:bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-100" },
  { bg: "bg-sky-50 hover:bg-sky-100", icon: "text-sky-600", border: "border-sky-100" },
  { bg: "bg-amber-50 hover:bg-amber-100", icon: "text-amber-600", border: "border-amber-100" },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
      <p className="text-zinc-900 font-semibold text-sm mb-4">Quick actions</p>
      <div className="grid grid-cols-2 gap-2.5">
        {quickActions.map((action, i) => {
          const Icon = iconMap[action.icon] ?? UserPlus;
          const style = actionStyles[i % actionStyles.length];
          return (
            <Link
              key={action.label}
              href={action.href}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border transition-colors text-center",
                style.bg,
                style.border
              )}
            >
              <Icon size={18} className={style.icon} />
              <span className="text-zinc-700 text-xs font-medium leading-tight">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function TopUsers() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
      <p className="text-zinc-900 font-semibold text-sm mb-4">Most active users</p>
      <div className="space-y-3">
        {topUsersData.map((user, index) => {
          const colors = avatarColors[user.color] ?? avatarColors["purple"];
          const maxSessions = topUsersData[0].sessions;
          const pct = Math.round((user.sessions / maxSessions) * 100);

          return (
            <div key={user.name} className="flex items-center gap-3">
              <span className="text-zinc-300 text-xs w-4 text-right flex-shrink-0">
                {index + 1}
              </span>
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0",
                  colors.bg,
                  colors.text
                )}
              >
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-zinc-800 text-xs font-medium truncate">
                    {user.name}
                  </p>
                  <span className="text-zinc-400 text-[11px] flex-shrink-0 ml-2">
                    {user.sessions}
                  </span>
                </div>
                <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

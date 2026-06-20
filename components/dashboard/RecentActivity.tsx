import { activityFeed } from "@/lib/mockData";
import { avatarColors } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const typeColors: Record<string, string> = {
  user_signup: "bg-violet-50 text-violet-700",
  role_change:  "bg-sky-50 text-sky-700",
  alert:        "bg-amber-50 text-amber-700",
  payment:      "bg-emerald-50 text-emerald-700",
  system:       "bg-zinc-100 text-zinc-600",
};

const typeLabels: Record<string, string> = {
  user_signup: "signup",
  role_change:  "role",
  alert:        "alert",
  payment:      "payment",
  system:       "system",
};

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="text-zinc-900 font-semibold text-sm">Recent activity</p>
        <Link
          href="/notifications"
          className="flex items-center gap-1 text-violet-600 text-xs font-medium hover:text-violet-700"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-1">
        {activityFeed.map((item) => {
          const colors = avatarColors[item.color] ?? avatarColors["purple"];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group"
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                  colors.bg,
                  colors.text
                )}
              >
                {item.avatar}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-zinc-800 text-xs font-medium leading-tight">
                  {item.message}
                </p>
                <p className="text-zinc-400 text-[11px] truncate mt-0.5">
                  {item.detail}
                </p>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    typeColors[item.type]
                  )}
                >
                  {typeLabels[item.type]}
                </span>
                <p className="text-zinc-400 text-[11px]">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

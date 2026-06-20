import { TrendingUp, TrendingDown, Users, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatCard as StatCardType } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  "currency-dollar": DollarSign,
  activity: Activity,
  "alert-triangle": AlertTriangle,
};

const accentColors: Record<string, { ring: string; iconBg: string; iconColor: string }> = {
  "total-users":      { ring: "ring-violet-100",  iconBg: "bg-violet-50",  iconColor: "text-violet-600" },
  "monthly-revenue":  { ring: "ring-emerald-100", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  "active-sessions":  { ring: "ring-sky-100",     iconBg: "bg-sky-50",     iconColor: "text-sky-600" },
  "error-rate":       { ring: "ring-amber-100",   iconBg: "bg-amber-50",   iconColor: "text-amber-600" },
};

export function StatCard({ card }: { card: StatCardType }) {
  const Icon = iconMap[card.icon] ?? Activity;
  const accent = accentColors[card.id] ?? accentColors["total-users"];
  const isUp = card.trend === "up";

  /* For error rate, lower is better — so "up" change is bad */
  const isGood =
    card.id === "error-rate" ? !isUp : isUp;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 ring-1 ring-inset transition-shadow hover:shadow-sm",
        accent.ring
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent.iconBg)}>
          <Icon size={18} className={accent.iconColor} />
        </div>
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            isGood
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          )}
        >
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {card.change}
        </span>
      </div>

      <p className="text-2xl font-bold text-zinc-900 tracking-tight">
        {card.value}
      </p>
      <p className="text-zinc-400 text-sm mt-0.5">{card.label}</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Bell, Users, AlertTriangle, CreditCard, Settings, CheckCheck, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifType = "system" | "user" | "alert" | "payment" | "all";

interface Notif {
  id: string;
  type: Exclude<NotifType, "all">;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const INITIAL: Notif[] = [
  { id:"n01", type:"alert",   title:"High CPU usage",              body:"Server EU-West-2 has been above 90% CPU for 15 minutes.",           time:"2 min ago",  read:false },
  { id:"n02", type:"user",    title:"New user registered",         body:"sarah.chen@example.com created an account and is awaiting approval.", time:"14 min ago", read:false },
  { id:"n03", type:"payment", title:"Payment received",            body:"Invoice #4821 for $2,400 was paid by Acme Corp.",                    time:"31 min ago", read:false },
  { id:"n04", type:"system",  title:"Scheduled maintenance",       body:"The platform will go into read-only mode on Aug 25 at 02:00 UTC.",   time:"1 hr ago",   read:false },
  { id:"n05", type:"user",    title:"Role changed",                body:"james.morris@example.com was promoted to Editor by Super Admin.",    time:"2 hr ago",   read:true  },
  { id:"n06", type:"alert",   title:"Unusual login detected",      body:"Login from new device in Lagos, Nigeria for leo.kim@example.com.",   time:"3 hr ago",   read:true  },
  { id:"n07", type:"payment", title:"Invoice overdue",             body:"Invoice #4798 for $840 from Beta Ltd is 7 days overdue.",            time:"5 hr ago",   read:true  },
  { id:"n08", type:"system",  title:"Database backup complete",    body:"Weekly backup completed successfully. 12.4 GB stored.",              time:"6 hr ago",   read:true  },
  { id:"n09", type:"user",    title:"User suspended",              body:"ryan.park@example.com was suspended by admin after 3 failed verifications.", time:"8 hr ago", read:true },
  { id:"n10", type:"system",  title:"New version deployed",        body:"AdminPanel v2.4.1 was deployed to production without errors.",       time:"1 day ago",  read:true  },
  { id:"n11", type:"payment", title:"Subscription renewed",        body:"Pro plan renewed for $299/mo. Next renewal: Sep 19, 2024.",         time:"1 day ago",  read:true  },
  { id:"n12", type:"alert",   title:"SSL certificate expiring",    body:"SSL certificate for admin.example.com expires in 14 days.",         time:"2 days ago", read:true  },
];

const typeConfig: Record<Exclude<NotifType,"all">, { icon: React.ElementType; label: string; iconBg: string; iconColor: string; dot: string }> = {
  system:  { icon: Settings,      label: "System",  iconBg: "bg-zinc-100",    iconColor: "text-zinc-500",    dot: "bg-zinc-400"    },
  user:    { icon: Users,         label: "User",    iconBg: "bg-violet-50",   iconColor: "text-violet-600",  dot: "bg-violet-500"  },
  alert:   { icon: AlertTriangle, label: "Alert",   iconBg: "bg-amber-50",    iconColor: "text-amber-600",   dot: "bg-amber-500"   },
  payment: { icon: CreditCard,    label: "Payment", iconBg: "bg-emerald-50",  iconColor: "text-emerald-600", dot: "bg-emerald-500" },
};

const FILTERS: { key: NotifType; label: string }[] = [
  { key: "all",     label: "All"      },
  { key: "alert",   label: "Alerts"   },
  { key: "user",    label: "Users"    },
  { key: "payment", label: "Payments" },
  { key: "system",  label: "System"   },
];

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState<Notif[]>(INITIAL);
  const [filter, setFilter]   = useState<NotifType>("all");
  const [showRead, setShowRead] = useState(true);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    const matchType = filter === "all" || n.type === filter;
    const matchRead = showRead || !n.read;
    return matchType && matchRead;
  });

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-violet-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-zinc-400 text-sm mt-0.5">System alerts, user events, and payment updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRead((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors",
              !showRead ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            )}
          >
            <Filter size={12} />
            {showRead ? "Hide read" : "Show read"}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <CheckCheck size={12} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map(({ key, label }) => {
          const count = key === "all"
            ? notifs.length
            : notifs.filter((n) => n.type === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                filter === key
                  ? "bg-zinc-900 text-white"
                  : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-300"
              )}
            >
              {label}
              <span className={cn(
                "text-[10px] font-semibold px-1 rounded-md",
                filter === key ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="space-y-1">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Bell size={28} className="mb-3 opacity-30" />
            <p className="text-sm">No notifications here.</p>
          </div>
        )}
        {filtered.map((n) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={cn(
                "flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-colors group",
                n.read ? "bg-white hover:bg-zinc-50" : "bg-violet-50/50 hover:bg-violet-50 ring-1 ring-inset ring-violet-100"
              )}
            >
              {/* Icon */}
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", cfg.iconBg)}>
                <Icon size={16} className={cfg.iconColor} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className={cn("text-sm font-medium leading-tight", n.read ? "text-zinc-700" : "text-zinc-900")}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", cfg.dot)} />
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{n.body}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                    cfg.iconBg, cfg.iconColor
                  )}>
                    {cfg.label}
                  </span>
                  <span className="text-[11px] text-zinc-400">{n.time}</span>
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                className="p-1.5 rounded-lg text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft, Terminal, Search, X,
  AlertTriangle, Info, CheckCircle2, XCircle,
  RefreshCw, Filter,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Level = "all" | "info" | "warn" | "error" | "success";

interface LogEntry {
  id:       string;
  level:    Exclude<Level, "all">;
  message:  string;
  source:   string;
  code:     string;
  time:     string;
  details?: string;
}

const LOGS: LogEntry[] = [
  { id:"l01", level:"error",   message:"Database connection timeout",          source:"db-pool",       code:"DB_TIMEOUT",       time:"08:42:11", details:"Connection to postgres://db-eu-west-2:5432 timed out after 30s. Retry 3/3 failed." },
  { id:"l02", level:"info",    message:"User authenticated successfully",      source:"auth-service",  code:"AUTH_SUCCESS",     time:"08:41:53", details:"User: sarah.chen@example.com · IP: 121.52.x.x · Method: password" },
  { id:"l03", level:"warn",    message:"Memory usage above 85% threshold",     source:"monitor",       code:"MEM_HIGH",         time:"08:40:30", details:"Current: 87.2% (6.98 GB / 8 GB). Alert sent to ops@company.com." },
  { id:"l04", level:"success", message:"Backup completed successfully",        source:"backup-cron",   code:"BACKUP_OK",        time:"08:30:00", details:"12.4 GB backed up to s3://admin-backups/2024-08-19. Duration: 4m 12s." },
  { id:"l05", level:"info",    message:"New user registered",                  source:"auth-service",  code:"USER_CREATED",     time:"08:28:44", details:"User ID: u21 · Email: new.user@example.com · Role: Viewer" },
  { id:"l06", level:"error",   message:"Payment webhook delivery failed",      source:"billing",       code:"WEBHOOK_FAIL",     time:"08:20:17", details:"Stripe webhook to /api/webhooks/stripe returned 503. Retry scheduled in 5m." },
  { id:"l07", level:"info",    message:"Scheduled report generated",           source:"analytics",     code:"REPORT_GEN",       time:"08:00:01" },
  { id:"l08", level:"warn",    message:"Rate limit approaching for API key",   source:"api-gateway",   code:"RATE_WARN",        time:"07:58:33", details:"Key: pk_live_xxx · 4,800/5,000 requests used in current window." },
  { id:"l09", level:"success", message:"SSL certificate renewed",              source:"cert-manager",  code:"SSL_RENEW",        time:"07:45:00", details:"admin.example.com · Valid until Nov 19, 2024." },
  { id:"l10", level:"info",    message:"Email invite sent",                    source:"mailer",        code:"EMAIL_SENT",       time:"07:31:22", details:"To: james.morris@example.com · Template: user-invite · MsgID: msg_abc123" },
  { id:"l11", level:"error",   message:"Failed login attempt",                 source:"auth-service",  code:"AUTH_FAIL",        time:"07:28:09", details:"Email: unknown@hacker.io · IP: 89.44.x.x · Attempt 5/5. Account locked." },
  { id:"l12", level:"warn",    message:"Disk usage at 79%",                   source:"monitor",       code:"DISK_WARN",        time:"07:00:00", details:"Volume: /dev/sda1 · 158 GB / 200 GB used." },
  { id:"l13", level:"info",    message:"Config updated by admin",              source:"settings",      code:"CONFIG_UPDATE",    time:"06:44:55", details:"Changed by: tom.nguyen@example.com · Key: notification.threshold" },
  { id:"l14", level:"success", message:"Deployment completed",                 source:"deploy",        code:"DEPLOY_OK",        time:"06:30:00", details:"Version: v2.4.1 · 0 errors · Build time: 1m 48s" },
  { id:"l15", level:"info",    message:"Cron job started",                     source:"scheduler",     code:"CRON_START",       time:"06:00:00" },
  { id:"l16", level:"error",   message:"File upload size limit exceeded",      source:"storage",       code:"UPLOAD_SIZE",      time:"05:52:14", details:"User: priya.patel@example.com · File: report_final_v2_FINAL.pdf · Size: 52 MB / 10 MB limit." },
  { id:"l17", level:"info",    message:"Analytics snapshot saved",             source:"analytics",     code:"SNAPSHOT_OK",      time:"05:00:00" },
  { id:"l18", level:"warn",    message:"3rd-party API slow response",          source:"integrations",  code:"API_SLOW",         time:"04:38:07", details:"Service: stripe.com · Latency: 4,200ms (threshold: 2,000ms)." },
  { id:"l19", level:"success", message:"Data export completed",                source:"export",        code:"EXPORT_OK",        time:"03:15:00", details:"Dataset: users · Format: CSV · 20 rows · 14 KB" },
  { id:"l20", level:"info",    message:"System health check passed",           source:"monitor",       code:"HEALTH_OK",        time:"03:00:00" },
];

const levelConfig: Record<Exclude<Level,"all">, { icon: React.ElementType; badge: string; dot: string; row: string }> = {
  info:    { icon: Info,          badge: "bg-sky-50 text-sky-700",       dot: "bg-sky-400",     row: ""                       },
  warn:    { icon: AlertTriangle, badge: "bg-amber-50 text-amber-700",   dot: "bg-amber-400",   row: "bg-amber-50/30"         },
  error:   { icon: XCircle,       badge: "bg-red-50 text-red-700",       dot: "bg-red-500",     row: "bg-red-50/40"           },
  success: { icon: CheckCircle2,  badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", row: ""                    },
};

const LEVEL_FILTERS: { key: Level; label: string }[] = [
  { key: "all",     label: "All"     },
  { key: "error",   label: "Errors"  },
  { key: "warn",    label: "Warnings"},
  { key: "info",    label: "Info"    },
  { key: "success", label: "Success" },
];

export default function LogsPage() {
  const [search,    setSearch]    = useState("");
  const [level,     setLevel]     = useState<Level>("all");
  const [expanded,  setExpanded]  = useState<string | null>(null);
  const [source,    setSource]    = useState("all");

  const sources = ["all", ...Array.from(new Set(LOGS.map((l) => l.source)))];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return LOGS.filter((l) => {
      const matchLevel  = level === "all" || l.level === level;
      const matchSource = source === "all" || l.source === source;
      const matchSearch = !q || l.message.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.source.toLowerCase().includes(q);
      return matchLevel && matchSource && matchSearch;
    });
  }, [search, level, source]);

  const counts = {
    error:   LOGS.filter((l) => l.level === "error").length,
    warn:    LOGS.filter((l) => l.level === "warn").length,
    info:    LOGS.filter((l) => l.level === "info").length,
    success: LOGS.filter((l) => l.level === "success").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors w-fit">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-zinc-900 font-bold text-xl tracking-tight flex items-center gap-2">
            <Terminal size={18} className="text-zinc-400" /> System logs
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">Real-time event and error log for all platform services.</p>
        </div>
        <button
          onClick={() => { setSearch(""); setLevel("all"); setSource("all"); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-500 hover:bg-zinc-50 transition-colors"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["error","warn","info","success"] as const).map((lvl) => {
          const cfg = levelConfig[lvl];
          const Icon = cfg.icon;
          return (
            <button
              key={lvl}
              onClick={() => setLevel(level === lvl ? "all" : lvl)}
              className={cn(
                "flex items-center gap-3 p-3.5 rounded-2xl ring-1 ring-inset transition-all text-left",
                level === lvl ? "ring-zinc-300 bg-zinc-50 shadow-sm" : "ring-zinc-100 bg-white hover:ring-zinc-200"
              )}
            >
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", cfg.badge.split(" ")[0])}>
                <Icon size={15} className={cfg.badge.split(" ")[1]} />
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900 leading-none">{counts[lvl]}</p>
                <p className="text-[11px] text-zinc-400 capitalize mt-0.5">{lvl === "warn" ? "warnings" : `${lvl}s`}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search message, code, or source…"
            className="w-full h-9 pl-8 pr-8 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-1 bg-white rounded-lg border border-zinc-200 p-1">
          {LEVEL_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                level === key ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Source filter */}
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-colors cursor-pointer"
        >
          {sources.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All sources" : s}</option>
          ))}
        </select>
      </div>

      {/* Log count */}
      <p className="text-xs text-zinc-400">
        Showing {filtered.length} of {LOGS.length} entries
      </p>

      {/* Log entries */}
      <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 opacity-70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-70" />
          </div>
          <span className="text-zinc-500 text-xs ml-2 font-mono">system.log — today</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Filter size={24} className="mb-3 opacity-30" />
            <p className="text-sm">No log entries match your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {filtered.map((log) => {
              const cfg  = levelConfig[log.level];
              const Icon = cfg.icon;
              const open = expanded === log.id;

              return (
                <div
                  key={log.id}
                  onClick={() => setExpanded(open ? null : (log.details ? log.id : null))}
                  className={cn(
                    "group transition-colors",
                    cfg.row,
                    log.details ? "cursor-pointer hover:bg-zinc-50" : ""
                  )}
                >
                  <div className="flex items-start gap-3 px-4 py-3">
                    {/* Level icon */}
                    <Icon size={14} className={cn("mt-0.5 flex-shrink-0", levelConfig[log.level].badge.split(" ")[1])} />

                    {/* Time */}
                    <span className="font-mono text-[11px] text-zinc-400 flex-shrink-0 mt-0.5 w-16">
                      {log.time}
                    </span>

                    {/* Source */}
                    <span className="text-[11px] font-mono text-violet-500 flex-shrink-0 mt-0.5 w-28 truncate">
                      {log.source}
                    </span>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-800 font-medium leading-tight">{log.message}</p>
                      {open && log.details && (
                        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed font-mono bg-zinc-50 px-2.5 py-2 rounded-lg">
                          {log.details}
                        </p>
                      )}
                    </div>

                    {/* Code badge */}
                    <span className="font-mono text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md flex-shrink-0 self-start">
                      {log.code}
                    </span>

                    {/* Level badge */}
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 self-start capitalize",
                      cfg.badge
                    )}>
                      {log.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  ArrowLeft, Download, FileJson, FileText,
  Table2, Users, BarChart2, Bell, Check, Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Format  = "json" | "csv" | "xlsx";
type Dataset = "users" | "analytics" | "notifications" | "roles";

interface ExportJob {
  id:      string;
  dataset: Dataset;
  format:  Format;
  rows:    number;
  size:    string;
  date:    string;
  status:  "ready" | "processing" | "done";
}

const DATASETS: { key: Dataset; label: string; desc: string; icon: React.ElementType; rows: number }[] = [
  { key: "users",         label: "Users",         desc: "All user accounts, roles, and status.",   icon: Users,    rows: 20   },
  { key: "analytics",     label: "Analytics",     desc: "Revenue, growth, and traffic data.",       icon: BarChart2,rows: 240  },
  { key: "notifications", label: "Notifications", desc: "System and user event log.",               icon: Bell,     rows: 12   },
  { key: "roles",         label: "Roles & perms", desc: "Role definitions and permission matrix.",  icon: Table2,   rows: 4    },
];

const FORMATS: { key: Format; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "json",  label: "JSON",  icon: FileJson, desc: "Best for API or code use"   },
  { key: "csv",   label: "CSV",   icon: FileText, desc: "Open in Excel / Sheets"     },
  { key: "xlsx",  label: "XLSX",  icon: Table2,   desc: "Formatted Excel workbook"   },
];

const HISTORY: ExportJob[] = [
  { id: "e1", dataset: "users",     format: "csv",  rows: 20,  size: "14 KB", date: "Aug 19, 2024 · 10:42 AM", status: "done" },
  { id: "e2", dataset: "analytics", format: "json", rows: 240, size: "82 KB", date: "Aug 17, 2024 · 3:15 PM",  status: "done" },
  { id: "e3", dataset: "roles",     format: "csv",  rows: 4,   size: "2 KB",  date: "Aug 10, 2024 · 9:00 AM",  status: "done" },
];

const datasetIcon: Record<Dataset, React.ElementType> = {
  users: Users, analytics: BarChart2, notifications: Bell, roles: Table2,
};

export default function ExportPage() {
  const [selected, setSelected]     = useState<Set<Dataset>>(new Set(["users"]));
  const [format,   setFormat]       = useState<Format>("csv");
  const [jobs,     setJobs]         = useState<ExportJob[]>(HISTORY);
  const [exporting, setExporting]   = useState(false);
  const [done,      setDone]        = useState(false);

  function toggleDataset(key: Dataset) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function handleExport() {
    if (!selected.size) return;
    setExporting(true);
    setDone(false);

    const newJobs: ExportJob[] = [...selected].map((ds, i) => ({
      id:      `e${Date.now()}-${i}`,
      dataset: ds,
      format,
      rows:    DATASETS.find((d) => d.key === ds)!.rows,
      size:    "–",
      date:    "Just now",
      status:  "processing" as const,
    }));

    setJobs((prev) => [...newJobs, ...prev]);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          newJobs.find((n) => n.id === j.id)
            ? { ...j, status: "done", size: `${Math.ceil(j.rows * 0.7)} KB` }
            : j
        )
      );
      setExporting(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 1800);
  }

  const totalRows = [...selected].reduce((acc, key) => acc + (DATASETS.find((d) => d.key === key)?.rows ?? 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors w-fit">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div>
        <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Export data</h2>
        <p className="text-zinc-400 text-sm mt-0.5">Download platform data as JSON, CSV, or Excel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Config */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dataset selection */}
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
            <p className="text-sm font-semibold text-zinc-900 mb-1">Select datasets</p>
            <p className="text-xs text-zinc-400 mb-4">Choose one or more datasets to export.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DATASETS.map(({ key, label, desc, icon: Icon, rows }) => {
                const on = selected.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleDataset(key)}
                    className={cn(
                      "text-left p-3.5 rounded-xl border transition-all",
                      on
                        ? "bg-violet-50 border-violet-200 ring-1 ring-inset ring-violet-200"
                        : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className={on ? "text-violet-600" : "text-zinc-400"} />
                      <span className={cn("text-xs font-semibold", on ? "text-violet-700" : "text-zinc-700")}>{label}</span>
                      {on && <Check size={11} className="ml-auto text-violet-500" />}
                    </div>
                    <p className="text-[11px] text-zinc-400">{desc}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{rows} records</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format */}
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
            <p className="text-sm font-semibold text-zinc-900 mb-4">Export format</p>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map(({ key, label, icon: Icon, desc }) => (
                <button
                  key={key}
                  onClick={() => setFormat(key)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all",
                    format === key
                      ? "bg-violet-50 border-violet-300 ring-2 ring-violet-200 text-violet-700"
                      : "border-zinc-100 hover:border-zinc-200 text-zinc-500"
                  )}
                >
                  <Icon size={20} className={format === key ? "text-violet-500" : "text-zinc-400"} />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-[11px] text-zinc-400">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary + action */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5 sticky top-6">
            <p className="text-sm font-semibold text-zinc-900 mb-4">Export summary</p>

            {selected.size === 0 ? (
              <p className="text-xs text-zinc-400">No datasets selected.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {[...selected].map((key) => {
                  const d   = DATASETS.find((x) => x.key === key)!;
                  const Icon = datasetIcon[key];
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Icon size={12} className="text-violet-400 flex-shrink-0" />
                      <span className="text-xs text-zinc-600 flex-1">{d.label}</span>
                      <span className="text-[11px] text-zinc-400">{d.rows} rows</span>
                    </div>
                  );
                })}
                <div className="border-t border-zinc-100 pt-2 mt-2 flex justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Total rows</span>
                  <span className="text-zinc-900 font-semibold">{totalRows}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Format</span>
                  <span className="text-zinc-900 font-semibold uppercase">{format}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleExport}
              disabled={!selected.size || exporting}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[.98]",
                done
                  ? "bg-emerald-500 text-white"
                  : !selected.size
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : exporting
                  ? "bg-violet-400 text-white cursor-wait"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200"
              )}
            >
              {done ? (
                <><Check size={15} /> Export ready!</>
              ) : exporting ? (
                <><Loader2 size={15} className="animate-spin" /> Exporting…</>
              ) : (
                <><Download size={15} /> Export now</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
        <p className="text-sm font-semibold text-zinc-900 mb-4">Export history</p>
        {jobs.length === 0 ? (
          <p className="text-xs text-zinc-400">No exports yet.</p>
        ) : (
          <div className="space-y-0 divide-y divide-zinc-50">
            {jobs.map((job) => {
              const Icon = datasetIcon[job.dataset];
              return (
                <div key={job.id} className="flex items-center gap-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 capitalize">{job.dataset}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{job.date} · {job.rows} rows · {job.size}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                    {job.format}
                  </span>
                  {job.status === "processing" ? (
                    <Loader2 size={15} className="text-violet-400 animate-spin flex-shrink-0" />
                  ) : (
                    <button className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium flex-shrink-0">
                      <Download size={12} /> Download
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

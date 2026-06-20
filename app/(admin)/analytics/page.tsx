"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, type TooltipProps,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  monthlyRevenue, userGrowth, trafficSources,
  sessionsByDevice, topPages, kpiCards,
} from "@/lib/analyticsData";
import { cn } from "@/lib/utils";

const RANGES = ["Last 30 days", "Last 3 months", "Last 6 months", "Last year"] as const;

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
      <p className="text-zinc-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-zinc-300 capitalize">{p.name}:</span>
          <span className="text-white font-medium">
            {typeof p.value === "number" && p.name?.includes("revenue") || p.name?.includes("expense") || p.name?.includes("profit")
              ? `$${p.value.toLocaleString()}`
              : (p.value ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ label, value, change, trend }: typeof kpiCards[number]) {
  return (
    <div className="bg-white rounded-2xl p-4 ring-1 ring-inset ring-zinc-100">
      <p className="text-zinc-400 text-xs mb-2">{label}</p>
      <p className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</p>
      <div className={cn(
        "inline-flex items-center gap-1 text-xs font-medium mt-1.5",
        trend === "up" ? "text-emerald-600" : "text-red-500"
      )}>
        <TrendingUp size={11} />
        {change} vs last period
      </div>
    </div>
  );
}

const RADIAN = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.08) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<typeof RANGES[number]>("Last 6 months");

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-zinc-900 font-bold text-xl tracking-tight">Analytics</h2>
          <p className="text-zinc-400 text-sm mt-0.5">Platform performance and growth metrics.</p>
        </div>
        {/* Range selector */}
        <div className="flex items-center gap-1 bg-white rounded-xl ring-1 ring-inset ring-zinc-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                range === r ? "bg-violet-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-zinc-900 font-semibold text-sm">Revenue vs Expenses</p>
            <p className="text-zinc-400 text-xs mt-0.5">Monthly breakdown across all accounts</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa", paddingTop: 12 }} />
            <Area type="monotone" dataKey="revenue"  stroke="#8b5cf6" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="expenses" stroke="#fb923c" strokeWidth={1.5} fill="url(#gExp)" dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="profit"   stroke="#34d399" strokeWidth={1.5} fill="url(#gPro)" dot={false} activeDot={{ r: 3, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* User growth + Traffic sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* User growth bar */}
        <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
          <p className="text-zinc-900 font-semibold text-sm mb-1">User growth</p>
          <p className="text-zinc-400 text-xs mb-4">New signups per month</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={userGrowth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#fafafa" }} />
              <Bar dataKey="newUsers" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="New users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic sources pie */}
        <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
          <p className="text-zinc-900 font-semibold text-sm mb-1">Traffic sources</p>
          <p className="text-zinc-400 text-xs mb-4">Where your visitors come from</p>
          <div className="flex items-center gap-4">
            <PieChart width={160} height={160}>
              <Pie
                data={trafficSources}
                cx={75} cy={75}
                innerRadius={40} outerRadius={75}
                dataKey="value"
                labelLine={false}
                label={PieLabel}
              >
                {trafficSources.map((s) => (
                  <Cell key={s.name} fill={s.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
            <div className="space-y-2 flex-1">
              {trafficSources.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-zinc-600 flex-1">{s.name}</span>
                  <span className="text-xs font-semibold text-zinc-900">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions by device + Top pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Devices */}
        <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
          <p className="text-zinc-900 font-semibold text-sm mb-4">Sessions by device</p>
          <div className="space-y-4">
            {sessionsByDevice.map((d) => (
              <div key={d.device}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-600">{d.device}</span>
                  <span className="text-xs font-semibold text-zinc-900">{d.pct}%</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">{d.sessions.toLocaleString()} sessions</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
          <p className="text-zinc-900 font-semibold text-sm mb-4">Top pages</p>
          <table className="w-full">
            <thead>
              <tr>
                {["Page", "Views", "Bounce", "Avg time"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider pb-2.5 pr-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {topPages.map((p) => (
                <tr key={p.path} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                      {p.path}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-sm font-medium text-zinc-900">
                    {p.views.toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-3 text-sm text-zinc-500">{p.bounce}</td>
                  <td className="py-2.5 text-sm text-zinc-500">{p.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

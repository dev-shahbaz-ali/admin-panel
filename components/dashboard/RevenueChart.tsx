"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { revenueChartData } from "@/lib/mockData";

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-zinc-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg">
      <p className="text-zinc-400 mb-1">{label}</p>
      <p className="font-semibold text-white">
        ${(payload[0].value ?? 0).toLocaleString()}
      </p>
      <p className="text-violet-300">
        {(payload[1]?.value ?? 0).toLocaleString()} users
      </p>
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-inset ring-zinc-100 p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-zinc-400 text-sm">Revenue overview</p>
          <p className="text-zinc-900 font-bold text-xl tracking-tight mt-0.5">
            $84,320
          </p>
          <p className="text-emerald-600 text-xs mt-0.5 font-medium">
            +8.2% vs last month
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-violet-500" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400" />
            Users
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e4e4e7", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#revGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#38bdf8"
            strokeWidth={1.5}
            fill="url(#userGrad)"
            dot={false}
            activeDot={{ r: 3, fill: "#38bdf8", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

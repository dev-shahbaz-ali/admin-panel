import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions, TopUsers } from "@/components/dashboard/QuickActions";
import { statsData } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Greeting banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-zinc-900 font-bold text-xl tracking-tight">
            Good morning, Shahbaz
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            Here&apos;s what&apos;s happening across your platform today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-medium px-3 py-2 rounded-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((card) => (
          <StatCard key={card.id} card={card} />
        ))}
      </div>

      {/* Chart + side column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart takes 2/3 */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Quick actions takes 1/3 */}
        <QuickActions />
      </div>

      {/* Activity + Top users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity takes 2/3 */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Top users takes 1/3 */}
        <TopUsers />
      </div>

    </div>
  );
}

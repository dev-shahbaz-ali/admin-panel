export const monthlyRevenue = [
  { month: "Jan", revenue: 52000, expenses: 31000, profit: 21000 },
  { month: "Feb", revenue: 58000, expenses: 34000, profit: 24000 },
  { month: "Mar", revenue: 61000, expenses: 36000, profit: 25000 },
  { month: "Apr", revenue: 55000, expenses: 33000, profit: 22000 },
  { month: "May", revenue: 67000, expenses: 38000, profit: 29000 },
  { month: "Jun", revenue: 72000, expenses: 40000, profit: 32000 },
  { month: "Jul", revenue: 69000, expenses: 39000, profit: 30000 },
  { month: "Aug", revenue: 84320, expenses: 44000, profit: 40320 },
];

export const userGrowth = [
  { month: "Jan", newUsers: 820,  totalUsers: 18200 },
  { month: "Feb", newUsers: 1040, totalUsers: 19240 },
  { month: "Mar", newUsers: 960,  totalUsers: 20200 },
  { month: "Apr", newUsers: 880,  totalUsers: 21080 },
  { month: "May", newUsers: 1120, totalUsers: 22200 },
  { month: "Jun", newUsers: 980,  totalUsers: 23180 },
  { month: "Jul", newUsers: 870,  totalUsers: 24050 },
  { month: "Aug", newUsers: 471,  totalUsers: 24521 },
];

export const trafficSources = [
  { name: "Organic search", value: 38, color: "#8b5cf6" },
  { name: "Direct",         value: 24, color: "#38bdf8" },
  { name: "Referral",       value: 18, color: "#34d399" },
  { name: "Social media",   value: 13, color: "#fb923c" },
  { name: "Email",          value: 7,  color: "#f472b6" },
];

export const sessionsByDevice = [
  { device: "Desktop", sessions: 14200, pct: 58 },
  { device: "Mobile",  sessions: 8400,  pct: 34 },
  { device: "Tablet",  sessions: 1920,  pct: 8  },
];

export const topPages = [
  { path: "/dashboard",  views: 12400, bounce: "24%", avg: "3m 12s" },
  { path: "/users",      views: 8800,  bounce: "18%", avg: "4m 42s" },
  { path: "/analytics",  views: 6200,  bounce: "31%", avg: "2m 58s" },
  { path: "/settings",   views: 4100,  bounce: "42%", avg: "1m 30s" },
  { path: "/roles",      views: 2900,  bounce: "29%", avg: "2m 15s" },
];

export const kpiCards = [
  { label: "Total revenue",   value: "$516,320", change: "+18.4%", trend: "up"   as const },
  { label: "Avg session",     value: "3m 24s",   change: "+0:12",  trend: "up"   as const },
  { label: "Bounce rate",     value: "28.6%",    change: "-2.1%",  trend: "up"   as const },
  { label: "Conversion rate", value: "4.82%",    change: "+0.3%",  trend: "up"   as const },
];

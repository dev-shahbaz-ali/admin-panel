export const statsData = [
  {
    id: "total-users",
    label: "Total users",
    value: "24,521",
    change: "+12.5%",
    trend: "up" as const,
    icon: "users",
  },
  {
    id: "monthly-revenue",
    label: "Monthly revenue",
    value: "$84,320",
    change: "+8.2%",
    trend: "up" as const,
    icon: "currency-dollar",
  },
  {
    id: "active-sessions",
    label: "Active sessions",
    value: "1,284",
    change: "-3.1%",
    trend: "down" as const,
    icon: "activity",
  },
  {
    id: "error-rate",
    label: "Error rate",
    value: "0.42%",
    change: "-0.08%",
    trend: "up" as const,
    icon: "alert-triangle",
  },
];

export const revenueChartData = [
  { month: "Jan", revenue: 52000, users: 18200 },
  { month: "Feb", revenue: 58000, users: 19400 },
  { month: "Mar", revenue: 61000, users: 20100 },
  { month: "Apr", revenue: 55000, users: 20800 },
  { month: "May", revenue: 67000, users: 21500 },
  { month: "Jun", revenue: 72000, users: 22400 },
  { month: "Jul", revenue: 69000, users: 23100 },
  { month: "Aug", revenue: 84320, users: 24521 },
];

export const activityFeed = [
  {
    id: "1",
    type: "user_signup" as const,
    message: "New user registered",
    detail: "sarah.chen@example.com",
    time: "2 min ago",
    avatar: "SC",
    color: "purple",
  },
  {
    id: "2",
    type: "role_change" as const,
    message: "Role updated to Editor",
    detail: "james.morris@example.com",
    time: "14 min ago",
    avatar: "JM",
    color: "teal",
  },
  {
    id: "3",
    type: "alert" as const,
    message: "High memory usage detected",
    detail: "Server cluster EU-West-2",
    time: "31 min ago",
    avatar: "!",
    color: "amber",
  },
  {
    id: "4",
    type: "user_signup" as const,
    message: "New user registered",
    detail: "priya.patel@example.com",
    time: "1 hr ago",
    avatar: "PP",
    color: "coral",
  },
  {
    id: "5",
    type: "payment" as const,
    message: "Payment received",
    detail: "Invoice #4821 · $2,400",
    time: "2 hr ago",
    avatar: "$",
    color: "green",
  },
  {
    id: "6",
    type: "role_change" as const,
    message: "New admin account created",
    detail: "admin.ops@company.com",
    time: "3 hr ago",
    avatar: "AO",
    color: "blue",
  },
];

export const quickActions = [
  { label: "Add user",    icon: "user-plus", href: "/users/new"  },
  { label: "Export data", icon: "download",  href: "/export"     },
  { label: "View reports",icon: "chart-bar", href: "/analytics"  },
  { label: "System logs", icon: "terminal",  href: "/logs"       },
];

export const topUsersData = [
  { name: "Sarah Chen", role: "Admin", sessions: 142, avatar: "SC", color: "purple" },
  { name: "James Morris", role: "Editor", sessions: 98, avatar: "JM", color: "teal" },
  { name: "Priya Patel", role: "Viewer", sessions: 76, avatar: "PP", color: "coral" },
  { name: "Leo Kim", role: "Editor", sessions: 61, avatar: "LK", color: "blue" },
];

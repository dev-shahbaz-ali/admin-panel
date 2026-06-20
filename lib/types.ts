export type TrendDirection = "up" | "down";

export type ActivityType =
  | "user_signup"
  | "role_change"
  | "alert"
  | "payment"
  | "system";

export interface StatCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  detail: string;
  time: string;
  avatar: string;
  color: string;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  users: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "Active" | "Inactive" | "Suspended";
  joined: string;
  avatar: string;
  sessions: number;
}

export type ColorKey =
  | "purple"
  | "teal"
  | "coral"
  | "blue"
  | "green"
  | "amber"
  | "red";

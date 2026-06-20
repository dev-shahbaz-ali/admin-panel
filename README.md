# Admin Panel — Next.js 14 Portfolio Project

A full-featured admin panel built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

## Pages

| Route | Description |
|---|---|
| `/dashboard` | Stats, revenue chart, activity feed, quick actions |
| `/users` | Data table with search, filter, sort, pagination, Add User modal |
| `/analytics` | Revenue/expense charts, user growth, traffic sources, top pages |
| `/roles` | Role cards with live permission toggles |
| `/notifications` | Filterable notification feed with mark-as-read |
| `/settings` | Profile, security, notifications, appearance, danger zone |

## Stack

- **Next.js 14** — App Router, route groups, server/client components
- **TypeScript** — Full type safety
- **Tailwind CSS v3** — Utility-first styling
- **Recharts** — Area, Bar, Pie charts
- **Lucide React** — Icons
- **clsx + tailwind-merge** — Conditional class merging

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
# Redirects automatically to /dashboard
```

## Project structure

```
app/
  (admin)/
    layout.tsx          ← Sidebar + topbar shell
    dashboard/page.tsx  ← Dashboard overview
    users/page.tsx      ← Users management
    analytics/page.tsx  ← Analytics charts
    roles/page.tsx      ← Roles & permissions
    notifications/page.tsx
    settings/page.tsx
  layout.tsx            ← Root layout (fonts, metadata)
  globals.css           ← Tailwind directives
  page.tsx              ← Redirects to /dashboard

components/
  dashboard/            ← StatCard, RevenueChart, RecentActivity, QuickActions
  users/                ← UsersTable, UserFilters, AddUserModal, Badges, Pagination

lib/
  mockData.ts           ← Dashboard data
  usersData.ts          ← 20 mock users
  analyticsData.ts      ← Charts data
  types.ts              ← TypeScript interfaces
  utils.ts              ← cn(), avatar colors
```

## Customization

- All data lives in `lib/`. Swap mock data with real API calls — component interfaces stay the same.
- Brand color is `violet` (`#8b5cf6`). Change in `tailwind.config.ts` and `globals.css`.
- To add a new page: create `app/(admin)/your-page/page.tsx` and add the route to `navItems` in `app/(admin)/layout.tsx`.

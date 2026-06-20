"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Shield,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { label: "Users",         href: "/users",         icon: Users            },
  { label: "Analytics",     href: "/analytics",     icon: BarChart2        },
  { label: "Roles",         href: "/roles",         icon: Shield           },
  { label: "Notifications", href: "/notifications", icon: Bell             },
  { label: "Settings",      href: "/settings",      icon: Settings         },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 bg-zinc-950 flex flex-col z-40 transition-transform duration-200",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">
            AdminPanel
          </span>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-zinc-500 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-wider px-2 mb-2">
            Main menu
          </p>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors group",
                  active
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <Icon size={16} className={active ? "text-violet-400" : ""} />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight size={12} className="text-violet-400 opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user area */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.05] cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-semibold flex-shrink-0">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium leading-tight truncate">
                Shahbaz Ali
              </p>
              <p className="text-zinc-500 text-[11px] truncate">Super Admin</p>
            </div>
            <LogOut
              size={14}
              className="text-zinc-600 group-hover:text-zinc-400 flex-shrink-0"
            />
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  const currentPage =
    navItems.find(
      (n) => pathname === n.href || pathname.startsWith(n.href + "/")
    )?.label ?? "Dashboard";

  return (
    <header className="h-16 border-b border-zinc-100 flex items-center px-4 lg:px-6 gap-4 bg-white sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-zinc-400 hover:text-zinc-700 p-1"
      >
        <Menu size={20} />
      </button>

      <div>
        <h1 className="text-zinc-900 font-semibold text-sm">{currentPage}</h1>
        <p className="text-zinc-400 text-xs">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-semibold">
          SA
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/hooks/useSidebar";
import { SIDEBAR_MENUS } from "@/constants";
import { Menu, X, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { Suspense, lazy, useMemo } from "react";

// Dynamically import only used icons - dramatically reduces bundle
const iconMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  LayoutDashboard: lazy(() => import("lucide-react").then(m => ({ default: m.LayoutDashboard }))),
  BarChart3: lazy(() => import("lucide-react").then(m => ({ default: m.BarChart3 }))),
  ShoppingCart: lazy(() => import("lucide-react").then(m => ({ default: m.ShoppingCart }))),
  Package: lazy(() => import("lucide-react").then(m => ({ default: m.Package }))),
  Users: lazy(() => import("lucide-react").then(m => ({ default: m.Users }))),
  UserCheck: lazy(() => import("lucide-react").then(m => ({ default: m.UserCheck }))),
  FileText: lazy(() => import("lucide-react").then(m => ({ default: m.FileText }))),
  DollarSign: lazy(() => import("lucide-react").then(m => ({ default: m.DollarSign }))),
  MessageSquare: lazy(() => import("lucide-react").then(m => ({ default: m.MessageSquare }))),
  Bell: lazy(() => import("lucide-react").then(m => ({ default: m.Bell }))),
  Settings: lazy(() => import("lucide-react").then(m => ({ default: m.Settings }))),
};

const IconPlaceholder = () => <div className="h-5 w-5 bg-muted rounded animate-pulse" />;

function SidebarContent() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle Button - Chỉ hiện khi Sidebar đóng trên mobile */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          className="fixed left-4 top-4 z-50 shadow-md lg:hidden bg-card dark:bg-input/30"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo & Close Button for Mobile */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Admin
            </span>
            <span>LTE</span>
          </h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggle} 
            className="text-muted-foreground hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-3 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar">
          {SIDEBAR_MENUS.map((menu) => {
            const isActive = pathname === menu.href || pathname.startsWith(menu.href + "/");
            const IconComponent = iconMap[menu.icon];

            return (
              <Link
                key={menu.id}
                href={menu.href}
                onClick={() => { if (window.innerWidth < 1024) toggle(); }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-white"
                )}
              >
                <Suspense fallback={<IconPlaceholder />}>
                  {IconComponent ? (
                    <IconComponent className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-white")} />
                  ) : null}
                </Suspense>
                
                <span className="flex-1">{menu.label}</span>

                {menu.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold">
                    {menu.badge}
                  </span>
                )}
                
                {isActive && (
                  <div className="absolute right-0 h-6 w-1 rounded-l-full bg-blue-300" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggle}
        />
      )}
    </>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64" />}>
      <SidebarContent />
    </Suspense>
  );
}
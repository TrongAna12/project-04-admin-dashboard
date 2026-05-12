"use client";

import { Moon, Sun, Bell, LogOut, Settings, User, Search, Command } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { resolvedTheme } = useTheme();
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { notifications } = useUIStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md dark:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Search Bar (Full Tailwind Design) */}
        <div className="flex flex-1 items-center gap-4">
          <div className="relative hidden max-w-md w-full md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm hệ thống..."
              className="h-10 w-full rounded-xl bg-muted pl-10 pr-12 text-sm outline-none transition-all focus:bg-background focus:ring-2 focus:ring-ring/20 dark:bg-input dark:focus:bg-input/80"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-input dark:border-border">
              <Command className="h-3 w-3" /> K
            </div>
          </div>
          <h2 className="text-lg font-bold md:hidden">Dashboard</h2>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-all hover:bg-muted/50 hover:text-foreground dark:border-border dark:text-foreground dark:hover:bg-muted/50"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition-all hover:bg-muted/50 dark:border-border dark:text-foreground dark:hover:bg-muted/50">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-2xl">
              <DropdownMenuLabel className="px-4 py-2 font-bold">Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Trống trơn... 🍃</div>
              ) : (
                <div className="space-y-1">
                  {notifications.slice(0, 4).map((n) => (
                    <DropdownMenuItem key={n.id} className="flex cursor-pointer flex-col items-start rounded-xl p-3 hover:bg-muted/50">
                      <span className="font-semibold text-sm">{n.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-xl border border-border p-1.5 transition-all hover:bg-muted/50 dark:border-border dark:hover:bg-muted/50">
                <img
                  src={user?.avatar || "https://ui-avatars.com/api/?name=User"}
                  alt="Avatar"
                  className="h-7 w-7 rounded-lg object-cover ring-2 ring-ring/10"
                />
                <div className="hidden flex-col items-start pr-2 sm:flex">
                  <span className="text-xs font-bold leading-none">{user?.name}</span>
                  <span className="text-[10px] text-muted-foreground">Quản trị viên</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground">Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50 hover:text-foreground dark:hover:bg-muted/50">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50 hover:text-foreground dark:hover:bg-muted/50">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={logout} 
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
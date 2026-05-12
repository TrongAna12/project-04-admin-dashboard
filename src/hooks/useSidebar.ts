"use client";

import { useUIStore } from "@/store/uiStore";

export function useSidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();

  return {
    isOpen: sidebarOpen,
    setOpen: setSidebarOpen,
    toggle: toggleSidebar,
  };
}

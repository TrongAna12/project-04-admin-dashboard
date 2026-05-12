"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/themeStore";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    theme,
    setTheme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
    mounted,
  };
}

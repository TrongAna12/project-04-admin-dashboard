"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, updateResolvedTheme } = useThemeStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (isSystemDark = mediaQuery.matches) => {
      const resolvedTheme =
        theme === "system" ? (isSystemDark ? "dark" : "light") : theme;

      updateResolvedTheme(resolvedTheme);
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    };

    applyTheme();

    const handleChange = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme(event.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, updateResolvedTheme]);

  return <>{children}</>;
}

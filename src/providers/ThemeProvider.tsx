"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ThemeMode } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const LOCAL_STORAGE_KEY = "mirrorfit_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile, user, updateThemePreference } = useAuth();
  const [localTheme, setLocalTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode | null;
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  const theme = profile?.theme ?? localTheme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      setLocalTheme(nextTheme);
      if (user) {
        void updateThemePreference(nextTheme);
      }
    },
    [updateThemePreference, user],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

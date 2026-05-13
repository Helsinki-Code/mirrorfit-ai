"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative h-10 w-20 overflow-hidden rounded-full border transition-all duration-500",
        "border-border bg-surface shadow-sm",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 transition-all duration-500",
          isDark
            ? "bg-[radial-gradient(circle_at_70%_30%,#4f46e5_0%,#111827_70%)]"
            : "bg-[radial-gradient(circle_at_30%_30%,#fcd34d_0%,#f59e0b_70%)]",
        )}
      />
      <span
        className={cn(
          "absolute top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-all duration-500",
          isDark ? "left-11 bg-slate-900 text-indigo-200" : "left-1.5 bg-white text-amber-500",
        )}
      >
        {isDark ? <MoonStar size={14} /> : <SunMedium size={14} />}
      </span>
    </button>
  );
}

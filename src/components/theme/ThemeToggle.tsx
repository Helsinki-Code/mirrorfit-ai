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
        "focus-ring relative h-10 w-[86px] overflow-hidden rounded-full border transition-all duration-500",
        "border-border bg-surface shadow-sm",
      )}
    >
      <span
        className={cn(
          "absolute inset-0 transition-all duration-500",
          isDark
            ? "bg-[radial-gradient(circle_at_76%_28%,#2dd4bf_0%,#0f1720_72%)]"
            : "bg-[radial-gradient(circle_at_24%_28%,#f59e0b_0%,#f6f4f2_78%)]",
        )}
      />
      <span
        className={cn(
          "absolute top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-all duration-500",
          isDark
            ? "left-[52px] bg-[#0b1417] text-[#2dd4bf]"
            : "left-1.5 bg-white text-amber-500",
        )}
      >
        {isDark ? <MoonStar size={14} /> : <SunMedium size={14} />}
      </span>
    </button>
  );
}

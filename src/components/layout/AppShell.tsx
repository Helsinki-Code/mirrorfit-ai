"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GalleryVerticalEnd,
  Images,
  LayoutDashboard,
  Palette,
  Settings,
  Shirt,
  WandSparkles,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/providers/AuthProvider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/models", label: "Model Library", icon: Images },
  { href: "/garments", label: "Garment Library", icon: Shirt },
  { href: "/studio", label: "Try-On Studio", icon: WandSparkles },
  { href: "/generations", label: "Generations", icon: GalleryVerticalEnd },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-app transition-colors duration-500">
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-lg border border-border bg-panel p-4 shadow-sm md:block">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
              <Palette size={20} />
            </div>
            <div>
              <p className="text-sm text-muted">MirrorFit AI</p>
              <p className="text-sm font-semibold text-text">Virtual Try-On</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-white"
                      : "text-text hover:bg-surface hover:text-text-strong",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-4 flex items-center justify-between rounded-lg border border-border bg-panel px-4 py-3 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Workspace</p>
              <h1 className="text-lg font-semibold text-text-strong">MirrorFit AI Studio</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-text">{profile?.name ?? "User"}</p>
                <p className="text-xs text-muted">{profile?.plan ?? "free"} plan</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-hover"
                onClick={async () => {
                  await signOut();
                  router.replace("/login");
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

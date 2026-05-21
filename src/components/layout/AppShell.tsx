"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  FolderHeart,
  Gauge,
  Images,
  ListChecks,
  LayoutDashboard,
  MessageSquare,
  Palette,
  ShieldCheck,
  Sparkles,
  Shirt,
  Share2,
  LogOut,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/providers/AuthProvider";

const primaryNavItems = [
  { href: "/dashboard", label: "Shoot Inbox", icon: LayoutDashboard },
  { href: "/studio", label: "Shoot Room", icon: MessageSquare },
  { href: "/models", label: "My Models", icon: Images },
  { href: "/garments", label: "My Garments", icon: Shirt },
];

const advancedNavItems = [
  { href: "/bulk-generator", label: "Bulk Generator", icon: ListChecks },
  { href: "/generations", label: "Generation History", icon: Gauge },
  { href: "/prompt-rewrite", label: "Prompt Rewrite", icon: Sparkles },
  { href: "/safety-rewrite", label: "Safety Rewrite", icon: ShieldCheck },
  { href: "/brand-memory", label: "Brand Memory", icon: FolderHeart },
  { href: "/share", label: "Share & Approval", icon: Share2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  return (
    <div className="app-canvas min-h-screen transition-colors duration-500">
      <div className="mx-auto grid w-full max-w-[1560px] gap-4 px-4 py-4 md:grid-cols-[284px_minmax(0,1fr)] md:px-6 lg:px-8">
        <aside className="hidden panel px-4 pb-4 pt-5 md:sticky md:top-4 md:block md:h-[calc(100vh-2rem)] md:overflow-y-auto">
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/95 text-white shadow-sm">
              <Palette size={18} />
            </div>
            <div>
              <p className="section-eyebrow">MirrorFit AI</p>
              <p className="editorial-title text-base text-text-strong">Production Workspace</p>
            </div>
          </div>

          <nav className="space-y-2.5">
            <p className="section-eyebrow px-1">Primary Workflow</p>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-transparent text-text hover:border-border hover:bg-surface hover:text-text-strong",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon size={15} />
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <details className="mt-3 rounded-md border border-border bg-surface open:bg-panel">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-strong">
                <span className="inline-flex items-center gap-2">
                  <Settings size={14} />
                  Advanced
                </span>
                <ChevronDown size={14} className="opacity-70" />
              </summary>
              <div className="space-y-1 px-2 pb-2 pt-0.5">
                {advancedNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "focus-ring flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-xs font-medium transition-colors",
                        active
                          ? "border-primary bg-primary text-white"
                          : "border-transparent text-text hover:border-border hover:bg-hover hover:text-text-strong",
                      )}
                    >
                      <Icon size={13} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          </nav>

          <div className="mt-4 rounded-md border border-border bg-surface px-3 py-3">
            <p className="section-eyebrow">Session</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              Chat-first workflow. We keep technical complexity out of the main flow.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="panel mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="section-eyebrow">Workspace</p>
              <h1 className="editorial-title text-2xl text-text-strong">MirrorFit Assistant</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-text-strong">{profile?.name ?? "User"}</p>
                <p className="text-xs text-muted">{profile?.plan ?? "free"} plan</p>
              </div>
              <button
                type="button"
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text transition-colors hover:bg-hover"
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

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {primaryNavItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring whitespace-nowrap rounded-md border px-3 py-2 text-xs font-medium",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-panel text-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <section className="space-y-4">{children}</section>
        </div>
      </div>
    </div>
  );
}

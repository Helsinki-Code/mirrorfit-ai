import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/ai-virtual-try-on-for-ecommerce", label: "Guides" },
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-shell">
      <header className="marketing-header sticky top-3 z-30 backdrop-blur">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-md px-2 py-1">
          <span className="section-eyebrow !tracking-[0.14em]">MirrorFit AI</span>
          <span className="editorial-title text-base text-text-strong">Fashion Production</span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {links.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="focus-ring rounded-md border border-transparent px-3 py-2 text-sm text-text transition-colors hover:border-border hover:bg-surface"
            >
              {entry.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="focus-ring action-chip">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="focus-ring rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm"
          >
            Start Free
          </Link>
        </div>
      </header>

      <nav className="mb-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
        {links.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="focus-ring whitespace-nowrap rounded-md border border-border bg-panel px-3 py-2 text-xs text-text"
          >
            {entry.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}

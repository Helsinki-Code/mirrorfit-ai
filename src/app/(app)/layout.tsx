import { AuthGate } from "@/components/auth/AuthGate";
import { PolicyGate } from "@/components/auth/PolicyGate";
import { AppShell } from "@/components/layout/AppShell";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGate>
      <PolicyGate>
        <AppShell>{children}</AppShell>
      </PolicyGate>
    </AuthGate>
  );
}

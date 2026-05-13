"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export function PolicyGate({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !profile) return;
    if (!profile.authorizedUseConfirmed || !profile.adultContentPolicyAck) {
      router.replace("/onboarding");
    }
  }, [loading, profile, router]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile.authorizedUseConfirmed || !profile.adultContentPolicyAck) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Redirecting to onboarding...
      </div>
    );
  }

  return <>{children}</>;
}

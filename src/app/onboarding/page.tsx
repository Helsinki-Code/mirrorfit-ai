"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function OnboardingPage() {
  const { user, profile, updatePolicyAck } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [adultAck, setAdultAck] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    router.replace("/login");
    return null;
  }

  if (profile?.authorizedUseConfirmed && profile.adultContentPolicyAck) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-app p-4">
      <div className="w-full max-w-2xl rounded-lg border border-border bg-panel p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-text-strong">Account Activation</h1>
        <p className="mb-6 text-sm text-muted">
          Confirm usage rights and adult-fashion policy before creating renders.
        </p>

        <div className="space-y-4 rounded-lg border border-border bg-surface p-4">
          <label className="flex items-start gap-3 text-sm text-text">
            <input
              type="checkbox"
              className="mt-1"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
            />
            <span>
              I confirm that I own or have permission to use uploaded model reference images for
              virtual try-on and commercial fashion rendering.
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-text">
            <input
              type="checkbox"
              className="mt-1"
              checked={adultAck}
              onChange={(e) => setAdultAck(e.target.checked)}
            />
            <span>
              I confirm all revealing fashion renders in this account will only use consenting adult
              model references.
            </span>
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

        <button
          type="button"
          className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          disabled={saving || !authorized || !adultAck}
          onClick={async () => {
            setError("");
            setSaving(true);
            try {
              await updatePolicyAck({
                authorizedUseConfirmed: authorized,
                adultContentPolicyAck: adultAck,
              });
              router.replace("/dashboard");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Unable to save onboarding.");
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? "Saving..." : "Continue to Dashboard"}
        </button>
      </div>
    </div>
  );
}

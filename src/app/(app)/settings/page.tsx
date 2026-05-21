"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";

export default function SettingsPage() {
  const { profile, updatePolicyAck } = useAuth();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <p className="section-eyebrow">Settings</p>
        <h2 className="mt-1 text-lg font-semibold text-text-strong">Theme Preferences</h2>
        <p className="mt-1 text-sm text-muted">Theme applies globally across every app element.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="focus-ring pill-btn px-4 py-2 text-sm"
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
          >
            Light
          </button>
          <button
            type="button"
            className="focus-ring pill-btn px-4 py-2 text-sm"
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
          >
            Dark
          </button>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-semibold text-text-strong">Policy Confirmation</h2>
        <p className="mt-1 text-sm text-muted">
          Keep these confirmations active for compliant try-on generation.
        </p>

        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={profile.authorizedUseConfirmed} readOnly />
            Authorized model usage confirmed
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={profile.adultContentPolicyAck} readOnly />
            Adult-only revealing fashion acknowledgement
          </label>
        </div>

        <button
          type="button"
          className="focus-ring mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            setMessage("");
            await updatePolicyAck({
              authorizedUseConfirmed: true,
              adultContentPolicyAck: true,
            });
            setSaving(false);
            setMessage("Policy confirmation refreshed.");
          }}
        >
          {saving ? "Updating..." : "Reconfirm Policy"}
        </button>
        {message ? <p className="mt-2 text-sm text-success">{message}</p> : null}
      </section>
    </div>
  );
}

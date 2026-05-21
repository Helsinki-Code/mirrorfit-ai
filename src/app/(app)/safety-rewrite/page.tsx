"use client";

import { useMemo, useState } from "react";

function safetyRewrite(input: string) {
  return input
    .replace(/\bsexy bikini\b/gi, "tasteful swimwear catalogue")
    .replace(/\bhot tight dress\b/gi, "body-fitted fashion catalogue")
    .replace(/\bnude|naked|erotic\b/gi, "fully clothed")
    .replace(/\bunderage|teen|minor\b/gi, "adult model")
    .replace(/\s+/g, " ")
    .trim();
}

export default function SafetyRewritePage() {
  const [raw, setRaw] = useState("");
  const safe = useMemo(() => safetyRewrite(raw), [raw]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="panel p-5">
        <p className="section-eyebrow">Advanced</p>
        <h2 className="mt-1 text-lg font-semibold text-text-strong">Safety Rewrite</h2>
        <p className="mt-1 text-sm text-muted">
          Convert risky wording into safe commercial fashion language.
        </p>
        <textarea
          className="subtle-input mt-3 min-h-[280px]"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          placeholder="Example: sexy bikini beach look with seductive vibe"
        />
      </section>
      <section className="panel p-5">
        <h3 className="text-base font-semibold text-text-strong">Safe Version</h3>
        <div className="thread-bubble thread-bubble-assistant mt-3 text-sm">
          {raw.trim() ? safe : "Safe rewritten version appears here."}
        </div>
      </section>
    </div>
  );
}

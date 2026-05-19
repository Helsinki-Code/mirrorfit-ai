"use client";

import { useMemo, useState } from "react";

function rewritePrompt(input: string) {
  const cleaned = input
    .replace(/\bsexy\b/gi, "commercial fashion")
    .replace(/\bhot\b/gi, "professional")
    .replace(/\blingerie\b/gi, "sleepwear fashion")
    .replace(/\s+/g, " ")
    .trim();

  return `Create a polished commercial fashion catalogue render using the selected model and garment references. Preserve exact face identity, body proportions, garment seams, fabric behavior, and product details. Use clean studio lighting, neutral background, product-focused framing, and tasteful non-explicit adult presentation. User direction: ${cleaned}`;
}

export default function PromptRewritePage() {
  const [raw, setRaw] = useState("");
  const rewritten = useMemo(() => rewritePrompt(raw), [raw]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card p-4">
        <h2 className="text-lg font-semibold text-text-strong">Smart Prompt Rewrite</h2>
        <p className="mt-1 text-sm text-muted">
          Paste a casual request and get a production-grade catalogue prompt.
        </p>
        <textarea
          className="subtle-input mt-3 min-h-[280px]"
          placeholder="Example: make this dress look hot on my model with good lights"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
        />
      </section>

      <section className="card p-4">
        <h3 className="text-base font-semibold text-text-strong">Rewritten Output</h3>
        <div className="mt-3 rounded-md border border-border bg-surface p-3 text-sm text-text">
          {raw.trim() ? rewritten : "Rewritten prompt appears here as you type."}
        </div>
      </section>
    </div>
  );
}

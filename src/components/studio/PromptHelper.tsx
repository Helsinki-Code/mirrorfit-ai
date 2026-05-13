"use client";

import { STYLE_GUIDE_GROUPS, STARTER_PROMPTS } from "@/lib/constants/prompt-helper";

export function PromptHelper({
  onInsert,
}: {
  onInsert: (text: string) => void;
}) {
  return (
    <aside className="card p-4">
      <h3 className="text-base font-semibold text-text-strong">Prompt Helper / Style Guide</h3>
      <p className="mt-1 text-sm text-muted">
        Add precise fabric, lighting, and composition language for stronger output quality.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">Starter Templates</p>
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((template, idx) => (
              <button
                key={idx}
                type="button"
                className="pill-btn px-3 py-2 text-left text-xs"
                onClick={() => onInsert(template)}
              >
                Template {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {STYLE_GUIDE_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="pill-btn px-3 py-2 text-left text-xs"
                  onClick={() => onInsert(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

import { Sparkles, Users } from "lucide-react";
import type { Idea, IdeaGroup } from "./ideasData";

export function IdeaCardBody({
  idea,
  drag = 0,
  group,
  compact = false,
  onOpen,
}: {
  idea: Idea;
  drag?: number;
  group?: IdeaGroup;
  compact?: boolean;
  onOpen?: () => void;
}) {
  const likeOpacity = Math.max(0, Math.min(1, drag / 120));
  const nopeOpacity = Math.max(0, Math.min(1, -drag / 120));
  return (
    <div
      onClick={onOpen}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-card p-6 text-card-foreground"
      style={{
        boxShadow: drag > 30 ? "0 24px 60px -20px rgba(47,174,102,0.55)" : "0 14px 40px -20px rgba(0,0,0,0.4)",
      }}
    >
      {/* Stamps */}
      <div
        className="pointer-events-none absolute right-6 top-6 rotate-12 rounded-xl border-4 px-3 py-1 text-lg font-extrabold tracking-widest"
        style={{ borderColor: "var(--mint)", color: "var(--mint)", opacity: likeOpacity }}
      >
        ✓ INTERESTED
      </div>
      <div
        className="pointer-events-none absolute left-6 top-6 -rotate-12 rounded-xl border-4 px-3 py-1 text-lg font-extrabold tracking-widest"
        style={{ borderColor: "var(--destructive)", color: "var(--destructive)", opacity: nopeOpacity }}
      >
        ✗ SKIP
      </div>

      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: "color-mix(in oklab, var(--mint) 14%, transparent)",
            color: "var(--mint)",
          }}
        >
          {idea.category}
        </span>
        {idea.aiGenerated && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
            style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}
          >
            <Sparkles className="h-3 w-3" /> AI Idea
          </span>
        )}
      </div>

      <div className={compact ? "mt-4" : "mt-auto"}>
        <h2 className={compact ? "text-2xl font-extrabold leading-tight" : "text-[34px] font-extrabold leading-[1.05] tracking-tight"}>
          {idea.title}
        </h2>
        <p
          className="mt-3 text-base leading-snug"
          style={{ color: "color-mix(in oklab, var(--card-foreground) 75%, transparent)" }}
        >
          {idea.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {idea.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
              style={{
                borderColor: "color-mix(in oklab, var(--mint) 40%, transparent)",
                color: "var(--mint)",
                backgroundColor: "color-mix(in oklab, var(--mint) 8%, transparent)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5" style={{ color: "var(--forest)" }}>
            <Users className="h-3.5 w-3.5" />
            {idea.interested} students interested
          </span>
          {group && (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}
            >
              🔗 {group.emoji} {group.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

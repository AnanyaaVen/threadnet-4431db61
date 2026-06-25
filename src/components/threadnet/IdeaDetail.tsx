import { ArrowLeft, MessageCircle, Sparkles, Users } from "lucide-react";
import type { Idea, IdeaGroup } from "./ideasData";

export function IdeaDetail({
  idea,
  group,
  onBack,
  onJoin,
  joined,
  onMessage,
}: {
  idea: Idea;
  group?: IdeaGroup;
  onBack: () => void;
  onJoin: () => void;
  joined: boolean;
  onMessage?: (idea: Idea) => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-10 pt-10">
      <button
        onClick={onBack}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
        style={{ borderColor: "var(--border)", color: "var(--card-foreground)" }}
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="rounded-3xl bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "color-mix(in oklab, var(--mint) 14%, transparent)", color: "var(--mint)" }}
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

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{idea.title}</h1>
        <p
          className="mt-3 text-base leading-relaxed"
          style={{ color: "color-mix(in oklab, var(--card-foreground) 78%, transparent)" }}
        >
          {idea.description}
        </p>

        <div className="mt-6">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
            Team slots needed
          </div>
          <div className="flex flex-wrap gap-1.5">
            {idea.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold"
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
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--forest)" }}>
            <Users className="h-4 w-4" />
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

      <button
        onClick={onJoin}
        className="mt-8 h-14 w-full rounded-2xl text-base font-bold transition-all active:scale-[0.98]"
        style={{
          backgroundColor: joined ? "var(--secondary)" : "var(--mint)",
          color: joined ? "var(--forest)" : "var(--primary-foreground)",
          boxShadow: joined ? undefined : "0 16px 40px -16px rgba(47,174,102,0.55)",
        }}
      >
        {joined ? "✓ You're on the waitlist" : "Join This Project"}
      </button>
    </div>
  );
}

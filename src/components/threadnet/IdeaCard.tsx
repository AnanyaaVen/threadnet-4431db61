import { Sparkles, Users, GraduationCap } from "lucide-react";
import type { Idea, IdeaGroup } from "./ideasData";
import { Avatar } from "./Feed";
import { postedAgo } from "./time";

export function IdeaCardBody({
  idea,
  drag = 0,
  group,
  compact = false,
  onOpen,
  onInterested,
}: {
  idea: Idea;
  drag?: number;
  group?: IdeaGroup;
  compact?: boolean;
  onOpen?: () => void;
  onInterested?: () => void;
}) {
  const likeOpacity = Math.max(0, Math.min(1, drag / 120));
  const nopeOpacity = Math.max(0, Math.min(1, -drag / 120));
  return (
    <div
      onClick={onOpen}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-5 text-card-foreground"
      style={{
        borderColor: "var(--border)",
        boxShadow: drag > 30 ? "0 24px 60px -20px rgba(47,174,102,0.45)" : "0 10px 30px -18px rgba(0,0,0,0.25)",
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

      {/* Founder header — like a real student post */}
      <div className="flex items-center gap-3">
        <Avatar initials={idea.founderInitials} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold">{idea.founderName}</span>
            {idea.aiGenerated && (
              <Sparkles className="h-3 w-3 flex-shrink-0" style={{ color: "var(--mint)" }} />
            )}
          </div>
          <div
            className="flex flex-wrap items-center gap-x-2 text-[11px] font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            {idea.founderUniversity && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {idea.founderUniversity}
              </span>
            )}
            <span>· {postedAgo(idea.createdAt)}</span>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: "color-mix(in oklab, var(--mint) 14%, transparent)",
            color: "var(--mint)",
          }}
        >
          {idea.category}
        </span>
      </div>

      <div className={compact ? "mt-4" : "mt-4 flex-1 flex flex-col"}>
        <h2 className={compact ? "text-xl font-extrabold leading-tight" : "text-[26px] font-extrabold leading-[1.1] tracking-tight"}>
          {idea.title}
        </h2>
        <p
          className="mt-2 text-[15px] leading-snug"
          style={{ color: "color-mix(in oklab, var(--card-foreground) 75%, transparent)" }}
        >
          {idea.description}
        </p>

        {idea.skills.length > 0 && (
          <div className="mt-3">
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
              Looking for
            </div>
            <div className="flex flex-wrap gap-1.5">
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
          </div>
        )}

        <div className={compact ? "mt-4" : "mt-auto pt-4"}>
          <div className="mb-3 flex items-center justify-between text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5" style={{ color: "var(--forest)" }}>
              <Users className="h-3.5 w-3.5" />
              {idea.interested} students interested
            </span>
            {group && (
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}
              >
                {group.emoji} {group.name}
              </span>
            )}
          </div>
          {onInterested && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInterested();
              }}
              className="h-11 w-full rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all active:scale-[0.98]"
            >
              I'm interested 👋
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

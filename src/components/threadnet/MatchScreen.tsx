import { useMemo } from "react";
import type { Project } from "./data";
import { Avatar } from "./Feed";

export function MatchScreen({
  project,
  onChat,
  onKeepSwiping,
}: {
  project: Project;
  onChat: () => void;
  onKeepSwiping: () => void;
}) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        size: 6 + Math.random() * 8,
        hue: Math.random() > 0.5 ? "var(--mint)" : "var(--cream)",
        rotate: Math.random() * 360,
        key: i,
      })),
    [project.id],
  );

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden px-6 pb-8 pt-16">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <span
            key={c.key}
            className="animate-confetti absolute top-0 block rounded-sm"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.4,
              backgroundColor: c.hue,
              transform: `rotate(${c.rotate}deg)`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--mint)" }}>
          It's a thread
        </span>
        <h1 className="mt-3 text-center text-4xl font-extrabold leading-tight tracking-tight">
          You matched with
          <br />
          {project.founder.split(" ")[0]}!
        </h1>
        <p className="mt-3 max-w-xs text-center text-sm text-muted-foreground">
          You're both interested in <span className="font-semibold text-foreground">{project.name}</span>. Slide into their messages.
        </p>

        {/* Avatars with line */}
        <div className="relative mt-12 flex items-center justify-center gap-10">
          <div className="absolute left-1/2 top-1/2 h-px w-32 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--mint)] to-transparent" />
          <div className="relative">
            <span
              className="animate-ring-pulse absolute inset-0 rounded-full border-2"
              style={{ borderColor: "var(--mint)" }}
            />
            <div className="animate-pop-in relative">
              <Avatar initials="YOU" size={84} />
            </div>
          </div>
          <div className="relative">
            <span
              className="animate-ring-pulse absolute inset-0 rounded-full border-2"
              style={{ borderColor: "var(--mint)", animationDelay: "0.3s" }}
            />
            <div className="animate-pop-in relative" style={{ animationDelay: "0.15s" }}>
              <Avatar initials={project.initials} size={84} />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/70 px-4 py-3 text-center backdrop-blur-md">
          <span className="text-2xl">{project.emoji}</span>
          <div className="mt-1 text-sm font-bold">{project.name}</div>
          <div className="text-[11px] text-muted-foreground">{project.roles.join(" · ")}</div>
        </div>
      </div>

      <div className="z-10 w-full space-y-3">
        <button
          onClick={onChat}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-[0.98]"
        >
          Send a Message
        </button>
        <button
          onClick={onKeepSwiping}
          className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-card text-base font-semibold active:scale-[0.98]"
        >
          Keep Swiping
        </button>
      </div>
    </div>
  );
}

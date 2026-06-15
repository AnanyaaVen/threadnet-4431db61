import { useMemo, useRef, useState } from "react";
import { Heart, X, Info } from "lucide-react";
import { PROJECTS, type Project } from "./data";

export function Feed({
  onMatch,
  onOpenDetail,
}: {
  onMatch: (p: Project) => void;
  onOpenDetail: (p: Project) => void;
}) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [flying, setFlying] = useState<"left" | "right" | null>(null);
  const startX = useRef<number | null>(null);

  const visible = useMemo(() => PROJECTS.slice(index, index + 3), [index]);

  const finish = (dir: "left" | "right") => {
    setFlying(dir);
    const p = PROJECTS[index];
    setTimeout(() => {
      setFlying(null);
      setDrag(0);
      setIndex((i) => (i + 1) % PROJECTS.length);
      if (dir === "right" && p) onMatch(p);
    }, 280);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (flying) return;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    setDrag(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (startX.current === null) return;
    startX.current = null;
    if (drag > 110) finish("right");
    else if (drag < -110) finish("left");
    else setDrag(0);
  };

  return (
    <div className="flex h-dvh flex-col px-5 pb-28 pt-8">
      <Header />

      <div className="relative mt-4 flex-1">
        {visible
          .slice()
          .reverse()
          .map((p, revI) => {
            const depth = visible.length - 1 - revI; // 0 top, 1, 2
            const isTop = depth === 0;
            const rotate = isTop ? drag * 0.06 : 0;
            const tx = isTop ? (flying === "left" ? -500 : flying === "right" ? 500 : drag) : 0;
            const scale = 1 - depth * 0.04;
            const ty = depth * 10;
            return (
              <article
                key={p.id + index}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerUp : undefined}
                className="absolute inset-0 touch-none select-none rounded-3xl border border-border bg-card shadow-2xl shadow-black/30"
                style={{
                  transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`,
                  transition: flying || startX.current === null ? "transform 280ms cubic-bezier(0.22,1,0.36,1)" : "none",
                  zIndex: 10 - depth,
                }}
              >
                <CardBody project={p} drag={isTop ? drag : 0} onOpen={() => isTop && onOpenDetail(p)} />
              </article>
            );
          })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => finish("left")}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-card transition-all active:scale-90"
          aria-label="Pass"
        >
          <X className="h-6 w-6 text-muted-foreground" />
        </button>
        <button
          onClick={() => finish("right")}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-all active:scale-90"
          aria-label="Interested"
        >
          <Heart className="h-7 w-7" style={{ color: "var(--primary-foreground)" }} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xl font-extrabold tracking-tight">ThreadNet</span>
      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
        Discover
      </span>
    </div>
  );
}

function CardBody({ project, drag, onOpen }: { project: Project; drag: number; onOpen: () => void }) {
  const likeOpacity = Math.max(0, Math.min(1, drag / 120));
  const nopeOpacity = Math.max(0, Math.min(1, -drag / 120));

  return (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${project.gradient}`}>
      {/* Stamps */}
      <div
        className="absolute right-5 top-6 rotate-12 rounded-xl border-4 px-3 py-1 text-lg font-extrabold tracking-widest"
        style={{ borderColor: "var(--mint)", color: "var(--mint)", opacity: likeOpacity }}
      >
        INTERESTED
      </div>
      <div
        className="absolute left-5 top-6 -rotate-12 rounded-xl border-4 border-destructive px-3 py-1 text-lg font-extrabold tracking-widest text-destructive"
        style={{ opacity: nopeOpacity }}
      >
        PASS
      </div>

      {/* Top emoji block */}
      <div className="flex items-center justify-between px-6 pt-7">
        <span className="text-5xl">{project.emoji}</span>
      </div>

      {/* Project name + tagline — hero */}
      <div className="mt-auto px-6 pb-6">
        <h2 className="text-[34px] font-extrabold leading-[1.05] tracking-tight">{project.name}</h2>
        <p className="mt-2 text-base font-medium leading-snug text-foreground/85">{project.tagline}</p>

        {/* Roles */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.roles.map((r) => (
            <span
              key={r}
              className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
              style={{
                borderColor: "color-mix(in oklab, var(--mint) 40%, transparent)",
                color: "var(--mint)",
                backgroundColor: "color-mix(in oklab, var(--mint) 10%, transparent)",
              }}
            >
              {r}
            </span>
          ))}
        </div>

        {/* Founder */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3 backdrop-blur-md">
          <Avatar initials={project.initials} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold">{project.founder}</div>
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{project.bio}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 active:scale-90"
            aria-label="Project details"
          >
            <Info className="h-4 w-4" style={{ color: "var(--mint)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: "var(--mint)",
        color: "var(--primary-foreground)",
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}

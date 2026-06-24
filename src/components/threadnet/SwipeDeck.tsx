import { useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import type { Idea, IdeaGroup } from "./ideasData";
import { IdeaCardBody } from "./IdeaCard";

export function SwipeDeck({
  ideas,
  groupsById,
  onSwipeRight,
  onSwipeLeft,
  onTap,
  emptyLabel = "You're all caught up.",
}: {
  ideas: Idea[];
  groupsById: Record<string, IdeaGroup>;
  onSwipeRight: (idea: Idea) => void;
  onSwipeLeft?: (idea: Idea) => void;
  onTap: (idea: Idea) => void;
  emptyLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [flying, setFlying] = useState<"left" | "right" | null>(null);
  const startX = useRef<number | null>(null);
  const movedRef = useRef(false);

  const visible = ideas.slice(index, index + 3);
  const current = ideas[index];
  const done = !current;

  const finish = (dir: "left" | "right") => {
    if (!current) return;
    setFlying(dir);
    const it = current;
    setTimeout(() => {
      setFlying(null);
      setDrag(0);
      setIndex((i) => i + 1);
      if (dir === "right") onSwipeRight(it);
      else onSwipeLeft?.(it);
    }, 260);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (flying) return;
    startX.current = e.clientX;
    movedRef.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 5) movedRef.current = true;
    setDrag(dx);
  };
  const onPointerUp = () => {
    if (startX.current === null) return;
    startX.current = null;
    if (drag > 110) finish("right");
    else if (drag < -110) finish("left");
    else setDrag(0);
  };
  const onClickCard = () => {
    if (movedRef.current) return;
    if (current) onTap(current);
  };

  if (done) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl">🌿</span>
        <p className="mt-4 text-base font-bold">{emptyLabel}</p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Check the Groups or AI Ideas tab for more.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative mt-2 flex-1">
        {visible
          .slice()
          .reverse()
          .map((p, revI) => {
            const depth = visible.length - 1 - revI;
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
                className="absolute inset-0 touch-none select-none"
                style={{
                  transform: `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`,
                  transition: flying || startX.current === null ? "transform 260ms cubic-bezier(0.22,1,0.36,1)" : "none",
                  zIndex: 10 - depth,
                }}
              >
                <IdeaCardBody
                  idea={p}
                  drag={isTop ? drag : 0}
                  group={p.groupId ? groupsById[p.groupId] : undefined}
                  onOpen={isTop ? onClickCard : undefined}
                />
              </article>
            );
          })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => finish("left")}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 bg-card transition-all active:scale-90"
          style={{ borderColor: "var(--border)" }}
          aria-label="Skip"
        >
          <X className="h-6 w-6" style={{ color: "var(--muted-foreground)" }} />
        </button>
        <button
          onClick={() => finish("right")}
          className="flex h-16 w-16 items-center justify-center rounded-full transition-all active:scale-90"
          style={{ backgroundColor: "var(--mint)", boxShadow: "0 16px 40px -16px rgba(47,174,102,0.6)" }}
          aria-label="Interested"
        >
          <Heart className="h-7 w-7" fill="currentColor" style={{ color: "var(--primary-foreground)" }} />
        </button>
      </div>
    </>
  );
}

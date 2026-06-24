import { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import { TopBar } from "./TopBar";
import { SwipeDeck } from "./SwipeDeck";
import { IdeaDetail } from "./IdeaDetail";
import type { Idea, IdeaCategory, IdeaGroup } from "./ideasData";
import type { ProfileData } from "./types";

const CATEGORIES: IdeaCategory[] = ["App", "EdTech", "AI", "Social Impact", "Fintech", "Health Tech", "Marketplace", "Hardware"];

export function DiscoverScreen({
  ideas,
  groups,
  savedIds,
  onSave,
  profile,
  onOpenProfile,
}: {
  ideas: Idea[];
  groups: IdeaGroup[];
  savedIds: string[];
  onSave: (idea: Idea) => void;
  profile: ProfileData;
  onOpenProfile: () => void;
}) {
  const [active, setActive] = useState<Idea | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [cats, setCats] = useState<IdeaCategory[]>([]);

  const groupsById = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups]);

  const filtered = useMemo(() => {
    if (cats.length === 0) return ideas;
    return ideas.filter((i) => cats.includes(i.category));
  }, [ideas, cats]);

  if (active) {
    return (
      <IdeaDetail
        idea={active}
        group={active.groupId ? groupsById[active.groupId] : undefined}
        onBack={() => setActive(null)}
        joined={savedIds.includes(active.id)}
        onJoin={() => {
          onSave(active);
          setActive(null);
        }}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col px-5 pb-28 pt-8">
      <TopBar
        profile={profile}
        onOpenProfile={onOpenProfile}
        right={
          <button
            onClick={() => setShowFilter((s) => !s)}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--forest)" }}
            aria-label="Filter"
          >
            <Filter className="h-4 w-4" />
          </button>
        }
      />

      {showFilter && (
        <div className="mb-3 animate-slide-up rounded-2xl bg-card p-4 text-card-foreground">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Filter by category
            </span>
            {cats.length > 0 && (
              <button
                onClick={() => setCats([])}
                className="inline-flex items-center gap-1 text-[11px] font-semibold"
                style={{ color: "var(--mint)" }}
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => {
              const on = cats.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => setCats((arr) => (on ? arr.filter((x) => x !== c) : [...arr, c]))}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: on ? "var(--mint)" : "var(--secondary)",
                    color: on ? "var(--primary-foreground)" : "var(--forest)",
                    borderColor: on ? "var(--mint)" : "var(--border)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <SwipeDeck
        ideas={filtered}
        groupsById={groupsById}
        onSwipeRight={onSave}
        onTap={setActive}
      />
    </div>
  );
}

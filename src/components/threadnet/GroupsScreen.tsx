import { useMemo, useState } from "react";
import { ArrowLeft, Sparkles, Users } from "lucide-react";
import { TopBar } from "./TopBar";
import { SwipeDeck } from "./SwipeDeck";
import { IdeaDetail } from "./IdeaDetail";
import type { Idea, IdeaGroup } from "./ideasData";
import type { ProfileData } from "./types";

export function GroupsScreen({
  ideas,
  groups,
  joinedGroupIds,
  savedIds,
  onToggleJoin,
  onSave,
  profile,
  onOpenProfile,
  onMessage,
}: {
  ideas: Idea[];
  groups: IdeaGroup[];
  joinedGroupIds: string[];
  savedIds: string[];
  onToggleJoin: (groupId: string) => void;
  onSave: (idea: Idea) => void;
  profile: ProfileData;
  onOpenProfile: () => void;
  onMessage?: (idea: Idea) => void;
}) {
  const [openGroup, setOpenGroup] = useState<IdeaGroup | null>(null);
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);

  const ideasById = useMemo(() => Object.fromEntries(ideas.map((i) => [i.id, i])), [ideas]);
  const groupsById = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups]);

  if (activeIdea) {
    return (
      <IdeaDetail
        idea={activeIdea}
        group={activeIdea.groupId ? groupsById[activeIdea.groupId] : undefined}
        onBack={() => setActiveIdea(null)}
        joined={savedIds.includes(activeIdea.id)}
        onJoin={() => {
          onSave(activeIdea);
          setActiveIdea(null);
        }}
      />
    );
  }

  if (openGroup) {
    const groupIdeas = openGroup.ideaIds.map((id) => ideasById[id]).filter(Boolean) as Idea[];
    return (
      <div className="flex h-dvh flex-col px-5 pb-28 pt-8">
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => setOpenGroup(null)}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--forest)" }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="text-center">
            <div className="text-base font-extrabold">
              {openGroup.emoji} {openGroup.name}
            </div>
            <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
              {openGroup.students} students · {groupIdeas.length} ideas
            </div>
          </div>
          <button
            onClick={() => onToggleJoin(openGroup.id)}
            className="rounded-full px-3 py-1.5 text-[11px] font-bold"
            style={{
              backgroundColor: joinedGroupIds.includes(openGroup.id) ? "var(--secondary)" : "var(--mint)",
              color: joinedGroupIds.includes(openGroup.id) ? "var(--forest)" : "var(--primary-foreground)",
            }}
          >
            {joinedGroupIds.includes(openGroup.id) ? "Joined" : "Join"}
          </button>
        </div>

        <SwipeDeck
          ideas={groupIdeas}
          groupsById={groupsById}
          onSwipeRight={onSave}
          onTap={setActiveIdea}
          emptyLabel="You've seen everything in this group."
        />

        <div className="mt-4 rounded-2xl bg-card p-4 text-card-foreground">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
            Members
          </div>
          <MembersStub />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <TopBar profile={profile} onOpenProfile={onOpenProfile} title={<span>Groups</span>} />

      <p className="mb-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
        Project ideas auto-clustered by AI. Join a group to find co-founders.
      </p>

      <div className="space-y-3">
        {groups.map((g) => {
          const top = g.ideaIds.map((id) => ideasById[id]).filter(Boolean).slice(0, 3) as Idea[];
          const joined = joinedGroupIds.includes(g.id);
          return (
            <article key={g.id} className="rounded-3xl bg-card p-5 text-card-foreground shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-extrabold tracking-tight">
                    {g.emoji} {g.name}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                    <Users className="h-3 w-3" /> {g.students} students · {g.ideaIds.length} ideas
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}
                >
                  <Sparkles className="h-3 w-3" /> AI Grouped
                </span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {top.map((i) => (
                  <li key={i.id} className="flex items-center gap-2 text-sm">
                    <span style={{ color: "var(--mint)" }}>•</span>
                    <span className="truncate font-semibold">{i.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => onToggleJoin(g.id)}
                  className="h-11 flex-1 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: joined ? "var(--secondary)" : "var(--mint)",
                    color: joined ? "var(--forest)" : "var(--primary-foreground)",
                  }}
                >
                  {joined ? "✓ Joined" : "Join Group"}
                </button>
                <button
                  onClick={() => setOpenGroup(g)}
                  className="h-11 flex-1 rounded-xl border text-sm font-bold transition-all active:scale-[0.98]"
                  style={{ borderColor: "var(--border)", color: "var(--forest)" }}
                >
                  View Ideas →
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MembersStub() {
  const members = [
    { initials: "MC", role: "iOS Dev" },
    { initials: "AP", role: "Researcher" },
    { initials: "RS", role: "Marketing" },
    { initials: "JL", role: "ML Dev" },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {members.map((m) => (
        <div key={m.initials} className="flex items-center gap-2 rounded-xl px-2 py-1.5" style={{ backgroundColor: "var(--secondary)" }}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold"
            style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)" }}
          >
            {m.initials}
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--forest)" }}>
            {m.role}
          </span>
        </div>
      ))}
    </div>
  );
}

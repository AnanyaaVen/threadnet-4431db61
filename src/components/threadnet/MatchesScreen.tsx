import { useEffect, useMemo, useState } from "react";
import { Sparkles, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "./Feed";
import type { ProfileData } from "./types";
import type { MatchPerson } from "./MatchChatScreen";

type OtherProfile = {
  id: string;
  display_name: string | null;
  majors: string[];
  skills: string[];
  interests: string[];
  roles: string[];
};

function jaccard(a: string[], b: string[]) {
  if (!a.length && !b.length) return 0;
  const A = new Set(a.map((s) => s.toLowerCase()));
  const B = new Set(b.map((s) => s.toLowerCase()));
  let inter = 0;
  A.forEach((x) => B.has(x) && inter++);
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
}

function compatibility(me: ProfileData, other: OtherProfile) {
  const m = jaccard(me.majors, other.majors);
  const s = jaccard(me.skills, other.skills);
  const i = jaccard(me.interests, other.interests);
  // weight interests + skills slightly higher than majors
  const score = 0.25 * m + 0.4 * s + 0.35 * i;
  return Math.round(score * 100);
}

function initialsOf(name: string | null) {
  return (name || "TN")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function MatchesScreen({
  me,
  currentUserId,
  onMessage,
}: {
  me: ProfileData;
  currentUserId: string | null;
  onMessage: (person: MatchPerson) => void;
}) {
  const [profiles, setProfiles] = useState<OtherProfile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, majors, skills, interests, roles")
        .eq("onboarded", true);
      if (cancelled) return;
      if (error) {
        setError(error.message);
        return;
      }
      setProfiles(
        (data ?? []).filter((p) => p.id !== currentUserId) as OtherProfile[],
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const { recommended, others } = useMemo(() => {
    const scored = (profiles ?? []).map((p) => ({
      profile: p,
      score: compatibility(me, p),
    }));
    scored.sort((a, b) => b.score - a.score);
    return {
      recommended: scored.filter((s) => s.score >= 70),
      others: scored.filter((s) => s.score < 70),
    };
  }, [profiles, me]);

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Matches</h1>
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
          {profiles?.length ?? 0} on ThreadNet
        </span>
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {profiles === null && !error && (
        <p className="mt-10 text-center text-sm text-muted-foreground">Loading matches…</p>
      )}

      {profiles && profiles.length === 0 && !error && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No one else has signed up yet. Invite a friend!
        </p>
      )}

      {recommended.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--mint)" }} />
            <h2 className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--mint)" }}>
              Recommended Matches
            </h2>
          </div>
          <div className="space-y-3">
            {recommended.map(({ profile, score }) => (
              <PersonCard key={profile.id} profile={profile} score={score} recommended />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Everyone else
          </h2>
          <div className="space-y-3">
            {others.map(({ profile, score }) => (
              <PersonCard key={profile.id} profile={profile} score={score} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PersonCard({
  profile,
  score,
  recommended = false,
}: {
  profile: OtherProfile;
  score: number;
  recommended?: boolean;
}) {
  const tags = [...profile.skills, ...profile.interests].slice(0, 4);
  return (
    <article
      className="flex items-center gap-3 rounded-2xl border bg-card p-3"
      style={{
        borderColor: recommended
          ? "color-mix(in oklab, var(--mint) 45%, transparent)"
          : "var(--border)",
        boxShadow: recommended
          ? "0 8px 24px -16px color-mix(in oklab, var(--mint) 60%, transparent)"
          : undefined,
      }}
    >
      <Avatar initials={initialsOf(profile.display_name)} size={52} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold">{profile.display_name || "ThreadNet user"}</h3>
          {profile.roles.length > 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {profile.roles[0]}
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        className="flex shrink-0 flex-col items-center rounded-xl px-3 py-1.5"
        style={{
          backgroundColor: recommended
            ? "color-mix(in oklab, var(--mint) 18%, transparent)"
            : "var(--secondary)",
          color: recommended ? "var(--mint)" : "var(--muted-foreground)",
        }}
      >
        <span className="text-base font-extrabold leading-none">{score}%</span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider">match</span>
      </div>
    </article>
  );
}

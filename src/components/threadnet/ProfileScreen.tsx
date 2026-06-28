import { ArrowLeft, LogOut, Settings, MapPin, GraduationCap, ShieldCheck, BookOpen, Sparkles } from "lucide-react";
import { Avatar } from "./Feed";
import type { ProfileData } from "./types";
import type { Idea, IdeaGroup, IdeaRating } from "./ideasData";
import { joinedAgo } from "./time";

export function ProfileScreen({
  profile,
  onBack,
  onEdit,
  onSignOut,
  savedIdeas,
  joinedGroups,
  ratings,
}: {
  profile: ProfileData;
  onBack: () => void;
  onEdit: () => void;
  onSignOut: () => void;
  savedIdeas: Idea[];
  joinedGroups: IdeaGroup[];
  ratings: IdeaRating[];
}) {
  const initials = (profile.display_name || "You")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-12 pt-10">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
          style={{ borderColor: "var(--border)", color: "var(--forest)" }}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Profile</h1>
        <div className="flex gap-2">
          <button
            onClick={onSignOut}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--forest)" }}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--forest)" }}
            aria-label="Edit profile"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Student profile card */}
      <div
        className="mt-6 overflow-hidden rounded-3xl border bg-card shadow-sm"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="h-16 w-full"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--mint) 35%, var(--card)) 0%, var(--card) 100%)",
          }}
        />
        <div className="-mt-10 px-5 pb-5">
          <div className="flex items-end gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-20 w-20 rounded-full border-4 object-cover"
                style={{ borderColor: "var(--card)" }}
              />
            ) : (
              <div className="rounded-full border-4" style={{ borderColor: "var(--card)" }}>
                <Avatar initials={initials} size={80} />
              </div>
            )}
            <div className="mb-1 min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold leading-tight">{profile.display_name || "You"}</h2>
              {profile.majors.length > 0 && (
                <p className="truncate text-xs font-semibold" style={{ color: "var(--mint)" }}>
                  {profile.majors.join(" · ")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
            {profile.university && (
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {profile.university}
                {profile.school_email_verified && (
                  <ShieldCheck className="h-3.5 w-3.5" style={{ color: "var(--mint)" }} />
                )}
              </span>
            )}
            {profile.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            )}
            {profile.created_at && (
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {joinedAgo(profile.created_at)}
              </span>
            )}
          </div>

          {profile.bio && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
              {profile.bio}
            </p>
          )}

          {profile.current_project && (
            <div
              className="mt-3 flex items-start gap-2 rounded-2xl p-3"
              style={{ backgroundColor: "color-mix(in oklab, var(--mint) 10%, transparent)" }}
            >
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--mint)" }} />
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--mint)" }}>
                  Currently building
                </div>
                <p className="text-sm font-semibold leading-snug">{profile.current_project}</p>
              </div>
            </div>
          )}
        </div>
      </div>


      <Section title="My Skills">
        {profile.skills.length ? (
          <Chips items={profile.skills} />
        ) : (
          <Empty>Add skills in Edit Profile.</Empty>
        )}
      </Section>

      <Section title={`Saved Ideas (${savedIdeas.length})`}>
        {savedIdeas.length ? (
          <ul className="space-y-1.5">
            {savedIdeas.map((i) => (
              <Row key={i.id} title={i.title} sub={i.category} />
            ))}
          </ul>
        ) : (
          <Empty>Swipe right on ideas in Discover to save them.</Empty>
        )}
      </Section>

      <Section title={`My Groups (${joinedGroups.length})`}>
        {joinedGroups.length ? (
          <ul className="space-y-1.5">
            {joinedGroups.map((g) => (
              <Row key={g.id} title={`${g.emoji} ${g.name}`} sub={`${g.students} students`} />
            ))}
          </ul>
        ) : (
          <Empty>Join a group from the Groups tab.</Empty>
        )}
      </Section>

      <Section title={`Ideas I've Rated (${ratings.length})`}>
        {ratings.length ? (
          <ul className="space-y-1.5">
            {ratings.map((r) => (
              <Row key={r.id} title={r.name} sub={`${r.category} · ${r.overall}/10`} />
            ))}
          </ul>
        ) : (
          <Empty>Use the Rate It tab to get AI feedback on your ideas.</Empty>
        )}
      </Section>

      <p className="mt-auto pt-10 text-center text-xs italic" style={{ color: "var(--muted-foreground)" }}>
        Find your people. Build something real.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
        {title}
      </div>
      <div className="rounded-2xl bg-card p-4 text-card-foreground">{children}</div>
    </div>
  );
}
function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span
          key={s}
          className="rounded-full border px-3 py-1 text-xs font-semibold"
          style={{
            borderColor: "color-mix(in oklab, var(--mint) 40%, transparent)",
            color: "var(--mint)",
            backgroundColor: "color-mix(in oklab, var(--mint) 10%, transparent)",
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}
function Row({ title, sub }: { title: string; sub: string }) {
  return (
    <li className="flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: "var(--secondary)" }}>
      <span className="truncate text-sm font-semibold" style={{ color: "var(--forest)" }}>{title}</span>
      <span className="text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>{sub}</span>
    </li>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{children}</p>;
}

import type { ProfileData } from "./types";

export function TopBar({
  title,
  right,
  profile,
  onOpenProfile,
}: {
  title?: React.ReactNode;
  right?: React.ReactNode;
  profile: ProfileData;
  onOpenProfile: () => void;
}) {
  const initials = (profile.display_name || "You")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between pb-3">
      <div className="flex items-center gap-2 text-base font-extrabold tracking-tight">
        {title ?? <span>ThreadNet</span>}
      </div>
      <div className="flex items-center gap-2">
        {right}
        <button
          onClick={onOpenProfile}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-all active:scale-95"
          style={{ borderColor: "var(--mint)" }}
          aria-label="Open profile"
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-xs font-extrabold"
              style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)" }}
            >
              {initials}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

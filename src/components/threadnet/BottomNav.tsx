import { Home, Users, Sparkles, Star, MessageCircle } from "lucide-react";
import type { Screen } from "./types";

const items: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: "discover", label: "Discover", icon: Home },
  { id: "groups", label: "Groups", icon: Users },
  { id: "matches", label: "Matches", icon: MessageCircle },
  { id: "ai", label: "AI Ideas", icon: Sparkles },
  { id: "rate", label: "Rate It", icon: Star },
];

export function BottomNav({
  active,
  onNavigate,
}: {
  active: Screen;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t px-1 pb-5 pt-2 backdrop-blur-md"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "color-mix(in oklab, var(--background) 92%, transparent)",
      }}
    >
      <div className="flex items-center justify-around">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive =
            active === id ||
            (id === "groups" && active === "group") ||
            (id === "matches" && active === "matchChat");
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition-all active:scale-95"
              aria-label={label}
            >
              <Icon
                className="h-6 w-6 transition-colors"
                strokeWidth={isActive ? 2.5 : 2}
                style={{ color: isActive ? "var(--mint)" : "var(--muted-foreground)" }}
              />
              <span
                className="text-[10px] font-semibold tracking-wide transition-colors"
                style={{ color: isActive ? "var(--mint)" : "var(--muted-foreground)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

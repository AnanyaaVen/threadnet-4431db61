import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Onboarding } from "@/components/threadnet/Onboarding";
import { Feed } from "@/components/threadnet/Feed";
import { ProjectDetail } from "@/components/threadnet/ProjectDetail";
import { MatchScreen } from "@/components/threadnet/MatchScreen";
import { Chat } from "@/components/threadnet/Chat";
import { BottomNav } from "@/components/threadnet/BottomNav";
import { PROJECTS, type Project } from "@/components/threadnet/data";
import type { Screen } from "@/components/threadnet/types";
import { Avatar } from "@/components/threadnet/Feed";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreadNet — Find your people. Build something real." },
      { name: "description", content: "ThreadNet helps Menlo College students find co-founders and project collaborators." },
      { property: "og:title", content: "ThreadNet" },
      { property: "og:description", content: "Find your people. Build something real." },
    ],
  }),
  component: App,
});

function App() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);

  const showNav = ["feed", "match", "chat", "profile"].includes(screen);

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background text-foreground">
      {screen === "onboarding" && <Onboarding onComplete={() => setScreen("feed")} />}

      {screen === "feed" && (
        <Feed
          onMatch={(p) => {
            setActiveProject(p);
            setScreen("match");
          }}
          onOpenDetail={(p) => {
            setActiveProject(p);
            setScreen("detail");
          }}
        />
      )}

      {screen === "detail" && (
        <ProjectDetail
          project={activeProject}
          onBack={() => setScreen("feed")}
          onInterested={() => setScreen("match")}
        />
      )}

      {screen === "match" && (
        <MatchScreen
          project={activeProject}
          onChat={() => setScreen("chat")}
          onKeepSwiping={() => setScreen("feed")}
        />
      )}

      {screen === "chat" && <Chat project={activeProject} onBack={() => setScreen("feed")} />}

      {screen === "profile" && <Profile onEdit={() => setScreen("onboarding")} />}

      {showNav && <BottomNav active={screen} onNavigate={(s) => setScreen(s)} />}
    </div>
  );
}

function Profile({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-28 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Profile</h1>
        <button
          onClick={onEdit}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:scale-95"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <Avatar initials="YOU" size={96} />
        <h2 className="mt-4 text-xl font-bold">You</h2>
        <p className="text-sm text-muted-foreground">Menlo College · Founder</p>
      </div>

      <div className="mt-8 space-y-5">
        <Field label="Major">Computer Science</Field>
        <Field label="Skills">
          <div className="flex flex-wrap gap-1.5">
            {["Frontend", "Product", "Design"].map((s) => (
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
        </Field>
        <Field label="Interests">
          <div className="flex flex-wrap gap-1.5">
            {["Edtech", "AI", "Social"].map((s) => (
              <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {s}
              </span>
            ))}
          </div>
        </Field>
      </div>

      <p className="mt-auto pt-10 text-center text-xs italic text-muted-foreground">
        Find your people. Build something real.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

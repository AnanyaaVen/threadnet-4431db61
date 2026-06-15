import { ArrowLeft, Users, Sparkles } from "lucide-react";
import type { Project } from "./data";

export function ProjectDetail({
  project,
  onBack,
  onInterested,
}: {
  project: Project;
  onBack: () => void;
  onInterested: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col pb-8">
      {/* Hero */}
      <div className={`relative bg-gradient-to-br ${project.gradient} px-5 pb-8 pt-12`}>
        <button
          onClick={onBack}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 backdrop-blur-md active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-6xl">{project.emoji}</span>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight">{project.name}</h1>
        <p className="mt-3 text-base font-medium leading-snug text-foreground/85">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: "color-mix(in oklab, var(--mint) 20%, transparent)", color: "var(--mint)" }}
          >
            Collaborators wanted
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-7 px-5 pt-7">
        <Section icon={<Sparkles className="h-4 w-4" />} label="About the project">
          <p className="text-[15px] leading-relaxed text-foreground/90">{project.description}</p>
        </Section>

        <Section icon={<Users className="h-4 w-4" />} label="Roles needed">
          <div className="flex flex-wrap gap-2">
            {project.roles.map((r) => (
              <span
                key={r}
                className="rounded-full border px-3.5 py-1.5 text-sm font-semibold"
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
        </Section>

        <Section label="Founder">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold"
              style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)" }}
            >
              {project.initials}
            </div>
            <div>
              <div className="text-base font-bold">{project.founder}</div>
              <p className="text-sm text-muted-foreground">{project.bio}</p>
            </div>
          </div>
        </Section>

        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-4 text-center text-xs text-muted-foreground">
          This is a project to <span className="font-semibold text-foreground">collaborate on</span> — not a job to apply for.
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 mt-auto px-5 pb-4 pt-6">
        <button
          onClick={onInterested}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 active:scale-[0.98]"
        >
          Interested in joining?
        </button>
      </div>
    </div>
  );
}

function Section({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

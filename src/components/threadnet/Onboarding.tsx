import { useState } from "react";
import { ArrowRight, Check, GraduationCap } from "lucide-react";

const MAJORS = ["Computer Science", "Business", "Marketing", "Design", "Data Science", "Psychology", "Economics", "Other"];
const SKILLS = ["Design", "Frontend", "Backend", "iOS", "Marketing", "Sales", "Video", "Writing", "Research", "ML/AI", "Product", "Ops"];
const INTERESTS = ["Edtech", "Wellness", "Fintech", "Social", "Climate", "AI", "Creator", "Hardware", "Marketplace"];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [major, setMajor] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [role, setRole] = useState<"founder" | "joiner" | null>(null);

  const toggle = (arr: string[], v: string, set: (v: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const canAdvance =
    (step === 0 && !!major) ||
    (step === 1 && skills.length > 0) ||
    (step === 2 && interests.length > 0) ||
    (step === 3 && !!role);

  const progress = ((step + 1) / 4) * 100;

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
          <GraduationCap className="h-5 w-5" style={{ color: "var(--mint)" }} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Menlo College</span>
          <span className="text-lg font-bold tracking-tight">ThreadNet</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: "var(--mint)" }}
        />
      </div>

      {/* Step content */}
      <div key={step} className="flex-1 animate-slide-up">
        {step === 0 && (
          <Step
            title="What are you studying?"
            sub="We'll match you with builders in adjacent fields too."
          >
            <ChipGrid options={MAJORS} selected={major ? [major] : []} onToggle={(v) => setMajor(v)} single />
          </Step>
        )}
        {step === 1 && (
          <Step title="What can you bring?" sub="Pick everything you're decent at — humility optional.">
            <ChipGrid options={SKILLS} selected={skills} onToggle={(v) => toggle(skills, v, setSkills)} />
          </Step>
        )}
        {step === 2 && (
          <Step title="What gets you excited?" sub="Space, education, climate, weird internet stuff — all welcome.">
            <ChipGrid options={INTERESTS} selected={interests} onToggle={(v) => toggle(interests, v, setInterests)} />
          </Step>
        )}
        {step === 3 && (
          <Step title="Where do you fit?" sub="You can change this later.">
            <div className="grid gap-3">
              <RoleCard
                label="I'm a Founder"
                desc="I have an idea and I'm looking for collaborators."
                active={role === "founder"}
                onClick={() => setRole("founder")}
              />
              <RoleCard
                label="I want to join a project"
                desc="I'm looking for something exciting to help build."
                active={role === "joiner"}
                onClick={() => setRole("joiner")}
              />
            </div>
            <p className="mt-8 text-center text-sm italic text-muted-foreground">
              Find your people. Build something real.
            </p>
          </Step>
        )}
      </div>

      {/* CTA */}
      <button
        disabled={!canAdvance}
        onClick={() => (step === 3 ? onComplete() : setStep(step + 1))}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40"
      >
        {step === 3 ? "Enter ThreadNet" : "Continue"}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function ChipGrid({
  options,
  selected,
  onToggle,
  single,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  single?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className="rounded-full border px-4 py-2.5 text-sm font-medium transition-all active:scale-95"
            style={{
              backgroundColor: active ? "var(--mint)" : "var(--secondary)",
              color: active ? "var(--primary-foreground)" : "var(--foreground)",
              borderColor: active ? "var(--mint)" : "var(--border)",
            }}
          >
            {active && !single && <Check className="mr-1 inline h-3.5 w-3.5" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function RoleCard({
  label,
  desc,
  active,
  onClick,
}: {
  label: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98]"
      style={{
        borderColor: active ? "var(--mint)" : "var(--border)",
        backgroundColor: active ? "color-mix(in oklab, var(--mint) 12%, transparent)" : "var(--card)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-bold">{label}</span>
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full border-2"
          style={{
            borderColor: active ? "var(--mint)" : "var(--border)",
            backgroundColor: active ? "var(--mint)" : "transparent",
          }}
        >
          {active && <Check className="h-3.5 w-3.5" style={{ color: "var(--primary-foreground)" }} />}
        </div>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}

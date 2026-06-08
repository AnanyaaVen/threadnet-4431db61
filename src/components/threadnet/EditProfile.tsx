import { useState } from "react";
import { ArrowLeft, Check, Save } from "lucide-react";
import type { ProfileData } from "./types";

const MAJORS = ["Computer Science", "Business", "Marketing", "Design", "Data Science", "Psychology", "Economics", "Other"];
const SKILLS = ["Design", "Frontend", "Backend", "iOS", "Marketing", "Sales", "Video", "Writing", "Research", "ML/AI", "Product", "Ops"];
const INTERESTS = ["Edtech", "Wellness", "Fintech", "Social", "Climate", "AI", "Creator", "Hardware", "Marketplace"];
const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "joiner", label: "Joining a project" },
];

export function EditProfile({
  initial,
  onBack,
  onSave,
  saving,
}: {
  initial: ProfileData;
  onBack: () => void;
  onSave: (data: Pick<ProfileData, "display_name" | "majors" | "skills" | "interests" | "roles">) => void;
  saving?: boolean;
}) {
  const [name, setName] = useState(initial.display_name ?? "");
  const [majors, setMajors] = useState<string[]>(initial.majors);
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [interests, setInterests] = useState<string[]>(initial.interests);
  const [roles, setRoles] = useState<string[]>(initial.roles);

  const toggle = (arr: string[], v: string, set: (v: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:scale-95">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Edit profile</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-7">
        <Section label="Display name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-2xl border-2 bg-card px-4 py-3 text-base font-semibold outline-none transition-all"
            style={{ borderColor: name ? "var(--mint)" : "var(--border)" }}
          />
        </Section>

        <Section label="Majors">
          <Chips options={MAJORS} selected={majors} onToggle={(v) => toggle(majors, v, setMajors)} />
        </Section>

        <Section label="Skills">
          <Chips options={SKILLS} selected={skills} onToggle={(v) => toggle(skills, v, setSkills)} />
        </Section>

        <Section label="Interests">
          <Chips options={INTERESTS} selected={interests} onToggle={(v) => toggle(interests, v, setInterests)} />
        </Section>

        <Section label="Role">
          <Chips
            options={ROLES.map((r) => r.label)}
            selected={roles.map((r) => ROLES.find((x) => x.value === r)?.label ?? r)}
            onToggle={(label) => {
              const v = ROLES.find((r) => r.label === label)?.value;
              if (v) toggle(roles, v, setRoles);
            }}
          />
        </Section>
      </div>

      <button
        disabled={saving}
        onClick={() =>
          onSave({
            display_name: name.trim() || null,
            majors,
            skills,
            interests,
            roles,
          })
        }
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40"
      >
        <Save className="h-5 w-5" />
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Chips({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
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
            {active && <Check className="mr-1 inline h-3.5 w-3.5" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

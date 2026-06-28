import { useState } from "react";
import { ArrowLeft, Check, Save, ShieldCheck } from "lucide-react";
import type { ProfileData } from "./types";
import { AvatarUpload } from "./AvatarUpload";

const MAJORS = ["Computer Science", "Business", "Marketing", "Design", "Data Science", "Psychology", "Economics", "Other"];
const SKILLS = ["Design", "Frontend", "Backend", "iOS", "Marketing", "Sales", "Video", "Writing", "Research", "ML/AI", "Product", "Ops"];
const INTERESTS = ["Edtech", "Wellness", "Fintech", "Social", "Climate", "AI", "Creator", "Hardware", "Marketplace"];
const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "joiner", label: "Joining a project" },
];

export type EditPayload = Pick<
  ProfileData,
  | "display_name"
  | "avatar_url"
  | "location"
  | "university"
  | "school_email"
  | "school_email_verified"
  | "bio"
  | "current_project"
  | "majors"
  | "skills"
  | "interests"
  | "roles"
>;

export function EditProfile({
  userId,
  initial,
  onBack,
  onSave,
  saving,
}: {
  userId: string | null;
  initial: ProfileData;
  onBack: () => void;
  onSave: (data: EditPayload) => void;
  saving?: boolean;
}) {
  const [name, setName] = useState(initial.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial.avatar_url ?? null);
  const [location, setLocation] = useState(initial.location ?? "");
  const [university, setUniversity] = useState(initial.university ?? "");
  const [schoolEmail, setSchoolEmail] = useState(initial.school_email ?? "");
  const [schoolVerified, setSchoolVerified] = useState(initial.school_email_verified ?? false);
  const [majors, setMajors] = useState<string[]>(initial.majors);
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [interests, setInterests] = useState<string[]>(initial.interests);
  const [roles, setRoles] = useState<string[]>(initial.roles);
  const [bio, setBio] = useState(initial.bio ?? "");
  const [currentProject, setCurrentProject] = useState(initial.current_project ?? "");

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
        <div className="flex justify-center">
          <AvatarUpload
            userId={userId}
            value={avatarUrl}
            onChange={setAvatarUrl}
            initials={name || "You"}
          />
        </div>

        <Section label="Display name">
          <Input value={name} onChange={setName} placeholder="Your name" />
        </Section>

        <Section label="Short bio">
          <TextArea value={bio} onChange={setBio} placeholder="Two sentences your future co-founder should read." />
        </Section>

        <Section label="What are you working on?">
          <TextArea
            value={currentProject}
            onChange={setCurrentProject}
            placeholder="A weekend project, a side hustle, a class idea you can't shake…"
          />
        </Section>

        <Section label="Location">
          <Input value={location} onChange={setLocation} placeholder="City or country" />
        </Section>


        <Section label="University (optional)">
          <Input
            value={university}
            onChange={(v) => {
              setUniversity(v);
              if (!v.trim()) {
                setSchoolEmail("");
                setSchoolVerified(false);
              } else {
                setSchoolVerified(false);
              }
            }}
            placeholder="e.g. Stanford University"
          />
          {university.trim() && (
            <SchoolEmailBlock
              email={schoolEmail}
              onEmail={(v) => {
                setSchoolEmail(v);
                setSchoolVerified(false);
              }}
              verified={schoolVerified}
              onVerify={() => setSchoolVerified(true)}
            />
          )}
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
        disabled={saving || (university.trim().length > 0 && !schoolVerified)}
        onClick={() =>
          onSave({
            display_name: name.trim() || null,
            avatar_url: avatarUrl,
            location: location.trim() || null,
            university: university.trim() || null,
            school_email: university.trim() ? schoolEmail.trim().toLowerCase() : null,
            school_email_verified: university.trim() ? schoolVerified : false,
            bio: bio.trim() || null,
            current_project: currentProject.trim() || null,
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

function isSchoolEmail(email: string) {
  const e = email.trim().toLowerCase();
  return /\S+@\S+\.\S+/.test(e) && /(\.edu(\.[a-z]{2,3})?|\.ac\.[a-z]{2,3})$/.test(e);
}

function SchoolEmailBlock({
  email,
  onEmail,
  verified,
  onVerify,
}: {
  email: string;
  onEmail: (v: string) => void;
  verified: boolean;
  onVerify: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const valid = isSchoolEmail(email);

  return (
    <div className="mt-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" style={{ color: "var(--mint)" }} />
        <span className="text-sm font-bold">Verify your school email</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Use a .edu or institutional address to confirm your enrollment.
      </p>
      <div className="mt-3">
        <Input value={email} onChange={onEmail} placeholder="you@school.edu" type="email" />
      </div>

      {!verified && !sent && (
        <button
          disabled={!valid}
          onClick={() => setSent(true)}
          className="mt-3 h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-40"
        >
          Send verification code
        </button>
      )}

      {!verified && sent && (
        <div className="mt-3">
          <Input value={code} onChange={setCode} placeholder="Enter 4-digit code" />
          <button
            disabled={code.replace(/\D/g, "").length !== 4}
            onClick={onVerify}
            className="mt-3 h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-40"
          >
            Confirm
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Prototype: any 4-digit code will verify.
          </p>
        </div>
      )}

      {verified && (
        <div
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
          style={{
            color: "var(--mint)",
            backgroundColor: "color-mix(in oklab, var(--mint) 12%, transparent)",
          }}
        >
          <Check className="h-4 w-4" /> Verified
        </div>
      )}
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

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border-2 bg-card px-4 py-3 text-base font-semibold outline-none transition-all"
      style={{ borderColor: value ? "var(--mint)" : "var(--border)" }}
    />
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

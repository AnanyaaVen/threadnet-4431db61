import { useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import type { ProfileData } from "./types";
import { AvatarUpload } from "./AvatarUpload";

const MAJORS = ["Computer Science", "Business", "Marketing", "Design", "Data Science", "Psychology", "Economics", "Other"];
const SKILLS = ["Design", "Frontend", "Backend", "iOS", "Marketing", "Sales", "Video", "Writing", "Research", "ML/AI", "Product", "Ops"];
const INTERESTS = ["Edtech", "Wellness", "Fintech", "Social", "Climate", "AI", "Creator", "Hardware", "Marketplace"];
const ROLES = [
  { value: "founder", label: "I'm a Founder", desc: "I have an idea and I'm looking for collaborators." },
  { value: "joiner", label: "I want to join a project", desc: "I'm looking for something exciting to help build." },
];

type OnboardingPayload = Omit<ProfileData, "onboarded">;

export function Onboarding({
  userId,
  initial,
  onComplete,
  saving,
}: {
  userId: string | null;
  initial?: Partial<ProfileData>;
  onComplete: (data: OnboardingPayload) => void;
  saving?: boolean;
}) {
  const TOTAL = 7;
  const [step, setStep] = useState(0);

  const [displayName, setDisplayName] = useState(initial?.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial?.avatar_url ?? null);
  const [location, setLocation] = useState(initial?.location ?? "");
  const [university, setUniversity] = useState(initial?.university ?? "");
  const [schoolEmail, setSchoolEmail] = useState(initial?.school_email ?? "");
  const [schoolVerified, setSchoolVerified] = useState(initial?.school_email_verified ?? false);
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [currentProject, setCurrentProject] = useState(initial?.current_project ?? "");

  const [majors, setMajors] = useState<string[]>(initial?.majors ?? []);
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [roles, setRoles] = useState<string[]>(initial?.roles ?? []);

  const toggle = (arr: string[], v: string, set: (v: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const schoolOk = !university.trim() || (isSchoolEmail(schoolEmail) && schoolVerified);
  const canAdvance =
    (step === 0 && displayName.trim().length > 0) ||
    (step === 1 && location.trim().length > 0) ||
    (step === 2 && schoolOk) ||
    (step === 3 && majors.length > 0) ||
    (step === 4 && skills.length > 0) ||
    (step === 5 && interests.length > 0 && roles.length > 0) ||
    (step === 6); // bio/project optional

  const progress = ((step + 1) / TOTAL) * 100;

  const finish = () => {
    onComplete({
      display_name: displayName.trim() || null,
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
    });
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="mb-6">
        <span className="text-lg font-bold tracking-tight">ThreadNet</span>
      </div>

      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: "var(--mint)" }}
        />
      </div>

      <div key={step} className="flex-1 animate-slide-up">
        {step === 0 && (
          <Step title="Hey 👋 what should we call you?" sub="Pop in a name and a pic so people recognize you in the feed.">
            <div className="flex flex-col items-center">
              <AvatarUpload
                userId={userId}
                value={avatarUrl}
                onChange={setAvatarUrl}
                initials={displayName || "You"}
              />
            </div>
            <div className="mt-6">
              <Label>Your name</Label>
              <TextInput value={displayName} onChange={setDisplayName} placeholder="e.g. Maya Chen" />
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="Where in the world are you?" sub="Helps us surface folks you could grab coffee with.">
            <Label>City or country</Label>
            <TextInput value={location} onChange={setLocation} placeholder="San Francisco, CA" />
          </Step>
        )}

        {step === 2 && (
          <Step title="Where do you study?" sub="Optional — but verifying your school email gets you a ✓ on your profile.">
            <Label>University</Label>
            <TextInput
              value={university}
              onChange={(v) => {
                setUniversity(v);
                setSchoolVerified(false);
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
          </Step>
        )}

        {step === 3 && (
          <Step title="What are you studying?" sub="Pick all that apply — double majors and minors welcome.">
            <ChipGrid options={MAJORS} selected={majors} onToggle={(v) => toggle(majors, v, setMajors)} />
          </Step>
        )}

        {step === 4 && (
          <Step title="What can you bring to a team?" sub="Pick everything you're decent at — humility optional.">
            <ChipGrid options={SKILLS} selected={skills} onToggle={(v) => toggle(skills, v, setSkills)} />
          </Step>
        )}

        {step === 5 && (
          <Step title="What gets you excited?" sub="Pick a few spaces you'd love to build in, and where you fit on a team.">
            <Label>Interests</Label>
            <ChipGrid options={INTERESTS} selected={interests} onToggle={(v) => toggle(interests, v, setInterests)} />
            <div className="mt-6">
              <Label>I'm here as a…</Label>
              <div className="grid gap-3">
                {ROLES.map((r) => (
                  <RoleCard
                    key={r.value}
                    label={r.label}
                    desc={r.desc}
                    active={roles.includes(r.value)}
                    onClick={() => toggle(roles, r.value, setRoles)}
                  />
                ))}
              </div>
            </div>
          </Step>
        )}

        {step === 6 && (
          <Step title="Tell us about you" sub="Find your people. Build something real.">
            <Label>What are you working on?</Label>
            <TextArea
              value={currentProject}
              onChange={setCurrentProject}
              placeholder="A weekend project, a side hustle, a class idea you can't shake…"
            />
            <div className="mt-5">
              <Label>A quick intro (optional)</Label>
              <TextArea
                value={bio}
                onChange={setBio}
                placeholder="Two sentences your future co-founder should read."
              />
            </div>
          </Step>
        )}
      </div>


      <button
        disabled={!canAdvance || saving}
        onClick={() => {
          if (step === TOTAL - 1) finish();
          else setStep(step + 1);
        }}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40"
      >
        {step === TOTAL - 1 ? (saving ? "Saving…" : "Enter ThreadNet") : "Continue"}
        {!saving && <ArrowRight className="h-5 w-5" />}
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
    <div className="mt-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4" style={{ color: "var(--mint)" }} />
        <span className="text-sm font-bold">Verify your school email</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Use a .edu or institutional address to confirm your enrollment.
      </p>
      <div className="mt-3">
        <TextInput value={email} onChange={onEmail} placeholder="you@school.edu" type="email" />
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
          <Label>Enter the 4-digit code we sent</Label>
          <TextInput value={code} onChange={setCode} placeholder="1234" />
          <button
            disabled={code.replace(/\D/g, "").length !== 4}
            onClick={onVerify}
            className="mt-3 h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-40"
          >
            Confirm
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Prototype: any 4-digit code will verify your school email.
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
          <Check className="h-4 w-4" /> School email verified
        </div>
      )}
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

function TextInput({
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

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-none rounded-2xl border-2 bg-card px-4 py-3 text-base font-medium leading-snug outline-none transition-all"
      style={{ borderColor: value ? "var(--mint)" : "var(--border)" }}
    />
  );

function ChipGrid({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
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
            {active && <Check className="mr-1 inline h-3.5 w-3.5" />}
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
        backgroundColor: active ? "color-mix(in oklab, var(--mint) 10%, transparent)" : "var(--card)",
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

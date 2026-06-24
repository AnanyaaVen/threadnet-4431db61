import { useState } from "react";
import { Sparkles, Users, RotateCcw } from "lucide-react";
import { TopBar } from "./TopBar";
import { mockRateIdea, type IdeaRating, type Idea } from "./ideasData";
import type { ProfileData, Screen } from "./types";

export function RateItScreen({
  profile,
  onOpenProfile,
  onPostToDiscover,
  onFindCoFounders,
  history,
  onSaveRating,
}: {
  profile: ProfileData;
  onOpenProfile: () => void;
  onPostToDiscover: (idea: Idea) => void;
  onFindCoFounders: (rating: IdeaRating) => void;
  history: IdeaRating[];
  onSaveRating: (r: IdeaRating) => void;
}) {
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [money, setMoney] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IdeaRating | null>(null);

  const valid = idea.trim().length > 4 && audience.trim().length > 1 && problem.trim().length > 4;

  const submit = async () => {
    if (!valid) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    const r = mockRateIdea({ idea, audience, problem, monetization: money });
    setResult(r);
    onSaveRating(r);
    setBusy(false);
  };

  const reset = () => {
    setResult(null);
    setIdea("");
    setAudience("");
    setProblem("");
    setMoney("");
  };

  if (result) {
    return (
      <RatingResult
        rating={result}
        onReset={reset}
        onPost={() => {
          const i: Idea = {
            id: `posted_${result.id}`,
            title: result.name,
            description: idea.trim(),
            category: result.category,
            skills: ["Founder", "Builder"],
            interested: 1,
          };
          onPostToDiscover(i);
        }}
        onFind={() => onFindCoFounders(result)}
        profile={profile}
        onOpenProfile={onOpenProfile}
        history={history}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <TopBar profile={profile} onOpenProfile={onOpenProfile} title={<span>Rate It</span>} />

      <div className="rounded-3xl bg-card p-5 text-card-foreground shadow-lg">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
          style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}>
          <Sparkles className="h-3 w-3" /> AI Idea Rater
        </div>

        <Field label="What's your idea?">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={3}
            placeholder="Describe your project in a few sentences…"
            className="w-full resize-none rounded-2xl border-2 bg-white px-3 py-2 text-sm font-medium outline-none"
            style={{ borderColor: idea ? "var(--mint)" : "var(--border)", color: "var(--card-foreground)" }}
          />
        </Field>
        <Field label="Who is it for?">
          <Input value={audience} onChange={setAudience} placeholder="e.g. first-year CS students" />
        </Field>
        <Field label="What problem does it solve?">
          <Input value={problem} onChange={setProblem} placeholder="The pain point you're attacking" />
        </Field>
        <Field label="How might it make money? (optional)">
          <Input value={money} onChange={setMoney} placeholder="Subscriptions, marketplace fee, etc." />
        </Field>

        <button
          onClick={submit}
          disabled={!valid || busy}
          className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)", boxShadow: "0 16px 40px -16px rgba(47,174,102,0.55)" }}
        >
          {busy ? "Rating…" : "Rate My Idea ✦"}
        </button>
      </div>

      {history.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
            Your past ratings
          </h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-2xl bg-card p-3 text-card-foreground">
                <div>
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{r.category}</div>
                </div>
                <ScoreBadge score={r.overall} size={40} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RatingResult({
  rating,
  onReset,
  onPost,
  onFind,
  profile,
  onOpenProfile,
  history,
}: {
  rating: IdeaRating;
  onReset: () => void;
  onPost: () => void;
  onFind: () => void;
  profile: ProfileData;
  onOpenProfile: () => void;
  history: IdeaRating[];
}) {
  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <TopBar
        profile={profile}
        onOpenProfile={onOpenProfile}
        title={<span>Rate It</span>}
        right={
          <button
            onClick={onReset}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-card active:scale-95"
            style={{ borderColor: "var(--border)", color: "var(--forest)" }}
            aria-label="New rating"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        }
      />

      <div className="animate-pop-in rounded-3xl bg-card p-5 text-card-foreground shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
              {rating.category}
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{rating.name}</h2>
          </div>
          <ScoreBadge score={rating.overall} size={88} />
        </div>

        <div className="mt-5 space-y-3">
          <Bar label="Originality" value={rating.originality} />
          <Bar label="Market Potential" value={rating.marketPotential} />
          <Bar label="Feasibility" value={rating.feasibility} />
          <Bar label="Student Buildability" value={rating.buildability} />
        </div>

        <p className="mt-5 rounded-2xl p-3 text-sm leading-relaxed" style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}>
          {rating.feedback}
        </p>

        <div className="mt-5 grid gap-3">
          <BulletBox title="✅ Strengths" items={rating.strengths} tint="var(--mint)" />
          <BulletBox title="⚠️ Watch Out For" items={rating.watchOuts} tint="#E2A53A" />
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onPost}
            className="h-12 flex-1 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)" }}
          >
            💡 Post to Discover
          </button>
          <button
            onClick={onFind}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border text-sm font-bold transition-all active:scale-[0.98]"
            style={{ borderColor: "var(--border)", color: "var(--forest)" }}
          >
            <Users className="h-4 w-4" /> Find Co-founders
          </button>
        </div>
      </div>

      {history.length > 1 && (
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
            Previous ratings
          </h2>
          <div className="space-y-2">
            {history.filter((r) => r.id !== rating.id).slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-2xl bg-card p-3 text-card-foreground">
                <div>
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{r.category}</div>
                </div>
                <ScoreBadge score={r.overall} size={40} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function colorFor(value: number) {
  if (value >= 7) return "var(--mint)";
  if (value >= 4) return "#E2A53A";
  return "var(--destructive)";
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, value * 10);
  const color = colorFor(value);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
        <span style={{ color: "var(--card-foreground)" }}>{label}</span>
        <span style={{ color }}>{value}/10</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--secondary)" }}>
        <div className="h-full animate-bar-fill rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ScoreBadge({ score, size }: { score: number; size: number }) {
  const color = colorFor(score);
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, score / 10);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--secondary)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-extrabold leading-none" style={{ color, fontSize: size * 0.34 }}>
          {score}
        </span>
        {size >= 60 && (
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
            /10
          </span>
        )}
      </div>
    </div>
  );
}

function BulletBox({ title, items, tint }: { title: string; items: string[]; tint: string }) {
  return (
    <div className="rounded-2xl p-3" style={{ backgroundColor: `color-mix(in oklab, ${tint} 10%, transparent)` }}>
      <div className="mb-1.5 text-xs font-bold" style={{ color: tint }}>
        {title}
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-xs leading-snug" style={{ color: "var(--card-foreground)" }}>
            • {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border-2 bg-white px-3 py-2.5 text-sm font-medium outline-none transition-all"
      style={{ borderColor: value ? "var(--mint)" : "var(--border)", color: "var(--card-foreground)" }}
    />
  );
}

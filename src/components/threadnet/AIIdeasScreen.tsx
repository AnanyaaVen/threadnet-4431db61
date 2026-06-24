import { useMemo, useState } from "react";
import { Sparkles, Send, Bookmark, RotateCw, Check } from "lucide-react";
import { TopBar } from "./TopBar";
import { mockGenerateIdeas, type Idea } from "./ideasData";
import type { ProfileData } from "./types";

export function AIIdeasScreen({
  profile,
  feedIdeas,
  savedIds,
  onSaveToDiscover,
  onOpenProfile,
}: {
  profile: ProfileData;
  feedIdeas: Idea[];
  savedIds: string[];
  onSaveToDiscover: (idea: Idea) => void;
  onOpenProfile: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState<Idea[]>([]);
  const [busy, setBusy] = useState(false);

  const trending = useMemo(() => feedIdeas.filter((i) => i.aiGenerated).slice(0, 5), [feedIdeas]);
  const forYou = useMemo(() => {
    if (profile.skills.length === 0) return feedIdeas.slice(0, 3);
    return feedIdeas
      .filter((i) => i.skills.some((s) => profile.skills.some((p) => s.toLowerCase().includes(p.toLowerCase()))))
      .slice(0, 4);
  }, [feedIdeas, profile.skills]);
  const justDropped = useMemo(() => feedIdeas.slice(-3).reverse(), [feedIdeas]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setGenerated((g) => [...mockGenerateIdeas(prompt, 3), ...g]);
    setPrompt("");
    setBusy(false);
  };

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-8">
      <TopBar profile={profile} onOpenProfile={onOpenProfile} title={<span>AI Ideas</span>} />

      <div className="rounded-3xl bg-card p-4 text-card-foreground shadow-lg">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
          style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}>
          <Sparkles className="h-3 w-3" /> Idea Generator
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a problem you care about…"
          rows={3}
          className="w-full resize-none rounded-2xl border-2 bg-white px-3 py-2 text-sm font-medium outline-none"
          style={{ borderColor: "var(--border)", color: "var(--card-foreground)" }}
        />
        <button
          onClick={generate}
          disabled={busy || !prompt.trim()}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)" }}
        >
          {busy ? "Generating…" : (<><Send className="h-4 w-4" /> Generate Ideas</>)}
        </button>
      </div>

      {generated.length > 0 && (
        <Section title="✦ Just Generated">
          {generated.map((i) => (
            <AIIdeaCard key={i.id} idea={i} saved={savedIds.includes(i.id)} onSave={() => onSaveToDiscover(i)} onRemix={(remix) => setGenerated((g) => [remix, ...g])} />
          ))}
        </Section>
      )}

      <Section title="Trending This Week">
        {trending.map((i) => (
          <AIIdeaCard key={i.id} idea={i} saved={savedIds.includes(i.id)} onSave={() => onSaveToDiscover(i)} onRemix={(remix) => setGenerated((g) => [remix, ...g])} />
        ))}
      </Section>

      <Section title="Based on Your Skills">
        {forYou.length === 0 ? (
          <EmptyHint>Add skills in your profile to personalise this feed.</EmptyHint>
        ) : (
          forYou.map((i) => (
            <AIIdeaCard key={"fy_" + i.id} idea={i} saved={savedIds.includes(i.id)} onSave={() => onSaveToDiscover(i)} onRemix={(remix) => setGenerated((g) => [remix, ...g])} />
          ))
        )}
      </Section>

      <Section title="Just Dropped">
        {justDropped.map((i) => (
          <AIIdeaCard key={"jd_" + i.id} idea={i} saved={savedIds.includes(i.id)} onSave={() => onSaveToDiscover(i)} onRemix={(remix) => setGenerated((g) => [remix, ...g])} />
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-foreground)" }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed p-4 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
      {children}
    </div>
  );
}

function AIIdeaCard({
  idea,
  saved,
  onSave,
  onRemix,
}: {
  idea: Idea;
  saved: boolean;
  onSave: () => void;
  onRemix: (i: Idea) => void;
}) {
  const [remixOpen, setRemixOpen] = useState(false);
  const [remixText, setRemixText] = useState("");
  const [busy, setBusy] = useState(false);

  const doRemix = async () => {
    if (!remixText.trim()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 500));
    const [variant] = mockGenerateIdeas(`${idea.title}: ${remixText}`, 1);
    onRemix(variant);
    setBusy(false);
    setRemixOpen(false);
    setRemixText("");
  };

  return (
    <article className="rounded-2xl bg-card p-4 text-card-foreground">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: "color-mix(in oklab, var(--mint) 14%, transparent)", color: "var(--mint)" }}
            >
              {idea.category}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
              style={{ backgroundColor: "var(--secondary)", color: "var(--forest)" }}
            >
              <Sparkles className="h-2.5 w-2.5" /> AI Generated
            </span>
          </div>
          <h3 className="mt-2 text-lg font-extrabold leading-tight">{idea.title}</h3>
          <p className="mt-1 text-sm" style={{ color: "color-mix(in oklab, var(--card-foreground) 75%, transparent)" }}>
            {idea.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onSave}
          disabled={saved}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
          style={{
            backgroundColor: saved ? "var(--secondary)" : "var(--mint)",
            color: saved ? "var(--forest)" : "var(--primary-foreground)",
          }}
        >
          {saved ? <><Check className="h-3.5 w-3.5" /> Saved</> : <><Bookmark className="h-3.5 w-3.5" /> Save to Discover</>}
        </button>
        <button
          onClick={() => setRemixOpen((o) => !o)}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border text-xs font-bold transition-all active:scale-[0.98]"
          style={{ borderColor: "var(--border)", color: "var(--forest)" }}
        >
          <RotateCw className="h-3.5 w-3.5" /> Remix
        </button>
      </div>

      {remixOpen && (
        <div className="mt-3 animate-slide-up">
          <input
            value={remixText}
            onChange={(e) => setRemixText(e.target.value)}
            placeholder="How should we vary this?"
            className="w-full rounded-xl border-2 bg-white px-3 py-2 text-sm font-medium outline-none"
            style={{ borderColor: "var(--border)", color: "var(--card-foreground)" }}
          />
          <button
            onClick={doRemix}
            disabled={busy || !remixText.trim()}
            className="mt-2 h-10 w-full rounded-xl text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ backgroundColor: "var(--mint)", color: "var(--primary-foreground)" }}
          >
            {busy ? "Remixing…" : "Remix ↗"}
          </button>
        </div>
      )}
    </article>
  );
}

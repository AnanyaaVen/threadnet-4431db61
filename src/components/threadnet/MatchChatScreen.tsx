import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";

export type MatchPerson = {
  id: string;
  name: string;
  initials: string;
  score: number;
  topTag?: string;
};

type Msg = { id: string; from: "me" | "them"; text: string };

export function MatchChatScreen({
  person,
  onBack,
}: {
  person: MatchPerson;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", from: "them", text: `Hey! We matched 🎉` },
    {
      id: "2",
      from: "them",
      text: person.topTag
        ? `Saw we both vibe with ${person.topTag} — what are you working on?`
        : `What are you building these days?`,
    },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: String(Date.now()), from: "me", text }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          from: "them",
          text: "Love that. Wanna hop on a quick call this week?",
        },
      ]);
    }, 1100);
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b border-border bg-card/95 px-4 pb-3 pt-12 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: "var(--secondary)", color: "var(--forest, #1A3C2E)" }}
        >
          {person.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{person.name}</div>
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs text-muted-foreground">
              {person.score}% match
            </span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "color-mix(in oklab, var(--mint) 18%, transparent)",
                color: "var(--mint)",
              }}
            >
              Match
            </span>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        <div className="mb-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
          You matched · say hi
        </div>
        {messages.map((m) => (
          <Bubble key={m.id} from={m.from}>
            {m.text}
          </Bubble>
        ))}
      </div>

      <div className="border-t border-border bg-card/95 px-3 pb-6 pt-3 backdrop-blur-md">
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-3xl border border-border bg-background px-4 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={send}
            disabled={!draft.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary transition active:scale-90 disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "me" | "them"; children: React.ReactNode }) {
  const isMe = from === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[78%] rounded-3xl px-4 py-2.5 text-[15px] leading-snug"
        style={
          isMe
            ? {
                backgroundColor: "var(--mint, #2FAE66)",
                color: "var(--primary-foreground, #fff)",
                borderBottomRightRadius: 6,
              }
            : {
                backgroundColor: "var(--cream, #F4EFE2)",
                color: "#1A3C2E",
                borderBottomLeftRadius: 6,
              }
        }
      >
        {children}
      </div>
    </div>
  );
}

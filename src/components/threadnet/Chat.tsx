import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import type { Project } from "./data";
import { Avatar } from "./Feed";

type Msg = { id: string; from: "me" | "them"; text: string };

export function Chat({ project, onBack }: { project: Project; onBack: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", from: "them", text: `Yo! Stoked you're into ${project.name} 🙌` },
    { id: "2", from: "them", text: "What pulled you in?" },
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
        { id: String(Date.now() + 1), from: "them", text: "Love it. Want to jump on a 15-min call this week?" },
      ]);
    }, 1100);
  };

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card/95 px-4 pb-3 pt-12 backdrop-blur-md">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full active:scale-90">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar initials={project.initials} size={40} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{project.founder}</div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{project.name}</span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: "color-mix(in oklab, var(--mint) 18%, transparent)", color: "var(--mint)" }}
            >
              Project
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        <div className="mb-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
          Matched today
        </div>
        {messages.map((m) => (
          <Bubble key={m.id} from={m.from}>
            {m.text}
          </Bubble>
        ))}
      </div>

      {/* Input */}
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
            <Send className="h-4.5 w-4.5" style={{ color: "var(--primary-foreground)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "me" | "them"; children: React.ReactNode }) {
  const isMe = from === "me";
  return (
    <div className={`flex animate-slide-up ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[78%] rounded-3xl px-4 py-2.5 text-[15px] leading-snug"
        style={
          isMe
            ? { backgroundColor: "var(--mint)", color: "var(--primary-foreground)", borderBottomRightRadius: 6 }
            : { backgroundColor: "var(--cream)", color: "#1A3C2E", borderBottomLeftRadius: 6 }
        }
      >
        {children}
      </div>
    </div>
  );
}

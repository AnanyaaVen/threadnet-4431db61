import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type MatchPerson = {
  id: string;
  name: string;
  initials: string;
  score: number;
  topTag?: string;
};

type Msg = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
};

export function MatchChatScreen({
  person,
  currentUserId,
  onBack,
}: {
  person: MatchPerson;
  currentUserId: string | null;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history + subscribe to realtime updates between me and `person`
  useEffect(() => {
    if (!currentUserId) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("direct_messages")
        .select("id, sender_id, recipient_id, body, created_at")
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${person.id}),and(sender_id.eq.${person.id},recipient_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        toast.error("Couldn't load messages");
      } else {
        setMessages((data ?? []) as Msg[]);
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel(`dm:${currentUserId}:${person.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
        },
        (payload) => {
          const m = payload.new as Msg;
          const involvesPair =
            (m.sender_id === currentUserId && m.recipient_id === person.id) ||
            (m.sender_id === person.id && m.recipient_id === currentUserId);
          if (!involvesPair) return;
          setMessages((prev) =>
            prev.some((x) => x.id === m.id) ? prev : [...prev, m],
          );
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [currentUserId, person.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text || !currentUserId || sending) return;
    setSending(true);
    setDraft("");
    const { data, error } = await supabase
      .from("direct_messages")
      .insert({
        sender_id: currentUserId,
        recipient_id: person.id,
        body: text,
      })
      .select("id, sender_id, recipient_id, body, created_at")
      .single();
    setSending(false);
    if (error) {
      toast.error(error.message);
      setDraft(text);
      return;
    }
    if (data) {
      setMessages((prev) =>
        prev.some((x) => x.id === data.id) ? prev : [...prev, data as Msg],
      );
    }
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
        {loading && (
          <p className="text-center text-xs text-muted-foreground">Loading…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground">
            No messages yet. Send the first one!
          </p>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} from={m.sender_id === currentUserId ? "me" : "them"}>
            {m.body}
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
            disabled={!draft.trim() || sending}
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

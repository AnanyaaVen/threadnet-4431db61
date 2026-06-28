import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, AlertCircle, Wifi, WifiOff } from "lucide-react";
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [rtStatus, setRtStatus] = useState<"connecting" | "live" | "offline">("connecting");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Guard: must be authenticated, and cannot DM yourself
  const sameUser = currentUserId && currentUserId === person.id;

  useEffect(() => {
    if (!currentUserId || sameUser) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoading(true);
      setLoadError(null);
      // Confirm session is hydrated so RLS + realtime auth use the user's JWT
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        setLoadError("You're signed out. Please sign in again.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("direct_messages")
        .select("id, sender_id, recipient_id, body, created_at")
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${person.id}),and(sender_id.eq.${person.id},recipient_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
        toast.error(`Couldn't load messages: ${error.message}`);
      } else {
        setMessages((data ?? []) as Msg[]);
      }
      setLoading(false);
    })();

    // Two server-side filtered channels — postgres_changes only supports a
    // single equality filter, so we open one for inbound and one for outbound.
    const pairId = [currentUserId, person.id].sort().join(":");

    const inbound = supabase
      .channel(`dm-in:${pairId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `recipient_id=eq.${currentUserId}`,
        },
        (payload) => {
          const m = payload.new as Msg;
          if (m.sender_id !== person.id) return;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRtStatus("live");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED")
          setRtStatus("offline");
      });

    const outbound = supabase
      .channel(`dm-out:${pairId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `sender_id=eq.${currentUserId}`,
        },
        (payload) => {
          const m = payload.new as Msg;
          if (m.recipient_id !== person.id) return;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(inbound);
      supabase.removeChannel(outbound);
    };
  }, [currentUserId, person.id, sameUser]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    if (!currentUserId) {
      setSendError("You're signed out. Please sign in to message.");
      return;
    }
    if (sameUser) {
      setSendError("You can't message yourself.");
      return;
    }
    setSending(true);
    setSendError(null);
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
      setSendError(error.message);
      toast.error(`Message failed: ${error.message}`);
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
        <div
          className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
          style={{
            backgroundColor:
              rtStatus === "live"
                ? "color-mix(in oklab, var(--mint) 18%, transparent)"
                : "var(--secondary)",
            color: rtStatus === "live" ? "var(--mint)" : "var(--muted-foreground)",
          }}
          title={`Realtime: ${rtStatus}`}
        >
          {rtStatus === "offline" ? (
            <WifiOff className="h-3 w-3" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          {rtStatus === "live" ? "Live" : rtStatus === "connecting" ? "…" : "Offline"}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        <div className="mb-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
          You matched · say hi
        </div>

        {sameUser && (
          <ErrorBanner message="You can't message yourself. Open this chat from another account." />
        )}
        {loadError && <ErrorBanner message={loadError} />}
        {loading && !loadError && (
          <p className="text-center text-xs text-muted-foreground">Loading…</p>
        )}
        {!loading && !loadError && messages.length === 0 && !sameUser && (
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
        {sendError && (
          <div className="mb-2">
            <ErrorBanner message={sendError} />
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-3xl border border-border bg-background px-4 py-2.5">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={sameUser ? "Can't message yourself" : "Message…"}
              disabled={!!sameUser}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
          </div>
          <button
            onClick={send}
            disabled={!draft.trim() || sending || !!sameUser || !currentUserId}
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

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-auto flex max-w-[90%] items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span className="leading-snug">{message}</span>
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

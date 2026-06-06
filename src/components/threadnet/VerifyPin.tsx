import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function VerifyPin({
  phone,
  expectedPin,
  onBack,
  onVerified,
  onResend,
}: {
  phone: string;
  expectedPin: string;
  onBack: () => void;
  onVerified: () => void;
  onResend: () => void;
}) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(20);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    setError(null);
    if (clean && i < 3) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) {
      const entered = next.join("");
      setTimeout(() => {
        if (entered === expectedPin) onVerified();
        else {
          setError("That code doesn't match. Try again.");
          setDigits(["", "", "", ""]);
          refs.current[0]?.focus();
        }
      }, 200);
    }
  };

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (text.length === 4) {
      e.preventDefault();
      setDigits(text.split(""));
      if (text === expectedPin) setTimeout(onVerified, 200);
      else setError("That code doesn't match. Try again.");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <button
        onClick={onBack}
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div className="flex-1">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
          <ShieldCheck className="h-6 w-6" style={{ color: "var(--mint)" }} />
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">Enter your code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 4-digit code to <span className="font-semibold text-foreground">{phone}</span>.
        </p>

        {/* Demo hint — prototype only */}
        <div
          className="mt-4 rounded-xl border px-3 py-2 text-xs"
          style={{
            borderColor: "color-mix(in oklab, var(--mint) 40%, transparent)",
            backgroundColor: "color-mix(in oklab, var(--mint) 10%, transparent)",
            color: "var(--mint)",
          }}
        >
          Prototype code: <span className="font-bold tracking-[0.3em]">{expectedPin}</span>
        </div>

        <div className="mt-8 flex justify-between gap-3" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-16 w-full rounded-2xl border-2 bg-card text-center text-2xl font-bold outline-none transition-all"
              style={{
                borderColor: error
                  ? "var(--destructive, #ef4444)"
                  : d
                    ? "var(--mint)"
                    : "var(--border)",
              }}
            />
          ))}
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-400">{error}</p>}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Didn't get it?{" "}
          {cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <button
              onClick={() => {
                onResend();
                setCooldown(20);
                setDigits(["", "", "", ""]);
                setError(null);
              }}
              className="font-semibold underline"
              style={{ color: "var(--mint)" }}
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

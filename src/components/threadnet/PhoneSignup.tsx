import { useState } from "react";
import { ArrowRight, GraduationCap, Phone } from "lucide-react";

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function PhoneSignup({ onSend }: { onSend: (phone: string, pin: string) => void }) {
  const [phone, setPhone] = useState("");
  const digits = phone.replace(/\D/g, "");
  const valid = digits.length === 10;

  const handle = () => {
    if (!valid) return;
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    onSend(phone, pin);
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="mb-10 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
          <GraduationCap className="h-5 w-5" style={{ color: "var(--mint)" }} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Menlo College
          </span>
          <span className="text-lg font-bold tracking-tight">ThreadNet</span>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">What's your number?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll text you a 4-digit code to confirm it's really you.
        </p>

        <div className="mt-8">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Phone number
          </label>
          <div
            className="flex items-center gap-3 rounded-2xl border-2 px-4 py-4 transition-all"
            style={{
              borderColor: valid ? "var(--mint)" : "var(--border)",
              backgroundColor: "var(--card)",
            }}
          >
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span className="text-base font-semibold text-muted-foreground">+1</span>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(555) 123-4567"
              className="flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            By continuing, you agree to receive an SMS. Standard rates may apply.
          </p>
        </div>
      </div>

      <button
        disabled={!valid}
        onClick={handle}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40"
      >
        Send code
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

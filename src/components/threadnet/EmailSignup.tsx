import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";

export function EmailSignup({
  onSubmit,
  busy,
}: {
  onSubmit: (email: string, password: string) => Promise<void> | void;
  busy?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 6;

  const submit = async () => {
    if (!valid) return;
    setErr(null);
    try {
      await onSubmit(email.trim().toLowerCase(), password);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="mb-10">
        <span className="text-2xl font-extrabold tracking-tight">ThreadNet</span>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">Welcome to ThreadNet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with your email — new here? We'll create an account for you.
        </p>

        <div className="mt-8 space-y-4">
          <Field icon={<Mail className="h-5 w-5 text-muted-foreground" />} valid={/\S+@\S+\.\S+/.test(email)}>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/60"
            />
          </Field>
          <Field icon={<Lock className="h-5 w-5 text-muted-foreground" />} valid={password.length >= 6}>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/60"
            />
          </Field>
          {err && <p className="text-sm font-medium text-destructive">{err}</p>}
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our terms. Sign in with the same email next time to restore your profile.
          </p>
        </div>
      </div>

      <button
        disabled={!valid || busy}
        onClick={submit}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40"
      >
        {busy ? "Signing in…" : "Continue"}
        {!busy && <ArrowRight className="h-5 w-5" />}
      </button>
    </div>
  );
}

function Field({
  icon,
  valid,
  children,
}: {
  icon: React.ReactNode;
  valid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border-2 bg-card px-4 py-4 transition-all"
      style={{ borderColor: valid ? "var(--mint)" : "var(--border)" }}
    >
      {icon}
      {children}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Onboarding } from "@/components/threadnet/Onboarding";
import { Feed } from "@/components/threadnet/Feed";
import { ProjectDetail } from "@/components/threadnet/ProjectDetail";
import { MatchScreen } from "@/components/threadnet/MatchScreen";
import { Chat } from "@/components/threadnet/Chat";
import { BottomNav } from "@/components/threadnet/BottomNav";
import { PhoneSignup } from "@/components/threadnet/PhoneSignup";
import { VerifyPin } from "@/components/threadnet/VerifyPin";
import { EditProfile } from "@/components/threadnet/EditProfile";
import { MatchesScreen } from "@/components/threadnet/MatchesScreen";
import { PROJECTS, type Project } from "@/components/threadnet/data";
import { EMPTY_PROFILE, type ProfileData, type Screen } from "@/components/threadnet/types";
import { Avatar } from "@/components/threadnet/Feed";
import { LogOut, Settings } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreadNet — Find your people. Build something real." },
      { name: "description", content: "ThreadNet helps Menlo College students find co-founders and project collaborators." },
    ],
  }),
  component: App,
});

const phoneDigits = (p: string) => p.replace(/\D/g, "");
const syntheticEmail = (digits: string) => `${digits}@phone.threadnet.app`;
const syntheticPassword = (digits: string) => `tn-${digits}-prototype-secret`;

function App() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [authBusy, setAuthBusy] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Boot + auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setProfile(EMPTY_PROFILE);
        setScreen("signup");
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      if (!uid) setBootstrapping(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load profile when signed in
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, majors, skills, interests, roles, onboarded")
        .eq("id", userId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        toast.error("Couldn't load your profile.");
        setBootstrapping(false);
        return;
      }
      const p: ProfileData = data
        ? {
            display_name: data.display_name,
            majors: data.majors ?? [],
            skills: data.skills ?? [],
            interests: data.interests ?? [],
            roles: data.roles ?? [],
            onboarded: data.onboarded,
          }
        : EMPTY_PROFILE;
      setProfile(p);
      setScreen(p.onboarded ? "feed" : "onboarding");
      setBootstrapping(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const showNav = ["feed", "matches", "match", "chat", "profile"].includes(screen);

  const sendPin = (p: string, code: string) => {
    setPhone(p);
    setPin(code);
    setScreen("verify");
  };

  const handleVerified = async () => {
    const digits = phoneDigits(phone);
    if (digits.length !== 10) return;
    setAuthBusy(true);
    const email = syntheticEmail(digits);
    const password = syntheticPassword(digits);
    // Try sign in first (returning user)
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error) {
      // New user — sign up
      const signUp = await supabase.auth.signUp({
        email,
        password,
        options: { data: { phone: digits } },
      });
      if (signUp.error) {
        toast.error(signUp.error.message);
        setAuthBusy(false);
        setScreen("signup");
        return;
      }
    }
    setAuthBusy(false);
    // onAuthStateChange will load profile and route
  };

  const saveProfile = async (
    patch: Partial<Pick<ProfileData, "display_name" | "majors" | "skills" | "interests" | "roles">>,
    markOnboarded = false,
  ) => {
    if (!userId) return;
    const next: ProfileData = {
      ...profile,
      ...patch,
      onboarded: markOnboarded || profile.onboarded,
    };
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: next.display_name,
        majors: next.majors,
        skills: next.skills,
        interests: next.interests,
        roles: next.roles,
        onboarded: next.onboarded,
      })
      .eq("id", userId);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProfile(next);
    toast.success(markOnboarded ? "Welcome to ThreadNet" : "Profile saved");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (bootstrapping && userId) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-background text-foreground">
      {screen === "signup" && <PhoneSignup onSend={sendPin} />}

      {screen === "verify" && (
        <VerifyPin
          phone={phone}
          expectedPin={pin}
          onBack={() => setScreen("signup")}
          onVerified={handleVerified}
          onResend={() => setPin(Math.floor(1000 + Math.random() * 9000).toString())}
        />
      )}

      {screen === "onboarding" && (
        <Onboarding
          initial={profile}
          saving={authBusy}
          onComplete={async (data) => {
            setAuthBusy(true);
            await saveProfile(data, true);
            setAuthBusy(false);
            setScreen("feed");
          }}
        />
      )}

      {screen === "feed" && (
        <Feed
          onMatch={(p) => {
            setActiveProject(p);
            setScreen("match");
          }}
          onOpenDetail={(p) => {
            setActiveProject(p);
            setScreen("detail");
          }}
        />
      )}

      {screen === "detail" && (
        <ProjectDetail
          project={activeProject}
          onBack={() => setScreen("feed")}
          onInterested={() => setScreen("match")}
        />
      )}

      {screen === "match" && (
        <MatchScreen project={activeProject} onChat={() => setScreen("chat")} onKeepSwiping={() => setScreen("feed")} />
      )}

      {screen === "matches" && <MatchesScreen me={profile} currentUserId={userId} />}

      {screen === "chat" && <Chat project={activeProject} onBack={() => setScreen("feed")} />}

      {screen === "profile" && (
        <Profile profile={profile} onEdit={() => setScreen("edit")} onSignOut={signOut} />
      )}

      {screen === "edit" && (
        <EditProfile
          initial={profile}
          saving={authBusy}
          onBack={() => setScreen("profile")}
          onSave={async (data) => {
            setAuthBusy(true);
            await saveProfile(data);
            setAuthBusy(false);
            setScreen("profile");
          }}
        />
      )}

      {showNav && <BottomNav active={screen} onNavigate={(s) => setScreen(s)} />}
    </div>
  );
}

function Profile({
  profile,
  onEdit,
  onSignOut,
}: {
  profile: ProfileData;
  onEdit: () => void;
  onSignOut: () => void;
}) {
  const initials = (profile.display_name || "You")
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  const roleLabel = profile.roles.length
    ? profile.roles.map((r) => (r === "founder" ? "Founder" : "Joiner")).join(" · ")
    : "Set your role";

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-28 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Profile</h1>
        <div className="flex gap-2">
          <button
            onClick={onSignOut}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:scale-95"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:scale-95"
            aria-label="Edit profile"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <Avatar initials={initials} size={96} />
        <h2 className="mt-4 text-xl font-bold">{profile.display_name || "You"}</h2>
        <p className="text-sm text-muted-foreground">Menlo College · {roleLabel}</p>
      </div>

      <div className="mt-8 space-y-5">
        <Field label="Majors">
          {profile.majors.length ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.majors.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          )}
        </Field>
        <Field label="Skills">
          {profile.skills.length ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{
                    borderColor: "color-mix(in oklab, var(--mint) 40%, transparent)",
                    color: "var(--mint)",
                    backgroundColor: "color-mix(in oklab, var(--mint) 10%, transparent)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          )}
        </Field>
        <Field label="Interests">
          {profile.interests.length ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          )}
        </Field>
      </div>

      <p className="mt-auto pt-10 text-center text-xs italic text-muted-foreground">
        Find your people. Build something real.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

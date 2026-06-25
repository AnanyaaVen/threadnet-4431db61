import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Onboarding } from "@/components/threadnet/Onboarding";
import { EmailSignup } from "@/components/threadnet/EmailSignup";
import { EditProfile } from "@/components/threadnet/EditProfile";
import { BottomNav } from "@/components/threadnet/BottomNav";
import { DiscoverScreen } from "@/components/threadnet/DiscoverScreen";
import { ChatScreen } from "@/components/threadnet/ChatScreen";
import { GroupsScreen } from "@/components/threadnet/GroupsScreen";
import { AIIdeasScreen } from "@/components/threadnet/AIIdeasScreen";
import { RateItScreen } from "@/components/threadnet/RateItScreen";
import { ProfileScreen } from "@/components/threadnet/ProfileScreen";
import { SEED_IDEAS, SEED_GROUPS, type Idea, type IdeaGroup, type IdeaRating } from "@/components/threadnet/ideasData";
import { EMPTY_PROFILE, type ProfileData, type Screen } from "@/components/threadnet/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThreadNet — Find your people. Build something real." },
      { name: "description", content: "ThreadNet helps students discover project ideas, find co-founders, and get instant AI feedback." },
    ],
  }),
  component: App,
});

function App() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [authBusy, setAuthBusy] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  // Local-only idea state for the prototype
  const [ideas, setIdeas] = useState<Idea[]>(SEED_IDEAS);
  const [groups] = useState<IdeaGroup[]>(SEED_GROUPS);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [ratings, setRatings] = useState<IdeaRating[]>([]);

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

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "display_name, avatar_url, location, university, school_email, school_email_verified, majors, skills, interests, roles, onboarded",
        )
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
            avatar_url: data.avatar_url,
            location: data.location,
            university: data.university,
            school_email: data.school_email,
            school_email_verified: data.school_email_verified ?? false,
            majors: data.majors ?? [],
            skills: data.skills ?? [],
            interests: data.interests ?? [],
            roles: data.roles ?? [],
            onboarded: data.onboarded,
          }
        : EMPTY_PROFILE;
      setProfile(p);
      setScreen(p.onboarded ? "discover" : "onboarding");
      setBootstrapping(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleEmailAuth = async (email: string, password: string) => {
    setAuthBusy(true);
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error) {
      const signUp = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (signUp.error) {
        setAuthBusy(false);
        throw new Error(signUp.error.message);
      }
    }
    setAuthBusy(false);
  };

  const saveProfile = async (patch: Partial<ProfileData>, markOnboarded = false) => {
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
        avatar_url: next.avatar_url,
        location: next.location,
        university: next.university,
        school_email: next.school_email,
        school_email_verified: next.school_email_verified,
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

  const onSaveIdea = (idea: Idea) => {
    setSavedIds((arr) => (arr.includes(idea.id) ? arr : [...arr, idea.id]));
    setIdeas((all) => all.map((i) => (i.id === idea.id ? { ...i, interested: i.interested + 1 } : i)));
    toast.success(`Joined "${idea.title}" waitlist`);
  };

  const onToggleJoinGroup = (groupId: string) => {
    setJoinedGroupIds((arr) => (arr.includes(groupId) ? arr.filter((x) => x !== groupId) : [...arr, groupId]));
  };

  const onSaveToDiscover = (idea: Idea) => {
    setIdeas((all) => (all.some((i) => i.id === idea.id) ? all : [idea, ...all]));
    setSavedIds((arr) => (arr.includes(idea.id) ? arr : [...arr, idea.id]));
    toast.success("Added to Discover");
  };

  const onPostRatedToDiscover = (idea: Idea) => {
    setIdeas((all) => [idea, ...all]);
    toast.success("Posted to Discover");
    setScreen("discover");
  };

  const onFindCoFounders = (rating: IdeaRating) => {
    const match = groups.find((g) =>
      g.name.toLowerCase().includes(rating.category.toLowerCase().split(" ")[0]),
    );
    if (match) {
      setJoinedGroupIds((arr) => (arr.includes(match.id) ? arr : [...arr, match.id]));
    }
    setScreen("groups");
  };

  const savedIdeas = useMemo(() => ideas.filter((i) => savedIds.includes(i.id)), [ideas, savedIds]);
  const joinedGroups = useMemo(() => groups.filter((g) => joinedGroupIds.includes(g.id)), [groups, joinedGroupIds]);

  const showNav = ["discover", "groups", "group", "ai", "rate"].includes(screen);
  const openProfile = () => setScreen("profile");

  if (bootstrapping && userId) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[430px] items-center justify-center bg-background" style={{ color: "var(--muted-foreground)" }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-background text-foreground">
      {screen === "signup" && <EmailSignup onSubmit={handleEmailAuth} busy={authBusy} />}

      {screen === "onboarding" && (
        <Onboarding
          userId={userId}
          initial={profile}
          saving={authBusy}
          onComplete={async (data) => {
            setAuthBusy(true);
            await saveProfile(data, true);
            setAuthBusy(false);
            setScreen("discover");
          }}
        />
      )}

      {screen === "discover" && (
        <DiscoverScreen
          ideas={ideas}
          groups={groups}
          savedIds={savedIds}
          onSave={onSaveIdea}
          profile={profile}
          onOpenProfile={openProfile}
        />
      )}

      {(screen === "groups" || screen === "group") && (
        <GroupsScreen
          ideas={ideas}
          groups={groups}
          joinedGroupIds={joinedGroupIds}
          savedIds={savedIds}
          onToggleJoin={onToggleJoinGroup}
          onSave={onSaveIdea}
          profile={profile}
          onOpenProfile={openProfile}
        />
      )}

      {screen === "ai" && (
        <AIIdeasScreen
          profile={profile}
          feedIdeas={ideas}
          savedIds={savedIds}
          onSaveToDiscover={onSaveToDiscover}
          onOpenProfile={openProfile}
        />
      )}

      {screen === "rate" && (
        <RateItScreen
          profile={profile}
          onOpenProfile={openProfile}
          onPostToDiscover={onPostRatedToDiscover}
          onFindCoFounders={onFindCoFounders}
          history={ratings}
          onSaveRating={(r) => setRatings((arr) => [r, ...arr])}
        />
      )}

      {screen === "profile" && (
        <ProfileScreen
          profile={profile}
          onBack={() => setScreen("discover")}
          onEdit={() => setScreen("edit")}
          onSignOut={signOut}
          savedIdeas={savedIdeas}
          joinedGroups={joinedGroups}
          ratings={ratings}
        />
      )}

      {screen === "edit" && (
        <EditProfile
          userId={userId}
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

export type Screen =
  | "signup"
  | "onboarding"
  | "discover"
  | "groups"
  | "group"
  | "ai"
  | "rate"
  | "profile"
  | "edit"
  | "chat"
  | "matches"
  | "matchChat";

export type ProfileData = {
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  university: string | null;
  school_email: string | null;
  school_email_verified: boolean;
  bio: string | null;
  current_project: string | null;
  majors: string[];
  skills: string[];
  interests: string[];
  roles: string[];
  created_at: string | null;
  onboarded: boolean;
};

export const EMPTY_PROFILE: ProfileData = {
  display_name: null,
  avatar_url: null,
  location: null,
  university: null,
  school_email: null,
  school_email_verified: false,
  bio: null,
  current_project: null,
  majors: [],
  skills: [],
  interests: [],
  roles: [],
  created_at: null,
  onboarded: false,
};

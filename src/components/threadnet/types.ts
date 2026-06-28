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
  majors: string[];
  skills: string[];
  interests: string[];
  roles: string[];
  onboarded: boolean;
};

export const EMPTY_PROFILE: ProfileData = {
  display_name: null,
  avatar_url: null,
  location: null,
  university: null,
  school_email: null,
  school_email_verified: false,
  majors: [],
  skills: [],
  interests: [],
  roles: [],
  onboarded: false,
};

export type Screen =
  | "signup"
  | "verify"
  | "onboarding"
  | "feed"
  | "detail"
  | "match"
  | "matches"
  | "chat"
  | "profile"
  | "edit";

export type ProfileData = {
  display_name: string | null;
  majors: string[];
  skills: string[];
  interests: string[];
  roles: string[];
  onboarded: boolean;
};

export const EMPTY_PROFILE: ProfileData = {
  display_name: null,
  majors: [],
  skills: [],
  interests: [],
  roles: [],
  onboarded: false,
};

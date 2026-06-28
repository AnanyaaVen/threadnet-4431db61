export type IdeaCategory =
  | "App"
  | "Hardware"
  | "Social Impact"
  | "Fintech"
  | "EdTech"
  | "Health Tech"
  | "Marketplace"
  | "AI";

export type Idea = {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  skills: string[];
  interested: number;
  aiGenerated?: boolean;
  groupId?: string;
  founderName: string;
  founderUniversity?: string;
  founderInitials: string;
  createdAt: number;
};

export type IdeaGroup = {
  id: string;
  name: string;
  emoji: string;
  students: number;
  ideaIds: string[];
};

const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

export const SEED_IDEAS: Idea[] = [
  {
    id: "i1",
    title: "AI Study Buddy",
    description: "An AI tutor that adapts to your learning style in real time.",
    category: "EdTech",
    skills: ["ML Engineer", "React Dev"],
    interested: 42,
    aiGenerated: true,
    groupId: "g_ai",
    founderName: "Maya Chen",
    founderUniversity: "Stanford University",
    founderInitials: "MC",
    createdAt: Date.now() - 2 * HOUR,
  },
  {
    id: "i2",
    title: "Campus Food Rescue",
    description: "Connects dining halls with students to redistribute surplus food before it's thrown out.",
    category: "Social Impact",
    skills: ["Backend Dev", "Operations"],
    interested: 27,
    groupId: "g_social",
    founderName: "Jordan Patel",
    founderUniversity: "UC Berkeley",
    founderInitials: "JP",
    createdAt: Date.now() - 6 * HOUR,
  },
  {
    id: "i3",
    title: "Peer Pitch Deck Review",
    description: "Students swap pitch decks and give structured feedback within 24 hours.",
    category: "Fintech",
    skills: ["UI Designer", "Product"],
    interested: 18,
    groupId: "g_market",
    founderName: "Sofia Alvarez",
    founderUniversity: "NYU Stern",
    founderInitials: "SA",
    createdAt: Date.now() - 1 * DAY,
  },
  {
    id: "i4",
    title: "Mental Health Check-in Bot",
    description: "Daily mood tracker with anonymous peer support threads moderated by an AI safety layer.",
    category: "Health Tech",
    skills: ["Full-stack", "Counsellor"],
    interested: 35,
    aiGenerated: true,
    groupId: "g_ai",
    founderName: "Riya Kapoor",
    founderUniversity: "UCLA",
    founderInitials: "RK",
    createdAt: Date.now() - 3 * DAY,
  },
  {
    id: "i5",
    title: "Local Gig Board",
    description: "A hyperlocal freelance marketplace for uni students — dog walks to design gigs.",
    category: "Marketplace",
    skills: ["React Dev", "Marketing"],
    interested: 21,
    groupId: "g_market",
    founderName: "Devon Brooks",
    founderUniversity: "Menlo College",
    founderInitials: "DB",
    createdAt: Date.now() - 5 * DAY,
  },
  {
    id: "i6",
    title: "DormHack Energy",
    description: "Plug-in sensor that scores your dorm's energy use and gamifies a weekly leaderboard.",
    category: "Hardware",
    skills: ["EE", "Firmware", "Designer"],
    interested: 12,
    groupId: "g_social",
    founderName: "Aisha Rahman",
    founderUniversity: "MIT",
    founderInitials: "AR",
    createdAt: Date.now() - 8 * DAY,
  },
  {
    id: "i7",
    title: "Note Resell",
    description: "A trusted marketplace for verified, professor-approved class notes between students.",
    category: "EdTech",
    skills: ["Backend Dev", "Growth"],
    interested: 9,
    groupId: "g_edu",
    founderName: "Liam O'Connor",
    founderUniversity: "USC",
    founderInitials: "LO",
    createdAt: Date.now() - 14 * DAY,
  },
];

export const SEED_GROUPS: IdeaGroup[] = [
  { id: "g_ai", name: "AI & Automation", emoji: "🤖", students: 32, ideaIds: ["i1", "i4"] },
  { id: "g_social", name: "Social Impact", emoji: "🌱", students: 21, ideaIds: ["i2", "i6"] },
  { id: "g_market", name: "Marketplace & Fintech", emoji: "💸", students: 18, ideaIds: ["i3", "i5"] },
  { id: "g_edu", name: "EdTech", emoji: "🎓", students: 15, ideaIds: ["i1", "i7"] },
  { id: "g_health", name: "Health Tech", emoji: "🏥", students: 24, ideaIds: ["i4"] },
];

// ---- Mock AI ----------------------------------------------------------------

const TITLE_BANK = [
  "Quiet Hours",
  "Syllabus Genie",
  "FlatmateFlow",
  "PitchPilot",
  "Lecture Loop",
  "Campus Carbon",
  "ResumeRoast",
  "StudyStreaks",
  "OfficeHours.live",
  "GrantHunter",
];
const TAGS: IdeaCategory[] = ["App", "EdTech", "AI", "Social Impact", "Fintech", "Health Tech", "Marketplace"];
const SKILL_BANK = ["React Dev", "ML Engineer", "UI Designer", "Backend Dev", "Growth", "iOS Dev", "Product", "Marketing"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

export function mockGenerateIdeas(prompt: string, count = 3): Idea[] {
  const seed = prompt.trim().slice(0, 40) || "students";
  return Array.from({ length: count }, (_, i) => {
    const title = `${pick(TITLE_BANK)}`;
    return {
      id: `ai_${Date.now()}_${i}`,
      title,
      description: `An AI-imagined project tackling "${seed}". ${pick([
        "Lightweight, mobile-first, built for a single dorm to start.",
        "Uses simple weekly nudges and a tiny social graph.",
        "Pairs a hardware prototype with a clean React companion app.",
        "Focuses on the first 100 power users on one campus.",
      ])}`,
      category: pick(TAGS),
      skills: sample(SKILL_BANK, 2 + Math.floor(Math.random() * 2)),
      interested: Math.floor(Math.random() * 30) + 3,
      aiGenerated: true,
      founderName: "ThreadNet AI",
      founderInitials: "AI",
      createdAt: Date.now(),
    };
  });
}


export type IdeaRating = {
  id: string;
  name: string;
  overall: number;
  originality: number;
  marketPotential: number;
  feasibility: number;
  buildability: number;
  feedback: string;
  strengths: string[];
  watchOuts: string[];
  category: IdeaCategory;
  createdAt: number;
};

export function mockRateIdea(input: {
  idea: string;
  audience: string;
  problem: string;
  monetization?: string;
}): IdeaRating {
  // Deterministic-ish scoring from input length, so the user feels causality.
  const base = Math.min(10, Math.max(3, Math.round((input.idea.length + input.problem.length) / 40)));
  const jitter = () => Math.max(2, Math.min(10, base + Math.floor(Math.random() * 5) - 2));
  const originality = jitter();
  const marketPotential = jitter();
  const feasibility = jitter();
  const buildability = jitter();
  const overall = Math.round((originality + marketPotential + feasibility + buildability) / 4);

  const titleWords = input.idea.split(/\s+/).filter(Boolean).slice(0, 4).join(" ");
  const name = titleWords ? titleWords.replace(/[.,!?]/g, "") : "Untitled Idea";

  const category: IdeaCategory = /learn|study|class|tutor/i.test(input.idea)
    ? "EdTech"
    : /health|mood|mental|wellness/i.test(input.idea)
      ? "Health Tech"
      : /money|pay|finance|invest/i.test(input.idea)
        ? "Fintech"
        : /community|help|impact|climate/i.test(input.idea)
          ? "Social Impact"
          : "App";

  return {
    id: `rate_${Date.now()}`,
    name,
    overall,
    originality,
    marketPotential,
    feasibility,
    buildability,
    category,
    createdAt: Date.now(),
    feedback: `Your idea targets ${input.audience || "a clear audience"} and addresses ${
      input.problem || "a real pain point"
    }. The concept is ${overall >= 7 ? "promising" : overall >= 4 ? "interesting but unproven" : "early"}, and a student team could likely ship a v1 in a single semester. Sharpen your wedge before broadening.`,
    strengths: [
      `Clear problem framing around ${input.problem ? "the stated pain point" : "user need"}.`,
      `Reasonable scope for a ${buildability >= 6 ? "student" : "small"} team.`,
      input.monetization ? `Plausible revenue path via ${input.monetization}.` : `Concept fits a tight initial audience.`,
    ],
    watchOuts: [
      `Validate that ${input.audience || "users"} will actually switch from current habits.`,
      originality < 6 ? `Several similar tools exist — find your unfair angle.` : `Concept is novel — watch for cold-start adoption.`,
      feasibility < 6 ? `Tech stack risk: prototype the hardest part first.` : `Don't over-build; ship the smallest useful slice.`,
    ],
  };
}

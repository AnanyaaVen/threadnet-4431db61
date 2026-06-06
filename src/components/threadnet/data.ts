export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  roles: string[];
  founder: string;
  bio: string;
  emoji: string;
  gradient: string;
  initials: string;
};

export const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Loop",
    tagline: "A campus marketplace where students trade textbooks in under 60 seconds.",
    description:
      "Loop is a hyperlocal, student-only marketplace built around speed. List in one tap, match with a buyer on your floor, swap during class break. We're piloting at Menlo this fall.",
    roles: ["iOS Dev", "Designer", "Growth"],
    founder: "Maya Chen",
    bio: "Junior, CS major. Built two side projects last year. Loves shipping fast and lo-fi prototypes.",
    emoji: "🔁",
    gradient: "from-emerald-500/30 to-teal-400/10",
    initials: "MC",
  },
  {
    id: "2",
    name: "Quietly",
    tagline: "Anonymous mental health check-ins for college dorms.",
    description:
      "A weekly 30-second pulse for your floor. Anonymous, opt-in, and RAs see aggregate trends only. Looking for co-founders who care about student wellbeing.",
    roles: ["Full-stack Dev", "Researcher"],
    founder: "Andre Park",
    bio: "Senior, Psych + Business. Former RA. Spent a summer at a mental health nonprofit.",
    emoji: "🌿",
    gradient: "from-lime-400/30 to-emerald-300/10",
    initials: "AP",
  },
  {
    id: "3",
    name: "Pitchdeck.fm",
    tagline: "Podcast where Menlo founders cold-pitch real VCs, live.",
    description:
      "We record weekly. Five-minute pitch, ten-minute roast, real feedback. Need a producer + editor + someone obsessed with founder stories.",
    roles: ["Producer", "Editor", "Marketing"],
    founder: "Riya Shah",
    bio: "Sophomore, Marketing. Ran her high school's podcast. Has cold-emailed 40 VCs this month.",
    emoji: "🎙️",
    gradient: "from-teal-400/30 to-emerald-500/10",
    initials: "RS",
  },
  {
    id: "4",
    name: "Pocket Tutor",
    tagline: "AI study partner trained on your actual class syllabus.",
    description:
      "Upload your syllabus + notes, get a tutor that knows exactly what's on the midterm. Looking for an ML-curious dev and a designer who cares about education.",
    roles: ["ML Dev", "Designer"],
    founder: "Jordan Lee",
    bio: "Junior, Data Science. TA for two classes. Already has a working prototype.",
    emoji: "📚",
    gradient: "from-emerald-400/30 to-green-300/10",
    initials: "JL",
  },
];

// Human-readable relative time helpers.
const UNITS: Array<{ s: number; one: string; many: string }> = [
  { s: 60, one: "second", many: "seconds" },
  { s: 60 * 60, one: "minute", many: "minutes" },
  { s: 60 * 60 * 24, one: "hour", many: "hours" },
  { s: 60 * 60 * 24 * 7, one: "day", many: "days" },
  { s: 60 * 60 * 24 * 30, one: "week", many: "weeks" },
  { s: 60 * 60 * 24 * 365, one: "month", many: "months" },
  { s: Infinity, one: "year", many: "years" },
];

export function relativeTime(input: number | string | Date): string {
  const t = typeof input === "number" ? input : new Date(input).getTime();
  const diff = Math.max(0, (Date.now() - t) / 1000);
  if (diff < 5) return "just now";
  let prev = 1;
  for (const u of UNITS) {
    if (diff < u.s) {
      const n = Math.floor(diff / prev);
      return `${n} ${n === 1 ? u.one : u.many} ago`;
    }
    prev = u.s;
  }
  return "a long time ago";
}

export function postedAgo(input: number | string | Date): string {
  return `Posted ${relativeTime(input)}`;
}

export function joinedAgo(input: number | string | Date): string {
  return `Joined ${relativeTime(input)}`;
}

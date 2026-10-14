export const TIER_IDS = ["platinum", "gold", "silver", "bronze", "borked"] as const;

export type TierId = (typeof TIER_IDS)[number];

export interface Tier {
  id: TierId;
  label: string;
  summary: string;
  /** Classes for the tier badge. */
  badge: string;
  /** Background class for the tier dot and distribution bar. */
  swatch: string;
  /** Gradient used for the card placeholder when an app has no image. */
  placeholder: string;
}

export const TIERS: Record<TierId, Tier> = {
  platinum: {
    id: "platinum",
    label: "Platinum",
    summary: "Runs perfectly out of the box.",
    badge: "bg-sky-100 text-sky-900 ring-sky-300 dark:bg-sky-300/15 dark:text-sky-100 dark:ring-sky-300/30",
    swatch: "bg-sky-300",
    placeholder: "from-sky-300/40 via-slate-200/20 to-transparent dark:from-sky-300/25 dark:via-slate-400/10",
  },
  gold: {
    id: "gold",
    label: "Gold",
    summary: "Runs perfectly after some tweaks.",
    badge: "bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30",
    swatch: "bg-amber-400",
    placeholder: "from-amber-300/40 via-yellow-200/20 to-transparent dark:from-amber-400/25 dark:via-yellow-500/10",
  },
  silver: {
    id: "silver",
    label: "Silver",
    summary: "Runs with minor issues that don't block normal use.",
    badge: "bg-zinc-200 text-zinc-800 ring-zinc-300 dark:bg-zinc-300/15 dark:text-zinc-200 dark:ring-zinc-300/30",
    swatch: "bg-zinc-400",
    placeholder: "from-zinc-300/50 via-zinc-200/20 to-transparent dark:from-zinc-300/20 dark:via-zinc-500/10",
  },
  bronze: {
    id: "bronze",
    label: "Bronze",
    summary: "Starts, but has issues that get in the way of normal use.",
    badge: "bg-orange-100 text-orange-900 ring-orange-300 dark:bg-orange-500/15 dark:text-orange-200 dark:ring-orange-500/30",
    swatch: "bg-orange-600",
    placeholder: "from-orange-400/40 via-orange-200/20 to-transparent dark:from-orange-600/25 dark:via-orange-700/10",
  },
  borked: {
    id: "borked",
    label: "Borked",
    summary: "Doesn't start, or crashes before it's usable.",
    badge: "bg-red-100 text-red-900 ring-red-300 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-500/30",
    swatch: "bg-red-500",
    placeholder: "from-red-400/40 via-rose-200/20 to-transparent dark:from-red-500/25 dark:via-rose-700/10",
  },
};

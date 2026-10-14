import type { TierId } from "@/lib/tiers";

export interface App {
  id: string;
  name: string;
  description: string;
  image?: string;
  tier: TierId;
  /** Numeric id from the app's Steam store URL. */
  steamAppId?: number;
  website?: string;
}

export interface AppLink {
  label: string;
  href: string;
}

/** External links for an app: its Steam store page and website, when set. */
export function appLinks(app: App): AppLink[] {
  const links: AppLink[] = [];
  if (app.steamAppId) links.push({ label: "Steam", href: `https://store.steampowered.com/app/${app.steamAppId}/` });
  if (app.website) links.push({ label: "Website", href: app.website });
  return links;
}

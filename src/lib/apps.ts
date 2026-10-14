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

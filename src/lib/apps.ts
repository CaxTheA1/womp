import type { TierId } from "@/lib/tiers";

export interface App {
  id: string;
  name: string;
  description: string;
  image?: string;
  tier: TierId;
}

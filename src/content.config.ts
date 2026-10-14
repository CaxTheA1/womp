import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { TIER_IDS } from "@/lib/tiers";

const apps = defineCollection({
  loader: file("src/data/apps.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tier: z.enum(TIER_IDS),
  }),
});

export const collections = { apps };

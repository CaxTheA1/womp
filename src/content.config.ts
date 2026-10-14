import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
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

/** One page per app, named after the app's id. */
const wiki = defineCollection({
  loader: glob({ pattern: "*.mdx", base: "src/content/wiki" }),
  schema: z.object({
    developer: z.string().optional(),
    builtWith: z.string().optional(),
  }),
});

export const collections = { apps, wiki };

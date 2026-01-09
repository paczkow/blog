import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { Essay } from "@/models.ts";

const essays = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/essays" }),
  schema: ({ image }) =>
    Essay.extend({
      image: image().or(z.string()).optional(),
    }),
});

export const collections = { essays };

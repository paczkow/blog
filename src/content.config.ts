import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { Essay, Note } from "@/models.ts";

const essays = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/essays" }),
  schema: ({ image }) =>
    Essay.extend({
      image: image().or(z.string()).optional(),
    }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/notes" }),
  schema: Note,
});

export const collections = { essays, notes };

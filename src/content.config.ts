import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { Article } from "@/models.ts";

const writing = defineCollection({
  loader: glob({ pattern: "{en,pl}/**/*.{md,mdx}", base: "content" }),
  schema: ({ image }) =>
    Article.extend({
      image: image().or(z.string()).optional(),
    }),
});

export const collections = { writing };

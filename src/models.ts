import { z } from "astro/zod";

export const Essay = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  topics: z.array(z.string()),
  toc: z.boolean().default(true),
});
export type Essay = z.infer<typeof Essay> & { id: string; type: "essay", readTime: number };

export const Note = z.object({
  title: z.string(),
  date: z.coerce.date(),
  status: z.enum(["spark", "synthesize", "evergreen"]),
  topics: z.array(z.string()),
  toc: z.boolean().default(false),
});
export type Note = z.infer<typeof Note> & { id: string; type: "note" };

export type Post = Essay | Note;
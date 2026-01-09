import { z } from "astro/zod";

export const Essay = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  toc: z.boolean().default(true),
});
export type Essay = z.infer<typeof Essay> & { id: string; type: "essay"; readTime: number };

export type Post = Essay;
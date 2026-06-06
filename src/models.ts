import { z } from "astro/zod";

import type { Lang } from "@/i18n/config.ts";

export { defaultLang, languages } from "@/i18n/config.ts";
export type { Lang } from "@/i18n/config.ts";

export const Article = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  toc: z.boolean().default(true),
  translationKey: z.string().optional(),
});

export type Article = z.infer<typeof Article> & {
  id: string;
  lang: Lang;
  slug: string;
  url: string;
  type: "article";
  readTime: number;
};

export type Post = Article;

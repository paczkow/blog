import type { CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { activeLangs } from "@/i18n/config.ts";
import { isLang } from "@/i18n/utils.ts";
import type { Lang, Post } from "@/models.ts";
import { defaultLang } from "@/models.ts";

export const DEFAULT_LANG: Lang = defaultLang;

export const getSortedByDate = <T extends { date: Date }>(
  posts: T[],
  compareFn: (a: T, b: T) => number = (a: T, b: T) => {
    return b.date.getTime() - a.date.getTime();
  },
) => posts.toSorted(compareFn);

export const getLangAndSlug = (id: string): { lang: Lang; slug: string } => {
  const [lang, ...slugParts] = id.split("/");

  if (!lang || !isLang(lang) || slugParts.length === 0) {
    throw new Error(`Invalid writing entry id: ${id}`);
  }

  return {
    lang,
    slug: slugParts.join("/").replace(/\/index$/, ""),
  };
};

export const getWritingIndexUrl = (lang: Lang) =>
  getRelativeLocaleUrl(lang, "writing");

export const getWritingUrl = (lang: Lang, slug: string) =>
  getRelativeLocaleUrl(lang, `writing/${slug}`);

export const getTranslationKey = ({
  slug,
  translationKey,
}: Pick<Post, "slug" | "translationKey">) => {
  return translationKey ?? slug;
};

export const toPost = (
  entry: CollectionEntry<"writing">,
  readTime: number,
): Post => {
  const { lang, slug } = getLangAndSlug(entry.id);

  return {
    id: entry.id,
    lang,
    slug,
    url: getWritingUrl(lang, slug),
    readTime,
    type: "article",
    ...entry.data,
  };
};

export const getPostsByLang = (posts: Post[], lang: Lang) => {
  return posts.filter((post) => post.lang === lang);
};

export const findTranslation = (
  posts: Post[],
  post: Pick<Post, "lang" | "slug" | "translationKey">,
  targetLang: Lang,
) => {
  const translationKey = getTranslationKey(post);

  return posts.find((candidate) => {
    return (
      candidate.lang === targetLang &&
      getTranslationKey(candidate) === translationKey
    );
  });
};

// The `<link rel="alternate">` list and the language switcher show the same set
// in two shapes, so one pass builds both: paused locales never appear, and a
// locale with no URL for the current page (an untranslated article) is dropped
// rather than linked.
export const getLocaleLinks = (href: (lang: Lang) => string | undefined) => {
  const alternates = activeLangs.flatMap((lang) => {
    const url = href(lang);
    return url ? [{ lang, href: url }] : [];
  });

  const languageLinks = Object.fromEntries(
    alternates.map((link) => [link.lang, link.href]),
  ) as Partial<Record<Lang, string>>;

  return { alternates, languageLinks };
};

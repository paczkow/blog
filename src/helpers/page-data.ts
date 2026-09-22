import type { CollectionEntry } from "astro:content";
import { getCollection, render } from "astro:content";

import { activeLangs, isLangEnabled } from "@/i18n/config.ts";
import type { Lang, Post } from "@/models.ts";
import { defaultLang } from "@/models.ts";
import {
  getLangAndSlug,
  getPostsByLang,
  getSortedByDate,
  toPost,
} from "./posts.ts";

export const getLocaleRouteParam = (lang: Lang) =>
  lang === defaultLang ? undefined : lang;

export const getLocaleStaticPaths = () =>
  activeLangs.map((lang) => ({
    params: { lang: getLocaleRouteParam(lang) },
    props: { lang },
  }));

// The glob still picks up every locale's files; a paused locale is dropped here
// so no page, feed or heatmap has to remember to filter it out.
const getWritingEntries = () =>
  getCollection("writing", ({ id }) => isLangEnabled(getLangAndSlug(id).lang));

export const loadWritingPosts = async () => {
  const entries = await getWritingEntries();
  const posts = await Promise.all(
    entries.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return toPost(entry, remarkPluginFrontmatter.minutesRead);
    }),
  );

  return { entries, posts };
};

export const getHomePosts = (posts: Post[], lang: Lang) => {
  return getSortedByDate(getPostsByLang(posts, lang));
};

export const getArticleStaticPaths = async () => {
  const { entries, posts } = await loadWritingPosts();

  return entries.map((entry) => {
    const { lang, slug } = getLangAndSlug(entry.id);
    const currentPost = posts.find((post) => post.id === entry.id);

    if (!currentPost) {
      throw new Error(`Missing rendered post for ${entry.id}`);
    }

    return {
      params: { lang: getLocaleRouteParam(lang), slug },
      props: {
        entry,
        currentPost,
        posts,
      },
    };
  });
};

export const getWritingOgStaticPaths = async () => {
  const entries = await getWritingEntries();

  return entries.map((entry) => {
    const { lang, slug } = getLangAndSlug(entry.id);

    return {
      params: { lang: getLocaleRouteParam(lang), slug },
      props: entry,
    };
  });
};

export type ArticleRouteProps = {
  entry: CollectionEntry<"writing">;
  currentPost: Post;
  posts: Post[];
};

import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

import {
  DEFAULT_LANG,
  getLangAndSlug,
  getSortedByDate,
  getWritingUrl,
} from "@/helpers/posts.ts";
import { SITE } from "config";

export async function GET() {
  const posts = (await getCollection("writing"))
    .map(({ id, data }) => ({
      ...getLangAndSlug(id),
      ...data,
    }))
    .filter((post) => post.lang === DEFAULT_LANG);

  const sortedPosts = getSortedByDate(posts);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ slug, title, description, date }) => ({
      link: getWritingUrl(DEFAULT_LANG, slug),
      title: title,
      description: description,
      pubDate: new Date(date),
    })),
  });
}

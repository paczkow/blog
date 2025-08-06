import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

import { getSortedByDate } from "@/helpers/posts.ts";
import { SITE } from "config";

export async function GET() {
  const essays = (await getCollection("essays")).map(({ id, data }) => ({
    id,
    ...data,
  }));

  const sortedEssays = getSortedByDate(essays);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedEssays.map(({ id, title, description, date }) => ({
      link: `writing/${id}`,
      title: title,
      description: description,
      pubDate: new Date(date),
    })),
  });
}

import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

import { createWritingOgImage } from "@/og/index.ts";

export async function getStaticPaths() {
  const writing = await Promise.all([
    getCollection("essays"),
    getCollection("notes"),
  ]);

  const posts = [...writing[0], ...writing[1]];

  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  return new Response(
    await createWritingOgImage({
      text: props.data.title,
      src: props.data.image?.src,
    }),
    {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
};

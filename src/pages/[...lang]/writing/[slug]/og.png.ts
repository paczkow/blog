import type { APIRoute } from "astro";

import { pngHeaders } from "@/og/route";
import { getWritingOgStaticPaths } from "@/helpers/page-data.ts";
import { createWritingOgImage } from "@/og/index.ts";

export const getStaticPaths = getWritingOgStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  return new Response(
    await createWritingOgImage({
      text: props.data.title,
      src: props.data.image?.src,
    }),
    {
      headers: pngHeaders,
    },
  );
};

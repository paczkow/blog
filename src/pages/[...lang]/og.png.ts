import type { APIRoute } from "astro";

import { getLocaleStaticPaths } from "@/helpers/page-data.ts";
import { createStaticOgResponse } from "@/og/route";

export const getStaticPaths = getLocaleStaticPaths;

export const GET: APIRoute = async () => {
  return createStaticOgResponse();
};

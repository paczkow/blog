import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Only Content-Type survives: in a static build Astro writes each endpoint's
// body to a file and drops the response headers, so caching for the emitted
// og.png files is set in public/_headers instead.
export const pngHeaders = {
  "Content-Type": "image/png",
};

export const createStaticOgResponse = () => {
  try {
    const imagePath = resolve("src", "og", "assets", "og.png");
    const imageBuffer = readFileSync(imagePath);

    return new Response(imageBuffer, {
      headers: pngHeaders,
    });
  } catch (error) {
    return new Response("Image not found", { status: 404 });
  }
};

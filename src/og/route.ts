import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const pngHeaders = {
  "Content-Type": "image/png",
  "Cache-Control": "public, max-age=31536000, immutable",
};

export const createStaticOgResponse = () => {
  try {
    const imagePath = resolve("public", "images", "og.png");
    const imageBuffer = readFileSync(imagePath);

    return new Response(imageBuffer, {
      headers: pngHeaders,
    });
  } catch (error) {
    return new Response("Image not found", { status: 404 });
  }
};

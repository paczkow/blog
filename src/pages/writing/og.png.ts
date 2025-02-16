import type { APIRoute } from "astro";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const GET: APIRoute = async () => {
  try {
    const imagePath = resolve("public", "images", "og.png");
    const imageBuffer = readFileSync(imagePath);

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Image not found", { status: 404 });
  }
};

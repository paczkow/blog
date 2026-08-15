import fs from "node:fs/promises";
import path from "node:path";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";

import { writing } from "./templates";

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  // These TTFs and the fallback image live in src/, not public/: satori reads
  // them here at build time and nothing requests them over HTTP, so keeping
  // them in public/ only published ~750 KB of assets no visitor ever fetches.
  fonts: [
    {
      name: "Inter Bold",
      data: await fs.readFile(path.resolve("./src/og/assets/inter-bold.ttf")),
    },
    {
      name: "Inter Medium",
      data: await fs.readFile(path.resolve("./src/og/assets/inter-medium.ttf")),
    },
  ],
};

export async function createWritingOgImage({
  text,
  src,
}: {
  text: string;
  src: string;
}) {
  const filePath = src
    ? getFilePath(src)
    : path.resolve("src", "og", "assets", "article.png");
  const file = await fs.readFile(filePath);
  const base64 = `data:image/png;base64,${file.toString("base64")}`;

  const svg = await satori(
    writing({ text, image: base64 }) as Parameters<typeof satori>[0],
    options,
  );

  return await toPNG(svg);
}

const getFilePath = (src: string) => {
  return process.env.NODE_ENV === "development"
    ? path.resolve(src.replace(/\?.*/, "").replace("/@fs", ""))
    : path.resolve(src.replace("/", "dist/"));
};

async function toPNG(svg: string) {
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

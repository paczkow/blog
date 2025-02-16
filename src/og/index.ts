import fs from "node:fs/promises";
import path from "node:path";
import satori, { type SatoriOptions } from "satori";
import sharp from "sharp";

import type React from "react";
import { writing } from "./templates";

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "Inter Bold",
      data: await fs.readFile(path.resolve("./public/fonts/inter-bold.ttf")),
    },
    {
      name: "Inter Medium",
      data: await fs.readFile(path.resolve("./public/fonts/inter-medium.ttf")),
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
    : path.resolve("public", "images", "article.png");
  const file = await fs.readFile(filePath);
  const base64 = `data:image/png;base64,${file.toString("base64")}`;

  const svg = await satori(
    writing({ text, image: base64 }) as React.ReactNode,
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

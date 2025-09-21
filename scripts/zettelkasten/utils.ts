import { promises as fs, readFileSync } from "node:fs";
import matter from "gray-matter";
import path, { join } from "node:path";
import type { TransformPayload } from "./types.ts";

export async function readMarkdownFile(
  filePath: string,
): Promise<TransformPayload | null> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    const title =
      frontmatter.title || path.basename(filePath, ".md").replace(/-/g, " ");

    return {
      title: title.toString(),
      content: content.trim(),
    };
  } catch (error) {
    return null;
  }
}

export const getPrompt = (): string => {
  const promptPath =
    process.env.ZETTELKASTEN_PROMPT_PATH ||
    join(process.cwd(), "prompts", "translation.txt");

  return readFileSync(promptPath, "utf-8").trim();
};

export async function writeNoteFile(
  outputPath: string,
  payload: TransformPayload,
): Promise<void> {
  const frontmatter = {
    title: payload.title,
    date: new Date().toISOString().split("T")[0],
    status: "spark" as const,
    topics: [] as string[],
    toc: false,
  };

  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length === 0
          ? `${key}: []`
          : `${key}:\n${value.map((v) => `  - ${v}`).join("\n")}`;
      }
      if (typeof value === "string") {
        return `${key}: ${value}`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");

  const fileContent = `---\n${frontmatterString}\n---\n\n${payload.content}\n`;

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, fileContent, "utf-8");
}

export function getOutputFilePath(
  inputFilePath: string,
  outputDir: string,
): string {
  const fileName = path.basename(inputFilePath);
  return path.join(outputDir, fileName);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

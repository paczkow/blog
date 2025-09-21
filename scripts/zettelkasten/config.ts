import type { TransformConfig } from "./types.ts";

export const config: TransformConfig = {
  apiEndpoint:
    process.env.TRANSFORM_API_URL || "http://localhost:3001/transform",
  watchDir: "src/content/zettelkasten",
  outputDir: "src/content/notes",
};

export const TIMEOUT_MS = 30000;
export const MAX_ERROR_BODY_LENGTH = 500;

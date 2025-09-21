import chokidar from "chokidar";
import { config } from "./config.ts";
import { logger } from "./logger.ts";
import { Provider } from "./provider/open-ai.ts";
import {
  fileExists,
  getOutputFilePath,
  readMarkdownFile,
  writeNoteFile,
} from "./utils.ts";

async function processFile(filePath: string): Promise<boolean> {
  const filename = filePath.split("/").pop() || filePath;

  logger.info({ file: filename }, "Processing file");

  try {
    const payload = await readMarkdownFile(filePath);
    if (!payload) {
      logger.error({ file: filename }, "Failed to read or parse markdown file");
      return false;
    }

    const outputPath = getOutputFilePath(filePath, config.outputDir);
    if (await fileExists(outputPath)) {
      logger.warn(
        { file: filename, outputFile: outputPath },
        "File already exists, skipping",
      );
      return false;
    }

    logger.info({ file: filename }, "Send file to LLM Provider");

    const transformedPayload = await Provider.transform({
      content: payload.content,
      title: payload.title || filename,
    });

    await writeNoteFile(outputPath, transformedPayload);

    logger.info(
      { file: filename, outputFile: outputPath },
      "File processed successfully",
    );
    return true;
  } catch (error: unknown) {
    logger.error(
      {
        file: filename,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to process file",
    );
    return false;
  }
}

function startWatcher(): void {
  const watchPattern = `${config.watchDir}`;

  logger.info(
    {
      watchDir: config.watchDir,
      endpoint: config.apiEndpoint,
    },
    "Starting file watcher",
  );

  const watcher = chokidar.watch(watchPattern, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on("add", (path) => {
      logger.debug({ file: path }, "File added, processing");
      processFile(path);
    })
    .on("change", (path) => {
      logger.debug({ file: path }, "File changed, processing");
      processFile(path);
    })
    .on("error", (error) => {
      logger.error(
        { error: error instanceof Error ? error.message : error },
        "Watcher error",
      );
    });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Shutting down watcher");
    watcher.close();
    process.exit(0);
  });
}

async function main(): Promise<void> {
  startWatcher();
}

main().catch((error) => {
  logger.error(
    { error: error.message, stack: error.stack },
    "Application error",
  );
  process.exit(1);
});

import OpenAI from "openai";
import type { LLMProvider, TransformPayload } from "../types.ts";
import { getPrompt } from "../utils.ts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const request = async (title: string, content: string) =>
  await openai.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "developer",
        content: [
          {
            type: "input_text",
            text: getPrompt(),
          },
        ],
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: JSON.stringify({ title, content }) },
        ],
      },
    ],
    text: {
      format: {
        type: "json_object",
      },
      verbosity: "medium",
    },
    reasoning: {
      effort: "medium",
      summary: "auto",
    },
    tools: [],
    store: true,
    include: ["reasoning.encrypted_content"],
  });

export const Provider: LLMProvider = {
  async transform(payload: TransformPayload): Promise<TransformPayload> {
    const response = await request(payload.title, payload.content);
    const result = JSON.parse(response.output_text);

    return {
      title: result.title || payload.title,
      content: result.content || payload.content,
    };
  },
};

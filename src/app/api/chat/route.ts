import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  getGeminiModel,
  MissingGeminiApiKeyError,
} from "@/lib/ai/gemini";
import { ASTRA_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 30;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUiMessage(value: unknown): value is UIMessage {
  if (!isRecord(value)) {
    return false;
  }

  const validRole =
    value.role === "user" ||
    value.role === "assistant" ||
    value.role === "system";

  return (
    typeof value.id === "string" &&
    validRole &&
    Array.isArray(value.parts)
  );
}

function parseMessages(body: unknown) {
  if (!isRecord(body) || !Array.isArray(body.messages)) {
    return null;
  }

  if (!body.messages.every(isUiMessage)) {
    return null;
  }

  return body.messages;
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = parseMessages(body);

  if (!messages) {
    return Response.json(
      { error: "Expected a messages array from the chat client." },
      { status: 400 },
    );
  }

  try {
    const result = streamText({
      model: getGeminiModel(),
      system: ASTRA_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof MissingGeminiApiKeyError) {
      return Response.json(
        {
          error:
            "Chat is not configured yet. Add a Gemini API key on the server.",
        },
        { status: 503 },
      );
    }

    console.error("Astra chat route failed", error);

    return Response.json(
      { error: "Astra could not start a response." },
      { status: 500 },
    );
  }
}

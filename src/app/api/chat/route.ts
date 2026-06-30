import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

import {
  getGeminiModel,
  MissingGeminiApiKeyError,
} from "@/lib/ai/gemini";
import { buildAstraSystemPrompt } from "@/lib/ai/prompts";
import { createCaptureLeadTool } from "@/lib/ai/tools/capture-lead";
import {
  ensureWebConversation,
  persistConversationMessage,
} from "@/lib/conversations/persistence";
import {
  retrieveRagContext,
  summarizeRagSources,
} from "@/lib/knowledge/rag";

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

function parseChatId(body: unknown) {
  if (!isRecord(body)) {
    return crypto.randomUUID();
  }

  if (typeof body.conversationId === "string") {
    return body.conversationId;
  }

  return typeof body.id === "string" ? body.id : crypto.randomUUID();
}

function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function getLatestUserMessage(messages: UIMessage[]) {
  return messages.toReversed().find((message) => message.role === "user");
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
      { error: "Expected a messages array from the chat interface." },
      { status: 400 },
    );
  }

  try {
    const chatId = parseChatId(body);
    const latestUserMessage = getLatestUserMessage(messages);
    const latestUserText = latestUserMessage
      ? getTextFromMessage(latestUserMessage)
      : "";
    const conversation = await ensureWebConversation(chatId, latestUserText);

    if (latestUserMessage) {
      await persistConversationMessage({
        conversationId: conversation.id,
        role: "user",
        content: latestUserText,
        uiMessageId: latestUserMessage.id,
        metadata: {
          chatId,
        },
      });
    }

    const ragContext = latestUserText
      ? await retrieveRagContext(latestUserText)
      : {
          promptContext:
            "No user question was available for knowledge-base retrieval.",
          sources: [],
        };
    const tools = {
      captureLead: createCaptureLeadTool(conversation.id),
    };
    const result = streamText({
      model: getGeminiModel(),
      system: buildAstraSystemPrompt(ragContext.promptContext),
      messages: await convertToModelMessages(messages, {
        tools,
        ignoreIncompleteToolCalls: true,
      }),
      tools,
      stopWhen: stepCountIs(3),
      temperature: 0.4,
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }) =>
        part.type === "finish"
          ? { sources: summarizeRagSources(ragContext.sources) }
          : undefined,
      onFinish: async ({ responseMessage, isAborted, finishReason }) => {
        if (isAborted) {
          return;
        }

        try {
          await persistConversationMessage({
            conversationId: conversation.id,
            role: "assistant",
            content: getTextFromMessage(responseMessage),
            uiMessageId: responseMessage.id,
            modelId: process.env.GEMINI_MODEL_ID ?? "gemini-2.5-flash",
            sources: summarizeRagSources(ragContext.sources),
            metadata: {
              chatId,
              finishReason,
            },
          });
        } catch (persistError) {
          console.error("Astra could not persist assistant message", persistError);
        }
      },
    });
  } catch (error) {
    if (error instanceof MissingGeminiApiKeyError) {
      return Response.json(
        {
          error: "Astra is temporarily unavailable. Please try again soon.",
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

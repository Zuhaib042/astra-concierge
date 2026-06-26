import { and, desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { conversations, messages } from "@/db/schema";
import type { RagSourceSummary } from "@/lib/knowledge/rag";

const MAX_TITLE_LENGTH = 120;
const MAX_VISITOR_ID_LENGTH = 128;
const DEFAULT_CONVERSATION_TITLE = "New conversation";

type PersistMessageInput = {
  conversationId: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  uiMessageId?: string;
  modelId?: string;
  sources?: RagSourceSummary[];
  metadata?: Record<string, unknown>;
};

function normalizeVisitorId(chatId: string) {
  return chatId.slice(0, MAX_VISITOR_ID_LENGTH);
}

function createConversationTitle(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return DEFAULT_CONVERSATION_TITLE;
  }

  return normalized.length > MAX_TITLE_LENGTH
    ? `${normalized.slice(0, MAX_TITLE_LENGTH).trim()}...`
    : normalized;
}

async function messageExists(conversationId: string, uiMessageId?: string) {
  if (!uiMessageId) {
    return false;
  }

  const db = getDb();
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        sql`${messages.metadata}->>'uiMessageId' = ${uiMessageId}`,
      ),
    );

  return Number(result?.count ?? 0) > 0;
}

export async function ensureWebConversation(chatId: string, firstMessage: string) {
  const db = getDb();
  const visitorId = normalizeVisitorId(chatId);
  const [existingConversation] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.visitorId, visitorId),
        eq(conversations.channel, "web"),
        eq(conversations.status, "active"),
      ),
    )
    .orderBy(desc(conversations.createdAt))
    .limit(1);

  if (existingConversation) {
    return existingConversation;
  }

  const [conversation] = await db
    .insert(conversations)
    .values({
      visitorId,
      title: createConversationTitle(firstMessage),
      channel: "web",
      status: "active",
      lastMessageAt: new Date(),
      metadata: {
        clientChatId: chatId,
        source: "astra-web-demo",
      },
    })
    .returning();

  return conversation;
}

export async function persistConversationMessage(input: PersistMessageInput) {
  if (!input.content.trim()) {
    return;
  }

  const alreadySaved = await messageExists(
    input.conversationId,
    input.uiMessageId,
  );

  if (alreadySaved) {
    return;
  }

  const db = getDb();
  const savedAt = new Date();

  await db.insert(messages).values({
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    modelId: input.modelId,
    sources: input.sources,
    metadata: {
      ...(input.metadata ?? {}),
      uiMessageId: input.uiMessageId,
    },
  });

  await db
    .update(conversations)
    .set({
      lastMessageAt: savedAt,
      updatedAt: savedAt,
    })
    .where(eq(conversations.id, input.conversationId));
}

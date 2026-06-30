import { desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  conversations,
  documentChunks,
  documents,
  leads,
  messages,
} from "@/db/schema";

const OVERVIEW_LIMIT = 8;
const RECENT_MESSAGE_LIMIT = 100;

export type AdminMetricSummary = {
  conversations: {
    total: number;
    active: number;
    qualified: number;
  };
  leads: {
    total: number;
    new: number;
    qualified: number;
    highPriority: number;
  };
  messages: {
    total: number;
    assistant: number;
    user: number;
  };
  knowledge: {
    documents: number;
    chunks: number;
    embeddedChunks: number;
    embeddingCoverage: number;
  };
};

export type AdminLeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  intent: string | null;
  status: "new" | "qualified" | "contacted" | "won" | "lost";
  priority: "low" | "medium" | "high";
  budgetRange: string | null;
  timeline: string | null;
  updatedAt: Date;
};

export type AdminConversationRow = {
  id: string;
  title: string;
  status: "active" | "qualified" | "archived";
  channel: "web" | "admin" | "demo";
  lastMessageAt: Date | null;
  createdAt: Date;
  messageCount: number;
  leadCount: number;
};

export type AdminMessageRow = {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  createdAt: Date;
  conversationTitle: string;
};

export type AdminCategoryRow = {
  category: string;
  count: number;
};

export type AdminIntentRow = {
  intent: string;
  count: number;
};

export type AdminDashboardData = {
  summary: AdminMetricSummary;
  recentLeads: AdminLeadRow[];
  recentConversations: AdminConversationRow[];
  recentMessages: AdminMessageRow[];
  documentsByCategory: AdminCategoryRow[];
  topLeadIntents: AdminIntentRow[];
  limits: {
    recentMessages: number;
  };
};

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

function toPercent(part: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

async function getConversationSummary() {
  const db = getDb();
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${conversations.status} = 'active')::int`,
      qualified: sql<number>`count(*) filter (where ${conversations.status} = 'qualified')::int`,
    })
    .from(conversations);

  return {
    total: toNumber(row?.total),
    active: toNumber(row?.active),
    qualified: toNumber(row?.qualified),
  };
}

async function getLeadSummary() {
  const db = getDb();
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      new: sql<number>`count(*) filter (where ${leads.status} = 'new')::int`,
      qualified: sql<number>`count(*) filter (where ${leads.status} = 'qualified')::int`,
      highPriority: sql<number>`count(*) filter (where ${leads.priority} = 'high')::int`,
    })
    .from(leads);

  return {
    total: toNumber(row?.total),
    new: toNumber(row?.new),
    qualified: toNumber(row?.qualified),
    highPriority: toNumber(row?.highPriority),
  };
}

async function getMessageSummary() {
  const db = getDb();
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      assistant: sql<number>`count(*) filter (where ${messages.role} = 'assistant')::int`,
      user: sql<number>`count(*) filter (where ${messages.role} = 'user')::int`,
    })
    .from(messages);

  return {
    total: toNumber(row?.total),
    assistant: toNumber(row?.assistant),
    user: toNumber(row?.user),
  };
}

async function getKnowledgeSummary() {
  const db = getDb();
  const [documentCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(documents);
  const [chunkSummary] = await db
    .select({
      chunks: sql<number>`count(*)::int`,
      embeddedChunks: sql<number>`count(${documentChunks.embedding})::int`,
    })
    .from(documentChunks);

  const chunks = toNumber(chunkSummary?.chunks);
  const embeddedChunks = toNumber(chunkSummary?.embeddedChunks);

  return {
    documents: toNumber(documentCount?.count),
    chunks,
    embeddedChunks,
    embeddingCoverage: toPercent(embeddedChunks, chunks),
  };
}

async function getRecentLeads(): Promise<AdminLeadRow[]> {
  const db = getDb();

  return db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      companyName: leads.companyName,
      intent: leads.intent,
      status: leads.status,
      priority: leads.priority,
      budgetRange: leads.budgetRange,
      timeline: leads.timeline,
      updatedAt: leads.updatedAt,
    })
    .from(leads)
    .orderBy(desc(leads.updatedAt))
    .limit(OVERVIEW_LIMIT);
}

async function getRecentConversations(): Promise<AdminConversationRow[]> {
  const db = getDb();

  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      status: conversations.status,
      channel: conversations.channel,
      lastMessageAt: conversations.lastMessageAt,
      createdAt: conversations.createdAt,
      messageCount: sql<number>`count(distinct ${messages.id})::int`,
      leadCount: sql<number>`count(distinct ${leads.id})::int`,
    })
    .from(conversations)
    .leftJoin(messages, eq(messages.conversationId, conversations.id))
    .leftJoin(leads, eq(leads.conversationId, conversations.id))
    .groupBy(conversations.id)
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.createdAt))
    .limit(OVERVIEW_LIMIT);

  return rows.map((row) => ({
    ...row,
    messageCount: toNumber(row.messageCount),
    leadCount: toNumber(row.leadCount),
  }));
}

async function getRecentMessages(): Promise<AdminMessageRow[]> {
  const db = getDb();

  return db
    .select({
      id: messages.id,
      role: messages.role,
      content: messages.content,
      createdAt: messages.createdAt,
      conversationTitle: conversations.title,
    })
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .orderBy(desc(messages.createdAt))
    .limit(RECENT_MESSAGE_LIMIT);
}

async function getDocumentsByCategory(): Promise<AdminCategoryRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      category: documents.category,
      count: sql<number>`count(*)::int`,
    })
    .from(documents)
    .groupBy(documents.category)
    .orderBy(sql`count(*) desc`)
    .limit(OVERVIEW_LIMIT);

  return rows.map((row) => ({
    category: row.category,
    count: toNumber(row.count),
  }));
}

async function getTopLeadIntents(): Promise<AdminIntentRow[]> {
  const db = getDb();
  const rows = await db
    .select({
      intent: leads.intent,
      count: sql<number>`count(*)::int`,
    })
    .from(leads)
    .where(sql`${leads.intent} is not null`)
    .groupBy(leads.intent)
    .orderBy(sql`count(*) desc`)
    .limit(OVERVIEW_LIMIT);

  return rows
    .filter(
      (row): row is { intent: string; count: number } =>
        typeof row.intent === "string",
    )
    .map((row) => ({
      intent: row.intent,
      count: toNumber(row.count),
    }));
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    conversationsSummary,
    leadsSummary,
    messagesSummary,
    knowledgeSummary,
    recentLeads,
    recentConversations,
    recentMessages,
    documentsByCategory,
    topLeadIntents,
  ] = await Promise.all([
    getConversationSummary(),
    getLeadSummary(),
    getMessageSummary(),
    getKnowledgeSummary(),
    getRecentLeads(),
    getRecentConversations(),
    getRecentMessages(),
    getDocumentsByCategory(),
    getTopLeadIntents(),
  ]);

  return {
    summary: {
      conversations: conversationsSummary,
      leads: leadsSummary,
      messages: messagesSummary,
      knowledge: knowledgeSummary,
    },
    recentLeads,
    recentConversations,
    recentMessages,
    documentsByCategory,
    topLeadIntents,
    limits: {
      recentMessages: RECENT_MESSAGE_LIMIT,
    },
  };
}

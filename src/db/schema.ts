import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

export const EMBEDDING_DIMENSIONS = 768;

const metadata = (name = "metadata") =>
  jsonb(name).$type<Record<string, unknown>>().default({}).notNull();

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date());

export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "qualified",
  "archived",
]);

export const conversationChannelEnum = pgEnum("conversation_channel", [
  "web",
  "admin",
  "demo",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
  "tool",
]);

export const documentSourceTypeEnum = pgEnum("document_source_type", [
  "synthetic",
  "upload",
  "url",
  "manual",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "draft",
  "ready",
  "failed",
  "archived",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "qualified",
  "contacted",
  "won",
  "lost",
]);

export const leadPriorityEnum = pgEnum("lead_priority", [
  "low",
  "medium",
  "high",
]);

export const datasetKindEnum = pgEnum("dataset_kind", [
  "leads",
  "support_tickets",
  "integration_metrics",
  "analytics",
  "pricing",
]);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    visitorId: varchar("visitor_id", { length: 128 }),
    title: varchar("title", { length: 160 }).default("New conversation").notNull(),
    status: conversationStatusEnum("status").default("active").notNull(),
    channel: conversationChannelEnum("channel").default("web").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    metadata: metadata(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("conversations_status_idx").on(table.status),
    index("conversations_visitor_id_idx").on(table.visitorId),
    index("conversations_last_message_at_idx").on(table.lastMessageAt),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    modelId: varchar("model_id", { length: 120 }),
    tokenCount: integer("token_count"),
    latencyMs: integer("latency_ms"),
    sources: jsonb("sources").$type<Array<Record<string, unknown>>>(),
    toolCalls: jsonb("tool_calls").$type<Array<Record<string, unknown>>>(),
    metadata: metadata(),
    createdAt: createdAt(),
  },
  (table) => [
    index("messages_conversation_created_at_idx").on(
      table.conversationId,
      table.createdAt,
    ),
    index("messages_role_idx").on(table.role),
  ],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    sourceType: documentSourceTypeEnum("source_type").default("synthetic").notNull(),
    category: varchar("category", { length: 80 }).notNull(),
    filePath: text("file_path"),
    mimeType: varchar("mime_type", { length: 120 }),
    checksum: varchar("checksum", { length: 128 }),
    status: documentStatusEnum("status").default("draft").notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    metadata: metadata(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("documents_slug_idx").on(table.slug),
    uniqueIndex("documents_checksum_idx").on(table.checksum),
    index("documents_category_idx").on(table.category),
    index("documents_status_idx").on(table.status),
  ],
);

export const documentChunks = pgTable(
  "document_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(),
    heading: varchar("heading", { length: 240 }),
    content: text("content").notNull(),
    tokenCount: integer("token_count").default(0).notNull(),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    metadata: metadata(),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("document_chunks_document_order_idx").on(
      table.documentId,
      table.chunkIndex,
    ),
    index("document_chunks_document_id_idx").on(table.documentId),
    index("document_chunks_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 160 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 80 }),
    companyName: varchar("company_name", { length: 180 }),
    intent: varchar("intent", { length: 160 }),
    status: leadStatusEnum("status").default("new").notNull(),
    priority: leadPriorityEnum("priority").default("medium").notNull(),
    budgetRange: varchar("budget_range", { length: 120 }),
    timeline: varchar("timeline", { length: 120 }),
    notes: text("notes"),
    metadata: metadata(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("leads_conversation_id_idx").on(table.conversationId),
    index("leads_email_idx").on(table.email),
    index("leads_status_idx").on(table.status),
    index("leads_priority_idx").on(table.priority),
  ],
);

export const datasets = pgTable(
  "datasets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 180 }).notNull(),
    kind: datasetKindEnum("kind").notNull(),
    sourcePath: text("source_path"),
    rowCount: integer("row_count").default(0).notNull(),
    metadata: metadata(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("datasets_name_kind_idx").on(table.name, table.kind),
    index("datasets_kind_idx").on(table.kind),
  ],
);

export const datasetRecords = pgTable(
  "dataset_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    externalId: varchar("external_id", { length: 160 }),
    record: jsonb("record").$type<Record<string, unknown>>().notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("dataset_records_dataset_external_id_idx").on(
      table.datasetId,
      table.externalId,
    ),
    index("dataset_records_dataset_id_idx").on(table.datasetId),
  ],
);

export const conversationsRelations = relations(conversations, ({ many }) => ({
  leads: many(leads),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const documentsRelations = relations(documents, ({ many }) => ({
  chunks: many(documentChunks),
}));

export const documentChunksRelations = relations(documentChunks, ({ one }) => ({
  document: one(documents, {
    fields: [documentChunks.documentId],
    references: [documents.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  conversation: one(conversations, {
    fields: [leads.conversationId],
    references: [conversations.id],
  }),
}));

export const datasetsRelations = relations(datasets, ({ many }) => ({
  records: many(datasetRecords),
}));

export const datasetRecordsRelations = relations(datasetRecords, ({ one }) => ({
  dataset: one(datasets, {
    fields: [datasetRecords.datasetId],
    references: [datasets.id],
  }),
}));

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type DocumentChunk = typeof documentChunks.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Dataset = typeof datasets.$inferSelect;
export type NewDataset = typeof datasets.$inferInsert;
export type DatasetRecord = typeof datasetRecords.$inferSelect;
export type NewDatasetRecord = typeof datasetRecords.$inferInsert;

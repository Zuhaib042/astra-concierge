import { eq, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { documentChunks, documents } from "@/db/schema";
import { embedKnowledgeQuery } from "@/lib/knowledge/embeddings";

export type KnowledgeSearchResult = {
  chunkId: string;
  documentId: string;
  title: string;
  category: string;
  filePath: string | null;
  heading: string | null;
  content: string;
  similarity: number;
};

export async function searchKnowledgeBase(query: string, limit = 6) {
  const db = getDb();
  const queryEmbedding = await embedKnowledgeQuery(query);
  const queryVector = JSON.stringify(queryEmbedding);
  const distance = sql<number>`${documentChunks.embedding} <=> ${queryVector}::vector`;

  const rows = await db
    .select({
      chunkId: documentChunks.id,
      documentId: documents.id,
      title: documents.title,
      category: documents.category,
      filePath: documents.filePath,
      heading: documentChunks.heading,
      content: documentChunks.content,
      similarity: sql<number>`1 - (${distance})`,
    })
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(sql`${documentChunks.embedding} IS NOT NULL`)
    .orderBy(distance)
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    similarity: Number(row.similarity),
  })) satisfies KnowledgeSearchResult[];
}

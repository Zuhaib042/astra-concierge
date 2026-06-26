import { config } from "dotenv";
import { and, asc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";

import { getDb } from "../src/db/client";
import { documentChunks, documents, EMBEDDING_DIMENSIONS } from "../src/db/schema";
import {
  buildKnowledgeEmbeddingText,
  embedKnowledgeDocuments,
} from "../src/lib/knowledge/embeddings";

config({ path: ".env.local" });
config({ path: ".env" });

const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_BATCH_DELAY_MS = 15_000;
const DEFAULT_QUOTA_RETRY_DELAY_MS = 60_000;

type ChunkToEmbed = {
  id: string;
  title: string;
  category: string;
  heading: string | null;
  content: string;
};

function getNumericArg(name: string) {
  const arg = process.argv.find((value) => value.startsWith(`--${name}=`));
  const rawValue = arg?.split("=")[1];
  const parsed = rawValue ? Number.parseInt(rawValue, 10) : undefined;

  return Number.isFinite(parsed) ? parsed : undefined;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryDelayMs(error: unknown) {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error ?? "");
  const retryMatch = message.match(/retry in ([\d.]+)s/i);
  const retrySeconds = retryMatch?.[1]
    ? Number.parseFloat(retryMatch[1])
    : undefined;

  if (retrySeconds && Number.isFinite(retrySeconds)) {
    return Math.ceil(retrySeconds * 1000) + 5_000;
  }

  return DEFAULT_QUOTA_RETRY_DELAY_MS;
}

function isQuotaError(error: unknown) {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error ?? "");

  return (
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("Quota exceeded") ||
    message.includes("exceeded your current quota")
  );
}

async function embedBatchWithQuotaRetry(values: string[]) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await embedKnowledgeDocuments(values);
    } catch (error) {
      if (!isQuotaError(error) || attempt === 4) {
        throw error;
      }

      const waitMs = getRetryDelayMs(error);
      console.log(
        `Embedding quota reached. Waiting ${Math.ceil(waitMs / 1000)}s before retry ${attempt + 1}/4.`,
      );
      await sleep(waitMs);
    }
  }

  throw new Error("Embedding batch failed after quota retries.");
}

async function loadChunksToEmbed(limit?: number) {
  const db = getDb();
  const baseQuery = db
    .select({
      id: documentChunks.id,
      title: documents.title,
      category: documents.category,
      heading: documentChunks.heading,
      content: documentChunks.content,
    })
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(isNull(documentChunks.embedding))
    .orderBy(asc(documentChunks.createdAt));

  return limit ? baseQuery.limit(limit) : baseQuery;
}

async function updateChunkEmbeddings(
  rows: Array<{ id: string; embedding: number[] }>,
) {
  if (rows.length === 0) {
    return;
  }

  const db = getDb();
  const embeddingModel =
    process.env.GEMINI_EMBEDDING_MODEL_ID ?? "gemini-embedding-001";
  const embeddedAt = new Date().toISOString();
  const values = sql.join(
    rows.map(
      (row) =>
        sql`(${row.id}::uuid, ${JSON.stringify(row.embedding)}::vector)`,
    ),
    sql`, `,
  );

  await db.execute(sql`
    UPDATE document_chunks AS chunks
    SET
      embedding = embedding_values.embedding,
      metadata = chunks.metadata || jsonb_build_object(
        'embeddingModel', ${embeddingModel}::text,
        'embeddingDimensions', ${EMBEDDING_DIMENSIONS}::int,
        'embeddedAt', ${embeddedAt}::text
      )
    FROM (VALUES ${values}) AS embedding_values(id, embedding)
    WHERE chunks.id = embedding_values.id
  `);
}

async function countEmbeddedChunks(chunkIds: string[]) {
  if (chunkIds.length === 0) {
    return 0;
  }

  const db = getDb();
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(documentChunks)
    .where(
      and(
        inArray(documentChunks.id, chunkIds),
        isNotNull(documentChunks.embedding),
      ),
    );

  return Number(result?.count ?? 0);
}

async function main() {
  const batchSize = getNumericArg("batch") ?? DEFAULT_BATCH_SIZE;
  const batchDelayMs = getNumericArg("delay") ?? DEFAULT_BATCH_DELAY_MS;
  const limit = getNumericArg("limit");
  const chunks = (await loadChunksToEmbed(limit)) satisfies ChunkToEmbed[];

  if (chunks.length === 0) {
    console.log("No document chunks need embeddings.");
    return;
  }

  console.log(`Embedding ${chunks.length} document chunks.`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`Batch delay: ${batchDelayMs}ms`);
  console.log(`Embedding dimensions: ${EMBEDDING_DIMENSIONS}`);

  let embeddedCount = 0;

  for (let index = 0; index < chunks.length; index += batchSize) {
    const batch = chunks.slice(index, index + batchSize);
    const values = batch.map((chunk) =>
      buildKnowledgeEmbeddingText({
        title: chunk.title,
        category: chunk.category,
        heading: chunk.heading,
        content: chunk.content,
      }),
    );
    const embeddings = await embedBatchWithQuotaRetry(values);

    await updateChunkEmbeddings(
      batch.map((chunk, batchIndex) => ({
        id: chunk.id,
        embedding: embeddings[batchIndex],
      })),
    );

    embeddedCount += batch.length;
    console.log(`Embedded ${embeddedCount}/${chunks.length} chunks.`);

    if (batchDelayMs > 0 && index + batchSize < chunks.length) {
      await sleep(batchDelayMs);
    }
  }

  const touchedChunkIds = chunks.map((chunk) => chunk.id);
  const verifiedCount = await countEmbeddedChunks(touchedChunkIds);

  console.log("Knowledge embeddings complete:");
  console.log(`- Chunks updated this run: ${verifiedCount}`);
}

main().catch((error) => {
  console.error("Knowledge embedding failed.");
  console.error(error);
  process.exit(1);
});

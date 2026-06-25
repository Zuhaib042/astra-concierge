import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { config } from "dotenv";
import { eq, inArray, sql } from "drizzle-orm";

import { getDb } from "../src/db/client";
import {
  datasetRecords,
  datasets,
  documentChunks,
  documents,
  type NewDatasetRecord,
  type NewDocumentChunk,
  type NewDocument,
} from "../src/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

const KNOWLEDGE_ROOT = path.join(process.cwd(), "content", "knowledge");
const MANIFEST_PATH = path.join(KNOWLEDGE_ROOT, "manifest.json");
const DATASETS_ROOT = path.join(KNOWLEDGE_ROOT, "datasets");

const MAX_CHUNK_WORDS = 260;
const CHUNK_OVERLAP_WORDS = 35;
const INSERT_BATCH_SIZE = 100;

type DatasetKind =
  | "leads"
  | "support_tickets"
  | "integration_metrics"
  | "analytics"
  | "pricing";

type ManifestDocument = {
  id: string;
  title: string;
  category: string;
  file: string;
  tags: string[];
};

type KnowledgeManifest = {
  generatedAt: string;
  seed: number;
  documentCount: number;
  documents: ManifestDocument[];
};

type MarkdownChunk = {
  heading: string | null;
  content: string;
  wordCount: number;
};

type PreparedDocument = {
  slug: string;
  row: NewDocument;
  chunks: MarkdownChunk[];
  manifestDocument: ManifestDocument;
};

type IngestionStats = {
  documents: number;
  chunks: number;
  datasets: number;
  datasetRecords: number;
};

const datasetKindByFile: Record<string, DatasetKind> = {
  "conversation-analytics.json": "analytics",
  "integration-metrics.json": "integration_metrics",
  "leads.json": "leads",
  "package-pricing.json": "pricing",
  "support-tickets.json": "support_tickets",
};

function checksum(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function countWords(input: string) {
  const matches = input.trim().match(/\S+/g);
  return matches?.length ?? 0;
}

function stripFrontmatter(markdown: string) {
  const frontmatterMatch = markdown.match(/^---\n[\s\S]*?\n---\n?/);
  return frontmatterMatch
    ? markdown.slice(frontmatterMatch[0].length).trim()
    : markdown.trim();
}

function normalizeHeading(line: string) {
  return line.replace(/^#{1,6}\s+/, "").trim();
}

function splitWordsWithOverlap(text: string) {
  const words = text.trim().split(/\s+/);
  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + MAX_CHUNK_WORDS, words.length);
    chunks.push(words.slice(start, end).join(" "));

    if (end === words.length) {
      break;
    }

    start = Math.max(end - CHUNK_OVERLAP_WORDS, start);
  }

  return chunks;
}

function chunkMarkdown(markdownBody: string): MarkdownChunk[] {
  const lines = markdownBody.split("\n");
  const sections: Array<{ heading: string | null; lines: string[] }> = [];
  let currentHeading: string | null = null;
  let currentLines: string[] = [];

  function flushSection() {
    const content = currentLines.join("\n").trim();

    if (content) {
      sections.push({ heading: currentHeading, lines: currentLines });
    }

    currentLines = [];
  }

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line)) {
      flushSection();
      currentHeading = normalizeHeading(line);
      currentLines.push(line);
      continue;
    }

    currentLines.push(line);
  }

  flushSection();

  return sections.flatMap((section) => {
    const sectionText = section.lines.join("\n").trim();
    const wordCount = countWords(sectionText);

    if (wordCount <= MAX_CHUNK_WORDS) {
      return [
        {
          heading: section.heading,
          content: sectionText,
          wordCount,
        },
      ];
    }

    return splitWordsWithOverlap(sectionText).map((content, index) => ({
      heading:
        index === 0
          ? section.heading
          : section.heading
            ? `${section.heading} continued`
            : "Continued",
      content,
      wordCount: countWords(content),
    }));
  });
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function insertInBatches<T extends Record<string, unknown>>(
  table: Parameters<ReturnType<typeof getDb>["insert"]>[0],
  rows: T[],
) {
  const db = getDb();

  for (let index = 0; index < rows.length; index += INSERT_BATCH_SIZE) {
    await db.insert(table).values(rows.slice(index, index + INSERT_BATCH_SIZE));
  }
}

function getDatasetRecordId(record: Record<string, unknown>, fallback: number) {
  const knownId =
    record.leadId ??
    record.ticketId ??
    record.metricId ??
    record.analyticsId ??
    record.packageName;

  return typeof knownId === "string" ? knownId : `row-${fallback + 1}`;
}

function getDatasetName(fileName: string) {
  return fileName
    .replace(".json", "")
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

async function prepareDocument(
  manifestDocument: ManifestDocument,
): Promise<PreparedDocument> {
  const filePath = path.join(KNOWLEDGE_ROOT, manifestDocument.file);
  const rawMarkdown = await readFile(filePath, "utf8");
  const markdownBody = stripFrontmatter(rawMarkdown);
  const slug = manifestDocument.file.replace(/\.md$/, "");
  const rawChecksum = checksum(rawMarkdown);
  const chunks = chunkMarkdown(markdownBody);

  return {
    slug,
    row: {
      title: manifestDocument.title,
      slug,
      sourceType: "synthetic",
      category: manifestDocument.category,
      filePath: path.relative(process.cwd(), filePath),
      mimeType: "text/markdown",
      checksum: rawChecksum,
      status: "ready",
      wordCount: countWords(markdownBody),
      metadata: {
        manifestId: manifestDocument.id,
        tags: manifestDocument.tags,
        sourceType: "synthetic_demo_knowledge",
      },
    },
    chunks,
    manifestDocument,
  };
}

async function ingestDocuments(
  manifestDocuments: ManifestDocument[],
): Promise<{ documentCount: number; chunkCount: number }> {
  const db = getDb();
  const preparedDocuments = await Promise.all(
    manifestDocuments.map((manifestDocument) => prepareDocument(manifestDocument)),
  );
  const insertedDocuments: Array<{ id: string; slug: string }> = [];

  for (
    let index = 0;
    index < preparedDocuments.length;
    index += INSERT_BATCH_SIZE
  ) {
    const batch = preparedDocuments.slice(index, index + INSERT_BATCH_SIZE);
    const returnedDocuments = await db
      .insert(documents)
      .values(batch.map((document) => document.row))
      .onConflictDoUpdate({
        target: documents.slug,
        set: {
          title: sql`excluded.title`,
          sourceType: sql`excluded.source_type`,
          category: sql`excluded.category`,
          filePath: sql`excluded.file_path`,
          mimeType: sql`excluded.mime_type`,
          checksum: sql`excluded.checksum`,
          status: sql`excluded.status`,
          wordCount: sql`excluded.word_count`,
          metadata: sql`excluded.metadata`,
          updatedAt: new Date(),
        },
      })
      .returning({ id: documents.id, slug: documents.slug });

    insertedDocuments.push(...returnedDocuments);
  }

  const documentIds = insertedDocuments.map((document) => document.id);

  for (let index = 0; index < documentIds.length; index += INSERT_BATCH_SIZE) {
    await db
      .delete(documentChunks)
      .where(
        inArray(
          documentChunks.documentId,
          documentIds.slice(index, index + INSERT_BATCH_SIZE),
        ),
      );
  }

  const documentIdBySlug = new Map(
    insertedDocuments.map((document) => [document.slug, document.id]),
  );
  const chunkRows: NewDocumentChunk[] = preparedDocuments.flatMap((document) => {
    const documentId = documentIdBySlug.get(document.slug);

    if (!documentId) {
      throw new Error(`Missing document id for ${document.slug}`);
    }

    return document.chunks.map((chunk, index) => ({
      documentId,
      chunkIndex: index,
      heading: chunk.heading,
      content: chunk.content,
      tokenCount: chunk.wordCount,
      metadata: {
        manifestId: document.manifestDocument.id,
        sourceFile: document.manifestDocument.file,
        chunkingStrategy: "heading-aware-word-window",
      },
    }));
  });

  await insertInBatches(documentChunks, chunkRows);

  return {
    documentCount: preparedDocuments.length,
    chunkCount: chunkRows.length,
  };
}

async function ingestDataset(fileName: string): Promise<{ recordCount: number }> {
  const kind = datasetKindByFile[fileName];

  if (!kind) {
    throw new Error(`Unsupported dataset file: ${fileName}`);
  }

  const db = getDb();
  const sourcePath = path.join(DATASETS_ROOT, fileName);
  const records = await readJsonFile<Array<Record<string, unknown>>>(sourcePath);
  const name = getDatasetName(fileName);

  const [dataset] = await db
    .insert(datasets)
    .values({
      name,
      kind,
      sourcePath: path.relative(process.cwd(), sourcePath),
      rowCount: records.length,
      metadata: {
        source: "synthetic_demo_dataset",
        fileName,
      },
    })
    .onConflictDoUpdate({
      target: [datasets.name, datasets.kind],
      set: {
        sourcePath: path.relative(process.cwd(), sourcePath),
        rowCount: records.length,
        metadata: {
          source: "synthetic_demo_dataset",
          fileName,
        },
        updatedAt: new Date(),
      },
    })
    .returning({ id: datasets.id });

  await db.delete(datasetRecords).where(eq(datasetRecords.datasetId, dataset.id));

  const datasetRows: NewDatasetRecord[] = records.map((record, index) => ({
    datasetId: dataset.id,
    externalId: getDatasetRecordId(record, index),
    record,
  }));

  await insertInBatches(datasetRecords, datasetRows);

  return { recordCount: datasetRows.length };
}

async function main() {
  const manifest = await readJsonFile<KnowledgeManifest>(MANIFEST_PATH);
  const datasetFiles = (await readdir(DATASETS_ROOT))
    .filter((fileName) => fileName.endsWith(".json"))
    .sort();

  const stats: IngestionStats = {
    documents: 0,
    chunks: 0,
    datasets: 0,
    datasetRecords: 0,
  };

  const documentResult = await ingestDocuments(manifest.documents);
  stats.documents = documentResult.documentCount;
  stats.chunks = documentResult.chunkCount;

  for (const fileName of datasetFiles) {
    const result = await ingestDataset(fileName);
    stats.datasets += 1;
    stats.datasetRecords += result.recordCount;
  }

  console.log("Knowledge base ingestion complete:");
  console.log(`- Documents: ${stats.documents}`);
  console.log(`- Document chunks: ${stats.chunks}`);
  console.log(`- Datasets: ${stats.datasets}`);
  console.log(`- Dataset records: ${stats.datasetRecords}`);
  console.log(`- Manifest documents expected: ${manifest.documentCount}`);
}

main().catch((error) => {
  console.error("Knowledge base ingestion failed.");
  console.error(error);
  process.exit(1);
});

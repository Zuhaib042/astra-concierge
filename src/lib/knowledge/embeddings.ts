import type { GoogleEmbeddingModelOptions } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

import { EMBEDDING_DIMENSIONS } from "@/db/schema";
import { getGeminiEmbeddingModel } from "@/lib/ai/gemini";

export type KnowledgeEmbeddingInput = {
  title: string;
  category: string;
  heading: string | null;
  content: string;
};

export function buildKnowledgeEmbeddingText(input: KnowledgeEmbeddingInput) {
  return [
    `Title: ${input.title}`,
    `Category: ${input.category}`,
    input.heading ? `Section: ${input.heading}` : null,
    "",
    input.content,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function embedKnowledgeDocuments(values: string[]) {
  const result = await embedMany({
    model: getGeminiEmbeddingModel(),
    values,
    maxParallelCalls: 1,
    providerOptions: {
      google: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
        taskType: "RETRIEVAL_DOCUMENT",
      } satisfies GoogleEmbeddingModelOptions,
    },
  });

  return result.embeddings;
}

export async function embedKnowledgeQuery(query: string) {
  const result = await embed({
    model: getGeminiEmbeddingModel(),
    value: query,
    providerOptions: {
      google: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
        taskType: "RETRIEVAL_QUERY",
      } satisfies GoogleEmbeddingModelOptions,
    },
  });

  return result.embedding;
}

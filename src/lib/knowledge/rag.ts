import {
  searchKnowledgeBase,
  type KnowledgeSearchResult,
} from "@/lib/knowledge/search";

const DEFAULT_RAG_SOURCE_LIMIT = 6;
const MAX_SOURCE_CONTENT_LENGTH = 1_600;

export type RagSource = KnowledgeSearchResult & {
  citationId: string;
};

export type RagContext = {
  sources: RagSource[];
  promptContext: string;
};

export type RagSourceSummary = {
  citationId: string;
  title: string;
  category: string;
  heading: string | null;
  filePath: string | null;
  similarity: number;
};

function truncateForPrompt(content: string) {
  if (content.length <= MAX_SOURCE_CONTENT_LENGTH) {
    return content;
  }

  return `${content.slice(0, MAX_SOURCE_CONTENT_LENGTH).trim()}...`;
}

function formatSourceForPrompt(source: RagSource) {
  return [
    `[${source.citationId}]`,
    `Title: ${source.title}`,
    `Category: ${source.category}`,
    source.heading ? `Section: ${source.heading}` : null,
    source.filePath ? `Source path: ${source.filePath}` : null,
    `Similarity: ${source.similarity.toFixed(3)}`,
    "",
    truncateForPrompt(source.content),
  ]
    .filter(Boolean)
    .join("\n");
}

export function summarizeRagSources(sources: RagSource[]): RagSourceSummary[] {
  return sources.map((source) => ({
    citationId: source.citationId,
    title: source.title,
    category: source.category,
    heading: source.heading,
    filePath: source.filePath,
    similarity: source.similarity,
  }));
}

export async function retrieveRagContext(
  query: string,
  limit = DEFAULT_RAG_SOURCE_LIMIT,
): Promise<RagContext> {
  const results = await searchKnowledgeBase(query, limit);
  const sources = results.map((source, index) => ({
    ...source,
    citationId: `S${index + 1}`,
  }));

  if (sources.length === 0) {
    return {
      sources,
      promptContext:
        "No relevant knowledge-base sources were found for this question.",
    };
  }

  return {
    sources,
    promptContext: sources.map(formatSourceForPrompt).join("\n\n---\n\n"),
  };
}

import { config } from "dotenv";

import { searchKnowledgeBase } from "../src/lib/knowledge/search";

config({ path: ".env.local" });
config({ path: ".env" });

function createSnippet(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 220
    ? `${normalized.slice(0, 220).trim()}...`
    : normalized;
}

async function main() {
  const query =
    process.argv.slice(2).join(" ") ||
    "How can Astra help a service business qualify leads and hand off to a CRM?";
  const results = await searchKnowledgeBase(query, 5);

  console.log(`Query: ${query}`);
  console.log(`Results: ${results.length}`);

  for (const [index, result] of results.entries()) {
    console.log("");
    console.log(`#${index + 1} ${result.title}`);
    console.log(`Similarity: ${result.similarity.toFixed(3)}`);
    console.log(`Category: ${result.category}`);
    console.log(`Section: ${result.heading ?? "Untitled section"}`);
    console.log(`Source: ${result.filePath ?? result.documentId}`);
    console.log(createSnippet(result.content));
  }
}

main().catch((error) => {
  console.error("Knowledge search failed.");
  console.error(error);
  process.exit(1);
});

# Database Layer

This folder owns the database boundary for Astra Concierge.

## Files

- `schema.ts` defines the database tables, enums, indexes, relationships, and TypeScript insert/select types.
- `client.ts` creates the Neon + Drizzle client lazily, which keeps `next build` working before a real `DATABASE_URL` is configured.

## Table Map

- `conversations`: one chat session with a visitor or lead.
- `messages`: individual user, assistant, system, or tool messages inside a conversation.
- `documents`: one source document, upload, URL import, or synthetic knowledge file.
- `document_chunks`: searchable pieces of a document. Embeddings are nullable because chunking and embedding happen in separate steps.
- `leads`: structured sales opportunities captured from chat.
- `datasets`: named quantitative demo datasets such as analytics, pricing, or support tickets.
- `dataset_records`: flexible JSON rows inside those datasets.

## Learning Notes

The schema separates durable business objects from AI processing details. A document is the original source. A document chunk is the smaller unit we retrieve during RAG. A message is the exact conversation turn we can replay or audit later. A lead is a business outcome extracted from the chat.

The vector column uses 768 dimensions so Gemini can store compact vectors for semantic search.

The `kb:ingest` script fills the knowledge tables before embeddings exist. That gives us inspectable text chunks first.

The `kb:embed` script updates those chunks with Gemini embeddings. It only selects rows where `embedding IS NULL`, which makes it resumable if a quota limit or connection issue interrupts the run.

The `kb:search` script is the retrieval smoke test. It embeds a search query, compares that query vector against `document_chunks.embedding` with `pgvector` cosine distance, and returns the most relevant chunks. This is the retrieval layer we will plug into the chat API in the RAG chunk.

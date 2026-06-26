# Astra Concierge

A premium AI concierge chatbot for showcasing AI automation and integration work.

Read `PROJECT_CONTEXT.md` before making implementation decisions. This project is both a portfolio product and a learning project.

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Synthetic Knowledge Base

Generate the demo knowledge corpus with:

```bash
npm run kb:generate
```

This creates `content/knowledge` with synthetic Markdown source documents, lead records, support tickets, integration metrics, analytics, package pricing, and a manifest for future ingestion.

After running database migrations, ingest the generated corpus into Neon with:

```bash
npm run kb:ingest
```

This stores Markdown files as `documents` and `document_chunks`, and stores JSON files as `datasets` and `dataset_records`.

Create Gemini embeddings for document chunks with:

```bash
npm run kb:embed
```

The embedding script only processes chunks that do not already have vectors, so it is safe to stop and rerun. It uses a conservative batch delay for Gemini's free-tier quota. For a small smoke test, you can run:

```bash
npm run kb:embed -- --limit=20 --delay=0
```

Search the vectorized knowledge base with:

```bash
npm run kb:search -- "AI website concierge for automotive service centers"
```

This embeds the query, searches `document_chunks` with `pgvector`, and prints the most relevant source chunks with similarity scores.

## Database

The project uses Neon Postgres with Drizzle ORM. Add your Neon connection string to `.env.local`:

```bash
DATABASE_URL="postgres://user:password@ep-example.neon.tech/neondb?sslmode=require"
```

Useful commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

The first migration creates conversations, messages, documents, document chunks, leads, and flexible dataset records. The `document_chunks.embedding` column uses `pgvector` with 768 dimensions for Gemini embeddings and similarity search.

## First Milestone

- Clean Next.js scaffold
- Premium first-screen chat experience
- Basic Gemini streaming chat endpoint

The UI, Gemini endpoint, synthetic knowledge base seed, database foundation, Neon knowledge ingestion, embeddings, and vector search are now in place. Conversation persistence, RAG retrieval, citations, and dashboards will be added in later chunks.

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

The first migration creates conversations, messages, documents, document chunks, leads, and flexible dataset records. The `document_chunks.embedding` column uses `pgvector` with 768 dimensions so the next chunks can add Gemini embeddings and similarity search.

## First Milestone

- Clean Next.js scaffold
- Premium first-screen chat experience
- Basic Gemini streaming chat endpoint

The UI, Gemini endpoint, synthetic knowledge base seed, database foundation, and Neon knowledge ingestion are now in place. Conversation persistence, embeddings, RAG retrieval, citations, and dashboards will be added in later chunks.

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

The live chat route also uses this retrieval layer. For each visitor question, `/api/chat` embeds the latest user message, retrieves relevant chunks, adds numbered sources to Astra's system prompt, and streams a Gemini answer with inline citations like `[S1]`.

Chat messages are persisted to Neon. The browser creates a session-scoped conversation id, sends it with each chat request, and `/api/chat` stores the latest visitor message plus the completed assistant response in `conversations` and `messages`.

Lead capture is also wired into the chat route. When a visitor shows buying intent, asks for pricing, requests a call, or shares contact details, Gemini can call Astra's `captureLead` tool. The tool saves or updates a structured row in `leads` and marks the conversation as `qualified` when contact details and intent are strong enough.

## Admin Dashboard

Open the read-only admin dashboard at:

```txt
http://localhost:3000/admin
```

The dashboard reads from Neon and summarizes conversations, leads, messages, embedded knowledge coverage, document categories, top lead intents, and recent saved chat turns. Before sharing a production deployment publicly, protect this route with authentication or Vercel project protection because it exposes operational data.

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

The UI, Gemini endpoint, synthetic knowledge base seed, database foundation, Neon knowledge ingestion, embeddings, vector search, RAG chat citations, conversation persistence, and lead capture are now in place. Knowledge upload, dashboards, and deployment polish will be added in later chunks.

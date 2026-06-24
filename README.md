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

## First Milestone

- Clean Next.js scaffold
- Premium first-screen chat experience
- Basic Gemini streaming chat endpoint

The UI, Gemini endpoint, and synthetic knowledge base seed are now in place. Database, embeddings, RAG retrieval, citations, and dashboards will be added in later chunks.

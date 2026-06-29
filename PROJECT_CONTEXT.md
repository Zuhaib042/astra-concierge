# Astra Concierge Project Context

This file is the project memory for `astra-concierge`.

Before starting work in a new chat or a resumed session, read this file first so the project stays aligned with the original goal, stack, teaching style, and code-quality standards.

## Project Name

`astra-concierge`

## Main Goal

Build a premium AI concierge chatbot that can be shown to potential clients as proof that we can build sophisticated AI automation and integration products.

This is also a learning project. The developer should understand each major step, not just receive generated code.

## Product Positioning

Astra Concierge is not just a basic chatbot. It should feel like an AI business concierge for service-based companies.

It should be able to:

- Answer user questions clearly and professionally.
- Explain services, pricing, onboarding, policies, and processes.
- Use uploaded business documents as its knowledge base.
- Cite the sources it used when answering from documents.
- Capture leads from chat.
- Qualify user intent.
- Recommend services or packages.
- Create callback or discovery-call requests.
- Show an admin dashboard for conversations, leads, documents, and analytics.

The first demo business can be an AI automation agency, because that directly supports the goal of getting AI automation and integration clients.

## Agreed Technology Stack

- Framework: Next.js with App Router
- Language: TypeScript
- AI model provider: Gemini API
- AI chat plumbing: Vercel AI SDK with `@ai-sdk/google`
- Database: Neon Postgres
- Vector search: `pgvector`
- ORM and migrations: Drizzle ORM
- UI system: Tailwind CSS and shadcn/ui
- Motion: Framer Motion for tasteful micro-interactions
- Deployment: Vercel Hobby for the portfolio/demo deployment

Important note: Vercel AI SDK is used as a free/open-source TypeScript toolkit. We are not depending on Vercel AI Gateway for model access. Gemini API is the model provider.

## Core Architecture

Chat flow:

```txt
User sends message
  -> Next.js chat UI
  -> /api/chat route
  -> load conversation context
  -> search relevant document chunks in Neon with pgvector
  -> send user message + retrieved context to Gemini
  -> stream the answer back to the UI
  -> save the assistant response and metadata
```

Knowledge base flow:

```txt
Admin uploads document
  -> extract text
  -> split text into chunks
  -> create Gemini embeddings
  -> store documents, chunks, and vectors in Neon
  -> retrieve relevant chunks during chat
```

## Planned Work Chunks

1. Project scaffold
   - Learn: Next.js App Router, TypeScript, project structure.

2. Premium UI shell
   - Learn: Tailwind, shadcn/ui, layout, responsive design, visual polish.

3. Basic chat UI
   - Learn: message state, input handling, loading states, streaming UX.

4. Gemini streaming chat API
   - Learn: server routes, environment variables, Gemini model calls, Vercel AI SDK streaming.

5. Neon and Drizzle setup
   - Learn: database connection, schema design, migrations.

5a. Synthetic knowledge base generation
   - Learn: generating realistic qualitative and quantitative demo knowledge without hand-writing every source document.

5b. Knowledge base ingestion into Neon
   - Learn: turning generated Markdown and JSON files into durable database records.

6. Conversation persistence
   - Learn: storing conversations and messages cleanly.

7. Knowledge base upload
   - Learn: file upload, text extraction, document records.

8. Embeddings and vector search
   - Learn: embeddings, `pgvector`, similarity search, document chunks.

9. RAG answers with citations
   - Learn: retrieval augmented generation, grounding, source citations.

10. Tool calling and automations
    - Learn: lead capture, callback request creation, structured tool inputs.

11. Admin dashboard
    - Learn: dashboards, tables, filters, analytics, document management.

12. Polish and deployment
    - Learn: production checks, env vars, Vercel deployment, demo readiness.

## Teaching Protocol

For every meaningful chunk, the assistant should teach while building.

Use this rhythm:

1. Explain the goal in plain English.
2. List the files that will be touched.
3. Implement the code.
4. Explain the important code section by section.
5. Run or describe verification.
6. Summarize what the developer should now understand.
7. Suggest a small practice change when useful.

Do not dump unexplained code. The developer wants to learn the system deeply enough to explain it to clients.

## Code Quality Standards

The codebase must be highly organized, modular, maintainable, and easy to understand.

Follow these rules:

- Prefer small, focused modules over large files.
- Use clear names for files, functions, components, variables, and database tables.
- Keep business logic separate from UI rendering where practical.
- Keep database schema, AI logic, retrieval logic, and UI components in predictable folders.
- Avoid clever code when simple code is clearer.
- Add comments only where they explain why something exists or clarify non-obvious logic.
- Use TypeScript types to make data flow understandable.
- Validate inputs at API boundaries.
- Handle loading, empty, success, and error states in the UI.
- Keep the design premium but practical, with no unnecessary decorative clutter.
- Prefer reusable components only when reuse is real and helpful.
- Keep each milestone working before moving to the next.

The target is a codebase that a beginner can navigate and a professional can respect.

## First Milestone

Build:

- A clean Next.js project scaffold.
- A premium first-screen chat experience.
- A basic Gemini streaming chat endpoint.

Do not start with the database. First make the assistant feel alive, then add memory, documents, retrieval, automations, and the dashboard step by step.

## Progress Log

- Chunk 1 complete: created the initial Next.js App Router scaffold with TypeScript, Tailwind CSS, ESLint, project metadata, root layout, and a simple landing page.
- Verification for Chunk 1: `npm run lint`, `npm run typecheck`, and `npm run build` all pass. The local dev server renders `http://localhost:3000` with no browser console errors or Next.js error overlay.
- Chunk 2 complete: replaced the placeholder page with a premium static UI shell using shadcn-style primitives, lucide icons, focused landing components, demo data constants, and a responsive chat preview.
- Verification for Chunk 2: `npm run lint`, `npm run typecheck`, and `npm run build` all pass. Browser checks passed on desktop and 390px mobile width with no console errors, no Next.js error overlay, and no horizontal overflow.
- Chunk 3 complete: replaced the static chat preview with an interactive client-side chat workspace. Added local message state, prompt chips, textarea input, submit handling, auto-scroll, source badges, and a simulated streaming assistant response.
- Verification for Chunk 3: `npm run lint`, `npm run typecheck`, and `npm run build` all pass. Browser interaction checks passed for clicking a suggested prompt and sending a typed message. Mobile verification passed at 390px width with no console errors, no Next.js error overlay, and no horizontal overflow.
- Chunk 4 complete: replaced the simulated chat stream with a real Vercel AI SDK chat pipeline. Added `@ai-sdk/google`, `@ai-sdk/react`, `ai`, AI Elements message rendering, a server-only Gemini model helper, an Astra system prompt, `/api/chat`, `.env.example`, and client-side `useChat` wiring.
- Verification for Chunk 4: `npm run lint`, `npm run typecheck`, and `npm run build` all pass. Browser checks passed on desktop and 390px mobile width with no console errors, no Next.js error overlay, and no horizontal overflow. Because `.env.local` is not configured yet, submitting a prompt returns the expected setup state from `/api/chat` instead of a live Gemini answer.
- Setup note for Chunk 4: create `.env.local` with `GOOGLE_GENERATIVE_AI_API_KEY` before expecting live Gemini responses locally or in Vercel.
- Audit note: `npm audit` currently reports 2 moderate advisories from PostCSS bundled inside Next.js. The suggested `npm audit fix --force` would downgrade Next, so do not apply it automatically.
- Knowledge-base generation chunk complete: added `@faker-js/faker`, `json-schema-faker`, and `scripts/generate-knowledge-base.mjs`. The generator creates a deterministic synthetic corpus under `content/knowledge` with 437 Markdown source documents and structured JSON datasets for 250 leads, 320 support tickets, 40 integration metric records, 180 analytics records, and 4 package-pricing records.
- Verification for knowledge-base generation: `npm run kb:generate`, `npm run lint`, `npm run typecheck`, and `npm run build` all pass. The generated Markdown corpus is about 101k words and includes service briefs, integration playbooks, case studies, FAQs, objection handling, security policies, implementation plans, lead playbooks, and support policies.
- Chunk 5 complete: added Neon + Drizzle database foundation with `drizzle.config.ts`, a lazy build-safe database client, schema definitions, typed table helpers, database npm scripts, `.env.example` documentation, and the first SQL migration. The schema covers conversations, messages, documents, document chunks with nullable `pgvector` embeddings, leads, datasets, and dataset records.
- Verification for Chunk 5: `npm run db:generate`, `npm run lint`, `npm run typecheck`, and `npm run build` all pass without `DATABASE_URL` configured, because the database client initializes lazily.
- Database activation complete: `npm run db:migrate` successfully applied the first Drizzle migration to Neon after `DATABASE_URL` was configured.
- Chunk 5b complete: added `scripts/ingest-knowledge-base.ts` and `npm run kb:ingest`. The importer reads `content/knowledge/manifest.json`, stores generated Markdown as `documents` and `document_chunks`, and stores generated JSON datasets as `datasets` and `dataset_records`. The importer is idempotent and batched for Neon, so it can refresh the generated corpus without duplicating rows.
- Verification for Chunk 5b: `npm run kb:ingest` completed against Neon with 437 documents, 2,303 document chunks, 5 datasets, and 794 dataset records. `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- Chunk 8 implementation complete: added Gemini embedding helpers, `npm run kb:embed`, vector search with `pgvector`, and `npm run kb:search`. The embedding script is resumable, stores metadata on each embedded chunk, and uses separate Gemini task types for document embeddings and query embeddings.
- Verification for Chunk 8: `npm run kb:embed -- --limit=20 --delay=0` completed, bringing the current embedded total to 116 chunks. `npm run kb:search -- "AI website concierge for automotive service centers pricing implementation handoff"` returned the correct automotive service-center concierge source document as the top result. Full corpus embedding is intentionally resumable because Gemini free-tier embedding quota can pause long runs; rerun `npm run kb:embed` to continue processing remaining chunks at the default throttled pace.
- Chunk 9 complete: wired RAG retrieval into `/api/chat`. The chat route now extracts the latest user text, retrieves relevant knowledge chunks with vector search, formats numbered source blocks for Gemini, instructs Astra to cite sources inline as `[S1]`, and attaches source summaries to the streamed assistant message metadata for UI badges.
- Verification for Chunk 9: `npm run lint`, `npm run typecheck`, and `npm run build` pass. A runtime `/api/chat` smoke test against the local dev server returned a Gemini answer grounded in the automotive service-center concierge source document, with inline citations and `messageMetadata.sources` in the UI message stream.
- Chunk 6 complete: added conversation persistence after the RAG layer. The browser now sends a session-scoped conversation id, `/api/chat` ensures an active web conversation exists, saves the latest visitor message before generation, and saves the completed assistant message with source summaries after streaming finishes. Persistence is idempotent by UI message id to avoid duplicate rows during retries/regeneration.
- Verification for Chunk 6: `npm run lint`, `npm run typecheck`, and `npm run build` pass. Runtime persistence smoke testing was skipped because the Gemini daily embedding/API quota was already exhausted during knowledge embedding work.
- Chunk 10 lead-capture slice complete: added an AI SDK `captureLead` tool, structured JSON schema validation, lead persistence into Neon, conversation qualification updates, and a live UI badge for lead tool results. Astra is instructed to call the tool when visitors show buying intent, request pricing/calls, share contact details, or describe a concrete automation need.
- Verification for Chunk 10: `npm run lint`, `npm run typecheck`, and `npm run build` pass. A live `/api/chat` smoke test with a fake BrightCare Dental prospect triggered the `captureLead` tool, saved a qualified high-priority lead in Neon, continued the response after the tool result, and returned RAG source metadata.

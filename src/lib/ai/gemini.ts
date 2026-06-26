import { createGoogleGenerativeAI } from "@ai-sdk/google";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";

export class MissingGeminiApiKeyError extends Error {
  constructor() {
    super(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY, GEMINI_API_KEY, or GOOGLE_API_KEY.",
    );
    this.name = "MissingGeminiApiKeyError";
  }
}

function getGeminiApiKey() {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_API_KEY
  );
}

function getGoogleProvider() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new MissingGeminiApiKeyError();
  }

  return createGoogleGenerativeAI({ apiKey });
}

export function getGeminiModel() {
  const google = getGoogleProvider();

  return google(process.env.GEMINI_MODEL_ID ?? DEFAULT_GEMINI_MODEL);
}

export function getGeminiEmbeddingModel() {
  const google = getGoogleProvider();

  return google.embedding(
    process.env.GEMINI_EMBEDDING_MODEL_ID ?? DEFAULT_GEMINI_EMBEDDING_MODEL,
  );
}

import { createGoogleGenerativeAI } from "@ai-sdk/google";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

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

export function getGeminiModel() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new MissingGeminiApiKeyError();
  }

  const google = createGoogleGenerativeAI({ apiKey });

  return google(process.env.GEMINI_MODEL_ID ?? DEFAULT_GEMINI_MODEL);
}

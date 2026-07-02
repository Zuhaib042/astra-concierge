export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  name: string;
  content: string;
  timestamp: string;
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    name: "Astra",
    content:
      "Welcome. I can explain your services, guide visitors toward the right next step, and prepare a qualified handoff when someone is ready to talk.",
    timestamp: "09:30",
  },
  {
    id: "welcome-2",
    role: "user",
    name: "Visitor",
    content:
      "Can you build an AI assistant that answers from our service docs and captures qualified leads?",
    timestamp: "09:31",
  },
  {
    id: "welcome-3",
    role: "assistant",
    name: "Astra",
    content:
      "Yes. A strong setup includes business-aware answers, lead qualification, callback requests, and an owner dashboard that shows what visitors need most.",
    timestamp: "09:31",
  },
];

export const SUGGESTED_PROMPTS = [
  "What would this cost for my business?",
  "Can you integrate with our CRM?",
  "How long does implementation take?",
  "What happens when the assistant cannot answer?",
] as const;

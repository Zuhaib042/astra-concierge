export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  name: string;
  content: string;
  sources: readonly string[];
  timestamp: string;
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    name: "Astra",
    content:
      "Welcome. I can explain automation services, answer from approved business documents, and prepare a qualified lead handoff when a visitor is ready.",
    sources: ["Service playbook", "Qualification policy"],
    timestamp: "09:30",
  },
  {
    id: "welcome-2",
    role: "user",
    name: "Visitor",
    content:
      "Can you build an AI assistant that answers from our service docs and captures qualified leads?",
    sources: [],
    timestamp: "09:31",
  },
  {
    id: "welcome-3",
    role: "assistant",
    name: "Astra",
    content:
      "Yes. The recommended setup is a concierge flow with document-grounded answers, visible citations, lead scoring, callback requests, and an owner dashboard for missed questions.",
    sources: ["Automation packages", "Client onboarding guide"],
    timestamp: "09:31",
  },
];

export const SUGGESTED_PROMPTS = [
  "What would this cost for my business?",
  "Can you integrate with our CRM?",
  "How long does implementation take?",
  "What happens when the assistant cannot answer?",
] as const;

const automationLabels = [
  {
    keywords: ["cost", "price", "pricing", "budget"],
    label: "Lead qualification started",
  },
  {
    keywords: ["crm", "hubspot", "salesforce", "integration", "integrate"],
    label: "CRM handoff prepared",
  },
  {
    keywords: ["long", "timeline", "implementation", "take", "launch"],
    label: "Project scope drafted",
  },
  {
    keywords: ["cannot", "can't", "unknown", "handoff", "support"],
    label: "Knowledge gap logged",
  },
] as const;

export function getAutomationLabelForPrompt(prompt: string) {
  const normalizedPrompt = prompt.toLowerCase();

  const match = automationLabels.find((item) =>
    item.keywords.some((keyword) => normalizedPrompt.includes(keyword)),
  );

  return match?.label ?? "Conversation summarized";
}

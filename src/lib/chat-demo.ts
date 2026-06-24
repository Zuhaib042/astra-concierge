export type ChatRole = "visitor" | "assistant";

export type ChatMessageStatus = "complete" | "streaming";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  name: string;
  content: string;
  sources: readonly string[];
  timestamp: string;
  status: ChatMessageStatus;
}

export interface DemoReply {
  content: string;
  sources: readonly string[];
  intentLabel: string;
  automationLabel: string;
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
    status: "complete",
  },
  {
    id: "welcome-2",
    role: "visitor",
    name: "Visitor",
    content:
      "Can you build an AI assistant that answers from our service docs and captures qualified leads?",
    sources: [],
    timestamp: "09:31",
    status: "complete",
  },
  {
    id: "welcome-3",
    role: "assistant",
    name: "Astra",
    content:
      "Yes. The recommended setup is a concierge flow with document-grounded answers, visible citations, lead scoring, callback requests, and an owner dashboard for missed questions.",
    sources: ["Automation packages", "Client onboarding guide"],
    timestamp: "09:31",
    status: "complete",
  },
];

export const SUGGESTED_PROMPTS = [
  "What would this cost for my business?",
  "Can you integrate with our CRM?",
  "How long does implementation take?",
  "What happens when the assistant cannot answer?",
] as const;

const replyLibrary = [
  {
    keywords: ["cost", "price", "pricing", "budget"],
    reply: {
      content:
        "For a service business, I would usually split pricing into a discovery phase and a production phase. The discovery phase maps the knowledge base, lead criteria, and integrations. The production phase builds the chatbot, admin visibility, and automations. For a demo estimate, I would qualify document volume, number of integrations, and how much human handoff logic is needed.",
      sources: ["Pricing guide", "Discovery checklist"],
      intentLabel: "Pricing intent",
      automationLabel: "Lead qualification started",
    },
  },
  {
    keywords: ["crm", "hubspot", "salesforce", "integration", "integrate"],
    reply: {
      content:
        "Yes. Astra can capture structured lead details during the conversation and send them into a CRM workflow. The clean implementation is to validate the lead fields first, then call an integration endpoint for tools like HubSpot, Salesforce, Airtable, or a custom webhook.",
      sources: ["Integration map", "Lead capture schema"],
      intentLabel: "Integration intent",
      automationLabel: "CRM handoff prepared",
    },
  },
  {
    keywords: ["long", "timeline", "implementation", "take", "launch"],
    reply: {
      content:
        "A focused first version can usually be launched in stages: UI and chat flow first, knowledge base retrieval next, then lead capture and dashboard visibility. That staged approach gives the client something useful early while keeping the codebase maintainable.",
      sources: ["Implementation plan", "Delivery milestones"],
      intentLabel: "Timeline intent",
      automationLabel: "Project scope drafted",
    },
  },
  {
    keywords: ["cannot", "can't", "unknown", "handoff", "support"],
    reply: {
      content:
        "When Astra cannot answer confidently, it should say so clearly, show what it checked, and offer a handoff path. Those unanswered questions should also appear in the owner dashboard so the business can improve its knowledge base over time.",
      sources: ["Fallback policy", "Knowledge gap report"],
      intentLabel: "Support intent",
      automationLabel: "Knowledge gap logged",
    },
  },
] as const;

const fallbackReply: DemoReply = {
  content:
    "Astra would first identify the visitor's goal, search the approved business knowledge, and answer in a helpful client-facing tone. If the question shows buying intent, it can ask for the right lead details and prepare a clean handoff for the owner.",
  sources: ["Service playbook", "Automation packages"],
  intentLabel: "General inquiry",
  automationLabel: "Conversation summarized",
};

export function buildDemoReply(prompt: string): DemoReply {
  const normalizedPrompt = prompt.toLowerCase();

  const match = replyLibrary.find((item) =>
    item.keywords.some((keyword) => normalizedPrompt.includes(keyword)),
  );

  return match?.reply ?? fallbackReply;
}

export function splitReplyIntoChunks(reply: string) {
  return reply.match(/\S+\s*/g) ?? [];
}

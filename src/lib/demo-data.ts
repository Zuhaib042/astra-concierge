export const NAV_ITEMS = [
  { label: "Concierge", href: "#concierge-demo" },
  { label: "About", href: "#about" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "Dashboard", href: "/admin" },
] as const;

export const OUTCOME_METRICS = [
  {
    label: "Always available",
    value: "24/7",
    detail: "Answers visitors after hours and during busy periods",
  },
  {
    label: "Lead handoff",
    value: "Sales-ready",
    detail: "Collects intent, contact, timeline, and budget signals",
  },
  {
    label: "Business context",
    value: "437+",
    detail: "Service guides, FAQs, policies, and playbooks prepared",
  },
] as const;

export const CAPABILITY_SUMMARY = [
  {
    title: "Answers from your business",
    description:
      "Astra can be prepared with your services, pricing rules, policies, FAQs, offers, onboarding steps, and objection handling.",
  },
  {
    title: "Qualifies serious buyers",
    description:
      "When a visitor is ready, Astra asks for the details your team needs instead of sending every conversation to sales.",
  },
  {
    title: "Gives owners clear visibility",
    description:
      "The dashboard shows conversations, qualified leads, common requests, and where the concierge needs better business content.",
  },
] as const;

export const AUTOMATION_EVENTS = [
  {
    title: "Visitor asks a buying question",
    detail: "Astra explains the offer clearly and keeps the conversation moving.",
    status: "complete",
  },
  {
    title: "Fit and urgency are clarified",
    detail: "The concierge gathers the right details for a useful sales follow-up.",
    status: "active",
  },
  {
    title: "Your team receives the context",
    detail: "The handoff includes the visitor need, budget range, timeline, and contact details.",
    status: "pending",
  },
] as const;

export const ABOUT_CAPABILITIES = [
  {
    title: "Service explanation",
    description:
      "Explain offers, packages, pricing ranges, process, timelines, guarantees, and support policies in a calm sales-ready tone.",
  },
  {
    title: "Smart recommendations",
    description:
      "Recommend the right service path based on the visitor's business type, urgency, goals, and current tools.",
  },
  {
    title: "Lead capture",
    description:
      "Collect name, email, company, budget, timeline, and need without making the conversation feel like a long form.",
  },
  {
    title: "Human handoff",
    description:
      "Prepare a clean summary so the owner or sales team can follow up with context instead of starting from zero.",
  },
  {
    title: "Business dashboard",
    description:
      "Show owners what visitors ask for, which leads are ready, and which services create the most demand.",
  },
  {
    title: "Content improvement",
    description:
      "Reveal missing answers, repeated objections, and high-value questions that should become better website content.",
  },
] as const;

export const TAILORING_STEPS = [
  "Map your services, qualification rules, offers, and common objections.",
  "Load approved FAQs, policies, pricing guidance, case studies, and sales playbooks.",
  "Shape the concierge tone so it feels like your brand, not a generic chatbot.",
  "Connect the handoff to your preferred workflow, such as email, CRM, calendar, or support desk.",
] as const;

export const BUSINESS_OUTCOMES = [
  "Fewer missed website leads",
  "Faster answers for common questions",
  "Cleaner sales follow-up",
  "A better first impression for premium services",
] as const;

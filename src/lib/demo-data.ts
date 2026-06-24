export const NAV_ITEMS = [
  { label: "Demo", href: "#concierge-demo" },
  { label: "Knowledge", href: "#knowledge" },
  { label: "Leads", href: "#leads" },
  { label: "Insights", href: "#insights" },
] as const;

export const OUTCOME_METRICS = [
  {
    label: "Avg. first response",
    value: "1.2s",
    detail: "Streaming answer preview",
  },
  {
    label: "Lead readiness",
    value: "84%",
    detail: "Qualified from chat intent",
  },
  {
    label: "Knowledge coverage",
    value: "36 docs",
    detail: "Policies, pricing, service FAQs",
  },
] as const;

export const CAPABILITY_SUMMARY = [
  {
    title: "Document-grounded answers",
    description:
      "Responds from approved business knowledge instead of generic model memory.",
  },
  {
    title: "Lead qualification",
    description:
      "Detects buying intent and asks for the few details a sales team needs.",
  },
  {
    title: "Owner visibility",
    description:
      "Surfaces conversations, unresolved questions, and content gaps for the business.",
  },
] as const;

export const AUTOMATION_EVENTS = [
  {
    title: "Intent detected",
    detail: "Visitor asked about implementation scope",
    status: "complete",
  },
  {
    title: "Lead score updated",
    detail: "Budget and timeline mentioned",
    status: "active",
  },
  {
    title: "Callback draft ready",
    detail: "Waiting for contact details",
    status: "pending",
  },
] as const;

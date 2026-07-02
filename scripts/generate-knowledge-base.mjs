import { faker } from "@faker-js/faker";
import { generate } from "json-schema-faker";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const outputRoot = path.join(projectRoot, "content", "knowledge");

const SEED = 20260624;
const GENERATED_AT = "2026-06-24T00:00:00.000Z";

const DOC_COUNTS = {
  services: 24,
  integrations: 40,
  caseStudies: 60,
  faqs: 120,
  objections: 60,
  security: 28,
  implementation: 40,
  leadPlaybooks: 35,
  support: 30,
};

const industries = [
  "dental clinics",
  "medical clinics",
  "law firms",
  "real estate brokerages",
  "home services companies",
  "B2B SaaS teams",
  "marketing agencies",
  "financial advisory firms",
  "insurance agencies",
  "education providers",
  "recruiting agencies",
  "ecommerce brands",
  "property management teams",
  "fitness studios",
  "accounting firms",
  "solar installation companies",
  "consulting practices",
  "event venues",
  "automotive service centers",
  "managed IT providers",
];

const serviceBlueprints = [
  "AI Website Concierge",
  "Document-Grounded Support Assistant",
  "Lead Qualification Chatbot",
  "CRM Handoff Automation",
  "Internal Knowledge Copilot",
  "Appointment Booking Assistant",
  "Proposal Intake Assistant",
  "Customer Onboarding Guide",
  "Support Deflection Bot",
  "Sales Discovery Assistant",
  "Policy Explanation Assistant",
  "Multi-Location Service Bot",
  "Product Recommendation Assistant",
  "Quote Request Automation",
  "Missed Call Follow-Up Agent",
  "Review Response Assistant",
  "Post-Purchase Support Assistant",
  "Operations SOP Copilot",
  "HR Candidate Screening Assistant",
  "Invoice and Billing Helpdesk",
  "Client Portal Search Assistant",
  "Escalation Triage Agent",
  "Training Content Assistant",
  "Executive Briefing Assistant",
];

const integrationApps = [
  "HubSpot",
  "Salesforce",
  "Airtable",
  "Notion",
  "Slack",
  "Google Sheets",
  "Gmail",
  "Calendly",
  "Make",
  "Zapier",
  "Pipedrive",
  "Zoho CRM",
  "Intercom",
  "Zendesk",
  "Freshdesk",
  "Typeform",
  "Jotform",
  "Stripe",
  "Square",
  "QuickBooks",
  "Google Calendar",
  "Microsoft Teams",
  "Outlook",
  "Monday.com",
  "Asana",
  "Trello",
  "ClickUp",
  "Linear",
  "Jira",
  "Shopify",
  "WooCommerce",
  "Webflow",
  "WordPress",
  "Twilio",
  "SendGrid",
  "Resend",
  "Postmark",
  "Customer.io",
  "Segment",
  "Snowflake",
];

const packages = [
  {
    name: "Starter Concierge",
    range: "$2,500-$4,500",
    timeline: "2-3 weeks",
    bestFor: "small teams validating one public-facing assistant",
  },
  {
    name: "Growth Automation",
    range: "$6,000-$12,000",
    timeline: "4-6 weeks",
    bestFor: "teams needing knowledge retrieval plus CRM handoff",
  },
  {
    name: "Scale Copilot Suite",
    range: "$15,000-$35,000",
    timeline: "8-12 weeks",
    bestFor: "multi-team deployments with dashboards and workflows",
  },
  {
    name: "Custom Integration Build",
    range: "$20,000+",
    timeline: "scoped after discovery",
    bestFor: "regulated or complex operations with custom APIs",
  },
];

const objectionThemes = [
  "we already use ChatGPT",
  "our documentation is messy",
  "AI might hallucinate",
  "the budget feels high",
  "our team will not adopt it",
  "we need human approval",
  "we are worried about privacy",
  "we do not know our exact scope",
  "we need results fast",
  "we have too many edge cases",
  "our CRM is custom",
  "we need multilingual support",
  "our service changes often",
  "we cannot expose pricing publicly",
  "we want voice later",
  "our sales team is skeptical",
  "we need executive approval",
  "we tried a chatbot before",
  "we want a cheaper plugin",
  "we need HIPAA-style safeguards",
];

const supportScenarios = [
  "unanswered visitor question",
  "CRM sync failure",
  "lead submitted incomplete contact details",
  "document source conflict",
  "low-confidence answer",
  "visitor requests human callback",
  "appointment slot unavailable",
  "payment question outside approved policy",
  "competitor comparison request",
  "after-hours urgent inquiry",
];

const securityTopics = [
  "API key handling",
  "source citation policy",
  "lead data minimization",
  "human handoff controls",
  "admin access roles",
  "audit logging",
  "retention windows",
  "prompt injection resistance",
  "private document boundaries",
  "integration secrets",
  "PII redaction",
  "analytics privacy",
  "client approval workflow",
  "regulated-data disclaimers",
];

function reseed(offset = 0) {
  faker.seed(SEED + offset);
}

function choice(values) {
  return faker.helpers.arrayElement(values);
}

function sample(values, count) {
  return faker.helpers.arrayElements(values, count);
}

function money(min, max) {
  return `$${faker.number.int({ min, max }).toLocaleString("en-US")}`;
}

function percent(min, max) {
  return `${faker.number.int({ min, max })}%`;
}

function days(min, max) {
  return `${faker.number.int({ min, max })} business days`;
}

function sentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function timesPerMonth(value) {
  return `${value} ${value === 1 ? "time" : "times"} per month`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function sentenceList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function metadataBlock(metadata) {
  const lines = Object.entries(metadata).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: [${value.map((item) => `"${item}"`).join(", ")}]`;
    }

    return `${key}: "${String(value).replaceAll('"', "'")}"`;
  });

  return ["---", ...lines, "---"].join("\n");
}

function buildDocument({ id, title, category, tags, summary, sections }) {
  return `${metadataBlock({
    id,
    title,
    category,
    tags,
    source_type: "synthetic_demo_knowledge",
    generated_at: GENERATED_AT,
  })}

# ${title}

${summary}

${sections
  .map(
    (section) => `## ${section.heading}

${section.body}`,
  )
  .join("\n\n")}
`;
}

async function writeJson(relativePath, data) {
  const target = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(data, null, 2)}\n`);
}

async function writeDoc(relativePath, content) {
  const target = path.join(outputRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}

function qualitativeBenchmarks() {
  return {
    responseCoverage: percent(64, 92),
    handoffReduction: percent(18, 47),
    leadCaptureLift: percent(9, 32),
    setupEffort: `${faker.number.int({ min: 18, max: 90 })} staff hours`,
    reviewCadence: timesPerMonth(faker.number.int({ min: 1, max: 4 })),
  };
}

function buildServiceDoc(index) {
  const service = serviceBlueprints[index % serviceBlueprints.length];
  const industry = choice(industries);
  const appStack = sample(integrationApps, 3);
  const pkg = choice(packages);
  const metrics = qualitativeBenchmarks();
  const title = `${service} for ${industry}`;
  const id = `svc-${String(index + 1).padStart(3, "0")}`;

  return {
    id,
    category: "services",
    title,
    file: `services/${id}-${slugify(title)}.md`,
    tags: ["service", industry, service, ...appStack],
    content: buildDocument({
      id,
      title,
      category: "services",
      tags: ["service", industry, service, ...appStack],
      summary: `This service brief explains how Astra positions ${service} for ${industry}. It gives the chatbot a polished answer path for discovery, scope, pricing, implementation, and handoff.`,
      sections: [
        {
          heading: "Client Problem",
          body: `${sentenceCase(industry)} often lose qualified inquiries because visitors ask detailed questions outside office hours, compare providers before contacting sales, or need a simple explanation before booking. The assistant should reduce hesitation by answering approved questions, identifying buying intent, and routing high-value visitors to a human owner with useful context.`,
        },
        {
          heading: "Recommended Solution",
          body: `Astra should present ${service} as a staged implementation. The first stage creates a focused public-facing assistant. The second stage connects the assistant to ${appStack.join(", ")}. The third stage adds dashboard review, missed-question analysis, and lead scoring. The recommended package is ${pkg.name}, usually priced around ${pkg.range} with a ${pkg.timeline} implementation window.`,
        },
        {
          heading: "Qualification Signals",
          body: sentenceList([
            "The visitor asks about cost, launch timeline, or expected ROI.",
            `The visitor names an existing tool such as ${appStack[0]} or ${appStack[1]}.`,
            `The visitor mentions more than ${faker.number.int({ min: 40, max: 250 })} monthly inquiries or support requests.`,
            "The visitor asks whether the assistant can collect details, book calls, or hand off to staff.",
          ]),
        },
        {
          heading: "Quantitative Benchmarks",
          body: sentenceList([
            `Expected answer coverage after knowledge ingestion: ${metrics.responseCoverage}.`,
            `Estimated human handoff reduction: ${metrics.handoffReduction}.`,
            `Expected lift in captured qualified leads: ${metrics.leadCaptureLift}.`,
            `Internal setup estimate: ${metrics.setupEffort}.`,
            `Recommended content review cadence: ${metrics.reviewCadence}.`,
          ]),
        },
        {
          heading: "Chatbot Answer Guidance",
          body: `When a visitor asks about ${service}, Astra should explain the business outcome first, then mention that final scope depends on document volume, integrations, risk tolerance, and handoff rules. If the visitor sounds ready to buy, ask for their current tools, monthly inquiry volume, and desired launch window.`,
        },
        {
          heading: "Human Handoff Rule",
          body: `Prepare a handoff when the visitor asks for exact pricing, names a live CRM, requests a timeline under ${days(7, 14)}, or mentions a budget above ${money(5000, 25000)}. The handoff summary should include industry, pain point, current tools, urgency, and next best action.`,
        },
      ],
    }),
  };
}

function buildIntegrationDoc(index) {
  const app = integrationApps[index % integrationApps.length];
  const industry = choice(industries);
  const syncDirection = choice([
    "one-way lead push",
    "two-way status sync",
    "event-triggered webhook",
    "scheduled enrichment sync",
  ]);
  const id = `int-${String(index + 1).padStart(3, "0")}`;
  const title = `${app} integration playbook`;

  return {
    id,
    category: "integrations",
    title,
    file: `integrations/${id}-${slugify(title)}.md`,
    tags: ["integration", app, industry, syncDirection],
    content: buildDocument({
      id,
      title,
      category: "integrations",
      tags: ["integration", app, industry, syncDirection],
      summary: `This integration note helps Astra explain how ${app} can connect to a client-facing AI concierge for ${industry}.`,
      sections: [
        {
          heading: "Integration Purpose",
          body: `${app} should be positioned as the system of record or action layer, while Astra remains the conversational intake layer. The assistant should collect structured details, validate required fields, then create or update the relevant record using a ${syncDirection} pattern.`,
        },
        {
          heading: "Recommended Data Fields",
          body: sentenceList([
            "contact_name",
            "email_or_phone",
            "company_name",
            "industry",
            "pain_point",
            "budget_range",
            "implementation_timeline",
            "conversation_summary",
            "lead_score",
            "source_citations_used",
          ]),
        },
        {
          heading: "Reliability Rules",
          body: `The integration should never fire until required fields are validated. If ${app} returns an error, Astra should tell the visitor that the request was captured and mark the conversation for owner review. Retry attempts should be capped at ${faker.number.int({ min: 2, max: 4 })} attempts to avoid duplicate records.`,
        },
        {
          heading: "Quantitative Expectations",
          body: sentenceList([
            `Typical setup complexity: ${faker.number.int({ min: 2, max: 8 })}/10.`,
            `Expected field completion rate after guided prompts: ${percent(68, 94)}.`,
            `Estimated manual copy-paste reduction: ${percent(45, 88)}.`,
            `Recommended QA sample size before launch: ${faker.number.int({ min: 20, max: 60 })} test conversations.`,
          ]),
        },
        {
          heading: "Fallback Handling",
          body: `If the visitor asks for a task ${app} cannot support through the available API, Astra should offer a manual handoff rather than inventing capability. The owner dashboard should tag the conversation as "integration gap" and include the requested action.`,
        },
      ],
    }),
  };
}

function buildCaseStudyDoc(index) {
  const industry = choice(industries);
  const company = faker.company.name();
  const pkg = choice(packages);
  const apps = sample(integrationApps, 4);
  const beforeResponseHours = faker.number.int({ min: 6, max: 48 });
  const afterResponseMinutes = faker.number.int({ min: 1, max: 12 });
  const id = `case-${String(index + 1).padStart(3, "0")}`;
  const title = `${company}: ${industry} AI concierge case study`;

  return {
    id,
    category: "case-studies",
    title,
    file: `case-studies/${id}-${slugify(company)}.md`,
    tags: ["case study", industry, pkg.name, ...apps],
    content: buildDocument({
      id,
      title,
      category: "case-studies",
      tags: ["case study", industry, pkg.name, ...apps],
      summary: `Synthetic case study showing how a ${industry} team used Astra to answer questions, qualify leads, and prepare staff handoffs.`,
      sections: [
        {
          heading: "Starting Situation",
          body: `${company} handled most inquiries through email and scattered forms. Response time averaged ${beforeResponseHours} hours, and staff often repeated answers about pricing, availability, onboarding steps, and required documents. Their existing stack included ${apps.join(", ")}.`,
        },
        {
          heading: "Implemented Scope",
          body: `The project used the ${pkg.name} package. Astra ingested service FAQs, onboarding policies, pricing ranges, support boundaries, and integration notes. The assistant collected visitor intent, asked follow-up questions, then prepared a structured summary for staff review.`,
        },
        {
          heading: "Measured Outcomes",
          body: sentenceList([
            `First response time improved from ${beforeResponseHours} hours to about ${afterResponseMinutes} minutes.`,
            `Qualified lead capture increased by ${percent(12, 41)} over the pilot window.`,
            `Repeated staff questions dropped by ${percent(24, 58)} after the first content review.`,
            `The owner dashboard identified ${faker.number.int({ min: 18, max: 74 })} missing knowledge topics.`,
          ]),
        },
        {
          heading: "Useful Demo Talking Point",
          body: "This case study is useful when a prospect asks whether a chatbot can create measurable business value. Astra should connect the result to faster answers, cleaner lead handoff, fewer repeated questions, and improved content coverage over time.",
        },
        {
          heading: "Caveat",
          body: "Astra should not promise these exact results to every prospect. The answer should explain that performance depends on traffic volume, document quality, staff response process, and integration readiness.",
        },
      ],
    }),
  };
}

function buildFaqDoc(index) {
  const industry = choice(industries);
  const service = choice(serviceBlueprints);
  const app = choice(integrationApps);
  const pkg = choice(packages);
  const questionPatterns = [
    `How much does ${service.toLowerCase()} cost for ${industry}?`,
    `Can Astra integrate with ${app}?`,
    `How long would implementation take for ${industry}?`,
    "What documents do we need before launch?",
    "Can the assistant qualify leads before sending them to our team?",
    "What happens when Astra does not know the answer?",
    "Can we hide exact pricing and only show ranges?",
    "How often should the knowledge base be updated?",
    "Can Astra explain our policies without making legal promises?",
    "What is the difference between a basic chatbot and a RAG assistant?",
  ];
  const question = questionPatterns[index % questionPatterns.length];
  const id = `faq-${String(index + 1).padStart(3, "0")}`;

  return {
    id,
    category: "faqs",
    title: question,
    file: `faqs/${id}-${slugify(question)}.md`,
    tags: ["faq", industry, service, app],
    content: buildDocument({
      id,
      title: question,
      category: "faqs",
      tags: ["faq", industry, service, app],
      summary: "FAQ answer for prospects evaluating Astra Concierge as a practical AI automation product.",
      sections: [
        {
          heading: "Short Answer",
          body: `For ${industry}, Astra should answer in terms of business workflow rather than generic AI hype. A useful first version usually starts with ${service.toLowerCase()}, approved knowledge documents, and a simple handoff path. If ${app} is involved, the integration should be scoped after confirming available fields and permission boundaries.`,
        },
        {
          heading: "Detailed Explanation",
          body: `The recommended answer is to explain the staged path: discovery, knowledge organization, prototype, integration, QA, launch, and review. Pricing may fit ${pkg.name}, which is typically ${pkg.range}, but Astra should avoid exact quotes until document volume, integration complexity, and owner approval rules are clear.`,
        },
        {
          heading: "Numbers To Mention",
          body: sentenceList([
            `Typical first version: ${pkg.timeline}.`,
            `Recommended initial document set: ${faker.number.int({ min: 25, max: 120 })} source items.`,
            `Suggested review window after launch: ${faker.number.int({ min: 14, max: 30 })} days.`,
            `Good target for answer coverage before launch: ${percent(70, 90)} of common questions.`,
          ]),
        },
        {
          heading: "Follow-Up Question",
          body: 'Astra should ask: "Which system should receive qualified leads, and what fields must be captured before your team considers a lead ready?"',
        },
      ],
    }),
  };
}

function buildObjectionDoc(index) {
  const objection = objectionThemes[index % objectionThemes.length];
  const industry = choice(industries);
  const id = `obj-${String(index + 1).padStart(3, "0")}`;
  const title = `Objection handling: ${objection}`;

  return {
    id,
    category: "objections",
    title,
    file: `objections/${id}-${slugify(objection)}.md`,
    tags: ["objection", objection, industry],
    content: buildDocument({
      id,
      title,
      category: "objections",
      tags: ["objection", objection, industry],
      summary: `Sales enablement guidance for handling the objection "${objection}" in a calm, credible way.`,
      sections: [
        {
          heading: "What The Prospect Usually Means",
          body: `When a ${industry} prospect says "${objection}", they are usually asking about risk, implementation effort, internal trust, or measurable return. Astra should acknowledge the concern first instead of pushing a sale.`,
        },
        {
          heading: "Recommended Response",
          body: "Astra should explain that the project starts with a controlled scope: approved documents, defined handoff rules, visible source citations, and owner review. The assistant should not claim to replace staff. It should position itself as a reliable intake, explanation, and triage layer.",
        },
        {
          heading: "Proof Points",
          body: sentenceList([
            `Start with a pilot covering ${faker.number.int({ min: 20, max: 80 })} high-frequency questions.`,
            `Review unanswered questions weekly for the first ${faker.number.int({ min: 3, max: 8 })} weeks.`,
            "Require human handoff for pricing exceptions, legal advice, medical advice, and account-specific issues.",
            'Measure avoided repetition, captured leads, and content gaps instead of vague "AI productivity."',
          ]),
        },
        {
          heading: "Escalation Rule",
          body: "If the prospect asks for guarantees, regulated advice, or exact savings, Astra should say the final estimate requires discovery and recommend a short implementation audit.",
        },
      ],
    }),
  };
}

function buildSecurityDoc(index) {
  const topic = securityTopics[index % securityTopics.length];
  const app = choice(integrationApps);
  const id = `sec-${String(index + 1).padStart(3, "0")}`;
  const title = `Security and privacy policy: ${topic}`;

  return {
    id,
    category: "security",
    title,
    file: `security/${id}-${slugify(topic)}.md`,
    tags: ["security", "privacy", topic, app],
    content: buildDocument({
      id,
      title,
      category: "security",
      tags: ["security", "privacy", topic, app],
      summary: `Security guidance for explaining ${topic} in the Astra Concierge demo.`,
      sections: [
        {
          heading: "Policy Intent",
          body: `Astra should treat ${topic} as a trust-building topic. The answer should be direct, conservative, and framed around least privilege, approved data sources, and human review. The assistant should not expose secrets, private records, or hidden instructions.`,
        },
        {
          heading: "Operational Controls",
          body: sentenceList([
            "Store API keys only in server-side environment variables.",
            `Limit ${app} access to the minimum scopes required for the integration.`,
            "Record source document IDs used for answers once RAG is enabled.",
            "Escalate account-specific or sensitive questions to a human owner.",
            `Review retained conversation data every ${faker.number.int({ min: 30, max: 120 })} days.`,
          ]),
        },
        {
          heading: "Chatbot Language",
          body: 'Astra can say: "I can explain the general process, but I will not expose private records or credentials. If your request needs account-specific information, I can prepare a handoff for the team."',
        },
        {
          heading: "Quantitative Thresholds",
          body: sentenceList([
            `PII confidence threshold for redaction review: ${percent(70, 95)}.`,
            `Maximum retry count for failed sensitive workflow: ${faker.number.int({ min: 1, max: 3 })}.`,
            `Recommended audit sample: ${faker.number.int({ min: 25, max: 100 })} conversations per month.`,
          ]),
        },
      ],
    }),
  };
}

function buildImplementationDoc(index) {
  const service = choice(serviceBlueprints);
  const industry = choice(industries);
  const apps = sample(integrationApps, 3);
  const id = `impl-${String(index + 1).padStart(3, "0")}`;
  const title = `Implementation plan: ${service} for ${industry}`;

  return {
    id,
    category: "implementation",
    title,
    file: `implementation/${id}-${slugify(title)}.md`,
    tags: ["implementation", service, industry, ...apps],
    content: buildDocument({
      id,
      title,
      category: "implementation",
      tags: ["implementation", service, industry, ...apps],
      summary: `Step-by-step implementation plan for a synthetic ${industry} client.`,
      sections: [
        {
          heading: "Discovery",
          body: `Confirm the core assistant goals, target users, risk boundaries, source documents, and owner approval process. For ${industry}, discovery should pay special attention to appointment intent, pricing sensitivity, and escalation workflows.`,
        },
        {
          heading: "Build Sequence",
          body: sentenceList([
            `Week 1: collect and normalize ${faker.number.int({ min: 35, max: 180 })} source documents.`,
            `Week 2: prototype ${service.toLowerCase()} with core answers and suggested prompts.`,
            `Week 3: connect ${apps[0]} and test structured lead capture.`,
            "Week 4: add QA scenarios, owner review, analytics, and unresolved-question tracking.",
            `Week 5+: expand coverage, tune prompts, and add ${apps.slice(1).join(" plus ")} if needed.`,
          ]),
        },
        {
          heading: "Acceptance Criteria",
          body: sentenceList([
            "Answers are grounded in approved source categories.",
            "The assistant refuses or hands off unsupported requests.",
            `At least ${faker.number.int({ min: 40, max: 120 })} test questions pass review.`,
            "Lead records include contact, pain point, urgency, budget range, and summary.",
            "Owner can identify common unanswered questions.",
          ]),
        },
        {
          heading: "Risks",
          body: "The main risks are stale content, ambiguous policy language, incomplete CRM fields, and edge cases that require human judgment. Astra should explain that a staged launch reduces these risks because the team can review real conversations before broad rollout.",
        },
      ],
    }),
  };
}

function buildLeadPlaybookDoc(index) {
  const industry = choice(industries);
  const service = choice(serviceBlueprints);
  const app = choice(integrationApps);
  const id = `lead-${String(index + 1).padStart(3, "0")}`;
  const title = `Lead qualification playbook for ${industry}`;

  return {
    id,
    category: "lead-playbooks",
    title,
    file: `lead-playbooks/${id}-${slugify(industry)}.md`,
    tags: ["lead qualification", industry, service, app],
    content: buildDocument({
      id,
      title,
      category: "lead-playbooks",
      tags: ["lead qualification", industry, service, app],
      summary: `Playbook for identifying and qualifying buying intent for ${industry}.`,
      sections: [
        {
          heading: "High-Intent Phrases",
          body: sentenceList([
            '"How much would this cost?"',
            `"Can you connect this to ${app}?"`,
            `"We need this live before ${faker.date.future({ years: 1 }).toLocaleDateString("en-US")}"`,
            '"Can someone call me?"',
            '"We get too many repetitive questions."',
          ]),
        },
        {
          heading: "Questions Astra Should Ask",
          body: sentenceList([
            "What tools are you currently using for leads or support?",
            "How many inquiries do you receive each month?",
            "Do you want the assistant to answer publicly, help staff internally, or both?",
            "What should happen when the visitor is ready for a human follow-up?",
            "What budget range and launch window should we keep in mind?",
          ]),
        },
        {
          heading: "Scoring Model",
          body: sentenceList([
            "Add 20 points when the visitor asks about price or package fit.",
            `Add 15 points when they name ${app} or another integration target.`,
            `Add 15 points when they mention a launch deadline under ${faker.number.int({ min: 30, max: 90 })} days.`,
            `Add 10 points when they reveal monthly volume over ${faker.number.int({ min: 80, max: 500 })} inquiries.`,
            `Escalate when score reaches ${faker.number.int({ min: 55, max: 75 })}.`,
          ]),
        },
        {
          heading: "Handoff Summary Format",
          body: `Use this structure: industry, visitor role, problem, tools, monthly volume, desired timeline, budget signal, recommended package, and next best action. Keep it short enough for an owner to scan in under ${faker.number.int({ min: 20, max: 45 })} seconds.`,
        },
      ],
    }),
  };
}

function buildSupportDoc(index) {
  const scenario = supportScenarios[index % supportScenarios.length];
  const app = choice(integrationApps);
  const id = `sup-${String(index + 1).padStart(3, "0")}`;
  const title = `Support policy: ${scenario}`;

  return {
    id,
    category: "support",
    title,
    file: `support/${id}-${slugify(scenario)}.md`,
    tags: ["support", scenario, app],
    content: buildDocument({
      id,
      title,
      category: "support",
      tags: ["support", scenario, app],
      summary: `Operational support policy for handling ${scenario}.`,
      sections: [
        {
          heading: "Expected Assistant Behavior",
          body: `When the scenario is ${scenario}, Astra should be transparent about the limit, keep the visitor moving, and create a useful owner-facing record. It should not invent account status, guarantee outcomes, or silently fail.`,
        },
        {
          heading: "Resolution Steps",
          body: sentenceList([
            "State the limitation in one sentence.",
            "Ask for the minimum missing detail needed to help.",
            "Create a handoff note or mark the issue for review.",
            `If ${app} is involved, check whether a retry or manual review is safer.`,
            "Add the question to the knowledge-gap queue if the content is missing.",
          ]),
        },
        {
          heading: "Service Targets",
          body: sentenceList([
            `High-intent visitor handoff target: ${days(1, 2)}.`,
            `Knowledge-gap review target: ${days(3, 7)}.`,
            `Integration failure review target: ${faker.number.int({ min: 2, max: 12 })} hours.`,
            `Monthly unresolved-question target: below ${percent(5, 18)} of conversations.`,
          ]),
        },
      ],
    }),
  };
}

async function generateRecord(schema, index) {
  reseed(index);
  return generate(schema, {
    extensions: { faker },
    seed: SEED + index,
    fillProperties: true,
    alwaysFakeOptionals: true,
  });
}

async function generateRecords(schema, count, offset, enrich) {
  const records = [];

  for (let index = 0; index < count; index += 1) {
    const base = await generateRecord(schema, offset + index);
    records.push(enrich(base, index));
  }

  return records;
}

const leadSchema = {
  type: "object",
  required: [
    "companyName",
    "contactName",
    "contactEmail",
    "industry",
    "employeeCount",
    "monthlyInquiryVolume",
    "budgetUsd",
    "crm",
    "urgencyScore",
  ],
  properties: {
    companyName: { type: "string", faker: "company.name" },
    contactName: { type: "string", faker: "person.fullName" },
    contactEmail: { type: "string", faker: "internet.email" },
    industry: { enum: industries },
    employeeCount: { type: "integer", minimum: 5, maximum: 950 },
    monthlyInquiryVolume: { type: "integer", minimum: 30, maximum: 2400 },
    budgetUsd: { type: "integer", minimum: 2500, maximum: 50000 },
    crm: { enum: integrationApps },
    urgencyScore: { type: "integer", minimum: 1, maximum: 100 },
  },
};

const ticketSchema = {
  type: "object",
  required: [
    "companyName",
    "scenario",
    "priority",
    "channel",
    "minutesToFirstResponse",
  ],
  properties: {
    companyName: { type: "string", faker: "company.name" },
    scenario: { enum: supportScenarios },
    priority: { enum: ["low", "normal", "high", "urgent"] },
    channel: { enum: ["chat", "email", "web form", "phone", "CRM task"] },
    minutesToFirstResponse: { type: "integer", minimum: 1, maximum: 720 },
  },
};

async function generateDatasets() {
  const leads = await generateRecords(leadSchema, 250, 1000, (lead, index) => ({
    leadId: `LD-${String(index + 1).padStart(5, "0")}`,
    ...lead,
    requestedService: choice(serviceBlueprints),
    leadScore: Math.min(
      100,
      Math.round(lead.urgencyScore * 0.6 + lead.monthlyInquiryVolume / 60),
    ),
    status: choice(["new", "qualified", "needs review", "demo booked", "not ready"]),
  }));

  const supportTickets = await generateRecords(
    ticketSchema,
    320,
    2000,
    (ticket, index) => ({
      ticketId: `TK-${String(index + 1).padStart(5, "0")}`,
      ...ticket,
      ownerReviewNeeded:
        ticket.priority === "urgent" || ticket.minutesToFirstResponse > 240,
      knowledgeGap: faker.datatype.boolean({ probability: 0.38 }),
    }),
  );

  const integrationMetrics = integrationApps.map((app, index) => {
    reseed(3000 + index);
    return {
      integration: app,
      setupComplexity: faker.number.int({ min: 1, max: 10 }),
      averageSetupHours: faker.number.int({ min: 6, max: 72 }),
      monthlySyncVolume: faker.number.int({ min: 100, max: 18000 }),
      failureRatePercent: faker.number.float({
        min: 0.1,
        max: 4.8,
        fractionDigits: 2,
      }),
      requiredFields: sample(
        ["name", "email", "phone", "company", "budget", "timeline", "service_interest"],
        faker.number.int({ min: 3, max: 6 }),
      ),
    };
  });

  const analytics = Array.from({ length: 180 }, (_, index) => {
    reseed(4000 + index);
    return {
      day: faker.date
        .between({ from: "2026-01-01", to: "2026-06-24" })
        .toISOString()
        .slice(0, 10),
      conversations: faker.number.int({ min: 18, max: 320 }),
      qualifiedLeads: faker.number.int({ min: 1, max: 48 }),
      handoffs: faker.number.int({ min: 0, max: 32 }),
      unansweredQuestions: faker.number.int({ min: 0, max: 24 }),
      averageConfidence: faker.number.float({
        min: 0.64,
        max: 0.96,
        fractionDigits: 2,
      }),
      topIntent: choice(["pricing", "timeline", "integration", "support", "booking", "security"]),
    };
  });

  const packagePricing = packages.map((pkg, index) => {
    reseed(5000 + index);
    return {
      packageName: pkg.name,
      publicRange: pkg.range,
      timeline: pkg.timeline,
      bestFor: pkg.bestFor,
      includedDocuments: faker.number.int({ min: 30, max: 280 }),
      includedIntegrations: faker.number.int({ min: 1, max: 8 }),
      monthlyReviewHours: faker.number.int({ min: 2, max: 18 }),
      addOnHourlyRate: faker.number.int({ min: 95, max: 225 }),
    };
  });

  await writeJson("datasets/leads.json", leads);
  await writeJson("datasets/support-tickets.json", supportTickets);
  await writeJson("datasets/integration-metrics.json", integrationMetrics);
  await writeJson("datasets/conversation-analytics.json", analytics);
  await writeJson("datasets/package-pricing.json", packagePricing);

  return {
    leads: leads.length,
    supportTickets: supportTickets.length,
    integrationMetrics: integrationMetrics.length,
    analytics: analytics.length,
    packagePricing: packagePricing.length,
  };
}

function buildAllDocuments() {
  const factories = [
    [DOC_COUNTS.services, buildServiceDoc],
    [DOC_COUNTS.integrations, buildIntegrationDoc],
    [DOC_COUNTS.caseStudies, buildCaseStudyDoc],
    [DOC_COUNTS.faqs, buildFaqDoc],
    [DOC_COUNTS.objections, buildObjectionDoc],
    [DOC_COUNTS.security, buildSecurityDoc],
    [DOC_COUNTS.implementation, buildImplementationDoc],
    [DOC_COUNTS.leadPlaybooks, buildLeadPlaybookDoc],
    [DOC_COUNTS.support, buildSupportDoc],
  ];

  return factories.flatMap(([count, factory], factoryIndex) =>
    Array.from({ length: count }, (_, index) => {
      reseed(factoryIndex * 10000 + index);
      return factory(index);
    }),
  );
}

async function writeReadme(documentCount, datasetStats) {
  await writeDoc(
    "README.md",
    `# Astra Concierge Synthetic Knowledge Base

This folder is generated by \`npm run kb:generate\`.

The data is synthetic and intentionally shaped for a premium AI automation agency demo. It gives Astra Concierge a broad business knowledge surface before we add Neon, pgvector, embeddings, and retrieval.

## Contents

- Markdown source documents: ${documentCount}
- Lead records: ${datasetStats.leads}
- Support ticket records: ${datasetStats.supportTickets}
- Integration metric records: ${datasetStats.integrationMetrics}
- Conversation analytics records: ${datasetStats.analytics}
- Package pricing records: ${datasetStats.packagePricing}

## Design Notes

- Use Markdown files as future RAG source documents.
- Use JSON datasets for dashboards, lead scoring, analytics, and admin workflows.
- Regenerate the folder with the same seed to get stable demo data.
- Do not edit generated files manually; update \`scripts/generate-knowledge-base.mjs\` instead.
`,
  );
}

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const documents = buildAllDocuments();

  for (const doc of documents) {
    await writeDoc(doc.file, doc.content);
  }

  const datasetStats = await generateDatasets();

  const manifest = {
    generatedAt: GENERATED_AT,
    seed: SEED,
    documentCount: documents.length,
    datasetStats,
    documents: documents.map(({ id, title, category, file, tags }) => ({
      id,
      title,
      category,
      file,
      tags,
    })),
  };

  await writeJson("manifest.json", manifest);
  await writeReadme(documents.length, datasetStats);

  console.log(`Generated ${documents.length} knowledge documents.`);
  console.log(`Generated datasets: ${JSON.stringify(datasetStats)}.`);
  console.log(`Output: ${path.relative(projectRoot, outputRoot)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

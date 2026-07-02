---
id: "int-019"
title: "Square integration playbook"
category: "integrations"
tags: ["integration", "Square", "B2B SaaS teams", "event-triggered webhook"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Square integration playbook

This integration note helps Astra explain how Square can connect to a client-facing AI concierge for B2B SaaS teams.

## Integration Purpose

Square should be positioned as the system of record or action layer, while Astra remains the conversational intake layer. The assistant should collect structured details, validate required fields, then create or update the relevant record using a event-triggered webhook pattern.

## Recommended Data Fields

- contact_name
- email_or_phone
- company_name
- industry
- pain_point
- budget_range
- implementation_timeline
- conversation_summary
- lead_score
- source_citations_used

## Reliability Rules

The integration should never fire until required fields are validated. If Square returns an error, Astra should tell the visitor that the request was captured and mark the conversation for owner review. Retry attempts should be capped at 4 attempts to avoid duplicate records.

## Quantitative Expectations

- Typical setup complexity: 6/10.
- Expected field completion rate after guided prompts: 93%.
- Estimated manual copy-paste reduction: 68%.
- Recommended QA sample size before launch: 22 test conversations.

## Fallback Handling

If the visitor asks for a task Square cannot support through the available API, Astra should offer a manual handoff rather than inventing capability. The owner dashboard should tag the conversation as "integration gap" and include the requested action.

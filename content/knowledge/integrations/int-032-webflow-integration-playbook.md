---
id: "int-032"
title: "Webflow integration playbook"
category: "integrations"
tags: ["integration", "Webflow", "ecommerce brands", "one-way lead push"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Webflow integration playbook

This integration note helps Astra explain how Webflow can connect to a client-facing AI concierge for ecommerce brands.

## Integration Purpose

Webflow should be positioned as the system of record or action layer, while Astra remains the conversational intake layer. The assistant should collect structured details, validate required fields, then create or update the relevant record using a one-way lead push pattern.

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

The integration should never fire until required fields are validated. If Webflow returns an error, Astra should tell the visitor that the request was captured and mark the conversation for owner review. Retry attempts should be capped at 3 attempts to avoid duplicate records.

## Quantitative Expectations

- Typical setup complexity: 4/10.
- Expected field completion rate after guided prompts: 77%.
- Estimated manual copy-paste reduction: 47%.
- Recommended QA sample size before launch: 21 test conversations.

## Fallback Handling

If the visitor asks for a task Webflow cannot support through the available API, Astra should offer a manual handoff rather than inventing capability. The owner dashboard should tag the conversation as "integration gap" and include the requested action.

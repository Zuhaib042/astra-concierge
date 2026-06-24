---
id: "int-013"
title: "Intercom integration playbook"
category: "integrations"
tags: ["integration", "Intercom", "law firms", "two-way status sync"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Intercom integration playbook

This integration note helps Astra explain how Intercom can connect to a client-facing AI concierge for law firms.

## Integration Purpose

Intercom should be positioned as the system of record or action layer, while Astra remains the conversational intake layer. The assistant should collect structured details, validate required fields, then create or update the relevant record using a two-way status sync pattern.

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

The integration should never fire until required fields are validated. If Intercom returns an error, Astra should tell the visitor that the request was captured and mark the conversation for owner review. Retry attempts should be capped at 2 attempts to avoid duplicate records.

## Quantitative Expectations

- Typical setup complexity: 8/10.
- Expected field completion rate after guided prompts: 78%.
- Estimated manual copy-paste reduction: 59%.
- Recommended QA sample size before launch: 25 test conversations.

## Fallback Handling

If the visitor asks for a task Intercom cannot support through the available API, Astra should offer a manual handoff rather than inventing capability. The owner dashboard should tag the conversation as "integration gap" and include the requested action.

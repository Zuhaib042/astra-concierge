---
id: "sup-002"
title: "Support policy: CRM sync failure"
category: "support"
tags: ["support", "CRM sync failure", "Slack"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Support policy: CRM sync failure

Operational support policy for handling CRM sync failure.

## Expected Assistant Behavior

When the scenario is CRM sync failure, Astra should be transparent about the limit, keep the visitor moving, and create a useful owner-facing record. It should not invent account status, guarantee outcomes, or silently fail.

## Resolution Steps

- State the limitation in one sentence.
- Ask for the minimum missing detail needed to help.
- Create a handoff note or mark the issue for review.
- If Slack is involved, check whether a retry or manual review is safer.
- Add the question to the knowledge-gap queue if the content is missing.

## Service Targets

- High-intent visitor handoff target: 2 business days.
- Knowledge-gap review target: 6 business days.
- Integration failure review target: 11 hours.
- Monthly unresolved-question target: below 10% of conversations.

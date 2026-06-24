---
id: "sup-001"
title: "Support policy: unanswered visitor question"
category: "support"
tags: ["support", "unanswered visitor question", "Snowflake"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Support policy: unanswered visitor question

Operational support policy for handling unanswered visitor question.

## Expected Assistant Behavior

When the scenario is unanswered visitor question, Astra should be transparent about the limit, keep the visitor moving, and create a useful owner-facing record. It should not invent account status, guarantee outcomes, or silently fail.

## Resolution Steps

- State the limitation in one sentence.
- Ask for the minimum missing detail needed to help.
- Create a handoff note or mark the issue for review.
- If Snowflake is involved, check whether a retry or manual review is safer.
- Add the question to the knowledge-gap queue if the content is missing.

## Service Targets

- High-intent visitor handoff target: 2 business days.
- Knowledge-gap review target: 6 business days.
- Integration failure review target: 5 hours.
- Monthly unresolved-question target: below 15% of conversations.

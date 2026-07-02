---
id: "sup-025"
title: "Support policy: low-confidence answer"
category: "support"
tags: ["support", "low-confidence answer", "Segment"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Support policy: low-confidence answer

Operational support policy for handling low-confidence answer.

## Expected Assistant Behavior

When the scenario is low-confidence answer, Astra should be transparent about the limit, keep the visitor moving, and create a useful owner-facing record. It should not invent account status, guarantee outcomes, or silently fail.

## Resolution Steps

- State the limitation in one sentence.
- Ask for the minimum missing detail needed to help.
- Create a handoff note or mark the issue for review.
- If Segment is involved, check whether a retry or manual review is safer.
- Add the question to the knowledge-gap queue if the content is missing.

## Service Targets

- High-intent visitor handoff target: 1 business days.
- Knowledge-gap review target: 6 business days.
- Integration failure review target: 8 hours.
- Monthly unresolved-question target: below 14% of conversations.

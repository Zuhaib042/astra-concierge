---
id: "impl-035"
title: "Implementation plan: Product Recommendation Assistant for law firms"
category: "implementation"
tags: ["implementation", "Product Recommendation Assistant", "law firms", "Postmark", "Microsoft Teams", "Trello"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Implementation plan: Product Recommendation Assistant for law firms

Step-by-step implementation plan for a synthetic law firms client.

## Discovery

Confirm the core assistant goals, target users, risk boundaries, source documents, and owner approval process. For law firms, discovery should pay special attention to appointment intent, pricing sensitivity, and escalation workflows.

## Build Sequence

- Week 1: collect and normalize 179 source documents.
- Week 2: prototype product recommendation assistant with core answers and suggested prompts.
- Week 3: connect Postmark and test structured lead capture.
- Week 4: add QA scenarios, owner review, analytics, and unresolved-question tracking.
- Week 5+: expand coverage, tune prompts, and add Microsoft Teams plus Trello if needed.

## Acceptance Criteria

- Answers are grounded in approved source categories.
- The assistant refuses or hands off unsupported requests.
- At least 104 test questions pass review.
- Lead records include contact, pain point, urgency, budget range, and summary.
- Owner can identify common unanswered questions.

## Risks

The main risks are stale content, ambiguous policy language, incomplete CRM fields, and edge cases that require human judgment. Astra should explain that a staged launch reduces these risks because the team can review real conversations before broad rollout.

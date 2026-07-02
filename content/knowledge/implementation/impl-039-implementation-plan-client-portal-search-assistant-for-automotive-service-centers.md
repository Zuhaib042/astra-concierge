---
id: "impl-039"
title: "Implementation plan: Client Portal Search Assistant for automotive service centers"
category: "implementation"
tags: ["implementation", "Client Portal Search Assistant", "automotive service centers", "Asana", "SendGrid", "Slack"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Implementation plan: Client Portal Search Assistant for automotive service centers

Step-by-step implementation plan for a synthetic automotive service centers client.

## Discovery

Confirm the core assistant goals, target users, risk boundaries, source documents, and owner approval process. For automotive service centers, discovery should pay special attention to appointment intent, pricing sensitivity, and escalation workflows.

## Build Sequence

- Week 1: collect and normalize 132 source documents.
- Week 2: prototype client portal search assistant with core answers and suggested prompts.
- Week 3: connect Asana and test structured lead capture.
- Week 4: add QA scenarios, owner review, analytics, and unresolved-question tracking.
- Week 5+: expand coverage, tune prompts, and add SendGrid plus Slack if needed.

## Acceptance Criteria

- Answers are grounded in approved source categories.
- The assistant refuses or hands off unsupported requests.
- At least 88 test questions pass review.
- Lead records include contact, pain point, urgency, budget range, and summary.
- Owner can identify common unanswered questions.

## Risks

The main risks are stale content, ambiguous policy language, incomplete CRM fields, and edge cases that require human judgment. Astra should explain that a staged launch reduces these risks because the team can review real conversations before broad rollout.

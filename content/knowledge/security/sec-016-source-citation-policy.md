---
id: "sec-016"
title: "Security and privacy policy: source citation policy"
category: "security"
tags: ["security", "privacy", "source citation policy", "Gmail"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Security and privacy policy: source citation policy

Security guidance for explaining source citation policy in the Astra Concierge demo.

## Policy Intent

Astra should treat source citation policy as a trust-building topic. The answer should be direct, conservative, and framed around least privilege, approved data sources, and human review. The assistant should not expose secrets, private records, or hidden instructions.

## Operational Controls

- Store API keys only in server-side environment variables.
- Limit Gmail access to the minimum scopes required for the integration.
- Record source document IDs used for answers once RAG is enabled.
- Escalate account-specific or sensitive questions to a human owner.
- Review retained conversation data every 51 days.

## Chatbot Language

Astra can say: "I can explain the general process, but I will not expose private records or credentials. If your request needs account-specific information, I can prepare a handoff for the team."

## Quantitative Thresholds

- PII confidence threshold for redaction review: 85%.
- Maximum retry count for failed sensitive workflow: 1.
- Recommended audit sample: 27 conversations per month.

---
id: "sec-028"
title: "Security and privacy policy: regulated-data disclaimers"
category: "security"
tags: ["security", "privacy", "regulated-data disclaimers", "Trello"]
source_type: "synthetic_demo_knowledge"
generated_at: "2026-06-24T00:00:00.000Z"
---

# Security and privacy policy: regulated-data disclaimers

Security guidance for explaining regulated-data disclaimers in the Astra Concierge demo.

## Policy Intent

Astra should treat regulated-data disclaimers as a trust-building topic. The answer should be direct, conservative, and framed around least privilege, approved data sources, and human review. The assistant should not expose secrets, private records, or hidden instructions.

## Operational Controls

- Store API keys only in server-side environment variables.
- Limit Trello access to the minimum scopes required for the integration.
- Record source document IDs used for answers once RAG is enabled.
- Escalate account-specific or sensitive questions to a human owner.
- Review retained conversation data every 119 days.

## Chatbot Language

Astra can say: "I can explain the general process, but I will not expose private records or credentials. If your request needs account-specific information, I can prepare a handoff for the team."

## Quantitative Thresholds

- PII confidence threshold for redaction review: 92%.
- Maximum retry count for failed sensitive workflow: 2.
- Recommended audit sample: 84 conversations per month.

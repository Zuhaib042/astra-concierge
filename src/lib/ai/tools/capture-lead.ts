import { jsonSchema, tool } from "ai";

import {
  saveCapturedLead,
  type CapturedLeadInput,
  type CapturedLeadResult,
  type LeadPriority,
} from "@/lib/leads/persistence";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown) {
  return typeof value === "string" || value === null || value === undefined;
}

function isLeadPriority(value: unknown): value is LeadPriority {
  return value === "low" || value === "medium" || value === "high";
}

function validateCaptureLeadInput(value: unknown) {
  if (!isRecord(value)) {
    return {
      success: false as const,
      error: new Error("Lead capture input must be an object."),
    };
  }

  if (
    typeof value.intent !== "string" ||
    typeof value.qualificationSummary !== "string" ||
    typeof value.confidence !== "number" ||
    !isLeadPriority(value.priority)
  ) {
    return {
      success: false as const,
      error: new Error("Lead capture input is missing required fields."),
    };
  }

  const optionalFields = [
    value.name,
    value.email,
    value.phone,
    value.companyName,
    value.budgetRange,
    value.timeline,
    value.requestedNextStep,
  ];

  if (!optionalFields.every(isNullableString)) {
    return {
      success: false as const,
      error: new Error("Optional lead fields must be strings or null."),
    };
  }

  return {
    success: true as const,
    value: value as CapturedLeadInput,
  };
}

function nullableStringProperty(description: string) {
  return {
    type: ["string", "null"] as ["string", "null"],
    description,
  };
}

const captureLeadInputSchema = jsonSchema<CapturedLeadInput>(
  {
    type: "object",
    additionalProperties: false,
    properties: {
      name: {
        ...nullableStringProperty("Visitor name, if provided."),
      },
      email: {
        ...nullableStringProperty("Visitor email address, if provided."),
      },
      phone: {
        ...nullableStringProperty("Visitor phone number, if provided."),
      },
      companyName: {
        ...nullableStringProperty(
          "Visitor company or organization name, if provided.",
        ),
      },
      intent: {
        type: "string",
        description:
          "Short business intent, such as CRM integration, AI concierge, support automation, or booking a call.",
      },
      budgetRange: {
        ...nullableStringProperty("Budget range mentioned by the visitor, if any."),
      },
      timeline: {
        ...nullableStringProperty("Desired launch or decision timeline, if any."),
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        description:
          "Lead priority based on buying intent, urgency, company fit, and whether contact details were provided.",
      },
      qualificationSummary: {
        type: "string",
        description:
          "Concise summary of why this visitor is or is not qualified.",
      },
      requestedNextStep: {
        ...nullableStringProperty(
          "The next step the visitor requested, such as pricing, callback, proposal, or implementation plan.",
        ),
      },
      confidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description: "Confidence that this is a real sales opportunity.",
      },
    },
    required: ["intent", "priority", "qualificationSummary", "confidence"],
  },
  { validate: validateCaptureLeadInput },
);

const captureLeadOutputSchema = jsonSchema<CapturedLeadResult>({
  type: "object",
  additionalProperties: false,
  properties: {
    leadId: { type: "string" },
    status: { type: "string", enum: ["new", "qualified"] },
    priority: { type: "string", enum: ["low", "medium", "high"] },
    missingFields: {
      type: "array",
      items: { type: "string" },
    },
    message: { type: "string" },
  },
  required: ["leadId", "status", "priority", "missingFields", "message"],
});

export function createCaptureLeadTool(conversationId: string) {
  return tool<CapturedLeadInput, CapturedLeadResult>({
    description:
      "Save or update a sales lead when the visitor shows buying intent, requests pricing, asks for a call, shares contact details, or describes a business automation need.",
    inputSchema: captureLeadInputSchema,
    outputSchema: captureLeadOutputSchema,
    execute: async (input) =>
      saveCapturedLead({
        conversationId,
        input,
      }),
  });
}

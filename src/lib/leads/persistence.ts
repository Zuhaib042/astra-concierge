import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { conversations, leads } from "@/db/schema";

export type LeadPriority = "low" | "medium" | "high";
export type LeadStatus = "new" | "qualified";

export type CapturedLeadInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  intent: string;
  budgetRange?: string | null;
  timeline?: string | null;
  priority: LeadPriority;
  qualificationSummary: string;
  requestedNextStep?: string | null;
  confidence: number;
};

export type CapturedLeadResult = {
  leadId: string;
  status: LeadStatus;
  priority: LeadPriority;
  missingFields: string[];
  message: string;
};

function cleanOptionalText(value: string | null | undefined) {
  const normalized = value?.replace(/\s+/g, " ").trim();

  return normalized ? normalized : null;
}

function mergeText(
  currentValue: string | null | undefined,
  nextValue: string | null | undefined,
) {
  return cleanOptionalText(nextValue) ?? cleanOptionalText(currentValue);
}

function getMissingFields(input: CapturedLeadInput) {
  const missingFields: string[] = [];

  if (!cleanOptionalText(input.email) && !cleanOptionalText(input.phone)) {
    missingFields.push("contact");
  }

  if (!cleanOptionalText(input.companyName)) {
    missingFields.push("company");
  }

  if (!cleanOptionalText(input.budgetRange)) {
    missingFields.push("budget");
  }

  if (!cleanOptionalText(input.timeline)) {
    missingFields.push("timeline");
  }

  return missingFields;
}

function getLeadStatus(input: CapturedLeadInput): LeadStatus {
  const hasContact =
    Boolean(cleanOptionalText(input.email)) || Boolean(cleanOptionalText(input.phone));

  if (hasContact && input.confidence >= 0.65) {
    return "qualified";
  }

  return "new";
}

function buildLeadNotes(input: CapturedLeadInput) {
  return [
    input.qualificationSummary,
    input.requestedNextStep
      ? `Requested next step: ${input.requestedNextStep}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function saveCapturedLead({
  conversationId,
  input,
}: {
  conversationId: string;
  input: CapturedLeadInput;
}): Promise<CapturedLeadResult> {
  const db = getDb();
  const savedAt = new Date();
  const missingFields = getMissingFields(input);
  const status = getLeadStatus(input);
  const [existingLead] = await db
    .select()
    .from(leads)
    .where(eq(leads.conversationId, conversationId))
    .orderBy(desc(leads.updatedAt))
    .limit(1);

  const leadValues = {
    conversationId,
    name: mergeText(existingLead?.name, input.name),
    email: mergeText(existingLead?.email, input.email),
    phone: mergeText(existingLead?.phone, input.phone),
    companyName: mergeText(existingLead?.companyName, input.companyName),
    intent: cleanOptionalText(input.intent),
    status,
    priority: input.priority,
    budgetRange: mergeText(existingLead?.budgetRange, input.budgetRange),
    timeline: mergeText(existingLead?.timeline, input.timeline),
    notes: buildLeadNotes(input),
    metadata: {
      ...(existingLead?.metadata ?? {}),
      confidence: input.confidence,
      missingFields,
      requestedNextStep: cleanOptionalText(input.requestedNextStep),
      capturedBy: "astra-capture-lead-tool",
      capturedAt: savedAt.toISOString(),
    },
    updatedAt: savedAt,
  };

  const [savedLead] = existingLead
    ? await db
        .update(leads)
        .set(leadValues)
        .where(eq(leads.id, existingLead.id))
        .returning()
    : await db.insert(leads).values(leadValues).returning();

  if (status === "qualified") {
    await db
      .update(conversations)
      .set({
        status: "qualified",
        updatedAt: savedAt,
      })
      .where(eq(conversations.id, conversationId));
  }

  return {
    leadId: savedLead.id,
    status,
    priority: input.priority,
    missingFields,
    message:
      status === "qualified"
        ? "Qualified lead saved in Neon."
        : "Lead saved with missing qualification details.",
  };
}

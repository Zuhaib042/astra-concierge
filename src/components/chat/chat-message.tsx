"use client";

import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Bot, BriefcaseBusiness, Check, Loader2, UserRound } from "lucide-react";

import { MessageResponse } from "@/components/ai-elements/message";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-demo";
import type { RagSourceSummary } from "@/lib/knowledge/rag";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType | UIMessage;
}

type TextPart = Extract<UIMessage["parts"][number], { type: "text" }>;
type SourceBadge = {
  key: string;
  label: string;
  title: string;
};
type LeadBadge = {
  key: string;
  label: string;
  title: string;
  variant: "success" | "warning";
};

function isStoredDemoMessage(
  message: ChatMessageType | UIMessage,
): message is ChatMessageType {
  return "content" in message;
}

function getTextParts(message: ChatMessageType | UIMessage): TextPart[] {
  if (isStoredDemoMessage(message)) {
    return [{ type: "text", text: message.content }];
  }

  return message.parts.filter((part): part is TextPart => part.type === "text");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRagSourceSummary(value: unknown): value is RagSourceSummary {
  return (
    isRecord(value) &&
    typeof value.citationId === "string" &&
    typeof value.title === "string" &&
    typeof value.category === "string" &&
    (typeof value.heading === "string" || value.heading === null) &&
    (typeof value.filePath === "string" || value.filePath === null) &&
    typeof value.similarity === "number"
  );
}

function getSourceBadges(message: ChatMessageType | UIMessage): SourceBadge[] {
  if (isStoredDemoMessage(message)) {
    return message.sources.map((source) => ({
      key: source,
      label: source,
      title: source,
    }));
  }

  const metadata = message.metadata;

  if (!isRecord(metadata) || !Array.isArray(metadata.sources)) {
    return [];
  }

  return metadata.sources
    .filter(isRagSourceSummary)
    .map((source) => ({
      key: `${source.citationId}-${source.title}-${source.heading ?? ""}`,
      label: `${source.citationId}: ${source.heading ?? source.title}`,
      title: `${source.title} (${source.category})`,
    }));
}

function isLeadToolOutput(value: unknown): value is {
  leadId: string;
  status: "new" | "qualified";
  priority: "low" | "medium" | "high";
  missingFields: string[];
  message: string;
} {
  return (
    isRecord(value) &&
    typeof value.leadId === "string" &&
    (value.status === "new" || value.status === "qualified") &&
    (value.priority === "low" ||
      value.priority === "medium" ||
      value.priority === "high") &&
    Array.isArray(value.missingFields) &&
    value.missingFields.every((field) => typeof field === "string") &&
    typeof value.message === "string"
  );
}

function getLeadBadges(message: ChatMessageType | UIMessage): LeadBadge[] {
  if (isStoredDemoMessage(message)) {
    return [];
  }

  return message.parts.flatMap((part) => {
    if (
      !isRecord(part) ||
      part.type !== "tool-captureLead" ||
      part.state !== "output-available" ||
      !isLeadToolOutput(part.output)
    ) {
      return [];
    }

    const output = part.output;
    const missing =
      output.missingFields.length > 0
        ? ` Missing: ${output.missingFields.join(", ")}.`
        : "";

    return {
      key: output.leadId,
      label:
        output.status === "qualified"
          ? "Qualified lead captured"
          : "Lead captured",
      title: `${output.message}${missing}`,
      variant: output.status === "qualified" ? "success" : "warning",
    };
  });
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const textParts = getTextParts(message);
  const hasText = textParts.some((part) => part.text.trim().length > 0);
  const sources = getSourceBadges(message);
  const leadBadges = getLeadBadges(message);
  const timestamp = isStoredDemoMessage(message) ? message.timestamp : "Live";
  const displayName = isAssistant ? "Astra" : "Visitor";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      className={cn("flex", isAssistant ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[92%] rounded-lg px-4 py-3 text-sm shadow-sm md:max-w-[82%]",
          isAssistant
            ? "border border-border bg-background/75 text-foreground"
            : "bg-primary text-primary-foreground",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs font-medium">
            {isAssistant ? (
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {displayName}
          </span>
          <span className="font-mono text-[11px] opacity-70">
            {timestamp}
          </span>
        </div>

        {hasText ? (
          <div className="space-y-3 leading-6">
            {textParts.map((part, index) =>
              isAssistant ? (
                <MessageResponse
                  key={`${message.id}-${index}`}
                  className="text-sm leading-6"
                >
                  {part.text}
                </MessageResponse>
              ) : (
                <p
                  key={`${message.id}-${index}`}
                  className="whitespace-pre-wrap"
                >
                  {part.text}
                </p>
              ),
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Connecting to Gemini</span>
          </div>
        )}

        {leadBadges.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {leadBadges.map((lead) => (
              <Badge
                key={lead.key}
                title={lead.title}
                variant={lead.variant}
                className="gap-1.5"
              >
                <BriefcaseBusiness className="h-3 w-3" aria-hidden="true" />
                {lead.label}
              </Badge>
            ))}
          </div>
        ) : null}

        {sources.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {sources.map((source) => (
              <Badge
                key={source.key}
                title={source.title}
                variant="secondary"
                className="gap-1.5 border-border bg-muted/80 text-muted-foreground"
              >
                <Check className="h-3 w-3 text-emerald-300" aria-hidden="true" />
                {source.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

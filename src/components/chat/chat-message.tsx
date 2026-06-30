"use client";

import type { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Bot, Loader2, UserRound } from "lucide-react";

import { MessageResponse } from "@/components/ai-elements/message";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-demo";
import { removeInternalSourceMarkers } from "@/lib/chat/display-text";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType | UIMessage;
}

type TextPart = Extract<UIMessage["parts"][number], { type: "text" }>;

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

function getDisplayText(part: TextPart, isAssistant: boolean) {
  return isAssistant ? removeInternalSourceMarkers(part.text) : part.text;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const textParts = getTextParts(message);
  const hasText = textParts.some((part) => part.text.trim().length > 0);
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
                  {getDisplayText(part, isAssistant)}
                </MessageResponse>
              ) : (
                <p
                  key={`${message.id}-${index}`}
                  className="whitespace-pre-wrap"
                >
                  {getDisplayText(part, isAssistant)}
                </p>
              ),
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Preparing your answer</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

"use client";

import { Bot, Check, Loader2, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import type { ChatMessage as ChatMessageType } from "@/lib/chat-demo";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

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
            {message.name}
          </span>
          <span className="font-mono text-[11px] opacity-70">
            {message.timestamp}
          </span>
        </div>

        {message.content ? (
          <p className="whitespace-pre-wrap leading-6">{message.content}</p>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Drafting a grounded response</span>
          </div>
        )}

        {message.sources.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.sources.map((source) => (
              <Badge
                key={source}
                variant="secondary"
                className="gap-1.5 border-border bg-muted/80 text-muted-foreground"
              >
                <Check className="h-3 w-3 text-emerald-300" aria-hidden="true" />
                {source}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}


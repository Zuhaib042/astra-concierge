"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Bot, ShieldCheck } from "lucide-react";

import { ChatMessage } from "@/components/chat/chat-message";
import { MessageComposer } from "@/components/chat/message-composer";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  buildDemoReply,
  INITIAL_CHAT_MESSAGES,
  splitReplyIntoChunks,
  type ChatMessage as ChatMessageType,
} from "@/lib/chat-demo";

function createMessageId(role: ChatMessageType["role"]) {
  return `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export function ChatWorkspace() {
  const [messages, setMessages] = useState<ChatMessageType[]>(
    INITIAL_CHAT_MESSAGES,
  );
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastAutomation, setLastAutomation] = useState(
    "Conversation summary ready",
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const streamTimerRef = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  function submitMessage(nextPrompt = draft) {
    const prompt = nextPrompt.trim();

    if (!prompt || isStreaming) {
      return;
    }

    const reply = buildDemoReply(prompt);
    const assistantMessageId = createMessageId("assistant");
    const chunks = splitReplyIntoChunks(reply.content);
    const timestamp = getCurrentTimeLabel();

    const visitorMessage: ChatMessageType = {
      id: createMessageId("visitor"),
      role: "visitor",
      name: "Visitor",
      content: prompt,
      sources: [],
      timestamp,
      status: "complete",
    };

    const assistantMessage: ChatMessageType = {
      id: assistantMessageId,
      role: "assistant",
      name: "Astra",
      content: "",
      sources: reply.sources,
      timestamp,
      status: "streaming",
    };

    setDraft("");
    setIsStreaming(true);
    setLastAutomation(reply.automationLabel);
    setMessages((currentMessages) => [
      ...currentMessages,
      visitorMessage,
      assistantMessage,
    ]);

    let chunkIndex = 0;

    streamTimerRef.current = window.setInterval(() => {
      chunkIndex += 1;

      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id !== assistantMessageId) {
            return message;
          }

          const isComplete = chunkIndex >= chunks.length;

          return {
            ...message,
            content: chunks.slice(0, chunkIndex).join(""),
            status: isComplete ? "complete" : "streaming",
          };
        }),
      );

      if (chunkIndex >= chunks.length && streamTimerRef.current) {
        window.clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
        setIsStreaming(false);
      }
    }, 28);
  }

  return (
    <Card
      id="concierge-demo"
      className="relative overflow-hidden bg-card/90 shadow-2xl shadow-black/25"
    >
      <div className="border-b border-border bg-muted/30 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Astra Concierge
              </h2>
              <p className="text-xs text-muted-foreground">
                Interactive local demo for an AI automation agency
              </p>
            </div>
          </div>
          <Badge variant="success" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {isStreaming ? "Answering" : "Ready"}
          </Badge>
        </div>
      </div>

      <div className="border-b border-border bg-background/40 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md border border-border bg-muted px-2 py-1">
            Intent: service inquiry
          </span>
          <span className="rounded-md border border-border bg-muted px-2 py-1">
            Automation: {lastAutomation}
          </span>
        </div>
      </div>

      <div className="max-h-[520px] min-h-[420px] space-y-4 overflow-y-auto px-5 py-5">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <SuggestedPrompts disabled={isStreaming} onSelectPrompt={submitMessage} />
      <MessageComposer
        draft={draft}
        isStreaming={isStreaming}
        onDraftChange={setDraft}
        onSubmit={submitMessage}
      />
    </Card>
  );
}


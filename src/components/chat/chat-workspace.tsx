"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, Bot, CircleStop, ShieldCheck } from "lucide-react";
import { DefaultChatTransport } from "ai";

import { ChatMessage } from "@/components/chat/chat-message";
import { MessageComposer } from "@/components/chat/message-composer";
import { SuggestedPrompts } from "@/components/chat/suggested-prompts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAutomationLabelForPrompt,
  INITIAL_CHAT_MESSAGES,
} from "@/lib/chat-demo";

const CONVERSATION_ID_STORAGE_KEY = "astra-concierge-conversation-id";

export function ChatWorkspace() {
  const [draft, setDraft] = useState("");
  const [lastAutomation, setLastAutomation] = useState(
    "Conversation summary ready",
  );

  const conversationIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { clearError, error, messages, regenerate, sendMessage, status, stop } =
    useChat({
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
    });

  const isStreaming = status === "submitted" || status === "streaming";
  const statusLabel = error ? "Needs setup" : isStreaming ? "Answering" : "Ready";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  function getConversationId() {
    if (conversationIdRef.current) {
      return conversationIdRef.current;
    }

    const storedConversationId = window.sessionStorage.getItem(
      CONVERSATION_ID_STORAGE_KEY,
    );
    const conversationId = storedConversationId ?? crypto.randomUUID();

    window.sessionStorage.setItem(CONVERSATION_ID_STORAGE_KEY, conversationId);
    conversationIdRef.current = conversationId;

    return conversationId;
  }

  function submitMessage(nextPrompt = draft) {
    const prompt = nextPrompt.trim();

    if (!prompt || isStreaming) {
      return;
    }

    setDraft("");
    clearError();
    setLastAutomation(getAutomationLabelForPrompt(prompt));
    void sendMessage(
      { text: prompt },
      { body: { conversationId: getConversationId() } },
    );
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
                Gemini streaming demo for an AI automation agency
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={stop}
                aria-label="Stop response"
                className="shrink-0"
              >
                <CircleStop className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : null}
            <Badge variant={error ? "secondary" : "success"} className="gap-1.5">
              {error ? (
                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {statusLabel}
            </Badge>
          </div>
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
          {INITIAL_CHAT_MESSAGES.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>
        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Live Gemini chat is not configured yet. Add a Gemini API key to
                the server environment and restart the app.
              </p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => regenerate()}
                disabled={messages.length === 0 || isStreaming}
                className="shrink-0"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : null}
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

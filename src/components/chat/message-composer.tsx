"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageComposerProps {
  draft: string;
  isStreaming: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageComposer({
  draft,
  isStreaming,
  onDraftChange,
  onSubmit,
}: MessageComposerProps) {
  const canSubmit = draft.trim().length > 0 && !isStreaming;

  return (
    <form
      className="border-t border-border bg-background/70 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex items-end gap-3 rounded-lg border border-border bg-card p-2">
        <Textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          disabled={isStreaming}
          rows={2}
          placeholder="Ask about pricing, integrations, timelines, or support handoff"
          className="min-h-12 resize-none border-0 bg-transparent shadow-none focus-visible:border-0 focus-visible:ring-0"
          aria-label="Message Astra Concierge"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!canSubmit}
          aria-label="Send message"
          className="mb-1 shrink-0"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

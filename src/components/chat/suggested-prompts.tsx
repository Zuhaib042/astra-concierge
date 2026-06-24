"use client";

import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SUGGESTED_PROMPTS } from "@/lib/chat-demo";

interface SuggestedPromptsProps {
  disabled: boolean;
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({
  disabled,
  onSelectPrompt,
}: SuggestedPromptsProps) {
  return (
    <div className="border-t border-border bg-muted/20 px-5 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Badge variant="outline" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Try a prompt
        </Badge>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          Local demo logic for now
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="shrink-0 rounded-md border border-border bg-background/70 px-3 py-2 text-left text-xs leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}


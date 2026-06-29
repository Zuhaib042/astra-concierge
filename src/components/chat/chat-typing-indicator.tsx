"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const dots = [0, 1, 2] as const;

export function ChatTypingIndicator() {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }}
      className="flex justify-start"
      aria-label="Astra is preparing a response"
      aria-live="polite"
    >
      <div className="max-w-[92%] rounded-lg border border-border bg-background/75 px-4 py-3 text-sm shadow-sm md:max-w-[82%]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs font-medium">
            <Bot className="h-3.5 w-3.5" aria-hidden="true" />
            Astra
          </span>
          <span className="font-mono text-[11px] opacity-70">Live</span>
        </div>

        <div className="flex h-6 items-center gap-1.5">
          {dots.map((dot) => (
            <motion.span
              key={dot}
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                opacity: [0.35, 1, 0.35],
                y: [0, -4, 0],
                scale: [0.92, 1, 0.92],
              }}
              transition={{
                duration: 0.9,
                ease: [0.4, 0, 0.2, 1],
                repeat: Infinity,
                delay: dot * 0.14,
              }}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

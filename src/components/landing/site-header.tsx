import { Activity, ArrowRight, Bot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/demo-data";
import { PROJECT } from "@/lib/project";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-5 md:px-8">
      <a href="#" className="flex items-center gap-3" aria-label="Astra Concierge home">
        <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card text-primary shadow-sm">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-semibold text-foreground">
            {PROJECT.name}
          </span>
          <span className="block text-xs text-muted-foreground">
            AI automation desk
          </span>
        </span>
      </a>

      <nav className="hidden items-center gap-1 rounded-md border border-border bg-card/70 p-1 md:flex">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Badge variant="success" className="hidden gap-1.5 sm:inline-flex">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          Live demo shell
        </Badge>
        <a
          href="#concierge-demo"
          className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
        >
          Preview
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}


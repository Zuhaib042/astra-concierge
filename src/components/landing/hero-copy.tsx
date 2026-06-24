import { ArrowRight, Database, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { OUTCOME_METRICS } from "@/lib/demo-data";
import { PROJECT } from "@/lib/project";
import { cn } from "@/lib/utils";

export function HeroCopy() {
  return (
    <section className="flex flex-col justify-center py-8 md:py-12">
      <Badge variant="outline" className="w-fit gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        Premium AI concierge demo
      </Badge>

      <div className="mt-7 max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-primary">
          Service business automation
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          {PROJECT.tagline}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {PROJECT.description}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#concierge-demo"
          className={cn(buttonVariants({ size: "lg" }), "min-h-11 w-full sm:w-fit")}
        >
          Open demo workspace
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href="#knowledge"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "min-h-11 w-full sm:w-fit",
          )}
        >
          <Database className="h-4 w-4" aria-hidden="true" />
          View knowledge flow
        </a>
      </div>

      <dl className="mt-10 grid gap-3 sm:grid-cols-3">
        {OUTCOME_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-border bg-card/70 p-4"
          >
            <dt className="text-xs text-muted-foreground">{metric.label}</dt>
            <dd className="mt-2 font-mono text-2xl font-semibold text-foreground">
              {metric.value}
            </dd>
            <dd className="mt-1 text-xs leading-5 text-muted-foreground">
              {metric.detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

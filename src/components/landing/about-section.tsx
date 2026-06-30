import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Handshake,
  MessageSquareText,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  ABOUT_CAPABILITIES,
  BUSINESS_OUTCOMES,
  TAILORING_STEPS,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const capabilityIcons = [
  MessageSquareText,
  SlidersHorizontal,
  BriefcaseBusiness,
  Handshake,
  BarChart3,
  FileText,
] as const;

export function AboutSection() {
  return (
    <section id="about" className="py-4">
      <div className="grid gap-8 border-y border-border py-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="min-w-0">
          <Badge variant="outline" className="gap-2">
            <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" aria-hidden />
            Built for qualified conversations
          </Badge>

          <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            A concierge that turns website visitors into qualified conversations.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Astra is designed to feel like a premium front desk, sales assistant,
            and service expert in one. It can be tailored for clinics, agencies,
            consultants, home services, education providers, SaaS companies, and
            other teams that need more qualified conversations from their website.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#concierge-demo"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-11 w-full sm:w-fit",
              )}
            >
              Try the concierge
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="/admin"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "min-h-11 w-full sm:w-fit",
              )}
            >
              View owner dashboard
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ABOUT_CAPABILITIES.map((capability, index) => {
            const Icon = capabilityIcons[index] ?? MessageSquareText;

            return (
              <article
                key={capability.title}
                className="rounded-lg border border-border bg-card/80 p-4"
              >
                <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {capability.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-border bg-card/80 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
              <SlidersHorizontal className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                How Astra adapts to a business
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Every business needs different qualification questions, handoff
                rules, tone, offers, and integrations. Astra is built to adapt to
                those details instead of forcing one generic chatbot flow.
              </p>
            </div>
          </div>

          <ol className="mt-5 grid gap-3 md:grid-cols-2">
            {TAILORING_STEPS.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 rounded-md border border-border bg-background/55 p-4"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-muted-foreground">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-border bg-card/80 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary text-primary">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Outcomes growing teams care about
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The goal is not to impress visitors with AI. The goal is to help
                the business respond faster, qualify better, and win more of the
                right conversations.
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {BUSINESS_OUTCOMES.map((outcome) => (
              <li key={outcome} className="flex items-center gap-3">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="text-sm text-foreground">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { CircleDashed, FileSearch, LineChart, RadioTower } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTOMATION_EVENTS, CAPABILITY_SUMMARY } from "@/lib/demo-data";

const eventIcon = {
  complete: FileSearch,
  active: RadioTower,
  pending: CircleDashed,
} as const;

export function OperationsPanel() {
  return (
    <section id="outcomes" className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-primary" aria-hidden="true" />
            Business-aware answers
          </CardTitle>
          <CardDescription>
            Astra is shaped around the offers, policies, language, and buying
            questions that matter to each business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {CAPABILITY_SUMMARY.map((capability) => (
              <div
                key={capability.title}
                className="rounded-md border border-border bg-background/60 p-4"
              >
                <h3 className="text-sm font-medium text-foreground">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-4 w-4 text-primary" aria-hidden="true" />
            Sales-ready handoff
          </CardTitle>
          <CardDescription>
            The conversation moves from helpful answer to qualified opportunity
            without forcing visitors through a cold form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {AUTOMATION_EVENTS.map((event) => {
              const Icon = eventIcon[event.status];

              return (
                <li
                  key={event.title}
                  className="flex gap-3 rounded-md border border-border bg-background/60 p-4"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {event.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {event.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}

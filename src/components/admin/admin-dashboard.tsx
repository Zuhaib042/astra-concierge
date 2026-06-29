import Link from "next/link";
import type { ComponentType } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CircleAlert,
  Database,
  Inbox,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AdminCategoryRow,
  AdminConversationRow,
  AdminDashboardData,
  AdminIntentRow,
  AdminLeadRow,
  AdminMessageRow,
} from "@/lib/admin/dashboard";
import { PROJECT } from "@/lib/project";
import { cn } from "@/lib/utils";

type BadgeVariant = BadgeProps["variant"];

type MetricCardProps = {
  label: string;
  value: number | string;
  detail: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatDateTime(value: Date | null) {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function truncateText(value: string, maxLength = 110) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

function formatLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLeadTitle(lead: AdminLeadRow) {
  return lead.companyName ?? lead.name ?? "Unidentified visitor";
}

function getLeadContact(lead: AdminLeadRow) {
  return lead.email ?? lead.phone ?? "No contact yet";
}

function getStatusVariant(status: string): BadgeVariant {
  if (status === "qualified" || status === "won") {
    return "success";
  }

  if (status === "active" || status === "new" || status === "contacted") {
    return "warning";
  }

  return "outline";
}

function getPriorityVariant(priority: AdminLeadRow["priority"]): BadgeVariant {
  if (priority === "high") {
    return "warning";
  }

  if (priority === "low") {
    return "outline";
  }

  return "secondary";
}

function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-foreground">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">{detail}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-secondary text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-6 py-10 text-center text-sm text-muted-foreground">
      <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden />
      <p>{label}</p>
    </div>
  );
}

function LeadPipelineTable({ leads }: { leads: AdminLeadRow[] }) {
  if (leads.length === 0) {
    return <EmptyState label="No leads have been captured yet." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-y border-border bg-secondary/60 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-medium">Lead</th>
            <th className="px-5 py-3 font-medium">Intent</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Budget</th>
            <th className="px-5 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leads.map((lead) => (
            <tr key={lead.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-foreground">{getLeadTitle(lead)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {getLeadContact(lead)}
                </p>
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                <p className="max-w-56 text-foreground">
                  {lead.intent ?? "Intent not clear yet"}
                </p>
                <p className="mt-1 text-xs">{lead.timeline ?? "Timeline unknown"}</p>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusVariant(lead.status)}>
                    {formatLabel(lead.status)}
                  </Badge>
                  <Badge variant={getPriorityVariant(lead.priority)}>
                    {formatLabel(lead.priority)}
                  </Badge>
                </div>
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                {lead.budgetRange ?? "Not shared"}
              </td>
              <td className="px-5 py-4 text-muted-foreground">
                {formatDateTime(lead.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConversationList({
  conversations,
}: {
  conversations: AdminConversationRow[];
}) {
  if (conversations.length === 0) {
    return <EmptyState label="No conversations have been stored yet." />;
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto]"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-foreground">{conversation.title}</p>
              <Badge variant={getStatusVariant(conversation.status)}>
                {formatLabel(conversation.status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatNumber(conversation.messageCount)} messages |{" "}
              {formatNumber(conversation.leadCount)} lead records |{" "}
              {formatLabel(conversation.channel)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground md:text-right">
            {formatDateTime(conversation.lastMessageAt ?? conversation.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function KnowledgeHealth({
  coverage,
  categories,
}: {
  coverage: number;
  categories: AdminCategoryRow[];
}) {
  return (
    <div className="space-y-5 px-5 pb-5">
      <div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Embedded chunk coverage</span>
          <span className="font-medium text-foreground">{coverage}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState label="No source documents have been ingested yet." />
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.category}
              className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-2"
            >
              <span className="min-w-0 truncate text-sm text-foreground">
                {formatLabel(category.category)}
              </span>
              <Badge variant="secondary">{formatNumber(category.count)}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadIntentList({ intents }: { intents: AdminIntentRow[] }) {
  if (intents.length === 0) {
    return <EmptyState label="No lead intent patterns are available yet." />;
  }

  return (
    <div className="divide-y divide-border">
      {intents.map((intent) => (
        <div
          key={intent.intent}
          className="flex items-start justify-between gap-4 px-5 py-4"
        >
          <p className="min-w-0 text-sm text-foreground">{intent.intent}</p>
          <Badge variant="secondary">{formatNumber(intent.count)}</Badge>
        </div>
      ))}
    </div>
  );
}

function RecentMessageList({ messages }: { messages: AdminMessageRow[] }) {
  if (messages.length === 0) {
    return <EmptyState label="No messages have been saved yet." />;
  }

  return (
    <div className="divide-y divide-border">
      {messages.map((message) => (
        <div key={message.id} className="px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant={message.role === "assistant" ? "success" : "secondary"}>
              {formatLabel(message.role)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDateTime(message.createdAt)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground">
            {truncateText(message.content)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {message.conversationTitle}
          </p>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboard({ data }: { data: AdminDashboardData }) {
  const { summary } = data;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 md:px-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card text-primary shadow-sm">
                <Bot className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-primary">{PROJECT.name}</p>
                <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                  Admin dashboard
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Monitor concierge conversations, captured leads, and knowledge-base
              readiness from one operational view.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            >
              Open concierge
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={MessageSquareText}
            label="Conversations"
            value={summary.conversations.total}
            detail={`${formatNumber(summary.conversations.active)} active | ${formatNumber(
              summary.conversations.qualified,
            )} qualified`}
          />
          <MetricCard
            icon={BriefcaseBusiness}
            label="Leads"
            value={summary.leads.total}
            detail={`${formatNumber(summary.leads.qualified)} qualified | ${formatNumber(
              summary.leads.highPriority,
            )} high priority`}
          />
          <MetricCard
            icon={Activity}
            label="Messages"
            value={summary.messages.total}
            detail={`${formatNumber(summary.messages.user)} user | ${formatNumber(
              summary.messages.assistant,
            )} assistant`}
          />
          <MetricCard
            icon={Database}
            label="Knowledge base"
            value={`${summary.knowledge.embeddingCoverage}%`}
            detail={`${formatNumber(summary.knowledge.embeddedChunks)} of ${formatNumber(
              summary.knowledge.chunks,
            )} chunks embedded`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-hidden">
            <SectionHeading
              title="Lead pipeline"
              description="The most recently updated prospects captured by Astra."
            />
            <LeadPipelineTable leads={data.recentLeads} />
          </Card>

          <Card className="overflow-hidden">
            <SectionHeading
              title="Top lead intents"
              description="Common buying signals currently appearing in captured leads."
            />
            <LeadIntentList intents={data.topLeadIntents} />
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <SectionHeading
              title="Recent conversations"
              description="Stored visitor sessions with message and lead counts."
            />
            <ConversationList conversations={data.recentConversations} />
          </Card>

          <Card className="overflow-hidden">
            <SectionHeading
              title="Knowledge health"
              description={`${formatNumber(
                summary.knowledge.documents,
              )} documents indexed across the demo corpus.`}
            />
            <KnowledgeHealth
              coverage={summary.knowledge.embeddingCoverage}
              categories={data.documentsByCategory}
            />
          </Card>
        </section>

        <Card className="overflow-hidden">
          <SectionHeading
            title="Recent message stream"
            description="A quick audit trail for the newest saved chat turns."
          />
          <RecentMessageList messages={data.recentMessages} />
        </Card>
      </div>
    </main>
  );
}

export function AdminDashboardUnavailable() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-8 md:px-8">
        <Card>
          <CardHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border border-border bg-secondary text-accent">
              <CircleAlert className="h-5 w-5" aria-hidden />
            </div>
            <CardTitle>Admin dashboard unavailable</CardTitle>
            <CardDescription>
              Astra could not load the dashboard data. Check that `DATABASE_URL`
              is configured and that the Neon database is reachable.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/" className={cn(buttonVariants({ variant: "secondary" }))}>
              Back to concierge
            </Link>
            <Badge variant="outline" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Safe read-only view
            </Badge>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

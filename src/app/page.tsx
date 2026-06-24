import { PROJECT, UPCOMING_CAPABILITIES } from "@/lib/project";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
      <header className="flex items-center justify-between border-b border-panel-border pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            Portfolio AI System
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            {PROJECT.name}
          </h1>
        </div>
        <div className="hidden rounded-full border border-panel-border px-4 py-2 text-sm text-muted sm:block">
          Chunk 1 ready
        </div>
      </header>

      <section className="grid flex-1 items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-mono text-sm text-accent">Foundation</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
            {PROJECT.tagline}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
            {PROJECT.description}
          </p>
        </div>

        <div className="rounded-lg border border-panel-border bg-panel p-5 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between border-b border-panel-border pb-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Build roadmap
              </p>
              <p className="mt-1 text-sm text-muted">
                The foundation is now ready for the next layers.
              </p>
            </div>
            <div className="h-3 w-3 rounded-full bg-accent" />
          </div>

          <ul className="mt-5 space-y-3">
            {UPCOMING_CAPABILITIES.map((capability) => (
              <li
                key={capability}
                className="rounded-md border border-panel-border bg-background/55 px-4 py-3 text-sm text-foreground"
              >
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}


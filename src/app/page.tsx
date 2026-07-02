import { ChatWorkspace } from "@/components/chat/chat-workspace";
import { AboutSection } from "@/components/landing/about-section";
import { HeroCopy } from "@/components/landing/hero-copy";
import { OperationsPanel } from "@/components/landing/operations-panel";
import { SiteHeader } from "@/components/landing/site-header";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-12 md:px-8">
        <section className="grid min-h-[calc(100vh-96px)] items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="min-w-0 animate-panel-rise">
            <HeroCopy />
          </div>
          <div className="min-w-0 animate-panel-rise [animation-delay:120ms]">
            <ChatWorkspace />
          </div>
        </section>

        <div className="animate-panel-rise [animation-delay:220ms]">
          <OperationsPanel />
        </div>

        <div className="animate-panel-rise [animation-delay:320ms]">
          <AboutSection />
        </div>
      </div>
    </main>
  );
}

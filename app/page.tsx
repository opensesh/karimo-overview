import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { PipelineAnimation } from "@/components/PipelineAnimation";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { OrchestrationViz } from "@/components/OrchestrationViz";
import { AdoptionPhases } from "@/components/AdoptionPhases";

export default function Home() {
  return (
    <>
      <Navigation />

      <main className="flex-1">
        {/* Section 01: Hero + Pipeline Animation */}
        <section id="hero">
          <Hero />
          <div className="border-t border-[var(--color-black70)]">
            <PipelineAnimation />
          </div>
        </section>

        {/* Section 02: The Process */}
        <section id="process">
          <ProcessTimeline />
        </section>

        {/* Section 03: Orchestration */}
        <section id="orchestration">
          <OrchestrationViz />
        </section>

        {/* Section 04: Adoption Phases */}
        <section id="adoption">
          <AdoptionPhases />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--color-black70)] bg-[var(--color-charcoal)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-aperol)] flex items-center justify-center text-sm font-bold text-[var(--color-vanilla)]">
              K
            </span>
            <span className="text-[var(--color-vanilla)] font-semibold">
              KARIMO
            </span>
            <span className="text-[var(--color-black50)] text-sm">
              by Open Session
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/opensesh/KARIMO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-black50)] hover:text-[var(--color-vanilla)] transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://github.com/opensesh/KARIMO/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-black50)] hover:text-[var(--color-vanilla)] transition-colors text-sm"
            >
              MIT License
            </a>
          </div>

          <p className="text-[var(--color-black50)] text-sm">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </>
  );
}

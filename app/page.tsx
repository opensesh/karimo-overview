import { KarimoPipeline } from "@/components/KarimoPipeline";
import { ProcessSection } from "@/components/ProcessSection";
import { OrchestrationSection } from "@/components/OrchestrationSection";
import { AdoptionSection } from "@/components/AdoptionSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section 01: How It Works - Pipeline Animation */}
      <KarimoPipeline />

      {/* Section 02: Process - How KARIMO Works */}
      <ProcessSection />

      {/* Section 03: Orchestration - Wave-Based Execution */}
      <OrchestrationSection />

      {/* Section 04: Adoption - Three-Phase Progression */}
      <AdoptionSection />
    </main>
  );
}

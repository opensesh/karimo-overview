import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { UnifiedPipelineSection } from "@/components/UnifiedPipelineSection";
import { OrchestrationSection } from "@/components/OrchestrationSection";
import { AdoptionSection } from "@/components/AdoptionSection";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero: ASCII title, badges, description */}
        <HeroSection />

        {/* Section 01: How It Works - Unified Pipeline */}
        <UnifiedPipelineSection />

        {/* Section 02: Orchestration - Wave-Based Execution */}
        <OrchestrationSection />

        {/* Section 03: Approach - Three-Phased Adoption */}
        <AdoptionSection />
      </main>
    </>
  );
}

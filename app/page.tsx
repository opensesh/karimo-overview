import { ViewportProvider } from "@/components/ViewportProvider";
import { Navigation } from "@/components/Navigation";
import { SideNav } from "@/components/SideNav";
import { HeroSection } from "@/components/HeroSection";
import { SolutionSection } from "@/components/SolutionSection";
import { LiveExampleSection } from "@/components/LiveExampleSection";
import { EncodingSection } from "@/components/EncodingSection";
import { ContextSection } from "@/components/ContextSection";
import { AdoptionSection } from "@/components/AdoptionSection";
import { ProblemSection } from "@/components/ProblemSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

async function getLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/opensesh/KARIMO/releases/latest",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.tag_name ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const version = await getLatestVersion();

  return (
    <>
      <ViewportProvider>
        <Navigation />
        <SideNav />
        <main className="min-h-screen">
          <div className="relative" style={{ zIndex: 1 }}>
            <HeroSection version={version} />
          </div>
          <div className="relative section-layer" style={{ zIndex: 2 }}>
            <ProblemSection />
          </div>
          <div className="relative section-layer" style={{ zIndex: 3 }}>
            <SolutionSection />
          </div>
          <div className="relative section-layer" style={{ zIndex: 4 }}>
            <LiveExampleSection />
          </div>
          <div className="relative section-layer" style={{ zIndex: 5 }}>
            <EncodingSection />
          </div>
          <div className="relative section-layer" style={{ zIndex: 6 }}>
            <ContextSection />
          </div>
          <div className="relative section-layer" style={{ zIndex: 7 }}>
            <AdoptionSection />
          </div>
          <div className="relative section-layer" style={{ zIndex: 8 }}>
            <CTASection />
          </div>
        </main>

        <Footer />
      </ViewportProvider>
    </>
  );
}

import { Navigation } from "@/components/Navigation";
import { SideNav } from "@/components/SideNav";
import { HeroSection } from "@/components/HeroSection";
import { OverviewSection } from "@/components/OverviewSection";
import { LiveExampleSection } from "@/components/LiveExampleSection";
import { EncodingSection } from "@/components/EncodingSection";
import { ContextSection } from "@/components/ContextSection";
import { AdoptionSection } from "@/components/AdoptionSection";
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
      <Navigation />
      <SideNav />
      <main className="min-h-screen">
        <HeroSection version={version} />
        <OverviewSection />
        <LiveExampleSection />
        <EncodingSection />
        <AdoptionSection />
        <ContextSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}

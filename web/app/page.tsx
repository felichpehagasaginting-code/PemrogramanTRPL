import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  HeroSection,
  TrustBarSection,
  FeaturesSection,
  CurriculumSection,
  GamificationSection,
  CTASection,
  EngineerSection,
} from "@/components/landing/Sections";
import { CyberBackground } from "@/components/landing/CyberBackground";
import { FAQSection } from "@/components/landing/FAQSection";

export default function HomePage() {
  return (
    <>
      <CyberBackground />
      <Navbar />
      <main style={{ flex: 1, position: "relative", zIndex: 1, overflowX: "hidden" }}>
        <HeroSection />
        <TrustBarSection />
        <FeaturesSection />
        <CurriculumSection />
        <GamificationSection />

        <section id="faq" className="section-padding" style={{ background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
          <FAQSection />
        </section>

        <CTASection />
        <EngineerSection />
      </main>
      <Footer />
    </>
  );
}


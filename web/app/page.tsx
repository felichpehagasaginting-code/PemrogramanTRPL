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
import { XPCalculator } from "@/components/landing/XPCalculator";
import { BeforeAfterSlider } from "@/components/landing/BeforeAfterSlider";
import { FAQSection } from "@/components/landing/FAQSection";
import { StickyCTABar } from "@/components/landing/StickyCTABar";
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { PointingPopup } from "@/components/ui/PointingPopup";
import { LANDING_FEATURES, POINTING_FEATURES } from "@/lib/features";

export default function HomePage() {
  return (
    <>
      <CyberBackground />
      <Navbar />
      <main style={{ flex: 1, position: "relative", zIndex: 1, overflowX: "hidden" }}>
        <HeroSection />
        <TrustBarSection />
        <FeaturesSection />

        <section id="transformasi" className="section-padding" style={{ background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
          <BeforeAfterSlider />
        </section>

        <CurriculumSection />

        <section id="kalkulator" className="section-padding" style={{ background: "var(--bg-page)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
          <XPCalculator />
        </section>

        <GamificationSection />

        <section id="faq" className="section-padding" style={{ background: "var(--bg-page-alt)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
          <FAQSection />
        </section>

        <CTASection />
        <EngineerSection />
      </main>
      <Footer />
      <StickyCTABar />
      <FeaturePopupQueue features={LANDING_FEATURES} delay={5000} />
      <PointingPopup {...POINTING_FEATURES.themeToggle} delay={8000} position="bottom" />
    </>
  );
}


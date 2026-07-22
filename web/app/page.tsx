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
      <main style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <HeroSection />
        <TrustBarSection />
        <FeaturesSection />

        <div style={{ padding: "var(--space-12) 0", background: "var(--bg-page-alt)" }}>
          <BeforeAfterSlider />
        </div>

        <CurriculumSection />

        <div style={{ padding: "var(--space-12) 0", background: "var(--bg-page)" }}>
          <XPCalculator />
        </div>

        <GamificationSection />

        <div style={{ padding: "var(--space-12) 0", background: "var(--bg-page-alt)" }}>
          <FAQSection />
        </div>

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

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
import { FeaturePopupQueue } from "@/components/ui/FeaturePopupQueue";
import { PointingPopup } from "@/components/ui/PointingPopup";
import { LANDING_FEATURES, POINTING_FEATURES } from "@/lib/features";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <TrustBarSection />
        <FeaturesSection />
        <CurriculumSection />
        <GamificationSection />
        <CTASection />
        <EngineerSection />
      </main>
      <Footer />
      <FeaturePopupQueue features={LANDING_FEATURES} delay={5000} />
      <PointingPopup {...POINTING_FEATURES.themeToggle} delay={8000} position="bottom" />
    </>
  );
}

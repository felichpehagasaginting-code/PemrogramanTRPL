import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  HeroSection,
  FeaturesSection,
  CurriculumSection,
  GamificationSection,
  CTASection,
  EngineerSection,
} from "@/components/landing/Sections";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <CurriculumSection />
        <GamificationSection />
        <CTASection />
        <EngineerSection />
      </main>
      <Footer />
    </>
  );
}

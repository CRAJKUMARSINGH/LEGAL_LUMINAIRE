import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestCasesSection from "@/components/landing/TestCasesSection";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import AccuracySection from "@/components/landing/AccuracySection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestCasesSection />
      <ArchitectureSection />
      <AccuracySection />
      <Footer />
    </div>
  );
};

export default Index;

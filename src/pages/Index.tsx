import HeroSection from "@/components/HeroSection";
import AgentPipeline from "@/components/AgentPipeline";
import DemoChat from "@/components/DemoChat";
import DesignPrinciples from "@/components/DesignPrinciples";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AgentPipeline />
      <DemoChat />
      <DesignPrinciples />
      <Footer />
    </div>
  );
};

export default Index;

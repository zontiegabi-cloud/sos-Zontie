import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsSection } from "@/components/home/NewsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ClassesSection } from "@/components/home/ClassesSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <NewsSection />
      <FeaturesSection />
      <ClassesSection />
      <CTASection />
    </Layout>
  );
};

export default Index;

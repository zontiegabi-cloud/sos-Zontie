import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsSection } from "@/components/home/NewsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ClassesSection } from "@/components/home/ClassesSection";
import { CTASection } from "@/components/home/CTASection";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Index = () => {
  const { settings } = useSiteSettings();
  
  // Get enabled sections sorted by order
  const enabledSections = settings.homepageSections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionComponents: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" />,
    news: <NewsSection key="news" />,
    features: <FeaturesSection key="features" />,
    classes: <ClassesSection key="classes" />,
    cta: <CTASection key="cta" />,
  };

  return (
    <Layout>
      {enabledSections.map(section => sectionComponents[section.id])}
    </Layout>
  );
};

export default Index;

import { Layout } from "@/components/layout/Layout";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { DEFAULT_SECTIONS } from "@/lib/default-sections";

const Index = () => {
  const { settings } = useSiteSettings();
  
  // Get enabled sections sorted by order
  const enabledSections = settings.homepageSections
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <Layout>
      {enabledSections.map(section => {
        // Use custom section from settings, or fallback to default configuration
        const sectionData = settings.customSections?.[section.id] || DEFAULT_SECTIONS[section.id];
        
        if (sectionData) {
          return <CustomSectionRenderer key={section.id} section={sectionData} />;
        }
        
        return null;
      })}
    </Layout>
  );
};

export default Index;

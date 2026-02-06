import { useState, useMemo } from "react";
import { useContent } from "@/hooks/use-content";
import { Layout } from "@/components/layout/Layout";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { GameContentNav } from "@/components/game/GameContentNav";
import { CustomSection } from "@/lib/content-store";

export default function GameContent() {
  const { pages, isLoading } = useContent();
  const page = pages.find(p => p.slug === 'game-content');
  
  // Legacy compatibility: If we have sections with showInNav, use them.
  // Otherwise, if we are on game-content, patch them for backward compatibility.
  const sections = useMemo(() => {
     if (!page) return [];
     const hasNavConfig = page.sections.some(s => s.settings?.showInNav);
     
     if (hasNavConfig) return page.sections;
     
     // Legacy Fallback for existing data: map old IDs/names to showInNav
     return page.sections.map(s => {
        const lowerId = s.id.toLowerCase();
        const lowerName = s.name.toLowerCase();
        
        // Check for known sections
        const isWeapons = lowerId.includes('weapon') || lowerName === 'weapons';
        const isMaps = lowerId.includes('map') || lowerName === 'maps';
        const isDevices = lowerId.includes('device') || lowerName === 'devices';
        const isModes = lowerId.includes('mode') || lowerName === 'game modes';
        
        if (isWeapons || isMaps || isDevices || isModes) {
             return {
                 ...s,
                 settings: {
                     ...s.settings,
                     showInNav: true,
                     navLabel: s.name
                 }
             } as CustomSection;
        }
        return s;
     });
  }, [page]);

  // Default to the first navigable section
  const defaultTab = useMemo(() => {
      const firstNavSection = sections.find(s => s.settings?.showInNav);
      return firstNavSection ? firstNavSection.id : "";
  }, [sections]);

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const currentTab = activeTab || defaultTab;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Page not found. Please ensure "game-content" page exists in the content store.</p>
        </div>
      </Layout>
    );
  }

  // Determine if we should show the nav
  const showNav = page.settings?.showGameContentNav ?? true;

  const isSectionVisible = (section: CustomSection) => {
    if (!showNav) return true;
    
    // If it's not a nav section, it's always visible (e.g. Hero)
    if (!section.settings?.showInNav) return true;

    return section.id === currentTab;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {sections.map((section, index) => {
          const isHero = index === 0; // Assumption based on typical layout
          const visible = isSectionVisible(section);

          if (!visible) return null;

          return (
            <div key={section.id}>
              <CustomSectionRenderer section={section} />
              {/* Render Nav after the hero section */}
              {isHero && showNav && (
                <GameContentNav 
                    sections={sections}
                    activeTab={currentTab} 
                    onTabChange={setActiveTab} 
                />
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

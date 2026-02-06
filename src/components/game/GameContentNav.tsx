import { motion } from "framer-motion";
import { Crosshair, Map, Cpu, Gamepad2, Layers } from "lucide-react";
import { CustomSection } from "@/lib/content-store";

interface GameContentNavProps {
  sections: CustomSection[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function GameContentNav({ sections, activeTab, onTabChange }: GameContentNavProps) {
  // Helper to guess icon
  const getIcon = (section: CustomSection) => {
    const name = (section.settings?.navLabel || section.name).toLowerCase();
    if (name.includes('weapon')) return Crosshair;
    if (name.includes('map')) return Map;
    if (name.includes('device')) return Cpu;
    if (name.includes('mode')) return Gamepad2;
    return Layers;
  };

  const navSections = sections.filter(s => s.settings?.showInNav);
  
  const tabs = navSections.map(s => ({
        id: s.id,
        label: s.settings?.navLabel || s.name,
        icon: getIcon(s)
    }));

  if (navSections.length === 0) return null;

  return (
    <div className="flex justify-center mb-8 sticky top-20 z-40 py-4">
      <div className="flex items-center gap-1 p-1.5 bg-background/80 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-x-auto max-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300
                ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 font-heading uppercase text-sm tracking-wider font-bold">
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

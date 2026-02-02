import { motion } from "framer-motion";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getBackgroundStyle } from "@/lib/background-utils";

export function CTASection() {
  const { settings } = useSiteSettings();

  // Guard clause for missing settings
  if (!settings?.cta || !settings?.backgrounds) return null;

  const { cta, backgrounds } = settings;

  // Helper to determine button variant style
  const getButtonVariant = (variant: string) => {
    switch (variant) {
      case 'secondary': return "secondary";
      case 'outline': return "outline";
      case 'ghost': return "ghost";
      default: return "default"; // maps to primary/default
    }
  };

  const getButtonClasses = (variant: string) => {
    const baseClasses = "font-heading text-lg uppercase tracking-wide px-10 py-7";
    switch (variant) {
      case 'secondary': 
        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
      case 'outline':
        return `${baseClasses} border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
      case 'ghost':
        return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
      default: // primary
        return `${baseClasses} bg-accent hover:bg-accent/90 text-accent-foreground glow-accent`;
    }
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={getBackgroundStyle(backgrounds.cta)}
      />
      {backgrounds.cta.textureEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ 
            backgroundImage: `url('/textures/grunge.png')`,
            opacity: (backgrounds.cta.textureOpacity || 3) / 100
          }} 
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="font-display text-4xl lg:text-7xl text-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: cta.title }}
          />
          <p 
            className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto mb-10 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: cta.description }}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {cta.buttons.map((button, index) => (
              <Button
                key={index}
                asChild
                size="lg"
                variant={getButtonVariant(button.variant) as any}
                className={getButtonClasses(button.variant)}
              >
                <a
                  href={button.url}
                  target={button.url.startsWith('http') ? "_blank" : undefined}
                  rel={button.url.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3"
                >
                  <span dangerouslySetInnerHTML={{ __html: button.text }} />
                  {button.url.startsWith('http') && <ExternalLink className="w-5 h-5" />}
                </a>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

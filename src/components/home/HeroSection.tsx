import { motion } from "framer-motion";
import { ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getBackgroundStyle } from "@/lib/background-utils";

export function HeroSection() {
  const { settings } = useSiteSettings();
  
  // Guard clause for missing settings
  if (!settings?.hero || !settings?.backgrounds) return null;

  const { hero, backgrounds } = settings;

  const bgStyle = getBackgroundStyle(backgrounds.hero);
  if (backgrounds.hero.type === 'image' && hero.backgroundImage) {
    bgStyle.backgroundImage = `url('${hero.backgroundImage}')`;
  }

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

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
    const baseClasses = "font-heading text-lg uppercase tracking-wide px-8 py-6";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={bgStyle}
      />
      
      {/* Dark Overlay with Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" 
        style={{ opacity: (hero.overlayOpacity || 60) / 100 }}
      />
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Title */}
          <h1 
            className="font-display text-5xl sm:text-7xl lg:text-9xl tracking-wider mb-4 whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: hero.title || `<span class="text-primary text-glow-primary">SHADOWS</span><br/><span class="text-foreground">OF SOLDIERS</span>`
            }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-heading text-xl sm:text-2xl lg:text-3xl text-muted-foreground uppercase tracking-wide mb-8 whitespace-pre-line"
          >
            {hero.subtitle || "Pick Your Role. Shape the Battlefield."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {hero.buttons && hero.buttons.length > 0 ? (
              hero.buttons.map((button, index) => (
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
                    <span>{button.text}</span>
                    {button.url.startsWith('http') && <ExternalLink className="w-5 h-5" />}
                  </a>
                </Button>
              ))
            ) : (
              // Default buttons if none configured
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading text-lg uppercase tracking-wide px-8 py-6 glow-accent"
                >
                  <a
                    href="https://store.steampowered.com/app/2713480/Shadows_of_Soldiers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <span>Wishlist on Steam</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading text-lg uppercase tracking-wide px-8 py-6"
                >
                  <a
                    href="https://discord.gg/shadowsofsoldiers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Discord
                  </a>
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>
    </section>
  );
}

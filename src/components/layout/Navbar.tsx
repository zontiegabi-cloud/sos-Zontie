import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Facebook, 
  Youtube, 
  ExternalLink,
  Twitter,
  Instagram,
  Twitch,
  Gamepad2,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Game Content", path: "/game-content" },
  { name: "Media", path: "/media" },
  { name: "News", path: "/news" },
  { name: "FAQ", path: "/faq" },
];

// Map platform names to icons
const PlatformIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  twitch: Twitch,
  discord: Gamepad2,
  steam: Gamepad2,
  other: Globe,
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { branding, socialLinks } = settings;

  // Find Steam link for the CTA button
  const steamLink = socialLinks.find(link => link.platform === 'steam' && link.enabled);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-darker/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {branding.logoUrl && (
              <img 
                src={branding.logoUrl} 
                alt={branding.siteName} 
                className="h-10 lg:h-12 w-auto object-contain" 
              />
            )}
            <div className="relative">
              <span className="font-display text-2xl lg:text-3xl tracking-wider text-primary text-glow-primary uppercase">
                {branding.siteName.split(' ')[0]}
              </span>
              <span className="font-display text-2xl lg:text-3xl tracking-wider text-foreground ml-2 uppercase">
                {branding.siteName.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading text-sm tracking-wide uppercase transition-all duration-300 hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary text-glow-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Social + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {socialLinks.filter(link => link.enabled && link.platform !== 'steam').slice(0, 3).map((link) => {
              const Icon = PlatformIcons[link.platform] || Globe;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
            
            {steamLink && (
              <Button
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading uppercase tracking-wide glow-accent"
              >
                <a
                  href={steamLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span>{steamLink.label || "Steam Page"}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface-darker border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-heading text-lg tracking-wide uppercase ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-border pt-4 mt-2">
                 <div className="flex items-center gap-4 mb-4">
                    {socialLinks.filter(link => link.enabled && link.platform !== 'steam').map((link) => {
                      const Icon = PlatformIcons[link.platform] || Globe;
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-secondary rounded text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                 </div>
                 
                 {steamLink && (
                   <Button
                     asChild
                     className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading uppercase tracking-wide w-full"
                   >
                     <a
                       href={steamLink.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2"
                     >
                       <span>{steamLink.label || "Steam Page"}</span>
                       <ExternalLink className="w-4 h-4" />
                     </a>
                   </Button>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

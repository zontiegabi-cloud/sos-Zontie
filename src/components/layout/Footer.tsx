import { Link } from "react-router-dom";
import { 
  Facebook, 
  Youtube, 
  Mail, 
  Twitter, 
  Instagram, 
  Twitch, 
  Gamepad2, 
  Globe 
} from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

// Map platform names to icons
const PlatformIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  twitch: Twitch,
  discord: Gamepad2, // Lucide doesn't have Discord icon, using Gamepad2 as fallback
  steam: Gamepad2,   // Lucide doesn't have Steam icon
  other: Globe,
};

export function Footer() {
  const { settings } = useSiteSettings();
  const { branding, socialLinks } = settings;

  return (
    <footer className="bg-surface-darker border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl tracking-wider text-primary uppercase">
                {branding.siteName.split(' ')[0]}
              </span>
              <span className="font-display text-2xl tracking-wider text-foreground ml-2 uppercase">
                {branding.siteName.split(' ').slice(1).join(' ')}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {branding.siteTagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg uppercase tracking-wide text-foreground mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/media" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Media
              </Link>
              <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-heading text-lg uppercase tracking-wide text-foreground mb-4">
              Connect With Us
            </h4>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {socialLinks.filter(link => link.enabled).map((link) => {
                const Icon = PlatformIcons[link.platform] || Globe;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary rounded hover:bg-primary hover:text-primary-foreground transition-all"
                    title={link.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-muted-foreground text-sm">
              Join our community for updates and playtests!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            {branding.copyrightText}
          </p>
          {branding.poweredByText && (
            <p className="text-muted-foreground text-xs">
              {branding.poweredByText}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}

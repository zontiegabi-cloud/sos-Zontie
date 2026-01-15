import { Link } from "react-router-dom";
import { Facebook, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-darker border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl tracking-wider text-primary">
                SHADOWS
              </span>
              <span className="font-display text-2xl tracking-wider text-foreground ml-2">
                OF SOLDIERS
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A tactical 5v5 shooter where every move matters, every shot counts,
              and every victory is earned.
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
            <div className="flex items-center gap-4 mb-4">
              <a
                href="https://www.facebook.com/shadowsofsoldiers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary rounded hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@shadowsofsoldiers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary rounded hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://discord.gg/shadowsofsoldiers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary rounded hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-muted-foreground text-sm">
              Join our community for updates and playtests!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © 2024 Shadows of Soldiers. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Powered by Unreal Engine 5
          </p>
        </div>
      </div>
    </footer>
  );
}

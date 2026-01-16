import { motion } from "framer-motion";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{
          backgroundImage: `url('https://www.shadowsofsoldiers.com/wp-content/uploads/2020/08/WA1FNFS-scaled.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-background" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl lg:text-7xl text-foreground mb-6">
            READY TO <span className="text-accent text-glow-accent">JUMP INTO BATTLE?</span>
          </h2>
          <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of players waiting for the next generation of tactical shooters. 
            Wishlist now and be the first to know when we launch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading text-lg uppercase tracking-wide px-10 py-7 glow-accent"
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
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading text-lg uppercase tracking-wide px-10 py-7"
            >
              <a
                href="https://discord.gg/shadowsofsoldiers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join Our Discord</span>
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";

export default function Privacy() {
  const { privacy } = useContent();

  return (
    <Layout>
      <section className="py-20 lg:py-32 bg-surface-dark min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-5xl lg:text-7xl text-foreground mb-8">
              {privacy.title.split(' ').map((word, i) => (
                <span key={i} className={i === privacy.title.split(' ').length - 1 ? "text-primary" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground text-lg mb-8">
                Last updated: {privacy.lastUpdated}
              </p>

              <div className="space-y-8 text-muted-foreground">
                {privacy.sections.map((section, index) => (
                  <section key={index}>
                    <h2 className="font-heading text-2xl text-foreground uppercase mb-4">
                      {section.heading}
                    </h2>
                    <p className="leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </section>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

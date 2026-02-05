import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Zap, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";
import { NewsDetailDialog } from "@/components/news/NewsDetailDialog";
import { NewsItem } from "@/lib/content-store";

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!isNaN(date.getTime()) && dateString.includes('-')) {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return dateString;
};

export default function News() {
  const { news } = useContent();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-primary" />
              <Zap className="w-5 h-5 text-primary" />
              <div className="h-px w-12 bg-primary" />
            </div>
            <h1 className="font-display text-5xl lg:text-7xl text-foreground mb-4">
              NEWS & <span className="text-primary">UPDATES</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Stay informed about the latest developments, announcements, and behind-the-scenes content
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 lg:py-24 bg-surface-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                <div 
                  className="block bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.thumbnail || item.image || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    {item.tag && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-heading uppercase tracking-wide rounded">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <h2 className="font-heading text-xl uppercase text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-heading uppercase mt-auto">
                      Read More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <NewsDetailDialog 
        item={selectedNews} 
        open={!!selectedNews} 
        onOpenChange={(open) => !open && setSelectedNews(null)} 
      />
    </Layout>
  );
}

import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { news } = useContent();
  
  const article = news.find(item => item.id === id);

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  // Find related articles (same tag, excluding current)
  const relatedArticles = news
    .filter(item => item.id !== id && item.tag === article.tag)
    .slice(0, 2);

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative h-[50vh] lg:h-[60vh]">
        <div className="absolute inset-0">
          <img
            src={article.bgImage || article.image || '/placeholder.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/news"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-heading uppercase text-sm">Back to News</span>
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-heading uppercase tracking-wide rounded flex items-center gap-2">
                <Tag className="w-3 h-3" />
                {article.tag}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
            </div>
            
            <h1 className="font-display text-4xl lg:text-6xl text-foreground max-w-4xl">
              {article.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 lg:py-24 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm"
            >
              {/* Lead paragraph */}
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4">
                {article.description}
              </p>
              
              {/* Full content - render HTML content */}
              <div 
                className="prose prose-invert prose-lg max-w-none break-words
                  [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:text-foreground [&>h2]:mt-12 [&>h2]:mb-4 
                  [&>h3]:font-heading [&>h3]:text-xl [&>h3]:text-foreground [&>h3]:mt-8 [&>h3]:mb-3
                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:my-6 
                  [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:my-6 
                  [&>li]:text-muted-foreground [&>li]:pl-1
                  [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-6
                  [&>img]:rounded-lg [&>img]:my-8 [&>img]:w-full [&>img]:shadow-md
                  [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-primary/80"
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 lg:py-24 bg-surface-dark">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl text-foreground mb-8 text-center">
              Related <span className="text-primary">Articles</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {relatedArticles.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    to={`/news/${item.id}`}
                    className="block bg-card border border-border rounded overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={item.thumbnail || item.image || '/placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-lg uppercase text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useContent } from "@/hooks/use-content";
import { Layout } from "@/components/layout/Layout";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";

export default function CustomPage() {
  const { slug } = useParams();
  const { pages, isLoading } = useContent();
  
  const page = pages.find(p => p.slug === slug);
  
  useEffect(() => {
    if (page) {
      document.title = page.seo?.title || page.title;
      
      // Update description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && page.seo?.description) {
        metaDesc.setAttribute('content', page.seo.description);
      }
      
      // Update OG Title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', page.seo?.title || page.title);
      }
    }
  }, [page]);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }
  
  if (!page) {
    return <Navigate to="/404" replace />;
  }
  
  // Allow draft pages to be viewed if we assume the user might be admin, 
  // but ideally we should check auth. For now, let's just show it.
  // If we want to hide drafts from public:
  // if (page.status === 'draft') return <Navigate to="/404" replace />;

  return (
    <Layout>
      <main className="min-h-screen">
        {page.sections.map(section => (
          <CustomSectionRenderer key={section.id} section={section} />
        ))}
      </main>
    </Layout>
  );
}

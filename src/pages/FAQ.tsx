import { Layout } from "@/components/layout/Layout";
import { useContent } from "@/hooks/use-content";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";

export default function FAQ() {
  const { pages } = useContent();
  const page = pages.find(p => p.slug === 'faq');

  if (!page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Page not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {page.sections.map((section) => (
          <CustomSectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </Layout>
  );
}

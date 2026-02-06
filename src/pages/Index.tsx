import { Layout } from "@/components/layout/Layout";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { useContent } from "@/hooks/use-content";

const Index = () => {
  const { pages, isLoading } = useContent();
  const page = pages.find(p => p.slug === 'home');

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Home page not found. Please check Admin &gt; Pages.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {page.sections.map(section => (
        <CustomSectionRenderer key={section.id} section={section} />
      ))}
    </Layout>
  );
};

export default Index;

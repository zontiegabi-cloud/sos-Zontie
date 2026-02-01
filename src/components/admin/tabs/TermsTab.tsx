import { motion } from "framer-motion";
import { useContent } from "@/hooks/use-content";
import { PageContent } from "@/lib/content-store";
import { PageContentEditor } from "../PageContentEditor";
import { toast } from "sonner";

export function TermsTab() {
  const { terms, updateTerms } = useContent();

  const handleSave = (content: PageContent) => {
    updateTerms(content);
    toast.success("Terms of Service updated!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading text-primary">Terms of Service Management</h2>
      </div>

      <PageContentEditor
        content={terms}
        onSave={handleSave}
      />
    </motion.div>
  );
}

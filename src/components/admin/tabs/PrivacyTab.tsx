import { motion } from "framer-motion";
import { useContent } from "@/hooks/use-content";
import { PageContent } from "@/lib/content-store";
import { PageContentEditor } from "../PageContentEditor";
import { toast } from "sonner";

export function PrivacyTab() {
  const { privacy, updatePrivacy } = useContent();

  const handleSave = (content: PageContent) => {
    updatePrivacy(content);
    toast.success("Privacy Policy updated!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading text-primary">Privacy Policy Management</h2>
      </div>

      <PageContentEditor
        content={privacy}
        onSave={handleSave}
      />
    </motion.div>
  );
}

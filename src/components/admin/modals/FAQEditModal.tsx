import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FAQItem } from "@/lib/content-store";

export function FAQEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: FAQItem;
  onSave: (item: FAQItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Add" : "Edit"} FAQ
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Question</label>
            <Input
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="What is...?"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Answer</label>
            <Textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="The answer is..."
              rows={5}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContent } from "@/hooks/use-content";
import { FAQItem } from "@/lib/content-store";
import { toast } from "sonner";
import { FAQEditModal } from "@/components/admin/modals/FAQEditModal";

export function FAQTab() {
  const { faq, addFAQItem, updateFAQItem, deleteFAQItem, content, updateContent } = useContent();
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredFAQ = faq.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveFAQ = (item: FAQItem) => {
    if (isCreating) {
      addFAQItem(item);
      toast.success("FAQ item created!");
    } else {
      updateFAQItem(item.id, item);
      toast.success("FAQ item updated!");
    }
    setEditingFAQ(null);
    setIsCreating(false);
  };

  const handleDeleteFAQ = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFAQItem(id);
      toast.success("FAQ deleted!");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredFAQ.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFAQ.map(f => f.id)));
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
      const newFAQ = faq.filter(item => !selectedIds.has(item.id));
      updateContent({ ...content, faq: newFAQ });
      setSelectedIds(new Set());
      toast.success("Selected items deleted!");
    }
  };

  const createNewFAQ = () => {
    setEditingFAQ({
      id: "",
      question: "",
      answer: "",
    });
    setIsCreating(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading text-primary">Manage FAQ</h2>
          <p className="text-muted-foreground text-sm">Frequently Asked Questions</p>
        </div>
        <div className="flex items-center gap-2">
           {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button onClick={createNewFAQ}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="whitespace-nowrap"
          >
            {selectedIds.size === filteredFAQ.length && filteredFAQ.length > 0 ? (
              <>
                <X className="w-4 h-4 mr-2" /> Deselect All
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" /> Select All
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredFAQ.map((item) => (
          <div
            key={item.id}
            className={`bg-card border rounded p-4 flex gap-4 items-start transition-colors ${
              selectedIds.has(item.id) ? "border-primary ring-1 ring-primary" : "border-border"
            }`}
          >
            <Checkbox
              checked={selectedIds.has(item.id)}
              onCheckedChange={() => toggleSelection(item.id)}
              className="mt-1"
            />
            <div className="flex-1 cursor-pointer" onClick={() => toggleSelection(item.id)}>
              <h3 className="font-heading text-foreground mb-2">{item.question}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingFAQ(item);
                  setIsCreating(false);
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFAQ(item.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {filteredFAQ.length === 0 && (
          <div className="py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
            <p>No FAQs found matching your search.</p>
          </div>
        )}
      </div>

      {editingFAQ && (
        <FAQEditModal
          item={editingFAQ}
          onSave={handleSaveFAQ}
          onCancel={() => {
            setEditingFAQ(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}

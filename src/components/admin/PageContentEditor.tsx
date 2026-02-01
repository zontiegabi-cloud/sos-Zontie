import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContent } from "@/lib/content-store";

export function PageContentEditor({
  content,
  onSave,
}: {
  content: PageContent;
  onSave: (content: PageContent) => void;
}) {
  const [formData, setFormData] = useState(content);

  const updateSection = (index: number, field: 'heading' | 'content', value: string) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { heading: "", content: "" }],
    });
  };

  const removeSection = (index: number) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Page title"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Last Updated</label>
          <Input
            value={formData.lastUpdated}
            onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
            placeholder="August 2024"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Sections</label>
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {formData.sections.map((section, index) => (
          <div key={index} className="border border-border rounded p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Section {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Input
              value={section.heading}
              onChange={(e) => updateSection(index, 'heading', e.target.value)}
              placeholder="Section heading"
            />
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Section content..."
              rows={4}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(formData)}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

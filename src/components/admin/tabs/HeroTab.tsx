import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { HeroSettings, HeroButton } from "@/lib/content-store";
import { toast } from "sonner";

export function HeroTab() {
  const { settings, updateSettings } = useSiteSettings();
  const [localHero, setLocalHero] = useState<HeroSettings>(settings.hero);
  
  useEffect(() => {
    if (settings.hero) {
      setLocalHero(settings.hero);
    }
  }, [settings.hero]);

  const hasChanges = JSON.stringify(localHero) !== JSON.stringify(settings.hero);

  const handleSave = async () => {
    await updateSettings({ ...settings, hero: localHero });
    toast.success("Hero settings saved successfully!");
  };

  const updateHero = (updates: Partial<HeroSettings>) => {
    setLocalHero(prev => ({ ...prev, ...updates }));
  };

  const updateButton = (index: number, updates: Partial<HeroButton>) => {
    const newButtons = [...localHero.buttons];
    newButtons[index] = { ...newButtons[index], ...updates };
    updateHero({ buttons: newButtons });
  };

  const addButton = () => {
    updateHero({
      buttons: [...localHero.buttons, { text: "New Button", url: "", variant: "primary" }]
    });
  };

  const removeButton = (index: number) => {
    const newButtons = localHero.buttons.filter((_, i) => i !== index);
    updateHero({ buttons: newButtons });
  };

  if (!localHero) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading text-primary">Hero Editor</h2>
          <p className="text-muted-foreground">Customize the main hero section of your landing page.</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Editor */}
        <div className="space-y-6">
          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <h3 className="font-heading text-lg">Main Content</h3>
            
            <div className="space-y-2">
              <Label>Title (HTML allowed)</Label>
              <Textarea
                value={localHero.title}
                onChange={(e) => updateHero({ title: e.target.value })}
                rows={3}
                placeholder="SHADOWS<br/>OF SOLDIERS"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Use &lt;br/&gt; for line breaks.</p>
            </div>

            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={localHero.subtitle}
                onChange={(e) => updateHero({ subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <h3 className="font-heading text-lg">Background</h3>
            
            <div className="space-y-2">
              <Label>Background Image</Label>
              <FileUpload
                currentValue={localHero.backgroundImage}
                onUploadComplete={(url) => updateHero({ backgroundImage: url })}
                accept="image/*"
                label="Upload Hero Background"
              />
            </div>

            <div className="space-y-2">
              <Label>Overlay Opacity: {localHero.overlayOpacity}%</Label>
              <Slider
                value={[localHero.overlayOpacity]}
                onValueChange={([v]) => updateHero({ overlayOpacity: v })}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>

          <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg">Call to Action Buttons</h3>
              <Button size="sm" variant="outline" onClick={addButton} disabled={localHero.buttons.length >= 3}>
                <Plus className="w-4 h-4 mr-2" />
                Add Button
              </Button>
            </div>

            <div className="space-y-4">
              {localHero.buttons.map((btn, index) => (
                <div key={index} className="space-y-3 p-3 bg-muted/30 rounded border border-border">
                  <div className="flex justify-between items-start">
                    <Label className="text-xs uppercase text-muted-foreground">Button {index + 1}</Label>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeButton(index)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Text</Label>
                      <Input 
                        value={btn.text} 
                        onChange={(e) => updateButton(index, { text: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Variant</Label>
                      <Select 
                        value={btn.variant} 
                        onValueChange={(v: any) => updateButton(index, { variant: v })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary (Glow)</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                          <SelectItem value="ghost">Ghost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={btn.url} 
                        onChange={(e) => updateButton(index, { url: e.target.value })}
                        className="h-8 flex-1"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="sticky top-6">
           <Label className="mb-2 block">Live Preview (Approximate)</Label>
           <div className="relative aspect-video rounded-lg overflow-hidden border border-border shadow-2xl">
              {/* Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${localHero.backgroundImage})` }}
              />
              <div 
                className="absolute inset-0 bg-background"
                style={{ opacity: localHero.overlayOpacity / 100 }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-60" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                <h1 
                  className="font-display text-4xl lg:text-5xl tracking-wider mb-4 leading-tight text-foreground"
                  dangerouslySetInnerHTML={{ __html: localHero.title }}
                />
                <p className="font-heading text-lg text-muted-foreground uppercase tracking-wide mb-6">
                  {localHero.subtitle}
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {localHero.buttons.map((btn, i) => (
                    <div 
                      key={i}
                      className={`
                        px-4 py-2 rounded font-heading uppercase text-sm tracking-wide
                        ${btn.variant === 'primary' ? 'bg-accent text-accent-foreground glow-accent' : ''}
                        ${btn.variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : ''}
                        ${btn.variant === 'outline' ? 'border border-primary text-primary' : ''}
                        ${btn.variant === 'ghost' ? 'text-primary hover:bg-primary/10' : ''}
                      `}
                    >
                      {btn.text}
                    </div>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

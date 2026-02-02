import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { BackgroundSettings, SiteSettings } from "@/lib/content-store";
import { getBackgroundStyle } from "@/lib/background-utils";

export const gradientDirections = [
  { value: "to top", label: "To Top" },
  { value: "to bottom", label: "To Bottom" },
  { value: "to left", label: "To Left" },
  { value: "to right", label: "To Right" },
  { value: "to top left", label: "To Top Left" },
  { value: "to top right", label: "To Top Right" },
  { value: "to bottom left", label: "To Bottom Left" },
  { value: "to bottom right", label: "To Bottom Right" },
];

interface BackgroundEditorProps {
  section: keyof SiteSettings['backgrounds'];
  label: string;
  background: BackgroundSettings;
  onChange: (bg: Partial<BackgroundSettings>) => void;
}

export function BackgroundEditor({ section, label, background, onChange }: BackgroundEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Guard against undefined background
  if (!background) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-border"
            style={getBackgroundStyle(background)}
          />
          <span className="font-medium">{label}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 bg-muted/30">
          {/* Background Type */}
          <div className="space-y-2">
            <Label>Background Type</Label>
            <Select value={background.type || 'color'} onValueChange={(v) => onChange({ type: v as BackgroundSettings['type'] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Settings */}
          {background.type === 'color' && (
            <div className="space-y-2">
              <Label>Color (HSL)</Label>
              <Input
                value={background.color || '220 15% 6%'}
                onChange={(e) => onChange({ color: e.target.value })}
                placeholder="220 15% 6%"
              />
              <p className="text-xs text-muted-foreground">Format: H S% L% (e.g., 220 15% 6%)</p>
            </div>
          )}

          {/* Gradient Settings */}
          {background.type === 'gradient' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Color (HSL)</Label>
                  <Input
                    value={background.gradientFrom || '220 15% 8%'}
                    onChange={(e) => onChange({ gradientFrom: e.target.value })}
                    placeholder="220 15% 8%"
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Color (HSL)</Label>
                  <Input
                    value={background.gradientTo || '220 15% 4%'}
                    onChange={(e) => onChange({ gradientTo: e.target.value })}
                    placeholder="220 15% 4%"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select
                  value={background.gradientDirection || 'to bottom'}
                  onValueChange={(v) => onChange({ gradientDirection: v as BackgroundSettings['gradientDirection'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientDirections.map((dir) => (
                      <SelectItem key={dir.value} value={dir.value}>{dir.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Image Settings */}
          {background.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="space-y-4">
                  <FileUpload 
                    currentValue={background.imageUrl}
                    onUploadComplete={(url) => onChange({ imageUrl: url })}
                    accept="image/*"
                    label="Upload Background Image"
                  />
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or enter URL</span>
                    </div>
                  </div>
                  <Input
                    value={background.imageUrl || ''}
                    onChange={(e) => onChange({ imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Overlay Opacity: {background.imageOverlayOpacity || 60}%</Label>
                <Slider
                  value={[background.imageOverlayOpacity || 60]}
                  onValueChange={([v]) => onChange({ imageOverlayOpacity: v })}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
            </>
          )}

          {/* Texture Settings */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Label>Grunge Texture Overlay</Label>
              <Switch
                checked={background.textureEnabled || false}
                onCheckedChange={(v) => onChange({ textureEnabled: v })}
              />
            </div>
            {background.textureEnabled && (
              <div className="space-y-2">
                <Label>Texture Opacity: {background.textureOpacity || 3}%</Label>
                <Slider
                  value={[background.textureOpacity || 3]}
                  onValueChange={([v]) => onChange({ textureOpacity: v })}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

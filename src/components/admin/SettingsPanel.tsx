import { useState } from "react";
import { 
  Palette, 
  Image, 
  Link2, 
  Search, 
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RotateCcw,
  Type,
  Paintbrush
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { SiteSettings, BackgroundSettings, SocialLink, ThemeSettings } from "@/lib/content-store";
import { toast } from "sonner";

const socialPlatforms = [
  { id: "discord", label: "Discord", icon: "🎮" },
  { id: "steam", label: "Steam", icon: "🎯" },
  { id: "twitter", label: "Twitter/X", icon: "🐦" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "youtube", label: "YouTube", icon: "📺" },
  { id: "twitch", label: "Twitch", icon: "🟣" },
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "reddit", label: "Reddit", icon: "🔴" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "other", label: "Other", icon: "🔗" },
];

const gradientDirections = [
  { value: "to-t", label: "To Top" },
  { value: "to-b", label: "To Bottom" },
  { value: "to-l", label: "To Left" },
  { value: "to-r", label: "To Right" },
  { value: "to-tl", label: "To Top Left" },
  { value: "to-tr", label: "To Top Right" },
  { value: "to-bl", label: "To Bottom Left" },
  { value: "to-br", label: "To Bottom Right" },
];

const fontOptions = [
  // Display/Impact fonts
  { value: "Bebas Neue", label: "Bebas Neue", category: "display" },
  { value: "Anton", label: "Anton", category: "display" },
  { value: "Bungee", label: "Bungee", category: "display" },
  { value: "Russo One", label: "Russo One", category: "display" },
  { value: "Black Ops One", label: "Black Ops One", category: "display" },
  { value: "Teko", label: "Teko", category: "display" },
  { value: "Orbitron", label: "Orbitron", category: "display" },
  // Heading fonts
  { value: "Oswald", label: "Oswald", category: "heading" },
  { value: "Rajdhani", label: "Rajdhani", category: "heading" },
  { value: "Audiowide", label: "Audiowide", category: "heading" },
  { value: "Exo 2", label: "Exo 2", category: "heading" },
  { value: "Quantico", label: "Quantico", category: "heading" },
  { value: "Saira", label: "Saira", category: "heading" },
  { value: "Titillium Web", label: "Titillium Web", category: "heading" },
  // Body fonts
  { value: "Inter", label: "Inter", category: "body" },
  { value: "Roboto", label: "Roboto", category: "body" },
  { value: "Open Sans", label: "Open Sans", category: "body" },
  { value: "Lato", label: "Lato", category: "body" },
  { value: "Source Sans 3", label: "Source Sans 3", category: "body" },
  { value: "PT Sans", label: "PT Sans", category: "body" },
  { value: "Nunito", label: "Nunito", category: "body" },
];

interface BackgroundEditorProps {
  section: keyof SiteSettings['backgrounds'];
  label: string;
  background: BackgroundSettings;
  onChange: (bg: Partial<BackgroundSettings>) => void;
}

function BackgroundEditor({ section, label, background, onChange }: BackgroundEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded border border-border"
            style={{
              background: background.type === 'image' && background.imageUrl
                ? `url(${background.imageUrl}) center/cover`
                : background.type === 'gradient'
                ? `linear-gradient(${background.gradientDirection?.replace('to-', 'to ') || 'to bottom'}, hsl(${background.gradientFrom || '220 15% 8%'}), hsl(${background.gradientTo || '220 15% 4%'}))`
                : `hsl(${background.color || '220 15% 6%'})`,
            }}
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
            <Select value={background.type} onValueChange={(v) => onChange({ type: v as BackgroundSettings['type'] })}>
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
                  value={background.gradientDirection || 'to-b'}
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
                <Input
                  value={background.imageUrl || ''}
                  onChange={(e) => onChange({ imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
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

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

function ColorInput({ label, value, onChange, description }: ColorInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div
          className="w-10 h-10 rounded border border-border shrink-0"
          style={{ background: `hsl(${value})` }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="220 15% 6%"
          className="flex-1"
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function SettingsPanel() {
  const {
    settings,
    updateBranding,
    updateBackground,
    updateSocialLinks,
    updateSEO,
    updateHomepageSections,
    updateThemeFonts,
    updateThemeColors,
    resetSettings,
  } = useSiteSettings();

  const [activeSubTab, setActiveSubTab] = useState("branding");

  const handleResetSettings = () => {
    if (confirm("Reset all site settings to defaults? This cannot be undone.")) {
      resetSettings();
      toast.success("Settings reset to defaults!");
    }
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const sections = [...settings.homepageSections];
    [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
    sections.forEach((s, i) => (s.order = i));
    updateHomepageSections(sections);
  };

  const moveSectionDown = (index: number) => {
    if (index === settings.homepageSections.length - 1) return;
    const sections = [...settings.homepageSections];
    [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
    sections.forEach((s, i) => (s.order = i));
    updateHomepageSections(sections);
  };

  const toggleSection = (id: string) => {
    const sections = settings.homepageSections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    updateHomepageSections(sections);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    const links = settings.socialLinks.map((l) =>
      l.id === id ? { ...l, ...updates } : l
    );
    updateSocialLinks(links);
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "other",
      url: "",
      label: "New Link",
      enabled: true,
    };
    updateSocialLinks([...settings.socialLinks, newLink]);
  };

  const removeSocialLink = (id: string) => {
    updateSocialLinks(settings.socialLinks.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading uppercase">Site Settings</h2>
        <Button variant="outline" size="sm" onClick={handleResetSettings}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Settings
        </Button>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="backgrounds" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Backgrounds</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input
                value={settings.branding.siteName}
                onChange={(e) => updateBranding({ siteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={settings.branding.siteTagline}
                onChange={(e) => updateBranding({ siteTagline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Logo URL (optional)</Label>
              <Input
                value={settings.branding.logoUrl || ''}
                onChange={(e) => updateBranding({ logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label>Favicon URL (optional)</Label>
              <Input
                value={settings.branding.faviconUrl || ''}
                onChange={(e) => updateBranding({ faviconUrl: e.target.value })}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div className="space-y-2">
              <Label>Copyright Text</Label>
              <Input
                value={settings.branding.copyrightText}
                onChange={(e) => updateBranding({ copyrightText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Powered By Text (optional)</Label>
              <Input
                value={settings.branding.poweredByText || ''}
                onChange={(e) => updateBranding({ poweredByText: e.target.value })}
              />
            </div>
          </div>

          {/* Preview */}
          {settings.branding.logoUrl && (
            <div className="p-4 bg-muted rounded-lg">
              <Label className="mb-2 block">Logo Preview</Label>
              <img
                src={settings.branding.logoUrl}
                alt="Logo preview"
                className="h-12 object-contain"
              />
            </div>
          )}
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-6">
          {/* Fonts Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-heading uppercase">Typography</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose fonts for different text elements. Changes apply in real-time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Display Font (H1, H2, H3)</Label>
                <Select
                  value={settings.theme.fonts.display}
                  onValueChange={(v) => updateThemeFonts({ display: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.filter(f => f.category === 'display' || f.category === 'heading').map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div 
                  className="p-3 bg-muted rounded text-2xl uppercase tracking-wide"
                  style={{ fontFamily: settings.theme.fonts.display }}
                >
                  DISPLAY TEXT
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Heading Font (H4, H5, H6)</Label>
                <Select
                  value={settings.theme.fonts.heading}
                  onValueChange={(v) => updateThemeFonts({ heading: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.filter(f => f.category === 'heading' || f.category === 'display').map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div 
                  className="p-3 bg-muted rounded text-lg font-medium"
                  style={{ fontFamily: settings.theme.fonts.heading }}
                >
                  Heading Text
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select
                  value={settings.theme.fonts.body}
                  onValueChange={(v) => updateThemeFonts({ body: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.filter(f => f.category === 'body').map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div 
                  className="p-3 bg-muted rounded text-sm"
                  style={{ fontFamily: settings.theme.fonts.body }}
                >
                  This is body text that appears throughout the site.
                </div>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-heading uppercase">Colors</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Customize the color palette. Use HSL format (e.g., "220 15% 6%"). Changes apply in real-time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ColorInput
                label="Primary Color"
                value={settings.theme.colors.primary}
                onChange={(v) => updateThemeColors({ primary: v })}
                description="Main brand color for buttons and accents"
              />
              <ColorInput
                label="Primary Foreground"
                value={settings.theme.colors.primaryForeground}
                onChange={(v) => updateThemeColors({ primaryForeground: v })}
                description="Text color on primary backgrounds"
              />
              <ColorInput
                label="Accent Color"
                value={settings.theme.colors.accent}
                onChange={(v) => updateThemeColors({ accent: v })}
                description="Secondary accent color (CTAs, highlights)"
              />
              <ColorInput
                label="Accent Foreground"
                value={settings.theme.colors.accentForeground}
                onChange={(v) => updateThemeColors({ accentForeground: v })}
                description="Text color on accent backgrounds"
              />
              <ColorInput
                label="Background"
                value={settings.theme.colors.background}
                onChange={(v) => updateThemeColors({ background: v })}
                description="Main page background color"
              />
              <ColorInput
                label="Foreground"
                value={settings.theme.colors.foreground}
                onChange={(v) => updateThemeColors({ foreground: v })}
                description="Main text color"
              />
              <ColorInput
                label="Muted"
                value={settings.theme.colors.muted}
                onChange={(v) => updateThemeColors({ muted: v })}
                description="Muted background color (cards, panels)"
              />
              <ColorInput
                label="Muted Foreground"
                value={settings.theme.colors.mutedForeground}
                onChange={(v) => updateThemeColors({ mutedForeground: v })}
                description="Secondary text color"
              />
              <ColorInput
                label="Border"
                value={settings.theme.colors.border}
                onChange={(v) => updateThemeColors({ border: v })}
                description="Border and divider color"
              />
            </div>

            {/* Color Preview */}
            <div className="mt-6 p-4 rounded-lg border border-border" style={{ background: `hsl(${settings.theme.colors.background})` }}>
              <h4 className="text-lg font-heading mb-2" style={{ color: `hsl(${settings.theme.colors.foreground})` }}>Color Preview</h4>
              <p className="text-sm mb-4" style={{ color: `hsl(${settings.theme.colors.mutedForeground})` }}>This is how your colors will look together.</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="px-4 py-2 rounded font-medium"
                  style={{ 
                    background: `hsl(${settings.theme.colors.primary})`,
                    color: `hsl(${settings.theme.colors.primaryForeground})`
                  }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-4 py-2 rounded font-medium"
                  style={{ 
                    background: `hsl(${settings.theme.colors.accent})`,
                    color: `hsl(${settings.theme.colors.accentForeground})`
                  }}
                >
                  Accent Button
                </button>
                <div 
                  className="px-4 py-2 rounded"
                  style={{ 
                    background: `hsl(${settings.theme.colors.muted})`,
                    color: `hsl(${settings.theme.colors.foreground})`,
                    border: `1px solid hsl(${settings.theme.colors.border})`
                  }}
                >
                  Muted Panel
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Backgrounds Tab */}
        <TabsContent value="backgrounds" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Customize the background for each section. Changes apply in real-time.
          </p>
          <BackgroundEditor
            section="hero"
            label="Hero Section"
            background={settings.backgrounds.hero}
            onChange={(bg) => updateBackground('hero', bg)}
          />
          <BackgroundEditor
            section="news"
            label="News Section"
            background={settings.backgrounds.news}
            onChange={(bg) => updateBackground('news', bg)}
          />
          <BackgroundEditor
            section="features"
            label="Features Section"
            background={settings.backgrounds.features}
            onChange={(bg) => updateBackground('features', bg)}
          />
          <BackgroundEditor
            section="classes"
            label="Classes Section"
            background={settings.backgrounds.classes}
            onChange={(bg) => updateBackground('classes', bg)}
          />
          <BackgroundEditor
            section="cta"
            label="CTA Section"
            background={settings.backgrounds.cta}
            onChange={(bg) => updateBackground('cta', bg)}
          />
          <BackgroundEditor
            section="footer"
            label="Footer"
            background={settings.backgrounds.footer}
            onChange={(bg) => updateBackground('footer', bg)}
          />
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Manage your social media links displayed in the footer and CTA sections.
            </p>
            <Button size="sm" onClick={addSocialLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>

          <div className="space-y-3">
            {settings.socialLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={link.enabled}
                    onCheckedChange={(v) => updateSocialLink(link.id, { enabled: v })}
                  />
                </div>
                <Select
                  value={link.platform}
                  onValueChange={(v) => updateSocialLink(link.id, { platform: v as SocialLink['platform'] })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.icon} {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={link.label}
                  onChange={(e) => updateSocialLink(link.id, { label: e.target.value })}
                  placeholder="Label"
                  className="w-24"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialLink(link.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Default Page Title</Label>
              <Input
                value={settings.seo.defaultTitle}
                onChange={(e) => updateSEO({ defaultTitle: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Keep under 60 characters for best results</p>
            </div>
            <div className="space-y-2">
              <Label>Default Meta Description</Label>
              <Textarea
                value={settings.seo.defaultDescription}
                onChange={(e) => updateSEO({ defaultDescription: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Keep under 160 characters for best results</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma-separated)</Label>
              <Input
                value={settings.seo.defaultKeywords.join(', ')}
                onChange={(e) => updateSEO({ defaultKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>OG Image URL (optional)</Label>
                <Input
                  value={settings.seo.ogImage || ''}
                  onChange={(e) => updateSEO({ ogImage: e.target.value })}
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle (optional)</Label>
                <Input
                  value={settings.seo.twitterHandle || ''}
                  onChange={(e) => updateSEO({ twitterHandle: e.target.value })}
                  placeholder="@yourgame"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Homepage Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Reorder and toggle visibility of homepage sections. Changes apply in real-time.
          </p>

          <div className="space-y-2">
            {settings.homepageSections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-3 p-3 bg-card border border-border rounded-lg ${!section.enabled ? 'opacity-50' : ''}`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">{section.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveSectionDown(index)}
                      disabled={index === settings.homepageSections.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSection(section.id)}
                    >
                      {section.enabled ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
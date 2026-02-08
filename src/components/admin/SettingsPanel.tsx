import { useState, useEffect } from "react";
import { 
  Palette,
  Image, 
  Link2, 
  Search, 
  Plus,
  Trash2,
  RotateCcw,
  Type,
  Paintbrush,
  Save,
  X,
  Megaphone,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import { ServerFilePicker } from "./server-file-picker";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { SiteSettings, BackgroundSettings, SocialLink, ThemeSettings, HeroButton } from "@/lib/content-store";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

function DatabaseSettings() {
  const [config, setConfig] = useState({
    DB_HOST: '',
    DB_USER: '',
    DB_PASSWORD: '',
    DB_NAME: '',
    DB_PORT: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/env')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load database settings');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading database configuration...</div>;

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-2 pb-2 border-b border-border">
         <Database className="w-5 h-5 text-primary" />
         <h3 className="text-lg font-heading uppercase">Database Connection</h3>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
           <Label>Host</Label>
           <Input 
             value={config.DB_HOST || ''} 
             onChange={e => setConfig({...config, DB_HOST: e.target.value})} 
             placeholder="localhost"
           />
         </div>
         <div className="space-y-2">
           <Label>Port</Label>
           <Input 
             value={config.DB_PORT || ''} 
             onChange={e => setConfig({...config, DB_PORT: e.target.value})} 
             placeholder="3306"
           />
         </div>
         <div className="space-y-2">
           <Label>Database Name</Label>
           <Input 
             value={config.DB_NAME || ''} 
             onChange={e => setConfig({...config, DB_NAME: e.target.value})} 
             placeholder="sos_zontie"
           />
         </div>
         <div className="space-y-2">
           <Label>User</Label>
           <Input 
             value={config.DB_USER || ''} 
             onChange={e => setConfig({...config, DB_USER: e.target.value})} 
             placeholder="root"
           />
         </div>
         <div className="space-y-2">
           <Label>Password</Label>
           <Input 
             type="password"
             value={config.DB_PASSWORD || ''} 
             onChange={e => setConfig({...config, DB_PASSWORD: e.target.value})} 
             placeholder="••••••"
           />
         </div>
       </div>

       <div className="pt-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
       </div>
       
       <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-500 flex items-center gap-2">
             <Megaphone className="w-4 h-4" />
             Note: Changing database settings requires a server restart to take effect.
          </p>
       </div>
    </div>
  );
}

export function SettingsPanel() {
  const {
    settings,
    updateSettings,
    resetSettings,
  } = useSiteSettings();

  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [activeSubTab, setActiveSubTab] = useState("branding");
  const [isResetting, setIsResetting] = useState(false);
  
  // Keep local settings in sync if they are updated externally (e.g. reset)
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settings);

  const handleSave = async () => {
    await updateSettings(localSettings);
    toast.success("Settings saved successfully!");
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    toast.info("Changes discarded.");
  };

  const handleResetSettings = () => {
    setIsResetting(true);
  };

  const confirmReset = async () => {
    await resetSettings();
    toast.success("Settings reset to defaults!");
    setIsResetting(false);
  };

  // Local update helpers
  const updateBranding = (branding: Partial<SiteSettings['branding']>) => {
    setLocalSettings(prev => ({
      ...prev,
      branding: { ...prev.branding, ...branding }
    }));
  };

  const updateThemeFonts = (fonts: Partial<ThemeSettings['fonts']>) => {
    setLocalSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        fonts: { ...prev.theme.fonts, ...fonts }
      }
    }));
  };

  const updateThemeColors = (colors: Partial<ThemeSettings['colors']>) => {
    setLocalSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: { ...prev.theme.colors, ...colors }
      }
    }));
  };

  const updateSEO = (seo: Partial<SiteSettings['seo']>) => {
    setLocalSettings(prev => ({
      ...prev,
      seo: { ...prev.seo, ...seo }
    }));
  };

  const updateSocialLinks = (links: SiteSettings['socialLinks']) => {
    setLocalSettings(prev => ({ ...prev, socialLinks: links }));
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    const links = localSettings.socialLinks.map((l) =>
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
    updateSocialLinks([...localSettings.socialLinks, newLink]);
  };

  const removeSocialLink = (id: string) => {
    updateSocialLinks(localSettings.socialLinks.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b border-border">
        <h2 className="text-xl font-heading uppercase">Site Settings</h2>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleResetSettings}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Defaults
          </Button>
        </div>
      </div>

      <AlertDialog open={isResetting} onOpenChange={setIsResetting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Settings?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all site settings to defaults? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-6 h-auto gap-2">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4" />
            <span className="hidden sm:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-8">
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Paintbrush className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-heading uppercase">Branding</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={localSettings.branding.siteName}
                  onChange={(e) => updateBranding({ siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={localSettings.branding.siteTagline}
                  onChange={(e) => updateBranding({ siteTagline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Logo URL (optional)</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FileUpload 
                        currentValue={localSettings.branding.logoUrl}
                        onUploadComplete={(url) => updateBranding({ logoUrl: url })}
                        accept="image/*"
                        label="Upload Logo"
                      />
                    </div>
                    <ServerFilePicker 
                      onSelect={(url) => updateBranding({ logoUrl: url })}
                      accept="image"
                      trigger={
                        <Button variant="outline" className="h-full px-3 gap-2" title="Select from Uploads">
                          <Image className="h-4 w-4" />
                          <span>Uploads</span>
                        </Button>
                      }
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or enter URL</span>
                    </div>
                  </div>
                  <Input
                    value={localSettings.branding.logoUrl || ''}
                    onChange={(e) => updateBranding({ logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Copyright Text</Label>
                <Input
                  value={localSettings.branding.copyrightText}
                  onChange={(e) => updateBranding({ copyrightText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Powered By Text (optional)</Label>
                <Input
                  value={localSettings.branding.poweredByText || ''}
                  onChange={(e) => updateBranding({ poweredByText: e.target.value })}
                />
              </div>
            </div>

            {/* Preview */}
            {localSettings.branding.logoUrl && (
              <div className="p-4 bg-muted rounded-lg">
                <Label className="mb-2 block">Logo Preview</Label>
                <img
                  src={localSettings.branding.logoUrl}
                  alt="Logo preview"
                  className="h-12 object-contain"
                />
              </div>
            )}
          </div>
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
              Choose fonts for different text elements. Changes apply after saving.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Display Font (H1, H2, H3)</Label>
                <Select
                  value={localSettings.theme.fonts.display}
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
                  style={{ fontFamily: localSettings.theme.fonts.display }}
                >
                  DISPLAY TEXT
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Heading Font (H4, H5, H6)</Label>
                <Select
                  value={localSettings.theme.fonts.heading}
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
                  style={{ fontFamily: localSettings.theme.fonts.heading }}
                >
                  Heading Text
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select
                  value={localSettings.theme.fonts.body}
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
                  style={{ fontFamily: localSettings.theme.fonts.body }}
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
              Customize the color palette. Use HSL format (e.g., "220 15% 6%"). Changes apply after saving.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ColorInput
                label="Primary Color"
                value={localSettings.theme.colors.primary}
                onChange={(v) => updateThemeColors({ primary: v })}
                description="Main brand color for buttons and accents"
              />
              <ColorInput
                label="Primary Foreground"
                value={localSettings.theme.colors.primaryForeground}
                onChange={(v) => updateThemeColors({ primaryForeground: v })}
                description="Text color on primary backgrounds"
              />
              <ColorInput
                label="Accent Color"
                value={localSettings.theme.colors.accent}
                onChange={(v) => updateThemeColors({ accent: v })}
                description="Secondary accent color (CTAs, highlights)"
              />
              <ColorInput
                label="Accent Foreground"
                value={localSettings.theme.colors.accentForeground}
                onChange={(v) => updateThemeColors({ accentForeground: v })}
                description="Text color on accent backgrounds"
              />
              <ColorInput
                label="Background"
                value={localSettings.theme.colors.background}
                onChange={(v) => updateThemeColors({ background: v })}
                description="Main page background color"
              />
              <ColorInput
                label="Foreground"
                value={localSettings.theme.colors.foreground}
                onChange={(v) => updateThemeColors({ foreground: v })}
                description="Main text color"
              />
              <ColorInput
                label="Muted"
                value={localSettings.theme.colors.muted}
                onChange={(v) => updateThemeColors({ muted: v })}
                description="Muted background color (cards, panels)"
              />
              <ColorInput
                label="Muted Foreground"
                value={localSettings.theme.colors.mutedForeground}
                onChange={(v) => updateThemeColors({ mutedForeground: v })}
                description="Secondary text color"
              />
              <ColorInput
                label="Border"
                value={localSettings.theme.colors.border}
                onChange={(v) => updateThemeColors({ border: v })}
                description="Border and divider color"
              />
            </div>

            {/* Color Preview */}
            <div className="mt-6 p-4 rounded-lg border border-border" style={{ background: `hsl(${localSettings.theme.colors.background})` }}>
              <h4 className="text-lg font-heading mb-2" style={{ color: `hsl(${localSettings.theme.colors.foreground})` }}>Color Preview</h4>
              <p className="text-sm mb-4" style={{ color: `hsl(${localSettings.theme.colors.mutedForeground})` }}>This is how your colors will look together.</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  className="px-4 py-2 rounded font-medium"
                  style={{ 
                    background: `hsl(${localSettings.theme.colors.primary})`,
                    color: `hsl(${localSettings.theme.colors.primaryForeground})`
                  }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-4 py-2 rounded font-medium"
                  style={{ 
                    background: `hsl(${localSettings.theme.colors.accent})`,
                    color: `hsl(${localSettings.theme.colors.accentForeground})`
                  }}
                >
                  Accent Button
                </button>
                <div 
                  className="px-4 py-2 rounded"
                  style={{ 
                    background: `hsl(${localSettings.theme.colors.muted})`,
                    color: `hsl(${localSettings.theme.colors.foreground})`,
                    border: `1px solid hsl(${localSettings.theme.colors.border})`
                  }}
                >
                  Muted Panel
                </div>
              </div>
            </div>
          </div>
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
            {localSettings.socialLinks.map((link) => (
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
                value={localSettings.seo.defaultTitle}
                onChange={(e) => updateSEO({ defaultTitle: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Keep under 60 characters for best results</p>
            </div>
            <div className="space-y-2">
              <Label>Default Meta Description</Label>
              <Textarea
                value={localSettings.seo.defaultDescription}
                onChange={(e) => updateSEO({ defaultDescription: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Keep under 160 characters for best results</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma-separated)</Label>
              <Input
                value={localSettings.seo.defaultKeywords.join(', ')}
                onChange={(e) => updateSEO({ defaultKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Favicon URL (optional)</Label>
                <div className="space-y-4">
                  <FileUpload 
                    currentValue={localSettings.branding.faviconUrl}
                    onUploadComplete={(url) => updateBranding({ faviconUrl: url })}
                    accept="image/*" 
                    label="Upload Favicon"
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
                    value={localSettings.branding.faviconUrl || ''}
                    onChange={(e) => updateBranding({ faviconUrl: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>OG Image URL (optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  The Open Graph (OG) image is displayed when your site link is shared on social media (Facebook, Twitter/X, Discord, etc.). Recommended size: 1200x630px.
                </p>
                <div className="space-y-4">
                  <FileUpload 
                    currentValue={localSettings.seo.ogImage}
                    onUploadComplete={(url) => updateSEO({ ogImage: url })}
                    accept="image/*"
                    label="Upload OG Image"
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
                    value={localSettings.seo.ogImage || ''}
                    onChange={(e) => updateSEO({ ogImage: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Twitter Handle (optional)</Label>
                <Input
                  value={localSettings.seo.twitterHandle || ''}
                  onChange={(e) => updateSEO({ twitterHandle: e.target.value })}
                  placeholder="@yourgame"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database">
          <DatabaseSettings />
        </TabsContent>

      </Tabs>
    </div>
  );
}

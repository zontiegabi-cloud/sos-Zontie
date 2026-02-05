import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Save, Layout, Type, Palette, 
  Image as ImageIcon, Code, MousePointerClick, 
  Settings, ArrowLeft, Eye, Copy, MonitorPlay,
  ChevronDown, ImagePlus, Eraser, Video, 
  Volume2, VolumeX, PlayCircle, Repeat, StopCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useContent } from "@/hooks/use-content";
import { 
  CustomSection, 
  HeroButton, 
  DynamicContentSource, 
  BackgroundSettings,
  NewsItem, 
  ClassItem, 
  MediaItem, 
  FeatureItem, 
  WeaponItem, 
  MapItem, 
  GameDeviceItem 
} from "@/lib/content-store";
import { toast } from "sonner";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { MediaPickerModal } from "@/components/admin/modals/MediaPickerModal";
import { ServerFilePicker } from "@/components/admin/server-file-picker";
import { DEFAULT_SECTIONS } from "@/lib/default-sections";

type ContentItem = NewsItem | ClassItem | MediaItem | FeatureItem | WeaponItem | MapItem | GameDeviceItem;

const SECTION_TEMPLATES = [
  {
    name: "Main Hero (Full Screen)",
    type: "hero",
    content: {
      title: '<span class="text-primary text-glow-primary">SHADOWS</span><br/><span class="text-foreground">OF SOLDIERS</span>',
      subtitle: "Pick Your Role. Shape the Battlefield.",
      description: "",
      buttons: [
        { text: "Wishlist on Steam", url: "https://store.steampowered.com/app/2713480/Shadows_of_Soldiers/", variant: "primary" },
        { text: "Join Discord", url: "https://discord.gg/shadowsofsoldiers", variant: "outline" }
      ]
    },
    settings: {
      paddingTop: "0",
      paddingBottom: "0",
      containerWidth: "default",
      minHeight: "100vh",
      textAlign: "center",
      titleStyle: "default",
      titleFontSize: "text-5xl sm:text-7xl lg:text-9xl",
      titleFontWeight: "font-display",
      titleTransform: "uppercase",
      overlayOpacity: 60,
      background: { type: "image", image: "", opacity: 0.6 }
    }
  },
  {
    name: "Call to Action",
    type: "cta",
    content: {
      title: "JOIN THE FIGHT",
      subtitle: "Ready to deploy?",
      description: "<p>Join thousands of players online now.</p>",
      buttons: [{ text: "Download Now", url: "#", variant: "primary" }]
    },
    settings: {
      paddingTop: "4rem",
      paddingBottom: "4rem",
      containerWidth: "narrow",
      textAlign: "center",
      background: { type: "color", color: "transparent" }
    }
  },
  {
    name: "Feature Grid (3 Cols)",
    type: "features",
    content: {
      title: "GAME FEATURES",
      subtitle: "What makes it unique",
      description: "<p>Explore the key features of our game.</p>",
    },
    settings: {
      paddingTop: "4rem",
      paddingBottom: "4rem",
      containerWidth: "default",
      textAlign: "center",
      background: { type: "color", color: "transparent" }
    }
  }
];

export function SectionBuilderTab() {
  const { settings, updateSettings, updateCustomSections, addCustomSection, removeCustomSection } = useSiteSettings();
  const { news, classes, media, features, weapons, maps, gameDevices } = useContent();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localSection, setLocalSection] = useState<CustomSection | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Measurement ref for button width calculation
  const measureRef = useRef<HTMLDivElement>(null);
  
  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<'image' | 'video'>('image');
  const [mediaPickerCallback, setMediaPickerCallback] = useState<(url: string) => void>(() => {});

  const openMediaPicker = (callback: (url: string) => void, type: 'image' | 'video' = 'image') => {
    setMediaPickerCallback(() => callback);
    setMediaPickerType(type);
    setMediaPickerOpen(true);
  };

  // Sync local state when selection changes or settings update
  useEffect(() => {
    if (selectedId) {
      if (settings.customSections[selectedId]) {
        // Existing custom section
        setLocalSection(settings.customSections[selectedId]);
      } else if (DEFAULT_SECTIONS[selectedId]) {
        // Default section (not yet customized)
        setLocalSection(DEFAULT_SECTIONS[selectedId]);
      } else {
        // Section not found (e.g. deleted)
        setSelectedId(null);
        setLocalSection(null);
      }
    }
  }, [selectedId, settings.customSections]);

  const handleCreateSection = async () => {
    const id = `section-${Date.now()}`;
    const newSection: CustomSection = {
      id,
      type: 'rich-text',
      name: 'New Custom Section',
      content: {
        title: 'New Section',
        subtitle: 'Subtitle goes here',
        description: '<p>Add your content here.</p>',
        buttons: []
      },
      settings: {
        paddingTop: '4rem',
        paddingBottom: '4rem',
        containerWidth: 'default',
        background: {
          type: 'color',
          color: 'transparent',
          opacity: 1
        },
        textAlign: 'left'
      }
    };

    await addCustomSection(newSection);
    setSelectedId(id);
    toast.success("New section created");
  };

  const handleSave = async () => {
    if (!localSection || !selectedId) return;

    // Validation helper
    const isValidDimension = (value?: string, isLineHeight = false) => {
      if (!value) return true; // Optional fields can be empty
      
      // If it's a line-height, unitless numbers are allowed
      if (isLineHeight) {
        const isNumber = /^[+-]?\d+(\.\d+)?$/.test(value.trim());
        return isNumber || /^(auto|normal|inherit|initial|unset)$/.test(value.trim()) || /[a-z%]+$/.test(value.trim());
      }

      // For other dimensions:
      // Matches common CSS units: px, rem, em, %, vh, vw, ch, ex, cm, mm, in, pt, pc
      // Also matches "0" (valid without unit) and "auto"
      // If it's just a number and NOT 0, it's invalid
      const isJustNumber = /^[+-]?\d+(\.\d+)?$/.test(value.trim());
      if (isJustNumber && Number(value) !== 0) return false;
      return true;
    };

    // Validate dimensions in settings
    const dimensionsToCheck = [
      // Base Padding
      { name: 'Padding Top', value: localSection.settings.paddingTop },
      { name: 'Padding Bottom', value: localSection.settings.paddingBottom },
      { name: 'Min Height', value: localSection.settings.minHeight },
      
      // Title Typography & Spacing
      { name: 'Title Font Size', value: localSection.settings.titleFontSize },
      { name: 'Title Line Height', value: localSection.settings.titleLineHeight, isLineHeight: true },
      { name: 'Title Letter Spacing', value: localSection.settings.titleLetterSpacing },
      { name: 'Title Padding Top', value: localSection.settings.titlePaddingTop },
      { name: 'Title Padding Bottom', value: localSection.settings.titlePaddingBottom },
      { name: 'Title Margin Top', value: localSection.settings.titleMarginTop },
      { name: 'Title Margin Bottom', value: localSection.settings.titleMarginBottom },
      { name: 'Title Wrapper Margin Top', value: localSection.settings.titleWrapperMarginTop },
      { name: 'Title Wrapper Margin Bottom', value: localSection.settings.titleWrapperMarginBottom },
      
      // Title Decoration
      { name: 'Decoration Size', value: localSection.settings.titleDecorationSize },
      { name: 'Decoration Padding Top', value: localSection.settings.titleDecorationPaddingTop },
      { name: 'Decoration Padding Bottom', value: localSection.settings.titleDecorationPaddingBottom },
      { name: 'Decoration Margin Top', value: localSection.settings.titleDecorationMarginTop },
      { name: 'Decoration Margin Bottom', value: localSection.settings.titleDecorationMarginBottom },
      
      // Subtitle Typography & Spacing
      { name: 'Subtitle Font Size', value: localSection.settings.subtitleFontSize },
      { name: 'Subtitle Line Height', value: localSection.settings.subtitleLineHeight, isLineHeight: true },
      { name: 'Subtitle Padding Top', value: localSection.settings.subtitlePaddingTop },
      { name: 'Subtitle Padding Bottom', value: localSection.settings.subtitlePaddingBottom },
      { name: 'Subtitle Margin Top', value: localSection.settings.subtitleMarginTop },
      { name: 'Subtitle Margin Bottom', value: localSection.settings.subtitleMarginBottom },
      
      // Body Typography
      { name: 'Body Font Size', value: localSection.settings.bodyFontSize },
      { name: 'Body Line Height', value: localSection.settings.bodyLineHeight, isLineHeight: true },
      { name: 'Body Letter Spacing', value: localSection.settings.bodyLetterSpacing },
    ];

    // Scroll Indicator Position
    if (localSection.settings.scrollIndicator?.position?.bottom) {
      dimensionsToCheck.push({ 
        name: 'Scroll Indicator Bottom', 
        value: localSection.settings.scrollIndicator.position.bottom 
      });
    }

    const invalidFields: string[] = [];

    for (const dim of dimensionsToCheck) {
      if (dim.value && dim.value !== 'none' && !dim.value.startsWith('text-')) {
        if (!isValidDimension(dim.value, dim.isLineHeight)) {
          invalidFields.push(dim.name);
        }
      }
    }

    // Validate button dimensions
    if (localSection.content.buttons) {
      for (let i = 0; i < localSection.content.buttons.length; i++) {
        const btn = localSection.content.buttons[i];
        const btnDims = [
          { name: `Button ${i+1} Width`, value: btn.width },
          { name: `Button ${i+1} Height`, value: btn.height },
          { name: `Button ${i+1} Font Size`, value: btn.fontSize },
        ];
        
        for (const dim of btnDims) {
          if (dim.value && !isValidDimension(dim.value)) {
            invalidFields.push(dim.name);
          }
        }
      }
    }

    if (invalidFields.length > 0) {
      toast.warning(
        `Invalid dimensions in: ${invalidFields.join(', ')}. Please add a unit (px, rem, etc).`,
        {
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            color: 'white',
            border: 'none',
            fontWeight: '500'
          },
          duration: 5000
        }
      );
      return;
    }
    
    const updatedCustomSections = {
      ...settings.customSections,
      [selectedId]: localSection
    };

    // Update homepageSections to reflect potential name change
    const updatedHomepageSections = settings.homepageSections.map(s => 
      s.id === selectedId ? { ...s, name: localSection.name } : s
    );
    
    await updateSettings({
      customSections: updatedCustomSections,
      homepageSections: updatedHomepageSections
    });
    toast.success("Section saved successfully");
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this section?")) {
      await removeCustomSection(id);
      if (selectedId === id) {
        setSelectedId(null);
        setLocalSection(null);
      }
      toast.success("Section deleted");
    }
  };

  const updateLocalSection = (updates: Partial<CustomSection>) => {
    if (!localSection) return;
    setLocalSection({ ...localSection, ...updates });
  };

  const updateContent = (updates: Partial<CustomSection['content']>) => {
    if (!localSection) return;
    setLocalSection({
      ...localSection,
      content: { ...localSection.content, ...updates }
    });
  };

  const updateSettingsLocal = (updates: Partial<CustomSection['settings']>) => {
    if (!localSection) return;
    setLocalSection({
      ...localSection,
      settings: { ...localSection.settings, ...updates }
    });
  };

  const updateBackground = (updates: Partial<BackgroundSettings>) => {
    if (!localSection) return;
    setLocalSection({
      ...localSection,
      settings: {
        ...localSection.settings,
        background: { ...localSection.settings.background, ...updates }
      }
    });
  };

  const updateAnimation = (updates: Partial<NonNullable<CustomSection['settings']['animation']>>) => {
    if (!localSection) return;
    setLocalSection({
      ...localSection,
      settings: {
        ...localSection.settings,
        animation: { ...(localSection.settings.animation || { type: 'none' }), ...updates }
      }
    });
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sectionToDuplicate = settings.customSections[id];
    if (!sectionToDuplicate) return;

    const newId = `section-${Date.now()}`;
    const newSection: CustomSection = {
      ...sectionToDuplicate,
      id: newId,
      name: `${sectionToDuplicate.name} (Copy)`,
    };

    await addCustomSection(newSection);
    toast.success("Section duplicated");
  };

  const handleCreateFromTemplate = async (template: typeof SECTION_TEMPLATES[0]) => {
    const id = `section-${Date.now()}`;
    const newSection: CustomSection = {
      id,
      name: template.name,
      type: template.type as CustomSection['type'],
      content: JSON.parse(JSON.stringify(template.content)), // Deep copy content
      settings: JSON.parse(JSON.stringify(template.settings)) as CustomSection['settings']
    };

    await addCustomSection(newSection);
    setSelectedId(id);
    toast.success(`Created section from template: ${template.name}`);
  };

  // Button management
  const addButton = () => {
    if (!localSection) return;
    const currentButtons = localSection.content.buttons || [];
    updateContent({
      buttons: [...currentButtons, { text: "Click Me", url: "#", variant: "primary" }]
    });
  };

  const updateButton = (index: number, updates: Partial<HeroButton>) => {
    if (!localSection) return;
    const newButtons = [...(localSection.content.buttons || [])];
    
    // Check if we need to auto-adjust width
    if (updates.width || updates.text || updates.icon) {
      const btn = { ...newButtons[index], ...updates };
      
      // Only proceed if we have a width set and it's in pixels (or just a number)
      if (btn.width && measureRef.current) {
        const isPxOrNumber = /^[+-]?\d+(\.\d+)?(px)?$/.test(btn.width.trim());
        
        if (isPxOrNumber) {
          // Setup measurement
          const measureEl = measureRef.current;
          measureEl.innerHTML = '';
          
          // Create structure: <span>Text</span> + (Icon ? gap + icon : 0)
          const span = document.createElement('span');
          span.textContent = btn.text;
          measureEl.appendChild(span);
          
          if (btn.icon && btn.icon !== 'none') {
            // Add icon simulation (20px width + 12px gap)
            // We simulate gap with margin on icon
            const iconEl = document.createElement('div');
            iconEl.style.width = '20px';
            iconEl.style.height = '20px';
            iconEl.style.marginLeft = '12px'; // gap-3 = 0.75rem = 12px
            iconEl.style.display = 'inline-block';
            measureEl.appendChild(iconEl);
          }
          
          // Get minimum required width (including padding from class)
          // We add a small buffer (2px) to be safe
          const minWidth = measureEl.offsetWidth + 2;
          const currentWidthVal = parseFloat(btn.width);
          
          if (currentWidthVal < minWidth) {
            // Auto-correct to min width
            // We only override if the update was to width/text/icon, 
            // but we must be careful not to create a loop or fight the user typing.
            // If the user IS typing width, we might want to wait for blur?
            // The prompt says: "if you modify the width smaller than label change it automaticly"
            // If I do it on change, it might be annoying.
            // BUT, if I do it here, I am intercepting the update.
            
            // Let's only override if the width is explicitly being updated OR if text/icon changed and existing width is too small.
            // If user types "2", it's < minWidth, so it becomes "120px" immediately. That prevents typing "200".
            // So we should NOT do this on every keystroke of width.
            
            // However, the prompt says "automaticly chage width".
            // To avoid input fighting, maybe we only apply this logic if the update comes from text/icon change,
            // OR if it's a width change, we rely on onBlur?
            // The user asked: "if you modify the width smaller than label change it automaticly"
            
            // Let's implement handleButtonWidthBlur instead for the width input,
            // and keep this logic for text/icon updates.
            
            if (updates.text || updates.icon) {
               updates.width = `${minWidth}px`;
            }
          }
        }
      }
    }

    newButtons[index] = { ...newButtons[index], ...updates };
    updateContent({ buttons: newButtons });
  };
  
  const checkButtonWidthOnBlur = (index: number) => {
    if (!localSection || !localSection.content.buttons) return;
    const btn = localSection.content.buttons[index];
    if (!btn.width || !measureRef.current) return;
    
    const isPxOrNumber = /^[+-]?\d+(\.\d+)?(px)?$/.test(btn.width.trim());
    if (!isPxOrNumber) return;

    const measureEl = measureRef.current;
    measureEl.innerHTML = '';
    
    const span = document.createElement('span');
    span.textContent = btn.text;
    measureEl.appendChild(span);
    
    if (btn.icon && btn.icon !== 'none') {
      const iconEl = document.createElement('div');
      iconEl.style.width = '20px';
      iconEl.style.height = '20px';
      iconEl.style.marginLeft = '12px';
      iconEl.style.display = 'inline-block';
      measureEl.appendChild(iconEl);
    }
    
    const minWidth = measureEl.offsetWidth + 2;
    const currentWidthVal = parseFloat(btn.width);
    
    if (currentWidthVal < minWidth) {
      updateButton(index, { width: `${minWidth}px` });
      toast.info(`Button width auto-adjusted to fit content (${minWidth}px)`);
    }
  };

  const removeButton = (index: number) => {
    if (!localSection) return;
    const newButtons = (localSection.content.buttons || []).filter((_, i) => i !== index);
    updateContent({ buttons: newButtons });
  };

  const updateScrollIndicator = (updates: any) => {
    if (!localSection) return;
    const current = localSection.settings.scrollIndicator || {
      enabled: false,
      style: 'bounce',
      icon: 'chevron-down',
      color: 'text-muted-foreground'
    };
    updateSettingsLocal({
      scrollIndicator: { ...current, ...updates }
    });
  };

  const insertTag = (tag: string) => {
    const el = document.getElementById('section-title-input') as HTMLTextAreaElement;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const text = el.value;
      const before = text.substring(0, start);
      const selection = text.substring(start, end);
      const after = text.substring(end);
      
      let newText = "";
      if (tag === 'br') {
        newText = before + `<br/>` + after;
      } else {
        newText = before + `<span class="${tag}">${selection || 'Text'}</span>` + after;
      }
      
      updateContent({ title: newText });
    }
  };

  const insertDescriptionTag = (tag: string) => {
    const el = document.getElementById('section-description-input') as HTMLTextAreaElement;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const text = el.value;
      const before = text.substring(0, start);
      const selection = text.substring(start, end);
      const after = text.substring(end);
      
      let newText = "";
      if (tag === 'br') newText = before + `<br/>` + after;
      else if (tag === 'b') newText = before + `<b>${selection}</b>` + after;
      else if (tag === 'i') newText = before + `<i>${selection}</i>` + after;
      else if (tag === 'u') newText = before + `<u>${selection}</u>` + after;
      else if (tag.startsWith('h')) newText = before + `<${tag}>${selection}</${tag}>` + after;
      else if (tag === 'p') newText = before + `<p>${selection}</p>` + after;
      else if (tag === 'ul') newText = before + `<ul>\n  <li>${selection || 'Item'}</li>\n</ul>` + after;
      else newText = before + `<span class="${tag}">${selection || 'Text'}</span>` + after;
      
      updateContent({ description: newText });
    }
  };

  const removeTags = () => {
    const el = document.getElementById('section-title-input') as HTMLTextAreaElement;
    if (el) {
      const text = el.value;
      const cleanText = text.replace(/<[^>]*>/g, '');
      updateContent({ title: cleanText });
    }
  };

  // Combine custom sections with default sections that are in the layout but not yet customized
  const sectionsList = [
    ...Object.values(settings.customSections),
    ...settings.homepageSections
      .filter(s => !settings.customSections[s.id] && DEFAULT_SECTIONS[s.id])
      .map(s => DEFAULT_SECTIONS[s.id])
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Hidden measurement element for button width calculation */}
      <div 
        ref={measureRef} 
        className="absolute opacity-0 pointer-events-none whitespace-nowrap font-heading text-lg uppercase tracking-wide px-8 border border-transparent"
        style={{ visibility: 'hidden', height: 0, overflow: 'hidden', left: -9999 }}
      ></div>

      {/* Sidebar List */}
      <Card className="md:col-span-3 flex flex-col h-full overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Sections</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                  <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCreateSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Empty Section
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Templates</DropdownMenuLabel>
                {SECTION_TEMPLATES.map((template, idx) => (
                  <DropdownMenuItem key={idx} onClick={() => handleCreateFromTemplate(template)}>
                    <Layout className="w-4 h-4 mr-2" />
                    {template.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>Manage your custom sections</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-2">
              {sectionsList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No sections created yet.
                </div>
              ) : (
                sectionsList.map((section) => (
                  <div
                    key={section.id}
                    onClick={() => setSelectedId(section.id)}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors border ${
                      selectedId === section.id
                        ? "bg-primary/10 border-primary/50"
                        : "hover:bg-muted border-transparent hover:border-border"
                    }`}
                  >
                    <div className="truncate flex-1 mr-2">
                      <div className="font-medium truncate text-sm">{section.name}</div>
                      <div className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 font-normal">
                          {section.type}
                        </Badge>
                        {!settings.customSections[section.id] && (
                          <Badge variant="secondary" className="text-[10px] h-4 px-1 py-0 font-normal bg-muted text-muted-foreground">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-50 hover:opacity-100 hover:text-primary hover:bg-primary/10"
                        onClick={(e) => handleDuplicate(section.id, e)}
                        title="Duplicate Section"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-50 hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(section.id, e)}
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="md:col-span-9 h-full overflow-hidden flex flex-col">
        {localSection ? (
          <div className="h-full flex flex-col gap-4">
            {/* Toolbar */}
            <Card className="border-border/50 shadow-sm shrink-0">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:w-auto flex gap-4 items-center">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground mb-1 block">Section Name</Label>
                    <Input 
                      value={localSection.name} 
                      onChange={(e) => updateLocalSection({ name: e.target.value })}
                      className="h-8"
                    />
                  </div>
                  <div className="w-[150px]">
                    <Label className="text-xs text-muted-foreground mb-1 block">Type</Label>
                    <Select 
                      value={localSection.type} 
                      onValueChange={(val: CustomSection['type']) => updateLocalSection({ type: val })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rich-text">Rich Text</SelectItem>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="cta">Call to Action</SelectItem>
                        <SelectItem value="features">Features List</SelectItem>
                        <SelectItem value="html">Custom HTML</SelectItem>
                        <SelectItem value="dynamic-content">Dynamic Content (Pro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                   <Button onClick={handleSave} className="h-9">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Editor Tabs */}
            <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-2 px-1">
                <TabsList>
                  {localSection.type === 'dynamic-content' && (
                    <TabsTrigger value="sources" className="flex gap-2 items-center">
                      <Layout className="w-4 h-4" />
                      Sources
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="content" className="flex gap-2 items-center">
                    <Type className="w-4 h-4" />
                    Text Content
                  </TabsTrigger>
                  <TabsTrigger value="design" className="flex gap-2 items-center">
                    <Palette className="w-4 h-4" />
                    Design & Style
                  </TabsTrigger>
                  <TabsTrigger value="effects" className="flex gap-2 items-center">
                    <MonitorPlay className="w-4 h-4" />
                    Effects (Pro)
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex gap-2 items-center">
                    <Settings className="w-4 h-4" />
                    Advanced
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 pb-10">
                {/* Dynamic Content Sources Tab */}
                <TabsContent value="sources" className="mt-0 space-y-6">
                  {localSection.type === 'dynamic-content' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Layout className="w-4 h-4 text-primary" />
                          Content Sources
                        </CardTitle>
                        <CardDescription>
                          Combine different content types in this section.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(localSection.content.dynamicSources || []).map((source: DynamicContentSource, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg bg-muted/30 relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                const newSources = [...(localSection.content.dynamicSources || [])];
                                newSources.splice(idx, 1);
                                updateContent({ dynamicSources: newSources });
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Content Type</Label>
                                <Select
                                  value={source.type}
                                  onValueChange={(val) => {
                                    const newSources = [...(localSection.content.dynamicSources || [])];
                                    
                                    // Recommended defaults based on type
                                    let defaultMode = 'grid';
                                    let defaultCount = 3;

                                    switch(val) {
                                      case 'news':
                                        defaultMode = 'grid';
                                        defaultCount = 3;
                                        break;
                                      case 'classes':
                                        defaultMode = 'list'; // List view shows details better
                                        defaultCount = 10;
                                        break;
                                      case 'features':
                                        defaultMode = 'grid';
                                        defaultCount = 6;
                                        break;
                                      case 'media':
                                        defaultMode = 'grid';
                                        defaultCount = 8;
                                        break;
                                      case 'weapons':
                                      case 'gameDevices':
                                        defaultMode = 'grid';
                                        defaultCount = 8;
                                        break;
                                      case 'maps':
                                        defaultMode = 'grid';
                                        defaultCount = 4;
                                        break;
                                    }

                                    newSources[idx] = { 
                                      ...newSources[idx], 
                                      type: val,
                                      displayMode: defaultMode,
                                      count: defaultCount,
                                      ids: undefined // Reset selection when type changes
                                    };
                                    updateContent({ dynamicSources: newSources });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="news">News / Articles</SelectItem>
                                    <SelectItem value="media">Media (Images/Videos)</SelectItem>
                                    <SelectItem value="classes">Classes</SelectItem>
                                    <SelectItem value="weapons">Weapons</SelectItem>
                                    <SelectItem value="maps">Maps</SelectItem>
                                    <SelectItem value="features">Features</SelectItem>
                                    <SelectItem value="gameDevices">Devices</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Display Mode</Label>
                                <Select
                                  value={source.displayMode}
                                  onValueChange={(val) => {
                                    const newSources = [...(localSection.content.dynamicSources || [])];
                                    newSources[idx] = { ...newSources[idx], displayMode: val };
                                    updateContent({ dynamicSources: newSources });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="grid">Grid</SelectItem>
                                    <SelectItem value="list">List</SelectItem>
                                    <SelectItem value="carousel">Carousel</SelectItem>
                                    <SelectItem value="cards">Cards</SelectItem>
                                    <SelectItem value="spotlight">Spotlight (Hero + List)</SelectItem>
                                    <SelectItem value="masonry">Masonry</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {source.type === 'news' && (
                                <div className="space-y-2">
                                  <Label>Card Style</Label>
                                  <Select
                                    value={source.cardStyle || 'default'}
                                    onValueChange={(val) => {
                                      const newSources = [...(localSection.content.dynamicSources || [])];
                                      newSources[idx] = { ...newSources[idx], cardStyle: val };
                                      updateContent({ dynamicSources: newSources });
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="default">Default</SelectItem>
                                      <SelectItem value="minimal">Minimal</SelectItem>
                                      <SelectItem value="overlay">Overlay</SelectItem>
                                      <SelectItem value="magazine">Magazine</SelectItem>
                                      <SelectItem value="compact">Compact</SelectItem>
                                      <SelectItem value="tech">Tech</SelectItem>
                                      <SelectItem value="corporate">Corporate</SelectItem>
                                      <SelectItem value="glass">Glass</SelectItem>
                                      <SelectItem value="featured">Featured (Hero)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {source.displayMode === 'grid' && (
                                <div className="space-y-2">
                                  <Label>Grid Columns</Label>
                                  <div className="flex items-center gap-2">
                                    <Slider
                                      value={[source.gridColumns || 3]}
                                      min={1}
                                      max={4}
                                      step={1}
                                      onValueChange={(vals) => {
                                        const newSources = [...(localSection.content.dynamicSources || [])];
                                        newSources[idx] = { ...newSources[idx], gridColumns: vals[0] };
                                        updateContent({ dynamicSources: newSources });
                                      }}
                                      className="flex-1"
                                    />
                                    <span className="text-sm w-8 text-right">{source.gridColumns || 3}</span>
                                  </div>
                                </div>
                              )}

                              <div className="space-y-2">
                                <Label>Max Items</Label>
                                <div className="flex items-center gap-2">
                                  <Slider
                                    value={[source.count || 3]}
                                    min={1}
                                    max={12}
                                    step={1}
                                    onValueChange={(vals) => {
                                      const newSources = [...(localSection.content.dynamicSources || [])];
                                      newSources[idx] = { ...newSources[idx], count: vals[0] };
                                      updateContent({ dynamicSources: newSources });
                                    }}
                                    className="flex-1"
                                  />
                                  <span className="text-sm w-8 text-right">{source.count || 3}</span>
                                </div>
                              </div>

                              <div className="space-y-2 col-span-1 md:col-span-2 pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                  <Label>Content Selection</Label>
                                  <div className="flex items-center gap-2 bg-muted rounded-md p-1">
                                     <Button 
                                        variant={!source.ids ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-6 text-xs px-2"
                                        onClick={() => {
                                            const newSources = [...(localSection.content.dynamicSources || [])];
                                            newSources[idx] = { ...newSources[idx], ids: undefined };
                                            updateContent({ dynamicSources: newSources });
                                        }}
                                     >
                                        All
                                     </Button>
                                     <Button 
                                        variant={source.ids ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-6 text-xs px-2"
                                        onClick={() => {
                                             if (!source.ids) {
                                                const newSources = [...(localSection.content.dynamicSources || [])];
                                                newSources[idx] = { ...newSources[idx], ids: [] };
                                                updateContent({ dynamicSources: newSources });
                                             }
                                        }}
                                     >
                                        Specific
                                     </Button>
                                  </div>
                                </div>
                                
                                {source.ids !== undefined && (
                                  <ScrollArea className="h-[150px] w-full border rounded-md bg-background">
                                    <div className="p-3 space-y-3">
                                      {(() => {
                                         const items = 
                                            source.type === 'news' ? news :
                                            source.type === 'media' ? media :
                                            source.type === 'classes' ? classes :
                                            source.type === 'weapons' ? weapons :
                                            source.type === 'maps' ? maps :
                                            source.type === 'features' ? features :
                                            source.type === 'gameDevices' ? gameDevices : [];
                                         
                                         if (items.length === 0) return <div className="text-xs text-muted-foreground text-center py-4">No items found for this type.</div>;

                                         return items.map((item: ContentItem) => {
                                            const label = 'title' in item ? item.title : 'name' in item ? item.name : "Untitled";
                                            return (
                                            <div key={item.id} className="flex items-center space-x-2">
                                              <Checkbox 
                                                id={`item-${idx}-${item.id}`}
                                                checked={source.ids?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    const currentIds = source.ids || [];
                                                    let newIds;
                                                    if (checked) {
                                                        newIds = [...currentIds, item.id];
                                                    } else {
                                                        newIds = currentIds.filter((id: string) => id !== item.id);
                                                    }
                                                    const newSources = [...(localSection.content.dynamicSources || [])];
                                                    newSources[idx] = { ...newSources[idx], ids: newIds };
                                                    updateContent({ dynamicSources: newSources });
                                                }}
                                              />
                                              <label 
                                                htmlFor={`item-${idx}-${item.id}`} 
                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate flex-1"
                                                title={label}
                                              >
                                                {label}
                                              </label>
                                            </div>
                                         )});
                                      })()}
                                    </div>
                                  </ScrollArea>
                                )}
                              </div>

                              <div className="space-y-2 col-span-1 md:col-span-2 pt-2 border-t border-border/50">
                                <Label className="flex justify-between">
                                  Title Override (Optional)
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">HTML Supported</span>
                                </Label>
                                <Textarea
                                  value={source.title || ''}
                                  onChange={(e) => {
                                    const newSources = [...(localSection.content.dynamicSources || [])];
                                    newSources[idx] = { ...newSources[idx], title: e.target.value };
                                    updateContent({ dynamicSources: newSources });
                                  }}
                                  placeholder="e.g. Latest Updates"
                                  className="min-h-[60px]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={() => {
                            const currentSources = localSection.content.dynamicSources || [];
                            updateContent({
                              dynamicSources: [
                                ...currentSources,
                                { type: 'news', displayMode: 'grid', count: 3 }
                              ]
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Content Source
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="content" className="mt-0 space-y-6">

                  {/* Common Content Fields */}
                  {localSection.type !== 'html' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Type className="w-4 h-4 text-primary" />
                          Text Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex justify-between items-center mb-2">
                            <span>Title</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">HTML Supported</span>
                          </Label>
                          
                          <div className="flex gap-1 bg-muted/30 p-1 rounded-md mb-2 overflow-x-auto">
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:bg-primary/10 px-2" onClick={() => insertTag('text-primary')}>
                              Primary
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-accent hover:bg-accent/10 px-2" onClick={() => insertTag('text-accent')}>
                              Accent
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => insertTag('text-white')}>
                              White
                            </Button>
                            <div className="w-px h-4 bg-border mx-1 self-center" />
                            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => insertTag('br')}>
                              Break
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive hover:bg-destructive/10 px-2" onClick={removeTags} title="Remove all HTML tags">
                              <Eraser className="w-3 h-3 mr-1" />
                              Clean
                            </Button>
                          </div>

                          <Textarea 
                            id="section-title-input"
                            value={localSection.content.title || ''} 
                            onChange={(e) => updateContent({ title: e.target.value })}
                            placeholder="Section Title"
                            className="min-h-[60px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Input 
                            value={localSection.content.subtitle || ''} 
                            onChange={(e) => updateContent({ subtitle: e.target.value })}
                            placeholder="Section Subtitle"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description / Body</Label>
                          <div className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-md mb-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => insertDescriptionTag('b')} title="Bold">
                              <span className="font-bold">B</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 italic" onClick={() => insertDescriptionTag('i')} title="Italic">
                              <span className="italic">I</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 underline" onClick={() => insertDescriptionTag('u')} title="Underline">
                              <span className="underline">U</span>
                            </Button>
                            <div className="w-px h-4 bg-border mx-1 self-center" />
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => insertDescriptionTag('h3')} title="Heading 3">H3</Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => insertDescriptionTag('h4')} title="Heading 4">H4</Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => insertDescriptionTag('p')} title="Paragraph">P</Button>
                            <div className="w-px h-4 bg-border mx-1 self-center" />
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => insertDescriptionTag('ul')} title="List">List</Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => insertDescriptionTag('br')} title="Line Break">BR</Button>
                            <div className="w-px h-4 bg-border mx-1 self-center" />
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary" onClick={() => insertDescriptionTag('text-primary')}>Color</Button>
                          </div>
                          <Textarea 
                            id="section-description-input"
                            value={localSection.content.description || ''} 
                            onChange={(e) => updateContent({ description: e.target.value })}
                            placeholder="<p>Enter your content here...</p>"
                            className="font-mono text-sm min-h-[150px]"
                          />
                          <p className="text-xs text-muted-foreground">HTML tags are allowed.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Image Field - REMOVED for Hero/CTA as requested */}
                  {/* (localSection.type === 'hero' || localSection.type === 'cta') && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          Media
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                         <div className="space-y-2">
                          <Label>Image URL</Label>
                          <div className="flex gap-2">
                            <Input 
                              value={localSection.content.image || ''} 
                              onChange={(e) => updateContent({ image: e.target.value })}
                              placeholder="https://..."
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openMediaPicker((url) => updateContent({ image: url }))}
                              title="Select from Media Library"
                            >
                              <ImagePlus className="w-4 h-4" />
                            </Button>
                            <FileUpload 
                              onUploadComplete={(url) => updateContent({ image: url })}
                              variant="button"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) */}

                  {/* Buttons */}
                  {localSection.type !== 'html' && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MousePointerClick className="w-4 h-4 text-primary" />
                          Action Buttons
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={addButton}>
                          <Plus className="w-3 h-3 mr-1" /> Add Button
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(!localSection.content.buttons || localSection.content.buttons.length === 0) ? (
                          <div className="text-sm text-muted-foreground italic">No buttons added.</div>
                        ) : (
                          localSection.content.buttons.map((btn, idx) => (
                            <div key={idx} className="flex flex-col gap-3 p-3 border rounded-md bg-muted/20">
                              <div className="flex gap-3 items-start">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div>
                                    <Label className="text-xs mb-1 block">Label</Label>
                                    <Input 
                                      value={btn.text} 
                                      onChange={(e) => updateButton(idx, { text: e.target.value })}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-1 block">Link</Label>
                                    <Input 
                                      value={btn.url} 
                                      onChange={(e) => updateButton(idx, { url: e.target.value })}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-1 block">Style</Label>
                                    <Select 
                                      value={btn.variant} 
                                      onValueChange={(val: HeroButton['variant']) => updateButton(idx, { variant: val })}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="primary">Primary</SelectItem>
                                        <SelectItem value="secondary">Secondary</SelectItem>
                                        <SelectItem value="outline">Outline</SelectItem>
                                        <SelectItem value="ghost">Ghost</SelectItem>
                                        <SelectItem value="destructive">Destructive</SelectItem>
                                        <SelectItem value="link">Link</SelectItem>
                                        <SelectItem value="glow">Glow</SelectItem>
                                        <SelectItem value="glass">Glass</SelectItem>
                                        <SelectItem value="soft">Soft</SelectItem>
                                        <SelectItem value="outline-glow">Outline Glow</SelectItem>
                                        <SelectItem value="neo">Neobrutalism</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-xs mb-1 block">Icon</Label>
                                    <Select 
                                      value={btn.icon || 'none'} 
                                      onValueChange={(val) => updateButton(idx, { icon: val === 'none' ? undefined : val })}
                                    >
                                      <SelectTrigger className="h-8 text-sm">
                                        <SelectValue placeholder="Select Icon" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="arrow-right">Arrow Right</SelectItem>
                                        <SelectItem value="chevron-right">Chevron Right</SelectItem>
                                        <SelectItem value="external-link">External Link</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                        <SelectItem value="zap">Zap</SelectItem>
                                        <SelectItem value="star">Star</SelectItem>
                                        <SelectItem value="crown">Crown</SelectItem>
                                        <SelectItem value="swords">Swords</SelectItem>
                                        <SelectItem value="skull">Skull</SelectItem>
                                        <SelectItem value="crosshair">Crosshair</SelectItem>
                                        <SelectItem value="shield">Shield</SelectItem>
                                        <SelectItem value="trophy">Trophy</SelectItem>
                                        <SelectItem value="flame">Flame</SelectItem>
                                        <SelectItem value="gamepad">Gamepad</SelectItem>
                                        <SelectItem value="mouse">Mouse</SelectItem>
                                        <SelectItem value="arrow-down">Arrow Down</SelectItem>
                                        <SelectItem value="chevron-down">Chevron Down</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0 mt-6" onClick={() => removeButton(idx)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              {/* Advanced Dimensions */}
                              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/50">
                                <div>
                                  <Label className="text-xs mb-1 block">Width (e.g. 150px, 100%)</Label>
                                  <Input 
                                    value={btn.width || ''} 
                                    onChange={(e) => updateButton(idx, { width: e.target.value })}
                                    onBlur={() => checkButtonWidthOnBlur(idx)}
                                    placeholder="Auto"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs mb-1 block">Height (e.g. 50px)</Label>
                                  <Input 
                                    value={btn.height || ''} 
                                    onChange={(e) => updateButton(idx, { height: e.target.value })}
                                    placeholder="Auto"
                                    className="h-7 text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs mb-1 block">Font Size (e.g. 18px)</Label>
                                  <Input 
                                    value={btn.fontSize || ''} 
                                    onChange={(e) => updateButton(idx, { fontSize: e.target.value })}
                                    placeholder="Default"
                                    className="h-7 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Raw HTML */}
                  {localSection.type === 'html' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Code className="w-4 h-4 text-primary" />
                          Custom Code
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Raw HTML</Label>
                          <Textarea 
                            value={localSection.content.html || ''} 
                            onChange={(e) => updateContent({ html: e.target.value })}
                            placeholder="<div>Your custom HTML here</div>"
                            className="font-mono text-sm min-h-[300px]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="design" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Layout className="w-4 h-4 text-primary" />
                        Layout & Spacing
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label>Padding Top</Label>
                          <Input 
                            value={localSection.settings.paddingTop}
                            onChange={(e) => updateSettingsLocal({ paddingTop: e.target.value })}
                            placeholder="e.g. 4rem, 64px"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Padding Bottom</Label>
                          <Input 
                            value={localSection.settings.paddingBottom}
                            onChange={(e) => updateSettingsLocal({ paddingBottom: e.target.value })}
                            placeholder="e.g. 4rem, 64px"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Minimum Height</Label>
                          <Select 
                            value={localSection.settings.minHeight || "none"} 
                            onValueChange={(val) => updateSettingsLocal({ minHeight: val === "none" ? undefined : val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Auto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Auto</SelectItem>
                              <SelectItem value="100vh">Full Screen (100vh)</SelectItem>
                              <SelectItem value="75vh">Large (75vh)</SelectItem>
                              <SelectItem value="50vh">Medium (50vh)</SelectItem>
                              <SelectItem value="600px">Fixed (600px)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label>Container Width</Label>
                        <Select 
                          value={localSection.settings.containerWidth} 
                          onValueChange={(val: CustomSection['settings']['containerWidth']) => updateSettingsLocal({ containerWidth: val })}
                      >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default (Boxed)</SelectItem>
                            <SelectItem value="narrow">Narrow (Text Focused)</SelectItem>
                            <SelectItem value="full">Full Width</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label>Text Alignment</Label>
                         <Select 
                          value={localSection.settings.textAlign || 'left'} 
                          onValueChange={(val: CustomSection['settings']['textAlign']) => updateSettingsLocal({ textAlign: val })}
                      >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {localSection.type === 'dynamic-content' && (
                        <div className="space-y-4">
                          <Label>Source Text Alignment</Label>
                           <Select 
                            value={localSection.settings.sourceTextAlign || 'left'} 
                            onValueChange={(val: CustomSection['settings']['sourceTextAlign']) => updateSettingsLocal({ sourceTextAlign: val })}
                        >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>

{/* Scroll Indicator removed from here */}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Type className="w-4 h-4 text-primary" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label>Title Size</Label>
                          <Input 
                            value={localSection.settings.titleFontSize || ""}
                            onChange={(e) => updateSettingsLocal({ titleFontSize: e.target.value })}
                            placeholder="e.g. 3rem, 48px, text-4xl"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Title Weight</Label>
                          <Select 
                            value={localSection.settings.titleFontWeight || "font-heading font-bold"} 
                            onValueChange={(val) => updateSettingsLocal({ titleFontWeight: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="font-sans font-normal">Normal (Sans)</SelectItem>
                              <SelectItem value="font-sans font-bold">Bold (Sans)</SelectItem>
                              <SelectItem value="font-heading font-medium">Medium (Heading)</SelectItem>
                              <SelectItem value="font-heading font-bold">Bold (Heading)</SelectItem>
                              <SelectItem value="font-display">Display (Heavy)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label>Text Transform</Label>
                          <Select 
                            value={localSection.settings.titleTransform || "none"} 
                            onValueChange={(val: any) => updateSettingsLocal({ titleTransform: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="uppercase">Uppercase</SelectItem>
                              <SelectItem value="capitalize">Capitalize</SelectItem>
                              <SelectItem value="lowercase">Lowercase</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label>Title Style Effect</Label>
                          <Select 
                            value={localSection.settings.titleStyle || 'default'} 
                            onValueChange={(val: any) => updateSettingsLocal({ titleStyle: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="glow">Glow Effect</SelectItem>
                              <SelectItem value="shadow">Drop Shadow</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-4">
                          <Label>Title Line Height</Label>
                          <Input 
                            value={localSection.settings.titleLineHeight || ""}
                            onChange={(e) => updateSettingsLocal({ titleLineHeight: e.target.value })}
                            placeholder="e.g. 1.2, 120%"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Title Letter Spacing</Label>
                          <Input 
                            value={localSection.settings.titleLetterSpacing || ""}
                            onChange={(e) => updateSettingsLocal({ titleLetterSpacing: e.target.value })}
                            placeholder="e.g. 0.05em, 2px"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Title Padding Top</Label>
                          <Input 
                            value={localSection.settings.titlePaddingTop || ""}
                            onChange={(e) => updateSettingsLocal({ titlePaddingTop: e.target.value })}
                            placeholder="e.g. 1rem, 20px"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Title Padding Bottom</Label>
                          <Input 
                            value={localSection.settings.titlePaddingBottom || ""}
                            onChange={(e) => updateSettingsLocal({ titlePaddingBottom: e.target.value })}
                            placeholder="e.g. 1rem, 20px"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Title Margin Top</Label>
                          <Input 
                            value={localSection.settings.titleMarginTop || ""}
                            onChange={(e) => updateSettingsLocal({ titleMarginTop: e.target.value })}
                            placeholder="e.g. 1rem, 20px"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Title Margin Bottom</Label>
                          <Input 
                            value={localSection.settings.titleMarginBottom || ""}
                            onChange={(e) => updateSettingsLocal({ titleMarginBottom: e.target.value })}
                            placeholder="e.g. 1rem, 20px"
                          />
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/50">
                          <div className="space-y-4">
                            <Label>Title Wrapper Margin Top</Label>
                            <Input 
                              value={localSection.settings.titleWrapperMarginTop || ""}
                              onChange={(e) => updateSettingsLocal({ titleWrapperMarginTop: e.target.value })}
                              placeholder="e.g. 1rem, 20px"
                            />
                          </div>
                          <div className="space-y-4">
                            <Label>Title Wrapper Margin Bottom</Label>
                            <Input 
                              value={localSection.settings.titleWrapperMarginBottom || ""}
                              onChange={(e) => updateSettingsLocal({ titleWrapperMarginBottom: e.target.value })}
                              placeholder="e.g. 1rem, 20px"
                            />
                          </div>
                        </div>

                        {/* Title Decoration Settings */}
                        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-border/50">
                          <Label className="text-sm font-semibold mb-4 block">Title Decoration</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <Label>Decoration Type</Label>
                              <Select 
                                value={localSection.settings.titleDecorationType || "none"} 
                                onValueChange={(val: any) => updateSettingsLocal({ titleDecorationType: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="icon">Icon Only</SelectItem>
                                  <SelectItem value="line-icon-line">Line - Icon - Line</SelectItem>
                                  <SelectItem value="image">Custom Image</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {localSection.settings.titleDecorationType && localSection.settings.titleDecorationType !== 'none' && (
                              <>
                                <div className="space-y-4">
                                  <Label>Position</Label>
                                  <Select 
                                    value={localSection.settings.titleDecorationPosition || "top"} 
                                    onValueChange={(val: any) => updateSettingsLocal({ titleDecorationPosition: val })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="top">Top</SelectItem>
                                      <SelectItem value="bottom">Bottom</SelectItem>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {localSection.settings.titleDecorationType !== 'image' && (
                                  <div className="space-y-4">
                                    <Label>Icon</Label>
                                    <Select 
                                      value={localSection.settings.titleDecorationIcon || "zap"} 
                                      onValueChange={(val) => updateSettingsLocal({ titleDecorationIcon: val })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="zap">Zap / Lightning</SelectItem>
                                        <SelectItem value="star">Star</SelectItem>
                                        <SelectItem value="crown">Crown</SelectItem>
                                        <SelectItem value="swords">Swords</SelectItem>
                                        <SelectItem value="skull">Skull</SelectItem>
                                        <SelectItem value="crosshair">Crosshair</SelectItem>
                                        <SelectItem value="shield">Shield</SelectItem>
                                        <SelectItem value="trophy">Trophy</SelectItem>
                                        <SelectItem value="flame">Flame</SelectItem>
                                        <SelectItem value="gamepad">Gamepad</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                {localSection.settings.titleDecorationType === 'image' && (
                                  <div className="space-y-4">
                                    <Label>Image URL</Label>
                                    <div className="flex gap-2">
                                      <Input 
                                        value={localSection.settings.titleDecorationImage || ''} 
                                        onChange={(e) => updateSettingsLocal({ titleDecorationImage: e.target.value })}
                                        placeholder="https://..."
                                      />
                                      <Button 
                                        variant="outline" 
                                        size="icon"
                                        onClick={() => openMediaPicker((url) => updateSettingsLocal({ titleDecorationImage: url }))}
                                        title="Select from Media Library"
                                      >
                                        <ImagePlus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-4">
                                  <Label>Decoration Color</Label>
                                  <div className="flex gap-2 items-center">
                                    <Input 
                                      type="color" 
                                      className="w-12 h-8 p-1"
                                      value={localSection.settings.titleDecorationColor || localSection.settings.titleColor || '#ffffff'}
                                      onChange={(e) => updateSettingsLocal({ titleDecorationColor: e.target.value })}
                                    />
                                    <Input 
                                      value={localSection.settings.titleDecorationColor || ''} 
                                      onChange={(e) => updateSettingsLocal({ titleDecorationColor: e.target.value })}
                                      placeholder="Inherit"
                                      className="font-mono"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <Label>Decoration Size</Label>
                                  <Input 
                                    value={localSection.settings.titleDecorationSize || ''} 
                                    onChange={(e) => updateSettingsLocal({ titleDecorationSize: e.target.value })}
                                    placeholder="e.g. 2rem, 32px (Default: 2rem)"
                                    className="font-mono"
                                  />
                                </div>

                                <div className="space-y-4">
                                  <Label>Decoration Padding</Label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">Top</Label>
                                      <Input 
                                        value={localSection.settings.titleDecorationPaddingTop || ""}
                                        onChange={(e) => updateSettingsLocal({ titleDecorationPaddingTop: e.target.value })}
                                        placeholder="e.g. 1rem"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">Bottom</Label>
                                      <Input 
                                        value={localSection.settings.titleDecorationPaddingBottom || ""}
                                        onChange={(e) => updateSettingsLocal({ titleDecorationPaddingBottom: e.target.value })}
                                        placeholder="e.g. 1rem"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <Label>Decoration Margin</Label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">Top</Label>
                                      <Input 
                                        value={localSection.settings.titleDecorationMarginTop || ""}
                                        onChange={(e) => updateSettingsLocal({ titleDecorationMarginTop: e.target.value })}
                                        placeholder="e.g. 1rem"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs text-muted-foreground">Bottom</Label>
                                      <Input 
                                        value={localSection.settings.titleDecorationMarginBottom || ""}
                                        onChange={(e) => updateSettingsLocal({ titleDecorationMarginBottom: e.target.value })}
                                        placeholder="e.g. 1rem"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Subtitle Settings */}
                        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-border/50">
                          <Label className="text-sm font-semibold mb-4 block">Subtitle Settings</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <Label>Subtitle Size</Label>
                              <Input 
                                value={localSection.settings.subtitleFontSize || ""}
                                onChange={(e) => updateSettingsLocal({ subtitleFontSize: e.target.value })}
                                placeholder="e.g. 1.5rem, 24px, text-xl"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Weight</Label>
                              <Select 
                                value={localSection.settings.subtitleFontWeight || "font-normal"} 
                                onValueChange={(val) => updateSettingsLocal({ subtitleFontWeight: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="font-light">Light</SelectItem>
                                  <SelectItem value="font-normal">Normal</SelectItem>
                                  <SelectItem value="font-medium">Medium</SelectItem>
                                  <SelectItem value="font-semibold">Semibold</SelectItem>
                                  <SelectItem value="font-bold">Bold</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Color</Label>
                              <div className="flex gap-2 items-center">
                                <Input 
                                  type="color" 
                                  className="w-12 h-8 p-1"
                                  value={localSection.settings.subtitleColor || '#9ca3af'}
                                  onChange={(e) => updateSettingsLocal({ subtitleColor: e.target.value })}
                                />
                                <Input 
                                  value={localSection.settings.subtitleColor || ''} 
                                  onChange={(e) => updateSettingsLocal({ subtitleColor: e.target.value })}
                                  placeholder="#9ca3af"
                                  className="font-mono"
                                />
                              </div>
                            </div>
                             <div className="space-y-4">
                              <Label>Subtitle Transform</Label>
                              <Select 
                                value={localSection.settings.subtitleTransform || "none"} 
                                onValueChange={(val: any) => updateSettingsLocal({ subtitleTransform: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="uppercase">Uppercase</SelectItem>
                                  <SelectItem value="capitalize">Capitalize</SelectItem>
                                  <SelectItem value="lowercase">Lowercase</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Line Height</Label>
                              <Input 
                                value={localSection.settings.subtitleLineHeight || ""}
                                onChange={(e) => updateSettingsLocal({ subtitleLineHeight: e.target.value })}
                                placeholder="e.g. 1.5, 150%"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Letter Spacing</Label>
                              <Input 
                                value={localSection.settings.subtitleLetterSpacing || ""}
                                onChange={(e) => updateSettingsLocal({ subtitleLetterSpacing: e.target.value })}
                                placeholder="e.g. 0.05em, 1px"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Padding Top</Label>
                              <Input 
                                value={localSection.settings.subtitlePaddingTop || ""}
                                onChange={(e) => updateSettingsLocal({ subtitlePaddingTop: e.target.value })}
                                placeholder="e.g. 1rem, 10px"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Padding Bottom</Label>
                              <Input 
                                value={localSection.settings.subtitlePaddingBottom || ""}
                                onChange={(e) => updateSettingsLocal({ subtitlePaddingBottom: e.target.value })}
                                placeholder="e.g. 1rem, 10px"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Margin Top</Label>
                              <Input 
                                value={localSection.settings.subtitleMarginTop || ""}
                                onChange={(e) => updateSettingsLocal({ subtitleMarginTop: e.target.value })}
                                placeholder="e.g. 1rem, 10px"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Subtitle Margin Bottom</Label>
                              <Input 
                                value={localSection.settings.subtitleMarginBottom || ""}
                                onChange={(e) => updateSettingsLocal({ subtitleMarginBottom: e.target.value })}
                                placeholder="e.g. 1rem, 10px"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Body Text Settings */}
                        <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-border/50">
                          <Label className="text-sm font-semibold mb-4 block">Body Text Settings</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <Label>Body Font Size</Label>
                              <Input 
                                value={localSection.settings.bodyFontSize || ""}
                                onChange={(e) => updateSettingsLocal({ bodyFontSize: e.target.value })}
                                placeholder="e.g. 1rem, 16px"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Body Font Weight</Label>
                              <Select 
                                value={localSection.settings.bodyFontWeight || "font-normal"} 
                                onValueChange={(val) => updateSettingsLocal({ bodyFontWeight: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="font-light">Light</SelectItem>
                                  <SelectItem value="font-normal">Normal</SelectItem>
                                  <SelectItem value="font-medium">Medium</SelectItem>
                                  <SelectItem value="font-semibold">Semibold</SelectItem>
                                  <SelectItem value="font-bold">Bold</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-4">
                              <Label>Body Line Height</Label>
                              <Input 
                                value={localSection.settings.bodyLineHeight || ""}
                                onChange={(e) => updateSettingsLocal({ bodyLineHeight: e.target.value })}
                                placeholder="e.g. 1.6, 160%"
                              />
                            </div>
                            <div className="space-y-4">
                              <Label>Body Letter Spacing</Label>
                              <Input 
                                value={localSection.settings.bodyLetterSpacing || ""}
                                onChange={(e) => updateSettingsLocal({ bodyLetterSpacing: e.target.value })}
                                placeholder="e.g. 0.02em"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        Colors & Background
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <Label>Text Color</Label>
                        <div className="flex gap-2 items-center">
                          <Input 
                            type="color" 
                            className="w-12 h-8 p-1"
                            value={localSection.settings.textColor || '#000000'}
                            onChange={(e) => updateSettingsLocal({ textColor: e.target.value })}
                          />
                          <Input 
                            value={localSection.settings.textColor || ''} 
                            onChange={(e) => updateSettingsLocal({ textColor: e.target.value })}
                            placeholder="#000000"
                            className="font-mono"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => updateSettingsLocal({ textColor: undefined })}
                            title="Reset to default"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Background Type</Label>
                        <Select 
                          value={localSection.settings.background?.type || 'color'} 
                          onValueChange={(val: BackgroundSettings['type']) => updateBackground({ type: val })}
                      >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="color">Solid Color</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {localSection.settings.background?.type === 'gradient' && (
                        <div className="space-y-4">
                          <Label>Gradient Settings</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs">From Color</Label>
                              <div className="flex gap-2">
                                <Input 
                                  type="color" 
                                  className="w-8 h-8 p-1"
                                  value={localSection.settings.background?.gradientFrom || '#000000'}
                                  onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                                />
                                <Input 
                                  value={localSection.settings.background?.gradientFrom || ''} 
                                  onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                                  placeholder="#000000"
                                  className="font-mono text-xs"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">To Color</Label>
                              <div className="flex gap-2">
                                <Input 
                                  type="color" 
                                  className="w-8 h-8 p-1"
                                  value={localSection.settings.background?.gradientTo || '#000000'}
                                  onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                                />
                                <Input 
                                  value={localSection.settings.background?.gradientTo || ''} 
                                  onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                                  placeholder="#000000"
                                  className="font-mono text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 mt-2">
                             <Label>Direction</Label>
                             <Select 
                                value={localSection.settings.background?.gradientDirection || 'to bottom'} 
                                onValueChange={(val) => updateBackground({ gradientDirection: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="to top">To Top</SelectItem>
                                  <SelectItem value="to right">To Right</SelectItem>
                                  <SelectItem value="to bottom">To Bottom</SelectItem>
                                  <SelectItem value="to left">To Left</SelectItem>
                                  <SelectItem value="to top right">To Top Right</SelectItem>
                                  <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                                  <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                                  <SelectItem value="to top left">To Top Left</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <Label>Texture Overlay</Label>
                          <Switch 
                            checked={localSection.settings.background?.textureEnabled || false}
                            onCheckedChange={(checked) => updateBackground({ textureEnabled: checked })}
                          />
                        </div>
                        {localSection.settings.background?.textureEnabled && (
                           <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label className="text-xs">Texture Opacity</Label>
                              <span className="text-xs text-muted-foreground">{localSection.settings.background?.textureOpacity ?? 10}%</span>
                            </div>
                            <Slider 
                              min={0} 
                              max={100} 
                              step={5} 
                              value={[localSection.settings.background?.textureOpacity ?? 10]}
                              onValueChange={([val]) => updateBackground({ textureOpacity: val })}
                            />
                          </div>
                        )}
                      </div>

                      {localSection.type === 'hero' && (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <Label>Overlay Opacity (%)</Label>
                            <span className="text-xs text-muted-foreground">{localSection.settings.overlayOpacity ?? 60}%</span>
                          </div>
                          <Slider 
                            min={0} 
                            max={100} 
                            step={5} 
                            value={[localSection.settings.overlayOpacity ?? 60]}
                            onValueChange={([val]) => updateSettingsLocal({ overlayOpacity: val })}
                          />
                        </div>
                      )}

                      {localSection.settings.background?.type === 'color' && (
                        <div className="space-y-4">
                          <Label>Background Color</Label>
                          <div className="flex gap-2 items-center">
                            <Input 
                              type="color" 
                              className="w-12 h-8 p-1"
                              value={localSection.settings.background?.color || '#ffffff'}
                              onChange={(e) => updateBackground({ color: e.target.value })}
                            />
                            <Input 
                              value={localSection.settings.background?.color || ''} 
                              onChange={(e) => updateBackground({ color: e.target.value })}
                              placeholder="#ffffff"
                              className="font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {localSection.settings.background?.type === 'image' && (
                        <>
                          <div className="space-y-2">
                            <Label>Background Image</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={localSection.settings.background?.image || ''} 
                                onChange={(e) => updateBackground({ image: e.target.value })}
                                placeholder="https://..."
                              />
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openMediaPicker((url) => updateBackground({ image: url }))}
                                title="Select from Media Library"
                              >
                                <ImagePlus className="w-4 h-4" />
                              </Button>
                              <FileUpload 
                                onUploadComplete={(url) => updateBackground({ image: url })}
                                variant="button"
                              />
                              <ServerFilePicker 
                                onSelect={(url) => updateBackground({ image: url })}
                                accept="image"
                                trigger={
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    title="Select from Uploads"
                                  >
                                    <ImageIcon className="w-4 h-4" />
                                  </Button>
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Image Visibility (Opacity)</Label>
                              <span className="text-xs text-muted-foreground">{localSection.settings.background?.opacity ?? 1}</span>
                            </div>
                            <Slider 
                              min={0} 
                              max={1} 
                              step={0.1} 
                              value={[localSection.settings.background?.opacity ?? 1]}
                              onValueChange={([val]) => updateBackground({ opacity: val })}
                            />
                          </div>
                        </>
                      )}

                      {localSection.settings.background?.type === 'video' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Background Video</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={localSection.settings.background?.videoUrl || ''} 
                                onChange={(e) => updateBackground({ videoUrl: e.target.value })}
                                placeholder="https://... (mp4, webm)"
                              />
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openMediaPicker((url) => updateBackground({ videoUrl: url }), 'video')}
                                title="Select from Media Library"
                              >
                                <Video className="w-4 h-4" />
                              </Button>
                              <FileUpload 
                                onUploadComplete={(url) => updateBackground({ videoUrl: url })}
                                accept="video/*"
                                variant="button"
                              />
                              <ServerFilePicker 
                                onSelect={(url) => updateBackground({ videoUrl: url })}
                                accept="video"
                                trigger={
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    title="Select from Uploads"
                                  >
                                    <Video className="w-4 h-4" />
                                  </Button>
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Video Controls</Label>
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center gap-1">
                                <Button
                                  variant={localSection.settings.background?.muted !== false ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => updateBackground({ muted: localSection.settings.background?.muted === false })}
                                  title="Toggle Mute"
                                >
                                  {localSection.settings.background?.muted !== false ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                                <span className="text-[10px] text-muted-foreground">Mute</span>
                              </div>

                              <div className="flex flex-col items-center gap-1">
                                <Button
                                  variant={localSection.settings.background?.autoplay !== false ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => updateBackground({ autoplay: localSection.settings.background?.autoplay === false })}
                                  title="Toggle Autoplay"
                                >
                                  <PlayCircle className="h-4 w-4" />
                                </Button>
                                <span className="text-[10px] text-muted-foreground">Autoplay</span>
                              </div>

                              <div className="flex flex-col items-center gap-1">
                                <Button
                                  variant={localSection.settings.background?.loop !== false ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => updateBackground({ loop: localSection.settings.background?.loop === false })}
                                  title="Toggle Loop"
                                >
                                  <Repeat className="h-4 w-4" />
                                </Button>
                                <span className="text-[10px] text-muted-foreground">Loop</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Overlay Opacity</Label>
                              <span className="text-xs text-muted-foreground">{localSection.settings.background?.opacity ?? 1}</span>
                            </div>
                            <Slider 
                              min={0} 
                              max={1} 
                              step={0.1} 
                              value={[localSection.settings.background?.opacity ?? 1]}
                              onValueChange={([val]) => updateBackground({ opacity: val })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Scroll Indicator moved to Effects tab */}
                </TabsContent>

                <TabsContent value="effects" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MonitorPlay className="w-4 h-4 text-primary" />
                        Animation Effects
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <Label>Animation Type</Label>
                        <Select 
                          value={localSection.settings.animation?.type || 'none'} 
                          onValueChange={(val) => updateAnimation({ type: val as NonNullable<CustomSection['settings']['animation']>['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="fade">Fade In</SelectItem>
                            <SelectItem value="slide-up">Slide Up</SelectItem>
                            <SelectItem value="slide-down">Slide Down</SelectItem>
                            <SelectItem value="slide-left">Slide Left</SelectItem>
                            <SelectItem value="slide-right">Slide Right</SelectItem>
                            <SelectItem value="zoom">Zoom In</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {localSection.settings.animation?.type && localSection.settings.animation.type !== 'none' && (
                        <>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Duration (seconds)</Label>
                              <span className="text-xs text-muted-foreground">{localSection.settings.animation?.duration || 0.5}s</span>
                            </div>
                            <Slider 
                              min={0.1} 
                              max={3} 
                              step={0.1} 
                              value={[localSection.settings.animation?.duration || 0.5]}
                              onValueChange={([val]) => updateAnimation({ duration: val })}
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Delay (seconds)</Label>
                              <span className="text-xs text-muted-foreground">{localSection.settings.animation?.delay || 0}s</span>
                            </div>
                            <Slider 
                              min={0} 
                              max={2} 
                              step={0.1} 
                              value={[localSection.settings.animation?.delay || 0]}
                              onValueChange={([val]) => updateAnimation({ delay: val })}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-primary" />
                        Scroll Indicator
                      </CardTitle>
                      <CardDescription>
                        Add a button to encourage scrolling.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label>Enable Indicator</Label>
                        <Switch
                          checked={localSection.settings.scrollIndicator?.enabled || false}
                          onCheckedChange={(checked) => updateScrollIndicator({ enabled: checked })}
                        />
                      </div>

                      {localSection.settings.scrollIndicator?.enabled && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Animation Style</Label>
                              <Select
                                value={localSection.settings.scrollIndicator?.style || 'bounce'}
                                onValueChange={(val) => updateScrollIndicator({ style: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bounce">Bounce</SelectItem>
                                  <SelectItem value="pulse">Pulse</SelectItem>
                                  <SelectItem value="static">Static</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Icon</Label>
                              <Select
                                value={localSection.settings.scrollIndicator?.icon || 'chevron-down'}
                                onValueChange={(val) => updateScrollIndicator({ icon: val })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="chevron-down">Chevron Down</SelectItem>
                                  <SelectItem value="arrow-down">Arrow Down</SelectItem>
                                  <SelectItem value="mouse">Mouse</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Color Class</Label>
                            <Input
                              value={localSection.settings.scrollIndicator?.color || 'text-muted-foreground'}
                              onChange={(e) => updateScrollIndicator({ color: e.target.value })}
                              placeholder="e.g. text-white, text-primary"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <Label>Opacity</Label>
                              <span className="text-xs text-muted-foreground">{localSection.settings.scrollIndicator?.opacity ?? 1}</span>
                            </div>
                            <Slider
                              min={0}
                              max={1}
                              step={0.1}
                              value={[localSection.settings.scrollIndicator?.opacity ?? 1]}
                              onValueChange={([val]) => updateScrollIndicator({ opacity: val })}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Bottom Position</Label>
                                <Input
                                value={localSection.settings.scrollIndicator?.position?.bottom || '2rem'}
                                onChange={(e) => {
                                    const currentPos = localSection.settings.scrollIndicator?.position || {};
                                    updateScrollIndicator({ position: { ...currentPos, bottom: e.target.value } });
                                }}
                                placeholder="e.g. 2rem, 10%"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Alignment</Label>
                                <Select
                                value={localSection.settings.scrollIndicator?.position?.align || 'center'}
                                onValueChange={(val: any) => {
                                    const currentPos = localSection.settings.scrollIndicator?.position || {};
                                    updateScrollIndicator({ position: { ...currentPos, align: val } });
                                }}
                                >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary" />
                        Advanced
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Custom CSS</Label>
                        <Textarea 
                          value={localSection.settings.customCss || ''} 
                          onChange={(e) => updateSettingsLocal({ customCss: e.target.value })}
                          placeholder=".section-class { ... }"
                          className="font-mono text-sm min-h-[200px]"
                        />
                        <p className="text-xs text-muted-foreground">Scoped to this section.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted m-4">
            <Layout className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">No Section Selected</h3>
            <p className="text-sm max-w-sm text-center mb-6">
              Select a section from the list on the left to edit, or create a new section to get started.
            </p>
            <Button onClick={handleCreateSection}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Section
            </Button>
          </div>
        )}
      </div>
      {/* Preview Modal */}
      {showPreview && localSection && (
        <div className="fixed inset-0 z-50 bg-background/95 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Preview: {localSection.name}</h2>
            <Button variant="ghost" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-background/50">
            <div className="min-h-full flex flex-col justify-center">
              <CustomSectionRenderer section={localSection} />
            </div>
          </div>
        </div>
      )}

      <MediaPickerModal 
        isOpen={mediaPickerOpen} 
        onClose={() => setMediaPickerOpen(false)} 
        type={mediaPickerType}
        onSelect={(url) => {
          mediaPickerCallback(url);
        }} 
      />
    </div>
  );
}

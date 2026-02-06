import { useState, useEffect, useRef } from "react";
import { 
  Plus, Trash2, Layout, Type, Palette, 
  Image as ImageIcon, Code, MousePointerClick, 
  Settings, MonitorPlay, ChevronDown, ImagePlus, 
  Eraser, Video, Volume2, VolumeX, PlayCircle, 
  Repeat, StopCircle, Check, X, AlignLeft, AlignCenter, 
  AlignRight, Bold, Italic, Underline, Link as LinkIcon,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FileUpload } from "@/components/ui/file-upload";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import { MediaPickerModal } from "@/components/admin/modals/MediaPickerModal";
import { ServerFilePicker } from "@/components/admin/server-file-picker";

type ContentItem = NewsItem | ClassItem | MediaItem | FeatureItem | WeaponItem | MapItem | GameDeviceItem;

interface SectionEditorProps {
  section: CustomSection;
  onChange: (updates: Partial<CustomSection>) => void;
  headerActions?: React.ReactNode;
}

export function SectionEditor({ section, onChange, headerActions }: SectionEditorProps) {
  const { news, classes, media, features, weapons, maps, gameDevices, roadmap } = useContent();
  const [activeTab, setActiveTab] = useState("content");
  
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

  // Safe settings access
  const safeSettings = section.settings || {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    containerWidth: 'default',
    background: { type: 'color', color: 'transparent', opacity: 1 }
  };

  const safeBackground = safeSettings.background || { type: 'color', color: 'transparent', opacity: 1 };

  // Helpers
  const updateContent = (updates: Partial<CustomSection['content']>) => {
    onChange({
      content: { ...section.content, ...updates }
    });
  };

  const updateSettings = (updates: Partial<CustomSection['settings']>) => {
    onChange({
      settings: { ...safeSettings, ...updates }
    });
  };

  const updateBackground = (updates: Partial<BackgroundSettings>) => {
    onChange({
      settings: {
        ...safeSettings,
        background: { ...safeBackground, ...updates }
      }
    });
  };

  const updateAnimation = (updates: Partial<NonNullable<CustomSection['settings']['animation']>>) => {
    onChange({
      settings: {
        ...safeSettings,
        animation: { ...(safeSettings.animation || { type: 'none' }), ...updates }
      }
    });
  };

  // Button management
  const addButton = () => {
    const currentButtons = section.content.buttons || [];
    updateContent({
      buttons: [...currentButtons, { text: "Click Me", url: "#", variant: "primary" }]
    });
  };

  const updateButton = (index: number, updates: Partial<HeroButton>) => {
    const newButtons = [...(section.content.buttons || [])];
    
    // Check if we need to auto-adjust width
    if (updates.width || updates.text || updates.icon) {
      const btn = { ...newButtons[index], ...updates };
      
      if (btn.width && measureRef.current) {
        const isPxOrNumber = /^[+-]?\d+(\.\d+)?(px)?$/.test(btn.width.trim());
        
        if (isPxOrNumber) {
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
          
          if (currentWidthVal < minWidth && (updates.text || updates.icon)) {
             updates.width = `${minWidth}px`;
          }
        }
      }
    }

    newButtons[index] = { ...newButtons[index], ...updates };
    updateContent({ buttons: newButtons });
  };
  
  const checkButtonWidthOnBlur = (index: number) => {
    if (!section.content.buttons) return;
    const btn = section.content.buttons[index];
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
    const newButtons = (section.content.buttons || []).filter((_, i) => i !== index);
    updateContent({ buttons: newButtons });
  };

  const updateScrollIndicator = (updates: any) => {
    const current = safeSettings.scrollIndicator || {
      enabled: false,
      style: 'bounce',
      icon: 'chevron-down',
      color: 'text-muted-foreground'
    };
    updateSettings({
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

  return (
    <div className="h-full flex flex-col gap-4">
      <MediaPickerModal 
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={mediaPickerCallback}
        type={mediaPickerType}
      />
      
      {/* Hidden measurement element */}
      <div 
        ref={measureRef} 
        className="absolute opacity-0 pointer-events-none whitespace-nowrap font-heading text-lg uppercase tracking-wide px-8 border border-transparent"
        style={{ visibility: 'hidden', height: 0, overflow: 'hidden', left: -9999 }}
      ></div>

      {/* Toolbar */}
      <Card className="border-border/50 shadow-sm shrink-0">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:w-auto flex gap-4 items-center">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Section Name</Label>
              <Input 
                value={section.name} 
                onChange={(e) => onChange({ name: e.target.value })}
                className="h-8"
              />
            </div>
            <div className="w-[150px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Type</Label>
              <Select 
                value={section.type} 
                onValueChange={(val: CustomSection['type']) => {
                   const updates: Partial<CustomSection> = { type: val };
                   if (val === 'dynamic-content' && !section.content.dynamicSources) {
                      updates.content = {
                        ...section.content,
                        dynamicSources: [{
                          type: 'news',
                          displayMode: 'grid',
                          count: 3
                        }]
                      };
                   }
                   onChange(updates);
                }}
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
          {headerActions && (
            <div className="flex items-end gap-2">
              {headerActions}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-2 px-1">
          <TabsList>
            {section.type === 'dynamic-content' && (
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
            {section.type === 'dynamic-content' && (
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
                  {(section.content.dynamicSources || []).map((source: DynamicContentSource, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg bg-muted/30 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const newSources = [...(section.content.dynamicSources || [])];
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
                              const newSources = [...(section.content.dynamicSources || [])];
                              
                              let defaultMode = 'grid';
                              let defaultCount = 3;

                              switch(val) {
                                case 'news': defaultMode = 'grid'; defaultCount = 3; break;
                                case 'classes': defaultMode = 'list'; defaultCount = 10; break;
                                case 'features': defaultMode = 'grid'; defaultCount = 6; break;
                                case 'media': defaultMode = 'grid'; defaultCount = 8; break;
                                case 'weapons':
                                case 'gameDevices': defaultMode = 'grid'; defaultCount = 8; break;
                                case 'maps': defaultMode = 'grid'; defaultCount = 4; break;
                                case 'faq': defaultMode = 'accordion'; defaultCount = 10; break;
                                case 'gamemodetab': defaultMode = 'grid'; defaultCount = 8; break;
                                case 'roadmap': defaultMode = 'grid'; defaultCount = 4; break;
                              }

                              newSources[idx] = { 
                                ...newSources[idx], 
                                type: val,
                                displayMode: defaultMode,
                                count: defaultCount,
                                ids: undefined
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
                              <SelectItem value="faq">FAQ</SelectItem>
                              <SelectItem value="gamemodetab">Game Modes</SelectItem>
                              <SelectItem value="roadmap">Roadmap</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Display Mode</Label>
                          <Select
                            value={source.displayMode}
                            onValueChange={(val) => {
                              const newSources = [...(section.content.dynamicSources || [])];
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
                              <SelectItem value="featured">Featured</SelectItem>
                              {source.type === 'roadmap' && (
                                <>
                                  <SelectItem value="timeline">Timeline</SelectItem>
                                  <SelectItem value="showcase">Showcase</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {['news', 'features', 'media'].includes(source.type) && (
                          <div className="space-y-2">
                            <Label>Card Style</Label>
                            <Select
                              value={source.cardStyle || 'default'}
                              onValueChange={(val) => {
                                const newSources = [...(section.content.dynamicSources || [])];
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

                        {source.type === 'roadmap' && (
                          <div className="space-y-2">
                            <Label>Filter by Category</Label>
                            <Select
                              value={source.category || 'all'}
                              onValueChange={(val) => {
                                const newSources = [...(section.content.dynamicSources || [])];
                                newSources[idx] = { ...newSources[idx], category: val === 'all' ? undefined : val };
                                updateContent({ dynamicSources: newSources });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {Array.from(new Set(roadmap?.map(i => i.category).filter(Boolean))).map(cat => (
                                  <SelectItem key={cat as string} value={cat as string}>
                                    {cat as string}
                                  </SelectItem>
                                ))}
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
                                  const newSources = [...(section.content.dynamicSources || [])];
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
                          <div className="flex items-center justify-between">
                            <Label>Max Items</Label>
                            {['news', 'media'].includes(source.type) && (
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`all-items-${idx}`} 
                                  checked={source.fetchAll || false}
                                  onCheckedChange={(checked) => {
                                    const newSources = [...(section.content.dynamicSources || [])];
                                    newSources[idx] = { ...newSources[idx], fetchAll: checked === true };
                                    updateContent({ dynamicSources: newSources });
                                  }}
                                />
                                <label 
                                  htmlFor={`all-items-${idx}`}
                                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  All Items
                                </label>
                              </div>
                            )}
                          </div>
                          <div className={cn("flex items-center gap-2", { "opacity-50 pointer-events-none": source.fetchAll })}>
                            <Slider
                              value={[source.count || 3]}
                              min={1}
                              max={20}
                              step={1}
                              onValueChange={(vals) => {
                                const newSources = [...(section.content.dynamicSources || [])];
                                newSources[idx] = { ...newSources[idx], count: vals[0] };
                                updateContent({ dynamicSources: newSources });
                              }}
                              className="flex-1"
                            />
                            <span className="text-sm w-8 text-right">{source.count || 3}</span>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label>Specific Items (Optional)</Label>
                          <ScrollArea className="h-[150px] border rounded-md p-2">
                            <div className="space-y-2">
                              {(() => {
                                let items: ContentItem[] = [];
                                switch(source.type) {
                                  case 'news': items = news; break;
                                  case 'classes': items = classes; break;
                                  case 'media': items = media; break;
                                  case 'features': items = features; break;
                                  case 'weapons': items = weapons; break;
                                  case 'maps': items = maps; break;
                                  case 'gameDevices': items = gameDevices; break;
                                }
                                
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
                                           const newSources = [...(section.content.dynamicSources || [])];
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
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2 pt-2 border-t border-border/50">
                          <Label className="flex justify-between">
                            Title Override (Optional)
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">HTML Supported</span>
                          </Label>
                          <Textarea
                            value={source.title || ''}
                            onChange={(e) => {
                              const newSources = [...(section.content.dynamicSources || [])];
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
                      const currentSources = section.content.dynamicSources || [];
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
            {section.type !== 'html' && (
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
                      value={section.content.title || ''} 
                      onChange={(e) => updateContent({ title: e.target.value })}
                      placeholder="Section Title"
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input 
                      value={section.content.subtitle || ''} 
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
                      value={section.content.description || ''} 
                      onChange={(e) => updateContent({ description: e.target.value })}
                      placeholder="<p>Enter your content here...</p>"
                      className="font-mono text-sm min-h-[150px]"
                    />
                    <p className="text-xs text-muted-foreground">HTML tags are allowed.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom HTML Editor */}
            {section.type === 'html' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    Custom HTML
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    value={section.content.description || ''} 
                    onChange={(e) => updateContent({ description: e.target.value })}
                    placeholder="<div>Your custom HTML here...</div>"
                    className="font-mono text-sm min-h-[300px]"
                  />
                </CardContent>
              </Card>
            )}

            {/* Buttons (Hero/CTA) */}
            {(section.type === 'hero' || section.type === 'cta') && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-primary" />
                    Action Buttons
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={addButton}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Button
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(section.content.buttons || []).map((btn, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-muted/30 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeButton(idx)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Button Text</Label>
                          <Input 
                            value={btn.text} 
                            onChange={(e) => updateButton(idx, { text: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>URL</Label>
                          <div className="flex gap-2">
                            <Input 
                              value={btn.url} 
                              onChange={(e) => updateButton(idx, { url: e.target.value })}
                            />
                            {/* Link Picker could go here */}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Style Variant</Label>
                          <Select 
                            value={btn.variant} 
                            onValueChange={(val: any) => updateButton(idx, { variant: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">Secondary</SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="ghost">Ghost</SelectItem>
                              <SelectItem value="link">Link</SelectItem>
                              <SelectItem value="destructive">Destructive</SelectItem>
                              <SelectItem value="glow">Glow</SelectItem>
                              <SelectItem value="glass">Glass</SelectItem>
                              <SelectItem value="soft">Soft</SelectItem>
                              <SelectItem value="outline-glow">Outline Glow</SelectItem>
                              <SelectItem value="neo">Neo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select 
                            value={btn.icon || 'none'} 
                            onValueChange={(val: any) => updateButton(idx, { icon: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="play">Play Circle</SelectItem>
                              <SelectItem value="download">Download</SelectItem>
                              <SelectItem value="arrow-right">Arrow Right</SelectItem>
                              <SelectItem value="external-link">External Link</SelectItem>
                              <SelectItem value="steam">Steam</SelectItem>
                              <SelectItem value="discord">Discord</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Width (Optional)</Label>
                          <Input 
                            value={btn.width || ''} 
                            onChange={(e) => updateButton(idx, { width: e.target.value })}
                            onBlur={() => checkButtonWidthOnBlur(idx)}
                            placeholder="e.g. 200px (leave empty for auto)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Height (Optional)</Label>
                          <Input 
                            value={btn.height || ''} 
                            onChange={(e) => updateButton(idx, { height: e.target.value })}
                            placeholder="e.g. 56px (leave empty for default)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Font Size (Optional)</Label>
                          <Input 
                            value={btn.fontSize || ''} 
                            onChange={(e) => updateButton(idx, { fontSize: e.target.value })}
                            placeholder="e.g. 1.1rem"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="design" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Type</Label>
                  <Select 
                    value={safeBackground.type} 
                    onValueChange={(val: any) => updateBackground({ type: val })}
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

                {safeBackground.type === 'gradient' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Color</Label>
                             <div className="flex gap-2">
                                <div className="w-8 h-8 rounded border shrink-0" style={{ background: safeBackground.gradientFrom || 'transparent' }} />
                                <Input value={safeBackground.gradientFrom || ''} onChange={(e) => updateBackground({ gradientFrom: e.target.value })} placeholder="#000000" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>To Color</Label>
                             <div className="flex gap-2">
                                <div className="w-8 h-8 rounded border shrink-0" style={{ background: safeBackground.gradientTo || 'transparent' }} />
                                <Input value={safeBackground.gradientTo || ''} onChange={(e) => updateBackground({ gradientTo: e.target.value })} placeholder="#000000" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Direction</Label>
                        <Input value={safeBackground.gradientDirection || ''} onChange={(e) => updateBackground({ gradientDirection: e.target.value })} placeholder="to right bottom" />
                    </div>
                  </div>
                )}

                {safeBackground.type === 'color' && (
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ background: safeBackground.color }}
                      />
                      <Input 
                        value={safeBackground.color} 
                        onChange={(e) => updateBackground({ color: e.target.value })}
                        placeholder="#000000 or transparent"
                      />
                    </div>
                  </div>
                )}

                {(safeBackground.type === 'image' || safeBackground.type === 'video') && (
                  <div className="space-y-2">
                    <Label>{safeBackground.type === 'image' ? 'Image Source' : 'Video Source'}</Label>
                    <div className="flex gap-2 items-start">
                       <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Input 
                              value={safeBackground.type === 'image' ? (safeBackground.image || '') : (safeBackground.videoUrl || '')} 
                              onChange={(e) => updateBackground(safeBackground.type === 'image' ? { image: e.target.value } : { videoUrl: e.target.value })}
                              placeholder={safeBackground.type === 'image' ? "https://..." : "https://... (mp4/webm)"}
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openMediaPicker(
                                (url) => updateBackground(safeBackground.type === 'image' ? { image: url } : { videoUrl: url }), 
                                safeBackground.type as 'image' | 'video'
                              )}
                            >
                              {safeBackground.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                            </Button>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            <ServerFilePicker 
                                onSelect={(url) => updateBackground(safeBackground.type === 'image' ? { image: url } : { videoUrl: url })}
                                trigger={
                                  <Button variant="outline" size="sm" className="w-full">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Select from Uploads
                                  </Button>
                                }
                            />
                            <div className="flex-1">
                                <FileUpload 
                                    onUploadComplete={(url) => updateBackground(safeBackground.type === 'image' ? { image: url } : { videoUrl: url })}
                                    variant="button"
                                    className="w-full"
                                />
                            </div>
                          </div>
                       </div>
                    </div>
                    {safeBackground.type === 'image' && safeBackground.image && (
                      <div className="mt-2 aspect-video w-40 rounded-md overflow-hidden border bg-muted">
                        <img src={safeBackground.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Overlay Opacity ({safeSettings.overlayOpacity || 0}%)</Label>
                  <Slider
                    value={[safeSettings.overlayOpacity || 0]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(vals) => updateSettings({ overlayOpacity: vals[0] })}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                   <Label>Background Texture</Label>
                   <Switch 
                     checked={safeBackground.textureEnabled || false}
                     onCheckedChange={(checked) => updateBackground({ textureEnabled: checked })}
                   />
                </div>
                {safeBackground.textureEnabled && (
                    <div className="space-y-2">
                        <Label>Texture Opacity ({safeBackground.textureOpacity || 10}%)</Label>
                         <Slider
                            value={[safeBackground.textureOpacity || 10]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(vals) => updateBackground({ textureOpacity: vals[0] })}
                          />
                    </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 {/* Custom Fonts */}
                 <div className="space-y-4">
                    <Label className="text-sm font-semibold text-primary">Custom Font Import</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Font Family Name</Label>
                            <Input 
                                value={safeSettings.customFontName || ''} 
                                onChange={(e) => updateSettings({ customFontName: e.target.value })} 
                                placeholder="e.g. 'My Custom Font'" 
                            />
                            <p className="text-xs text-muted-foreground">The exact name to use in CSS font-family</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Font URL (CSS)</Label>
                            <Input 
                                value={safeSettings.customFontUrl || ''} 
                                onChange={(e) => updateSettings({ customFontUrl: e.target.value })} 
                                placeholder="https://fonts.googleapis.com/..." 
                            />
                            <p className="text-xs text-muted-foreground">Direct link to the CSS file (e.g. Google Fonts)</p>
                        </div>
                    </div>
                 </div>

                 {/* Title Settings */}
                 <div className="space-y-4">
                    <Label className="text-sm font-semibold text-primary">Title Styling</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Input value={safeSettings.titleFontSize || ''} onChange={(e) => updateSettings({ titleFontSize: e.target.value })} placeholder="e.g. 3rem" />
                        </div>
                         <div className="space-y-2">
                            <Label>Font Weight</Label>
                            <Select value={safeSettings.titleFontWeight || 'bold'} onValueChange={(v: any) => updateSettings({ titleFontWeight: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="extrabold">Extra Bold</SelectItem>
                                    <SelectItem value="black">Black</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select value={safeSettings.titleFontFamily || 'var(--font-heading)'} onValueChange={(v) => updateSettings({ titleFontFamily: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="var(--font-heading)">Theme Heading</SelectItem>
                                    <SelectItem value="var(--font-display)">Theme Display</SelectItem>
                                    <SelectItem value="var(--font-body)">Theme Body</SelectItem>
                                    <SelectItem value="'Anton', sans-serif">Anton</SelectItem>
                                    <SelectItem value="'Audiowide', cursive">Audiowide</SelectItem>
                                    <SelectItem value="'Bebas Neue', sans-serif">Bebas Neue</SelectItem>
                                    <SelectItem value="'Black Ops One', cursive">Black Ops One</SelectItem>
                                    <SelectItem value="'Bungee', cursive">Bungee</SelectItem>
                                    <SelectItem value="'Exo 2', sans-serif">Exo 2</SelectItem>
                                    <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                                    <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                                    <SelectItem value="'Nunito', sans-serif">Nunito</SelectItem>
                                    <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                                    <SelectItem value="'Orbitron', sans-serif">Orbitron</SelectItem>
                                    <SelectItem value="'Oswald', sans-serif">Oswald</SelectItem>
                                    <SelectItem value="'PT Sans', sans-serif">PT Sans</SelectItem>
                                    <SelectItem value="'Quantico', sans-serif">Quantico</SelectItem>
                                    <SelectItem value="'Rajdhani', sans-serif">Rajdhani</SelectItem>
                                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                                    <SelectItem value="'Russo One', sans-serif">Russo One</SelectItem>
                                    <SelectItem value="'Saira', sans-serif">Saira</SelectItem>
                                    <SelectItem value="'Source Sans 3', sans-serif">Source Sans 3</SelectItem>
                                    <SelectItem value="'Teko', sans-serif">Teko</SelectItem>
                                    <SelectItem value="'Titillium Web', sans-serif">Titillium Web</SelectItem>
                                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="monospace">Monospace</SelectItem>
                                    {safeSettings.customFontName && (
                                        <SelectItem value={safeSettings.customFontName}>Custom: {safeSettings.customFontName}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Style</Label>
                            <Select value={safeSettings.titleStyle || 'default'} onValueChange={(v: any) => updateSettings({ titleStyle: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="glow">Glow</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                    <SelectItem value="shadow">Shadow</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded border shrink-0" style={{ background: safeSettings.titleColor || 'currentColor' }} />
                                <Input value={safeSettings.titleColor || ''} onChange={(e) => updateSettings({ titleColor: e.target.value })} placeholder="inherit" />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <Label>Transform</Label>
                             <Select value={safeSettings.titleTransform || 'none'} onValueChange={(v: any) => updateSettings({ titleTransform: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="uppercase">Uppercase</SelectItem>
                                    <SelectItem value="lowercase">Lowercase</SelectItem>
                                    <SelectItem value="capitalize">Capitalize</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Line Height</Label>
                            <Input value={safeSettings.titleLineHeight || ''} onChange={(e) => updateSettings({ titleLineHeight: e.target.value })} placeholder="e.g. 1.2" />
                        </div>
                        <div className="space-y-2">
                            <Label>Letter Spacing</Label>
                            <Input value={safeSettings.titleLetterSpacing || ''} onChange={(e) => updateSettings({ titleLetterSpacing: e.target.value })} placeholder="e.g. -0.02em" />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2 pt-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Title Padding (Top, Right, Bottom, Left)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Input placeholder="Top" value={safeSettings.titlePaddingTop || ''} onChange={(e) => updateSettings({ titlePaddingTop: e.target.value })} />
                                <Input placeholder="Right" value={safeSettings.titlePaddingRight || ''} onChange={(e) => updateSettings({ titlePaddingRight: e.target.value })} />
                                <Input placeholder="Bottom" value={safeSettings.titlePaddingBottom || ''} onChange={(e) => updateSettings({ titlePaddingBottom: e.target.value })} />
                                <Input placeholder="Left" value={safeSettings.titlePaddingLeft || ''} onChange={(e) => updateSettings({ titlePaddingLeft: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2 pt-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Title Margin (Top, Right, Bottom, Left)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Input placeholder="Top" value={safeSettings.titleMarginTop || ''} onChange={(e) => updateSettings({ titleMarginTop: e.target.value })} />
                                <Input placeholder="Right" value={safeSettings.titleMarginRight || ''} onChange={(e) => updateSettings({ titleMarginRight: e.target.value })} />
                                <Input placeholder="Bottom" value={safeSettings.titleMarginBottom || ''} onChange={(e) => updateSettings({ titleMarginBottom: e.target.value })} />
                                <Input placeholder="Left" value={safeSettings.titleMarginLeft || ''} onChange={(e) => updateSettings({ titleMarginLeft: e.target.value })} />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Subtitle Settings */}
                 <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-semibold text-primary">Subtitle Styling</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Input value={safeSettings.subtitleFontSize || ''} onChange={(e) => updateSettings({ subtitleFontSize: e.target.value })} placeholder="e.g. 1.5rem" />
                        </div>
                         <div className="space-y-2">
                            <Label>Font Weight</Label>
                            <Select value={safeSettings.subtitleFontWeight || 'normal'} onValueChange={(v: any) => updateSettings({ subtitleFontWeight: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="extrabold">Extra Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select value={safeSettings.subtitleFontFamily || 'var(--font-heading)'} onValueChange={(v) => updateSettings({ subtitleFontFamily: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="var(--font-heading)">Theme Heading</SelectItem>
                                    <SelectItem value="var(--font-display)">Theme Display</SelectItem>
                                    <SelectItem value="var(--font-body)">Theme Body</SelectItem>
                                    <SelectItem value="'Anton', sans-serif">Anton</SelectItem>
                                    <SelectItem value="'Audiowide', cursive">Audiowide</SelectItem>
                                    <SelectItem value="'Bebas Neue', sans-serif">Bebas Neue</SelectItem>
                                    <SelectItem value="'Black Ops One', cursive">Black Ops One</SelectItem>
                                    <SelectItem value="'Bungee', cursive">Bungee</SelectItem>
                                    <SelectItem value="'Exo 2', sans-serif">Exo 2</SelectItem>
                                    <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                                    <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                                    <SelectItem value="'Nunito', sans-serif">Nunito</SelectItem>
                                    <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                                    <SelectItem value="'Orbitron', sans-serif">Orbitron</SelectItem>
                                    <SelectItem value="'Oswald', sans-serif">Oswald</SelectItem>
                                    <SelectItem value="'PT Sans', sans-serif">PT Sans</SelectItem>
                                    <SelectItem value="'Quantico', sans-serif">Quantico</SelectItem>
                                    <SelectItem value="'Rajdhani', sans-serif">Rajdhani</SelectItem>
                                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                                    <SelectItem value="'Russo One', sans-serif">Russo One</SelectItem>
                                    <SelectItem value="'Saira', sans-serif">Saira</SelectItem>
                                    <SelectItem value="'Source Sans 3', sans-serif">Source Sans 3</SelectItem>
                                    <SelectItem value="'Teko', sans-serif">Teko</SelectItem>
                                    <SelectItem value="'Titillium Web', sans-serif">Titillium Web</SelectItem>
                                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="monospace">Monospace</SelectItem>
                                    {safeSettings.customFontName && (
                                        <SelectItem value={safeSettings.customFontName}>Custom: {safeSettings.customFontName}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded border shrink-0" style={{ background: safeSettings.subtitleColor || 'transparent' }} />
                                <Input value={safeSettings.subtitleColor || ''} onChange={(e) => updateSettings({ subtitleColor: e.target.value })} placeholder="text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Transform</Label>
                            <Select value={safeSettings.subtitleTransform || 'none'} onValueChange={(v: any) => updateSettings({ subtitleTransform: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="uppercase">Uppercase</SelectItem>
                                    <SelectItem value="capitalize">Capitalize</SelectItem>
                                    <SelectItem value="lowercase">Lowercase</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2 pt-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Subtitle Padding (Top, Right, Bottom, Left)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Input placeholder="Top" value={safeSettings.subtitlePaddingTop || ''} onChange={(e) => updateSettings({ subtitlePaddingTop: e.target.value })} />
                                <Input placeholder="Right" value={safeSettings.subtitlePaddingRight || ''} onChange={(e) => updateSettings({ subtitlePaddingRight: e.target.value })} />
                                <Input placeholder="Bottom" value={safeSettings.subtitlePaddingBottom || ''} onChange={(e) => updateSettings({ subtitlePaddingBottom: e.target.value })} />
                                <Input placeholder="Left" value={safeSettings.subtitlePaddingLeft || ''} onChange={(e) => updateSettings({ subtitlePaddingLeft: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2 pt-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Subtitle Margin (Top, Right, Bottom, Left)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Input placeholder="Top" value={safeSettings.subtitleMarginTop || ''} onChange={(e) => updateSettings({ subtitleMarginTop: e.target.value })} />
                                <Input placeholder="Right" value={safeSettings.subtitleMarginRight || ''} onChange={(e) => updateSettings({ subtitleMarginRight: e.target.value })} />
                                <Input placeholder="Bottom" value={safeSettings.subtitleMarginBottom || ''} onChange={(e) => updateSettings({ subtitleMarginBottom: e.target.value })} />
                                <Input placeholder="Left" value={safeSettings.subtitleMarginLeft || ''} onChange={(e) => updateSettings({ subtitleMarginLeft: e.target.value })} />
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Body Settings */}
                 <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-semibold text-primary">Body / Description</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Font Size</Label>
                            <Input value={safeSettings.bodyFontSize || ''} onChange={(e) => updateSettings({ bodyFontSize: e.target.value })} placeholder="e.g. 1.125rem" />
                        </div>
                        <div className="space-y-2">
                            <Label>Font Weight</Label>
                             <Select value={safeSettings.bodyFontWeight || 'normal'} onValueChange={(v: any) => updateSettings({ bodyFontWeight: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="semibold">Semibold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select value={safeSettings.bodyFontFamily || 'var(--font-body)'} onValueChange={(v) => updateSettings({ bodyFontFamily: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="var(--font-heading)">Theme Heading</SelectItem>
                                    <SelectItem value="var(--font-display)">Theme Display</SelectItem>
                                    <SelectItem value="var(--font-body)">Theme Body</SelectItem>
                                    <SelectItem value="'Anton', sans-serif">Anton</SelectItem>
                                    <SelectItem value="'Audiowide', cursive">Audiowide</SelectItem>
                                    <SelectItem value="'Bebas Neue', sans-serif">Bebas Neue</SelectItem>
                                    <SelectItem value="'Black Ops One', cursive">Black Ops One</SelectItem>
                                    <SelectItem value="'Bungee', cursive">Bungee</SelectItem>
                                    <SelectItem value="'Exo 2', sans-serif">Exo 2</SelectItem>
                                    <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                                    <SelectItem value="'Lato', sans-serif">Lato</SelectItem>
                                    <SelectItem value="'Nunito', sans-serif">Nunito</SelectItem>
                                    <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                                    <SelectItem value="'Orbitron', sans-serif">Orbitron</SelectItem>
                                    <SelectItem value="'Oswald', sans-serif">Oswald</SelectItem>
                                    <SelectItem value="'PT Sans', sans-serif">PT Sans</SelectItem>
                                    <SelectItem value="'Quantico', sans-serif">Quantico</SelectItem>
                                    <SelectItem value="'Rajdhani', sans-serif">Rajdhani</SelectItem>
                                    <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                                    <SelectItem value="'Russo One', sans-serif">Russo One</SelectItem>
                                    <SelectItem value="'Saira', sans-serif">Saira</SelectItem>
                                    <SelectItem value="'Source Sans 3', sans-serif">Source Sans 3</SelectItem>
                                    <SelectItem value="'Teko', sans-serif">Teko</SelectItem>
                                    <SelectItem value="'Titillium Web', sans-serif">Titillium Web</SelectItem>
                                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="monospace">Monospace</SelectItem>
                                    {safeSettings.customFontName && (
                                        <SelectItem value={safeSettings.customFontName}>Custom: {safeSettings.customFontName}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                 </div>

                 {/* Spacing */}
                 <div className="space-y-4 pt-4 border-t">
                    <Label className="text-sm font-semibold text-primary">Spacing & Margins</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title Wrapper Top</Label>
                            <Input value={safeSettings.titleWrapperMarginTop || ''} onChange={(e) => updateSettings({ titleWrapperMarginTop: e.target.value })} placeholder="auto" />
                        </div>
                        <div className="space-y-2">
                            <Label>Title Wrapper Bottom</Label>
                            <Input value={safeSettings.titleWrapperMarginBottom || ''} onChange={(e) => updateSettings({ titleWrapperMarginBottom: e.target.value })} placeholder="auto" />
                        </div>
                        <div className="space-y-2">
                            <Label>Title Margin Bottom</Label>
                            <Input value={safeSettings.titleMarginBottom || ''} onChange={(e) => updateSettings({ titleMarginBottom: e.target.value })} placeholder="1rem" />
                        </div>
                         <div className="space-y-2">
                            <Label>Subtitle Margin Bottom</Label>
                            <Input value={safeSettings.subtitleMarginBottom || ''} onChange={(e) => updateSettings({ subtitleMarginBottom: e.target.value })} placeholder="2rem" />
                        </div>
                    </div>
                 </div>
              </CardContent>
            </Card>

            <Card>
               <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Title Decoration
                </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={safeSettings.titleDecorationType || 'none'} onValueChange={(v: any) => updateSettings({ titleDecorationType: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                               <SelectItem value="none">None</SelectItem>
                               <SelectItem value="icon">Icon</SelectItem>
                               <SelectItem value="line">Line</SelectItem>
                               <SelectItem value="image">Image</SelectItem>
                               <SelectItem value="line-icon-line">Line Icon Line</SelectItem>
                               <SelectItem value="line-image-line">Line Image Line</SelectItem>
                           </SelectContent>
                       </Select>
                   </div>
                   <div className="space-y-2">
                       <Label>Position</Label>
                        <Select value={safeSettings.titleDecorationPosition || 'top'} onValueChange={(v: any) => updateSettings({ titleDecorationPosition: v })}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                               <SelectItem value="top">Top</SelectItem>
                               <SelectItem value="bottom">Bottom</SelectItem>
                               <SelectItem value="left">Left</SelectItem>
                               <SelectItem value="right">Right</SelectItem>
                           </SelectContent>
                       </Select>
                   </div>
                </div>

                {(safeSettings.titleDecorationType === 'icon' || safeSettings.titleDecorationType === 'line-icon-line') && (
                   <div className="space-y-2">
                       <Label>Icon Name</Label>
                       <Select value={safeSettings.titleDecorationIcon || 'star'} onValueChange={(v) => updateSettings({ titleDecorationIcon: v })}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                              <SelectItem value="star">Star</SelectItem>
                              <SelectItem value="sparkles">Sparkles</SelectItem>
                              <SelectItem value="crown">Crown</SelectItem>
                              <SelectItem value="shield">Shield</SelectItem>
                              <SelectItem value="swords">Swords</SelectItem>
                              <SelectItem value="zap">Zap</SelectItem>
                              <SelectItem value="flame">Flame</SelectItem>
                              <SelectItem value="gamepad">Gamepad</SelectItem>
                              <SelectItem value="skull">Skull</SelectItem>
                              <SelectItem value="crosshair">Crosshair</SelectItem>
                              <SelectItem value="trophy">Trophy</SelectItem>
                              <SelectItem value="target">Target</SelectItem>
                              <SelectItem value="ghost">Ghost</SelectItem>
                              <SelectItem value="rocket">Rocket</SelectItem>
                              <SelectItem value="bomb">Bomb</SelectItem>
                              <SelectItem value="map">Map</SelectItem>
                              <SelectItem value="flag">Flag</SelectItem>
                              <SelectItem value="medal">Medal</SelectItem>
                              <SelectItem value="heart">Heart</SelectItem>
                              <SelectItem value="bell">Bell</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="alert-triangle">Alert Triangle</SelectItem>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="help-circle">Help Circle</SelectItem>
                              <SelectItem value="calendar">Calendar</SelectItem>
                              <SelectItem value="diamond">Diamond</SelectItem>
                              <SelectItem value="sun">Sun</SelectItem>
                              <SelectItem value="moon">Moon</SelectItem>
                              <SelectItem value="cloud">Cloud</SelectItem>
                              <SelectItem value="snowflake">Snowflake</SelectItem>
                              <SelectItem value="droplet">Droplet</SelectItem>
                              <SelectItem value="anchor">Anchor</SelectItem>
                              <SelectItem value="feather">Feather</SelectItem>
                              <SelectItem value="lock">Lock</SelectItem>
                              <SelectItem value="unlock">Unlock</SelectItem>
                          </SelectContent>
                       </Select>
                   </div>
                )}
                
                {(safeSettings.titleDecorationType === 'image' || safeSettings.titleDecorationType === 'line-image-line') && (
                    <div className="space-y-2">
                       <Label>Image URL</Label>
                        <div className="flex gap-2">
                             <Input value={safeSettings.titleDecorationImage || ''} onChange={(e) => updateSettings({ titleDecorationImage: e.target.value })} placeholder="https://..." />
                              <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => openMediaPicker(
                                (url) => updateSettings({ titleDecorationImage: url }), 
                                'image'
                              )}
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                        </div>
                     </div>
                 )}

                 {safeSettings.titleDecorationType !== 'none' && (
                     <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                             <Label>Size</Label>
                             <Input value={safeSettings.titleDecorationSize || ''} onChange={(e) => updateSettings({ titleDecorationSize: e.target.value })} placeholder="e.g. 2rem" />
                        </div>
                        <div className="space-y-2">
                             <Label>Color</Label>
                             <div className="flex gap-2">
                                <div className="w-8 h-8 rounded border" style={{ background: safeSettings.titleDecorationColor || 'currentColor' }} />
                                <Input value={safeSettings.titleDecorationColor || ''} onChange={(e) => updateSettings({ titleDecorationColor: e.target.value })} placeholder="inherit" />
                             </div>
                        </div>
                        <div className="space-y-2">
                             <Label>Alignment</Label>
                              <Select value={safeSettings.titleDecorationAlignment || 'center'} onValueChange={(v: any) => updateSettings({ titleDecorationAlignment: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="start">Start</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="end">End</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label>Opacity (0-1)</Label>
                             <Input type="number" step="0.1" min="0" max="1" value={safeSettings.titleDecorationOpacity ?? 1} onChange={(e) => updateSettings({ titleDecorationOpacity: parseFloat(e.target.value) })} />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2 pt-2 border-t">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Decoration Padding (Top, Right, Bottom, Left)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Input placeholder="Top" value={safeSettings.titleDecorationPaddingTop || ''} onChange={(e) => updateSettings({ titleDecorationPaddingTop: e.target.value })} />
                                <Input placeholder="Right" value={safeSettings.titleDecorationPaddingRight || ''} onChange={(e) => updateSettings({ titleDecorationPaddingRight: e.target.value })} />
                                <Input placeholder="Bottom" value={safeSettings.titleDecorationPaddingBottom || ''} onChange={(e) => updateSettings({ titleDecorationPaddingBottom: e.target.value })} />
                                <Input placeholder="Left" value={safeSettings.titleDecorationPaddingLeft || ''} onChange={(e) => updateSettings({ titleDecorationPaddingLeft: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-2 pt-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase">Decoration Margin (Top, Right, Bottom, Left)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <Input placeholder="Top" value={safeSettings.titleDecorationMarginTop || ''} onChange={(e) => updateSettings({ titleDecorationMarginTop: e.target.value })} />
                                <Input placeholder="Right" value={safeSettings.titleDecorationMarginRight || ''} onChange={(e) => updateSettings({ titleDecorationMarginRight: e.target.value })} />
                                <Input placeholder="Bottom" value={safeSettings.titleDecorationMarginBottom || ''} onChange={(e) => updateSettings({ titleDecorationMarginBottom: e.target.value })} />
                                <Input placeholder="Left" value={safeSettings.titleDecorationMarginLeft || ''} onChange={(e) => updateSettings({ titleDecorationMarginLeft: e.target.value })} />
                            </div>
                        </div>
                     </div>
                 )}
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  Layout & Spacing
                </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Top Padding</Label>
                      <Input 
                        value={safeSettings.paddingTop} 
                        onChange={(e) => updateSettings({ paddingTop: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bottom Padding</Label>
                      <Input 
                        value={safeSettings.paddingBottom} 
                        onChange={(e) => updateSettings({ paddingBottom: e.target.value })}
                      />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                   <Label>Container Width</Label>
                   <Select 
                      value={safeSettings.containerWidth} 
                      onValueChange={(val: any) => updateSettings({ containerWidth: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (1200px)</SelectItem>
                        <SelectItem value="narrow">Narrow (800px)</SelectItem>
                        <SelectItem value="wide">Wide (1400px)</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                 
                 <div className="space-y-2">
                   <Label>Text Align</Label>
                   <div className="flex gap-2">
                     <Button 
                       variant={safeSettings.textAlign === 'left' ? 'default' : 'outline'} 
                       size="sm" 
                       onClick={() => updateSettings({ textAlign: 'left' })}
                     >
                       <AlignLeft className="w-4 h-4" />
                     </Button>
                     <Button 
                       variant={safeSettings.textAlign === 'center' ? 'default' : 'outline'} 
                       size="sm" 
                       onClick={() => updateSettings({ textAlign: 'center' })}
                     >
                       <AlignCenter className="w-4 h-4" />
                     </Button>
                     <Button 
                       variant={safeSettings.textAlign === 'right' ? 'default' : 'outline'} 
                       size="sm" 
                       onClick={() => updateSettings({ textAlign: 'right' })}
                     >
                       <AlignRight className="w-4 h-4" />
                     </Button>
                   </div>
                 </div>

                 {section.type === 'dynamic-content' && (
                    <div className="space-y-2">
                       <Label>Source Alignment</Label>
                       <div className="flex gap-2">
                         <Button 
                           variant={safeSettings.sourceTextAlign === 'left' ? 'default' : 'outline'} 
                           size="sm" 
                           onClick={() => updateSettings({ sourceTextAlign: 'left' })}
                         >
                           <AlignLeft className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant={safeSettings.sourceTextAlign === 'center' ? 'default' : 'outline'} 
                           size="sm" 
                           onClick={() => updateSettings({ sourceTextAlign: 'center' })}
                         >
                           <AlignCenter className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant={safeSettings.sourceTextAlign === 'right' ? 'default' : 'outline'} 
                           size="sm" 
                           onClick={() => updateSettings({ sourceTextAlign: 'right' })}
                         >
                           <AlignRight className="w-4 h-4" />
                         </Button>
                       </div>
                    </div>
                 )}

                 <div className="space-y-2">
                    <Label>Min Height</Label>
                    <Input 
                      value={safeSettings.minHeight || ''} 
                      onChange={(e) => updateSettings({ minHeight: e.target.value })}
                      placeholder="e.g. 100vh or 600px"
                    />
                 </div>
               </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="effects" className="mt-0 space-y-6">
            <Card>
               <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  Section Padding
                </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">Padding (Top, Right, Bottom, Left)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Input placeholder="Top" value={safeSettings.paddingTop || ''} onChange={(e) => updateSettings({ paddingTop: e.target.value })} />
                        <Input placeholder="Right" value={safeSettings.paddingRight || ''} onChange={(e) => updateSettings({ paddingRight: e.target.value })} />
                        <Input placeholder="Bottom" value={safeSettings.paddingBottom || ''} onChange={(e) => updateSettings({ paddingBottom: e.target.value })} />
                        <Input placeholder="Left" value={safeSettings.paddingLeft || ''} onChange={(e) => updateSettings({ paddingLeft: e.target.value })} />
                    </div>
                 </div>
               </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MonitorPlay className="w-4 h-4 text-primary" />
                  Entrance Animation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Animation Type</Label>
                  <Select 
                    value={safeSettings.animation?.type || 'none'} 
                    onValueChange={(val: any) => updateAnimation({ type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="fade-in">Fade In</SelectItem>
                      <SelectItem value="slide-up">Slide Up</SelectItem>
                      <SelectItem value="slide-right">Slide Right</SelectItem>
                      <SelectItem value="zoom-in">Zoom In</SelectItem>
                      <SelectItem value="reveal">Reveal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {safeSettings.animation?.type && safeSettings.animation.type !== 'none' && (
                  <>
                    <div className="space-y-2">
                      <Label>Duration (seconds)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[safeSettings.animation?.duration || 0.8]}
                          min={0.1}
                          max={3}
                          step={0.1}
                          onValueChange={(vals) => updateAnimation({ duration: vals[0] })}
                          className="flex-1"
                        />
                        <span className="text-sm w-12 text-right">{safeSettings.animation?.duration || 0.8}s</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Delay (seconds)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[safeSettings.animation?.delay || 0]}
                          min={0}
                          max={2}
                          step={0.1}
                          onValueChange={(vals) => updateAnimation({ delay: vals[0] })}
                          className="flex-1"
                        />
                        <span className="text-sm w-12 text-right">{safeSettings.animation?.delay || 0}s</span>
                      </div>
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
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <Label>Show Scroll Indicator</Label>
                   <Switch 
                     checked={safeSettings.scrollIndicator?.enabled || false}
                     onCheckedChange={(checked) => updateScrollIndicator({ 
                        enabled: checked,
                        style: 'bounce',
                        icon: 'chevron-down'
                     })}
                   />
                 </div>
                 
                 {safeSettings.scrollIndicator?.enabled && (
                   <>
                     <div className="space-y-2">
                       <Label>Icon</Label>
                       <Select 
                          value={safeSettings.scrollIndicator.icon || 'chevron-down'} 
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
                     <div className="space-y-2">
                       <Label>Animation Style</Label>
                       <Select 
                          value={safeSettings.scrollIndicator.style || 'bounce'} 
                          onValueChange={(val) => updateScrollIndicator({ style: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="fade">Fade</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase">Padding (Top, Right, Bottom, Left)</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Input placeholder="Top" value={safeSettings.scrollIndicator.paddingTop || ''} onChange={(e) => updateScrollIndicator({ paddingTop: e.target.value })} />
                            <Input placeholder="Right" value={safeSettings.scrollIndicator.paddingRight || ''} onChange={(e) => updateScrollIndicator({ paddingRight: e.target.value })} />
                            <Input placeholder="Bottom" value={safeSettings.scrollIndicator.paddingBottom || ''} onChange={(e) => updateScrollIndicator({ paddingBottom: e.target.value })} />
                            <Input placeholder="Left" value={safeSettings.scrollIndicator.paddingLeft || ''} onChange={(e) => updateScrollIndicator({ paddingLeft: e.target.value })} />
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
                  <Layout className="w-4 h-4 text-primary" />
                  Navigation Settings
                </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Show in Navigation</Label>
                     <p className="text-xs text-muted-foreground">Include this section in the page navigation bar</p>
                   </div>
                   <Switch 
                     checked={safeSettings.showInNav || false}
                     onCheckedChange={(checked) => updateSettings({ showInNav: checked })}
                   />
                 </div>
                 
                 {safeSettings.showInNav && (
                   <div className="space-y-2">
                      <Label>Navigation Label</Label>
                      <Input 
                        value={safeSettings.navLabel || section.name || ''} 
                        onChange={(e) => updateSettings({ navLabel: e.target.value })}
                        placeholder="Label for navigation tab"
                      />
                   </div>
                 )}
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Advanced Settings
                </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Custom CSS Class</Label>
                    <Input 
                      value={safeSettings.className || ''} 
                      onChange={(e) => updateSettings({ className: e.target.value })}
                      placeholder="e.g. my-custom-section"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>Section ID (Anchor)</Label>
                    <Input 
                      value={safeSettings.id || ''} 
                      onChange={(e) => updateSettings({ id: e.target.value })}
                      placeholder="e.g. features-section"
                    />
                 </div>
                 <div className="flex items-center justify-between pt-2">
                   <div className="space-y-0.5">
                     <Label>Parallax Effect</Label>
                     <p className="text-xs text-muted-foreground">Enable parallax scrolling for background</p>
                   </div>
                   <Switch 
                     checked={safeBackground.parallax || false}
                     onCheckedChange={(checked) => updateBackground({ parallax: checked })}
                   />
                 </div>
               </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

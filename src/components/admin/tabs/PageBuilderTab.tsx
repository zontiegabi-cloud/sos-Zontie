import { useState, useRef, useEffect } from "react";
import { useContent } from "@/hooks/use-content";
import { Page, CustomSection, HeroButton, DynamicContentSource, BackgroundSettings } from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Trash2, Save, ArrowLeft, Eye, 
  Pencil, Copy, LayoutGrid, List
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { CustomSectionRenderer } from "@/components/home/CustomSectionRenderer";
import { useSiteSettings } from "@/hooks/use-site-settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionEditor } from "@/components/admin/SectionEditor";
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

export function PageBuilderTab() {
  const { pages, addPage, updatePage, deletePage } = useContent();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<'settings' | 'content'>('settings');
  
  // Local state for the page being edited
  const [localPage, setLocalPage] = useState<Page | null>(null);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  
  // State for section editing
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // View mode state with persistence
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pageBuilderViewMode');
      return (saved === 'grid' || saved === 'list') ? saved : 'grid';
    }
    return 'grid';
  });

  // Persist view mode changes
  useEffect(() => {
    localStorage.setItem('pageBuilderViewMode', viewMode);
  }, [viewMode]);

  const selectedSection = localPage?.sections.find(s => s.id === selectedSectionId);

  // Create New Page
  const handleCreatePage = () => {
    const newPage: Omit<Page, 'id'> = {
      title: 'New Page',
      slug: `page-${Date.now()}`,
      status: 'draft',
      sections: [],
      seo: {
        title: 'New Page',
        description: ''
      }
    };
    const created = addPage(newPage);
    if (created) {
      setSelectedPageId(created.id);
      setLocalPage(JSON.parse(JSON.stringify(created)));
      toast.success("Page created");
    }
  };

  // Select Page
  const handleSelectPage = (page: Page) => {
    setSelectedPageId(page.id);
    setLocalPage(JSON.parse(JSON.stringify(page))); // Deep copy
    setSelectedSectionId(null);
  };

  // Save Page
  const handleSavePage = () => {
    if (!localPage || !selectedPageId) return;
    updatePage(selectedPageId, localPage);
    toast.success("Page saved successfully");
  };

  // Delete Page
  const handleDeletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPageToDelete(id);
  };

  const confirmDeletePage = () => {
    if (pageToDelete) {
      deletePage(pageToDelete);
      if (selectedPageId === pageToDelete) {
        setSelectedPageId(null);
        setLocalPage(null);
        setSelectedSectionId(null);
      }
      toast.success("Page deleted");
      setPageToDelete(null);
    }
  };

  // Section Management
  const handleAddSection = () => {
    if (!localPage) return;
    const newSection: CustomSection = {
      id: generateId(),
      type: 'rich-text',
      name: 'New Section',
      content: {
        title: 'New Section',
        description: '<p>Content goes here...</p>'
      },
      settings: {
        paddingTop: '4rem',
        paddingBottom: '4rem',
        containerWidth: 'default',
        background: { type: 'color', color: 'transparent', opacity: 1 },
        textAlign: 'left'
      }
    };
    setLocalPage({
      ...localPage,
      sections: [...localPage.sections, newSection]
    });
    setSelectedSectionId(newSection.id);
  };

  const handleDuplicateSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localPage) return;
    const sectionToDuplicate = localPage.sections.find(s => s.id === sectionId);
    if (!sectionToDuplicate) return;

    const newSection: CustomSection = {
      ...sectionToDuplicate,
      id: generateId(),
      name: `${sectionToDuplicate.name} (Copy)`
    };

    setLocalPage({
      ...localPage,
      sections: [...localPage.sections, newSection]
    });
    toast.success("Section duplicated");
  };

  const handleRemoveSection = (sectionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!localPage) return;
    setSectionToDelete(sectionId);
  };

  const confirmRemoveSection = () => {
    if (!localPage || !sectionToDelete) return;
    setLocalPage({
      ...localPage,
      sections: localPage.sections.filter(s => s.id !== sectionToDelete)
    });
    if (selectedSectionId === sectionToDelete) {
      setSelectedSectionId(null);
    }
    setSectionToDelete(null);
    toast.success("Section removed");
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!localPage) return;
    const newSections = [...localPage.sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setLocalPage({ ...localPage, sections: newSections });
  };

  // Section Updating Helpers
  const updateSection = (updates: Partial<CustomSection>) => {
    if (!localPage || !selectedSectionId) return;
    const newSections = localPage.sections.map(s => 
      s.id === selectedSectionId ? { ...s, ...updates } : s
    );
    setLocalPage({ ...localPage, sections: newSections });
  };

  // Render Page Editor
  if (selectedPageId && localPage) {
    return (
      <div className="h-full flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setSelectedPageId(null); setLocalPage(null); setSelectedSectionId(null); }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{localPage.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={localPage.status === 'published' ? 'default' : 'secondary'}>
                  {localPage.status}
                </Badge>
                <span>/{localPage.slug}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.open(`/${localPage.slug}`, '_blank')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview Page
            </Button>
            <Button onClick={handleSavePage}>
              <Save className="w-4 h-4 mr-2" />
              Save Page
            </Button>
          </div>
        </div>

        <Tabs value={editMode} onValueChange={(v) => setEditMode(v as 'settings' | 'content')} className="flex-1 flex flex-col overflow-hidden">
          <TabsList>
            <TabsTrigger value="settings">Page Settings</TabsTrigger>
            <TabsTrigger value="content">Content & Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="flex-1 overflow-auto p-4 border rounded-md bg-card">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input 
                  value={localPage.title} 
                  onChange={(e) => setLocalPage({ ...localPage, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input 
                    value={localPage.slug} 
                    onChange={(e) => setLocalPage({ ...localPage, slug: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={localPage.status} 
                  onValueChange={(v: 'draft' | 'published') => setLocalPage({ ...localPage, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localPage.slug === 'game-content' && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Game Content Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Content Navigation</Label>
                      <p className="text-sm text-muted-foreground">
                        Display the tabbed navigation bar for Weapons, Maps, etc.
                      </p>
                    </div>
                    <Switch
                      checked={localPage.settings?.showGameContentNav ?? true}
                      onCheckedChange={(checked) => setLocalPage({
                        ...localPage,
                        settings: {
                          ...localPage.settings,
                          showGameContentNav: checked
                        }
                      })}
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input 
                      value={localPage.seo?.title || ''} 
                      onChange={(e) => setLocalPage({ 
                        ...localPage, 
                        seo: { ...localPage.seo!, title: e.target.value } 
                      })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea 
                      value={localPage.seo?.description || ''} 
                      onChange={(e) => setLocalPage({ 
                        ...localPage, 
                        seo: { ...localPage.seo!, description: e.target.value } 
                      })} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="flex-1 overflow-hidden flex gap-4">
            {/* Sections List (Left Panel) */}
            <div className="w-1/4 flex flex-col border rounded-md bg-card overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold">Sections</h3>
                <Button size="sm" onClick={handleAddSection}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {localPage.sections.map((section, index) => (
                    <div 
                      key={section.id || index} 
                      className={`flex items-center gap-2 p-3 border rounded-md transition-colors group cursor-pointer ${
                        selectedSectionId === section.id ? 'bg-primary/10 border-primary/50' : 'bg-background hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={(e) => handleMoveSection(index, 'up', e)}>
                          <ArrowLeft className="w-3 h-3 rotate-90" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === localPage.sections.length - 1} onClick={(e) => handleMoveSection(index, 'down', e)}>
                          <ArrowLeft className="w-3 h-3 -rotate-90" />
                        </Button>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium text-sm truncate">{section.name || 'Untitled Section'}</div>
                        <div className="text-xs text-muted-foreground">{section.type}</div>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={(e) => handleDuplicateSection(section.id, e)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={(e) => handleRemoveSection(section.id, e)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {localPage.sections.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No sections yet. Add one to get started.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            {/* Right Panel: Editor OR Preview */}
            <div className="flex-1 border rounded-md bg-background overflow-hidden flex flex-col">
              {selectedSection ? (
                <SectionEditor 
                  section={selectedSection} 
                  onChange={updateSection}
                  headerActions={
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSectionId(null)}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Preview
                    </Button>
                  }
                />
              ) : (
                // Preview Mode
                <div className="flex-1 flex flex-col h-full bg-muted/10">
                  <div className="p-4 text-center text-muted-foreground">
                    Select a section to edit or add a new one
                  </div>
                  <div className="flex-1 overflow-auto p-8 flex justify-center">
                    <div className="w-full max-w-5xl bg-background shadow-lg min-h-[500px] rounded-lg overflow-hidden border">
                      {localPage.sections.map((section) => (
                         <div 
                           key={section.id} 
                           className={`relative group ${selectedSectionId === section.id ? 'ring-2 ring-primary ring-inset z-10' : ''}`}
                           onClick={() => setSelectedSectionId(section.id)}
                         >
                           <CustomSectionRenderer section={section} />
                           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur rounded-md shadow-sm p-1 border flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setSelectedSectionId(section.id); }}>
                                <Pencil className="w-3 h-3" />
                              </Button>
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialog open={!!sectionToDelete} onOpenChange={(open) => !open && setSectionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Section?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this section? You can undo this by not saving the page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoveSection} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Render Page List
  return (
    <div className="h-full space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Pages</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md p-1 bg-muted/20">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={handleCreatePage}>
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </Button>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
          <p className="text-lg font-medium">No pages found</p>
          <p className="text-sm mt-1">Create a new page to get started</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow 
                  key={page.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSelectPage(page)}
                >
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell>{page.sections.length}</TableCell>
                  <TableCell>
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeletePage(page.id, e)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card 
              key={page.id} 
              className="cursor-pointer hover:border-primary transition-colors group relative"
              onClick={() => handleSelectPage(page)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{page.title}</span>
                  <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                    {page.status}
                  </Badge>
                </CardTitle>
                <CardDescription>/{page.slug}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {page.sections.length} sections
                </div>
              </CardContent>
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDeletePage(page.id, e)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

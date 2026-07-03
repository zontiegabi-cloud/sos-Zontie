import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Star, Check, X, Image, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import {
  FeaturedContentItem,
  HomepageHeroBanner,
  CreateFeaturedContent,
  CreateHeroBanner,
} from "@/lib/featured-content.types";
import { ContentPickerModal } from "../modals/ContentPickerModal";

// Simple modal for editing featured content
function FeaturedContentEditModal({
  item,
  isCreating,
  onSave,
  onCancel,
}: {
  item: FeaturedContentItem | null;
  isCreating: boolean;
  onSave: (item: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(
    item || {
      title: "",
      description: "",
      thumbnail: "",
      sortOrder: 0,
      categoryGroup: "grid-featured",
      contentSource: "news",
      sourceId: "",
      isActive: true,
    }
  );
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <Dialog open={!!item} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Add Featured Content" : "Edit Featured Content"}
            </DialogTitle>
            <DialogDescription>
              Promote content from your CMS tables to be featured on the homepage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Content Source</Label>
              <Select
                value={formData.contentSource}
                onValueChange={(value) =>
                  setFormData({ ...formData, contentSource: value, sourceId: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="weapons">Weapons</SelectItem>
                  <SelectItem value="classes">Classes</SelectItem>
                  <SelectItem value="maps">Maps</SelectItem>
                  <SelectItem value="game_devices">Game Devices</SelectItem>
                  <SelectItem value="game_modes">Game Modes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Content</Label>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowPicker(true)}
              >
                {formData.sourceId ? (
                  <span>Selected (ID: {formData.sourceId})</span>
                ) : (
                  <span className="text-muted-foreground">Click to select...</span>
                )}
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Title (optional override)</Label>
              <Input
                value={formData.title ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Leave blank to use original title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional override)</Label>
              <Input
                value={formData.description ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Leave blank to use original description"
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input
                value={formData.thumbnail ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Category Group</Label>
              <Select
                value={formData.categoryGroup}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryGroup: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero Banner</SelectItem>
                  <SelectItem value="grid-featured">Grid Featured</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!formData.sourceId) {
                  toast.error("Please select content first!");
                  return;
                }
                onSave(formData);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContentPickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        contentSource={formData.contentSource}
        onSelect={(id, title, desc, thumb) => {
          setFormData({
            ...formData,
            sourceId: id,
            title: title,
            description: desc || "",
            thumbnail: thumb || "",
          });
        }}
      />
    </>
  );
}

// Simple modal for editing hero banners
function HeroBannerEditModal({
  item,
  isCreating,
  onSave,
  onCancel,
}: {
  item: HomepageHeroBanner | null;
  isCreating: boolean;
  onSave: (item: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<any>(
    item || {
      bannerUrl: "",
      thumbnailUrl: "",
      title: "",
      description: "",
      callToAction: "",
      ctaLink: "",
      sortOrder: 0,
      isActive: true,
    }
  );

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCreating ? "Add Hero Banner" : "Edit Hero Banner"}
          </DialogTitle>
          <DialogDescription>
            Create and manage hero banners for your homepage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Banner URL</Label>
            <Input
                value={formData.bannerUrl ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, bannerUrl: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Thumbnail URL</Label>
            <Input
                value={formData.thumbnailUrl ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, thumbnailUrl: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Call to Action (Button Text)</Label>
            <Input
                value={formData.callToAction ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, callToAction: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Link</Label>
            <Input
                value={formData.ctaLink ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, ctaLink: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input
              type="number"
                value={formData.sortOrder ?? 0}
              onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked as boolean })
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(formData);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FeaturedContentTab() {
  const [featuredContent, setFeaturedContent] = useState<
    FeaturedContentItem[]
  >([]);
  const [heroBanners, setHeroBanners] = useState<HomepageHeroBanner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeSection, setActiveSection] = useState<
    "featured" | "banners"
  >("featured");

  // Edit state
  const [editingFeatured, setEditingFeatured] =
    useState<FeaturedContentItem | null>(null);
  const [editingBanner, setEditingBanner] =
    useState<HomepageHeroBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: "single" | "batch";
    id?: number;
  } | null>(null);

  const readArrayResponse = useCallback(
    async <T,>(response: Response, label: string): Promise<T[]> => {
      const rawText = await response.text();

      let payload: unknown = [];
      if (rawText) {
        try {
          payload = JSON.parse(rawText);
        } catch {
          throw new Error(`${label} returned invalid JSON.`);
        }
      }

      if (!response.ok) {
        const message =
          payload &&
          typeof payload === "object" &&
          "error" in payload &&
          typeof (payload as { error?: unknown }).error === "string"
            ? (payload as { error: string }).error
            : `${label} request failed with status ${response.status}.`;
        throw new Error(message);
      }

      return Array.isArray(payload) ? (payload as T[]) : [];
    },
    []
  );

  // Fetch data on mount
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch featured content (all, including inactive)
      const featuredRes = await fetch(`${API_BASE_URL}/api/featured/content/all`);
      const featuredData = await readArrayResponse<FeaturedContentItem>(
        featuredRes,
        "Featured content"
      );
      setFeaturedContent(featuredData);

      // Fetch hero banners (all, including inactive)
      const bannerRes = await fetch(`${API_BASE_URL}/api/featured/homepage/all`);
      const bannerData = await readArrayResponse<HomepageHeroBanner>(
        bannerRes,
        "Hero banners"
      );
      setHeroBanners(bannerData);

    } catch (error) {
      console.error("Failed to fetch featured content:", error);
      setFeaturedContent([]);
      setHeroBanners([]);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load featured content."
      );
    } finally {
      setIsLoading(false);
    }
  }, [readArrayResponse]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle save for featured content
  const handleSaveFeatured = async (item: any) => {
    try {
      if (isCreating) {
        await fetch(`${API_BASE_URL}/api/featured/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        toast.success("Featured content added!");
      } else if (item.id) {
        await fetch(`${API_BASE_URL}/api/featured/content/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        toast.success("Featured content updated!");
      }
      await fetchData();
      setEditingFeatured(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to save featured content:", error);
      toast.error("Failed to save featured content.");
    }
  };

  // Handle save for hero banners
  const handleSaveBanner = async (item: any) => {
    try {
      if (isCreating) {
        await fetch(`${API_BASE_URL}/api/featured/homepage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        toast.success("Hero banner added!");
      } else if (item.id) {
        await fetch(`${API_BASE_URL}/api/featured/homepage/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        toast.success("Hero banner updated!");
      }
      await fetchData();
      setEditingBanner(null);
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to save hero banner:", error);
      toast.error("Failed to save hero banner.");
    }
  };

  // Handle delete
  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      if (deleteConfirmation.type === "single" && deleteConfirmation.id) {
        if (activeSection === "featured") {
          await fetch(
            `${API_BASE_URL}/api/featured/content/${deleteConfirmation.id}`,
            {
              method: "DELETE",
            }
          );
        } else {
          await fetch(
            `${API_BASE_URL}/api/featured/homepage/${deleteConfirmation.id}`,
            {
              method: "DELETE",
            }
          );
        }
        toast.success("Deleted!");
      } else if (deleteConfirmation.type === "batch") {
        // Batch delete (needs backend support, just show a warning for now)
        toast.info("Batch delete needs backend implementation.");
      }
      await fetchData();
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item.");
    } finally {
      setDeleteConfirmation(null);
    }
  };

  // Filtered data based on search query
  const filteredFeatured = featuredContent.filter(
    (item) =>
      !searchQuery ||
      (item.title &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBanners = heroBanners.filter(
    (item) =>
      !searchQuery ||
      (item.title &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading text-primary">
            Featured Content
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage featured content and hero banners for your homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirmation({ type: "batch" })}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.size})
            </Button>
          )}
          <Button
            onClick={() => {
              if (activeSection === "featured") {
                setEditingFeatured({
                  id: 0,
                  title: "",
                  description: "",
                  thumbnail: "",
                  sortOrder: featuredContent.length,
                  categoryGroup: "grid-featured",
                  contentSource: "news",
                  sourceId: "",
                  isActive: true,
                });
              } else {
                setEditingBanner({
                  id: 0,
                  bannerUrl: "",
                  title: "",
                  description: "",
                  callToAction: "",
                  ctaLink: "",
                  sortOrder: heroBanners.length,
                  isActive: true,
                });
              }
              setIsCreating(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {activeSection === "featured" ? "Featured Content" : "Banner"}
          </Button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeSection === "featured" ? "default" : "ghost"}
          onClick={() => {
            setActiveSection("featured");
            setSelectedIds(new Set());
          }}
        >
          Featured Content
        </Button>
        <Button
          variant={activeSection === "banners" ? "default" : "ghost"}
          onClick={() => {
            setActiveSection("banners");
            setSelectedIds(new Set());
          }}
        >
          Hero Banners
        </Button>
      </div>

      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${activeSection === "featured" ? "featured content" : "banners"}...`}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Featured Content Table */}
      {activeSection === "featured" && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      filteredFeatured.length > 0 &&
                      selectedIds.size === filteredFeatured.length
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(
                          new Set(filteredFeatured.map((item) => item.id))
                        );
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sort</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeatured.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No featured content yet. Add some!
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeatured.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedIds);
                          if (checked) newSelected.add(item.id);
                          else newSelected.delete(item.id);
                          setSelectedIds(newSelected);
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.title || "Untitled"}
                    </TableCell>
                    <TableCell>{item.contentSource}</TableCell>
                    <TableCell>{item.categoryGroup}</TableCell>
                    <TableCell>{item.sortOrder}</TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingFeatured(item);
                            setIsCreating(false);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setDeleteConfirmation({
                              type: "single",
                              id: item.id,
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Hero Banners List */}
      {activeSection === "banners" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanners.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border border-dashed rounded-lg">
              No hero banners yet. Add some!
            </div>
          ) : (
            filteredBanners.map((item) => (
              <div
                key={item.id}
                className="bg-card border rounded-lg p-4 relative"
              >
                <div className="absolute top-3 left-3">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedIds);
                      if (checked) newSelected.add(item.id);
                      else newSelected.delete(item.id);
                      setSelectedIds(newSelected);
                    }}
                  />
                </div>
                {item.bannerUrl && (
                  <div className="ml-8 mb-2">
                    <img
                      src={item.bannerUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                <div className="ml-8">
                  <h3 className="font-semibold mb-1">
                    {item.title || "Untitled Banner"}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Sort: {item.sortOrder}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingBanner(item);
                      setIsCreating(false);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setDeleteConfirmation({ type: "single", id: item.id })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {editingFeatured && (
        <FeaturedContentEditModal
          item={editingFeatured}
          isCreating={isCreating}
          onSave={handleSaveFeatured}
          onCancel={() => {
            setEditingFeatured(null);
            setIsCreating(false);
          }}
        />
      )}
      {editingBanner && (
        <HeroBannerEditModal
          item={editingBanner}
          isCreating={isCreating}
          onSave={handleSaveBanner}
          onCancel={() => {
            setEditingBanner(null);
            setIsCreating(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirmation}
        onOpenChange={(open) => !open && setDeleteConfirmation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmation?.type === "single"
                ? "This action cannot be undone. This will permanently delete this item."
                : `This action cannot be undone. This will permanently delete ${selectedIds.size} selected items.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

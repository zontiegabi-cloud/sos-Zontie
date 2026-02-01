import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContent } from "@/hooks/use-content";
import { NewsItem } from "@/lib/content-store";
import { toast } from "sonner";
import { NewsEditModal } from "@/components/admin/modals/NewsEditModal";

export function NewsTab() {
  const { news, addNewsItem, updateNewsItem, deleteNewsItem, updateContent, content } = useContent();
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredNews.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
      const newNews = news.filter((item) => !selectedIds.has(item.id));
      updateContent({ ...content, news: newNews });
      setSelectedIds(new Set());
      toast.success("Selected items deleted!");
    }
  };

  const handleSaveNews = (item: NewsItem) => {
    if (isCreating) {
      addNewsItem(item);
      toast.success("News article created!");
    } else {
      updateNewsItem(item.id, item);
      toast.success("News article updated!");
    }
    setEditingNews(null);
    setIsCreating(false);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      deleteNewsItem(id);
      toast.success("News article deleted!");
    }
  };

  const createNewNews = () => {
    setEditingNews({
      id: "",
      title: "",
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      image: "",
      description: "",
      content: "",
      tag: "News"
    });
    setIsCreating(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-heading text-xl text-foreground uppercase">
            Manage News Articles
          </h2>
          <p className="text-muted-foreground text-sm">
            {news.length} articles total
          </p>
        </div>
        <Button onClick={createNewNews}>
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        {selectedIds.size > 0 && (
          <Button variant="destructive" onClick={handleBatchDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedIds.size})
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={filteredNews.length > 0 && selectedIds.size === filteredNews.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No news found.
                </TableCell>
              </TableRow>
            ) : (
              filteredNews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(item.id)}
                      onCheckedChange={(checked) => handleSelectOne(item.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-8 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {item.tag}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingNews(item);
                          setIsCreating(false);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteNews(item.id)}
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

      {editingNews && (
        <NewsEditModal
          item={editingNews}
          onSave={handleSaveNews}
          onCancel={() => {
            setEditingNews(null);
            setIsCreating(false);
          }}
          isCreating={isCreating}
        />
      )}
    </motion.div>
  );
}

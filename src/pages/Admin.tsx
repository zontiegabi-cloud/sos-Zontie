import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  Users, 
  Settings, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  X,
  RotateCcw,
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/hooks/use-content";
import { NewsItem, ClassItem } from "@/lib/content-store";
import { toast } from "sonner";

type Tab = "news" | "classes";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("news");
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const {
    news,
    classes,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addClassItem,
    updateClassItem,
    deleteClassItem,
    reset,
  } = useContent();

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

  const handleSaveClass = (item: ClassItem) => {
    if (isCreating) {
      addClassItem(item);
      toast.success("Class created!");
    } else {
      updateClassItem(item.id, item);
      toast.success("Class updated!");
    }
    setEditingClass(null);
    setIsCreating(false);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      deleteClassItem(id);
      toast.success("Class deleted!");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all content to defaults? This cannot be undone.")) {
      reset();
      toast.success("Content reset to defaults!");
    }
  };

  const createNewNews = () => {
    setEditingNews({
      id: "",
      title: "",
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      description: "",
      content: "",
      image: "",
      tag: "News",
    });
    setIsCreating(true);
  };

  const createNewClass = () => {
    setEditingClass({
      id: "",
      name: "",
      role: "",
      description: "",
      details: ["", "", "", ""],
      image: "",
      icon: "Crosshair",
      color: "from-red-500/20 to-transparent",
    });
    setIsCreating(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-2xl text-foreground">
              ADMIN <span className="text-primary">PANEL</span>
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("news")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  activeTab === "news"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-heading uppercase">News</span>
              </button>
              <button
                onClick={() => setActiveTab("classes")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  activeTab === "classes"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-heading uppercase">Classes</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* News Tab */}
            {activeTab === "news" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-foreground uppercase">
                    Manage News Articles
                  </h2>
                  <Button onClick={createNewNews}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Article
                  </Button>
                </div>

                {/* News List */}
                <div className="space-y-4">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded p-4 flex items-center gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-heading text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.date} • {item.tag}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingNews(item);
                            setIsCreating(false);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteNews(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Modal */}
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
            )}

            {/* Classes Tab */}
            {activeTab === "classes" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-foreground uppercase">
                    Manage Classes
                  </h2>
                  <Button onClick={createNewClass}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </div>

                {/* Classes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classes.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded p-4"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-heading text-foreground">{item.name}</h3>
                          <p className="text-sm text-primary">{item.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingClass(item);
                            setIsCreating(false);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClass(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Modal */}
                {editingClass && (
                  <ClassEditModal
                    item={editingClass}
                    onSave={handleSaveClass}
                    onCancel={() => {
                      setEditingClass(null);
                      setIsCreating(false);
                    }}
                    isCreating={isCreating}
                  />
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// News Edit Modal Component
function NewsEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: NewsItem;
  onSave: (item: NewsItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Create" : "Edit"} News Article
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Date</label>
              <Input
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="August 2024"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Tag</label>
              <Input
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Development"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Short Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description for cards..."
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Full Content (Markdown)</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content...&#10;&#10;## Use headers&#10;&#10;- Use bullet points&#10;&#10;Regular paragraphs..."
              rows={10}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Class Edit Modal Component
function ClassEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: ClassItem;
  onSave: (item: ClassItem) => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState(item);

  const updateDetail = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-xl text-foreground">
            {isCreating ? "Create" : "Edit"} Class
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Assault"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Role</label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Frontline Fighter"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image URL</label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Class description..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Details (4 bullet points)</label>
            <div className="space-y-2">
              {[0, 1, 2, 3].map((index) => (
                <Input
                  key={index}
                  value={formData.details[index] || ""}
                  onChange={(e) => updateDetail(index, e.target.value)}
                  placeholder={`Detail ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Icon (Lucide name)</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Crosshair"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Color Gradient</label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="from-red-500/20 to-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

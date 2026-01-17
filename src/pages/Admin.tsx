import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Newspaper, 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Save,
  X,
  RotateCcw,
  Home,
  Image,
  HelpCircle,
  Shield,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent } from "@/hooks/use-content";
import { NewsItem, ClassItem, MediaItem, FAQItem, PageContent } from "@/lib/content-store";
import { toast } from "sonner";

type Tab = "news" | "classes" | "media" | "faq" | "privacy" | "terms";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("news");
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const {
    news,
    classes,
    media,
    faq,
    privacy,
    terms,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    addClassItem,
    updateClassItem,
    deleteClassItem,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    addFAQItem,
    updateFAQItem,
    deleteFAQItem,
    updatePrivacy,
    updateTerms,
    reset,
  } = useContent();

  // News handlers
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

  // Class handlers
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

  // Media handlers
  const handleSaveMedia = (item: MediaItem) => {
    if (isCreating) {
      addMediaItem(item);
      toast.success("Media item created!");
    } else {
      updateMediaItem(item.id, item);
      toast.success("Media item updated!");
    }
    setEditingMedia(null);
    setIsCreating(false);
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm("Are you sure you want to delete this media item?")) {
      deleteMediaItem(id);
      toast.success("Media item deleted!");
    }
  };

  // FAQ handlers
  const handleSaveFAQ = (item: FAQItem) => {
    if (isCreating) {
      addFAQItem(item);
      toast.success("FAQ item created!");
    } else {
      updateFAQItem(item.id, item);
      toast.success("FAQ item updated!");
    }
    setEditingFAQ(null);
    setIsCreating(false);
  };

  const handleDeleteFAQ = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFAQItem(id);
      toast.success("FAQ deleted!");
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

  const createNewMedia = () => {
    setEditingMedia({
      id: "",
      type: "image",
      title: "",
      src: "",
      category: "Gameplay",
    });
    setIsCreating(true);
  };

  const createNewFAQ = () => {
    setEditingFAQ({
      id: "",
      question: "",
      answer: "",
    });
    setIsCreating(true);
  };

  const tabs = [
    { id: "news" as Tab, label: "News", icon: Newspaper },
    { id: "classes" as Tab, label: "Classes", icon: Users },
    { id: "media" as Tab, label: "Media", icon: Image },
    { id: "faq" as Tab, label: "FAQ", icon: HelpCircle },
    { id: "privacy" as Tab, label: "Privacy", icon: Shield },
    { id: "terms" as Tab, label: "Terms", icon: FileText },
  ];

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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-heading uppercase">{tab.label}</span>
                </button>
              ))}
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

            {/* Media Tab */}
            {activeTab === "media" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-foreground uppercase">
                    Manage Media
                  </h2>
                  <Button onClick={createNewMedia}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Media
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded overflow-hidden"
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-heading text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.type} • {item.category}</p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setEditingMedia(item);
                              setIsCreating(false);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMedia(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {editingMedia && (
                  <MediaEditModal
                    item={editingMedia}
                    onSave={handleSaveMedia}
                    onCancel={() => {
                      setEditingMedia(null);
                      setIsCreating(false);
                    }}
                    isCreating={isCreating}
                  />
                )}
              </motion.div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl text-foreground uppercase">
                    Manage FAQ
                  </h2>
                  <Button onClick={createNewFAQ}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>

                <div className="space-y-4">
                  {faq.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-border rounded p-4"
                    >
                      <h3 className="font-heading text-foreground mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingFAQ(item);
                            setIsCreating(false);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFAQ(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingFAQ && (
                  <FAQEditModal
                    item={editingFAQ}
                    onSave={handleSaveFAQ}
                    onCancel={() => {
                      setEditingFAQ(null);
                      setIsCreating(false);
                    }}
                    isCreating={isCreating}
                  />
                )}
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-xl text-foreground uppercase">
                  Edit Privacy Policy
                </h2>
                <PageContentEditor
                  content={privacy}
                  onSave={(content) => {
                    updatePrivacy(content);
                    toast.success("Privacy policy updated!");
                  }}
                />
              </motion.div>
            )}

            {/* Terms Tab */}
            {activeTab === "terms" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="font-heading text-xl text-foreground uppercase">
                  Edit Terms & Conditions
                </h2>
                <PageContentEditor
                  content={terms}
                  onSave={(content) => {
                    updateTerms(content);
                    toast.success("Terms updated!");
                  }}
                />
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// News Edit Modal
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
            <label className="text-sm text-muted-foreground mb-1 block">Full Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full article content..."
              rows={10}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Class Edit Modal
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
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Media Edit Modal
function MediaEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: MediaItem;
  onSave: (item: MediaItem) => void;
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
            {isCreating ? "Add" : "Edit"} Media
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
              placeholder="Media title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MediaItem['type'] })}
                className="w-full h-10 px-3 bg-background border border-border rounded text-foreground"
              >
                <option value="image">Image</option>
                <option value="gif">GIF</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Gameplay"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Source URL</label>
            <Input
              value={formData.src}
              onChange={(e) => setFormData({ ...formData, src: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// FAQ Edit Modal
function FAQEditModal({
  item,
  onSave,
  onCancel,
  isCreating,
}: {
  item: FAQItem;
  onSave: (item: FAQItem) => void;
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
            {isCreating ? "Add" : "Edit"} FAQ
          </h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Question</label>
            <Input
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="What is...?"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Answer</label>
            <Textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="The answer is..."
              rows={5}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Page Content Editor (for Privacy & Terms)
function PageContentEditor({
  content,
  onSave,
}: {
  content: PageContent;
  onSave: (content: PageContent) => void;
}) {
  const [formData, setFormData] = useState(content);

  const updateSection = (index: number, field: 'heading' | 'content', value: string) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { heading: "", content: "" }],
    });
  };

  const removeSection = (index: number) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Page title"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Last Updated</label>
          <Input
            value={formData.lastUpdated}
            onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
            placeholder="August 2024"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Sections</label>
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {formData.sections.map((section, index) => (
          <div key={index} className="border border-border rounded p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Section {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            <Input
              value={section.heading}
              onChange={(e) => updateSection(index, 'heading', e.target.value)}
              placeholder="Section heading"
            />
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(index, 'content', e.target.value)}
              placeholder="Section content..."
              rows={4}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave(formData)}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

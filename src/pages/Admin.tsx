import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, 
  Users, 
  Image,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  Key,
  Crosshair,
  Map,
  Cpu,
  Gamepad2,
  Settings,
  LayoutDashboard,
  Layout,
  Home,
  UserCog,
  Menu,
  X
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

// Import modular tabs
import { DashboardTab } from "@/components/admin/tabs/DashboardTab";
import { NewsTab } from "@/components/admin/tabs/NewsTab";
import { ClassesTab } from "@/components/admin/tabs/ClassesTab";
import { WeaponsTab } from "@/components/admin/tabs/WeaponsTab";
import { MapsTab } from "@/components/admin/tabs/MapsTab";
import { DevicesTab } from "@/components/admin/tabs/DevicesTab";
import { GameModesTab } from "@/components/admin/tabs/GameModesTab";
import { MediaTab } from "@/components/admin/tabs/MediaTab";
import { FeaturesTab } from "@/components/admin/tabs/FeaturesTab";
import { PageBuilderTab } from "@/components/admin/tabs/PageBuilderTab";
import { FAQTab } from "@/components/admin/tabs/FAQTab";
import { UsersTab } from "@/components/admin/tabs/UsersTab";
import { RoadMapTab } from "@/components/admin/tabs/RoadMapTab";

type Tab = "dashboard" | "news" | "section_builder" | "pages" | "classes" | "media" | "faq" | "features" | "weapons" | "maps" | "devices" | "gamemodes" | "settings" | "users" | "roadmap";

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "dashboard");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update URL when tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const {
    isAuthenticated,
    user,
    isPasswordSet,
    isLoading,
    setPassword,
    login,
    logout,
    changePassword,
  } = useAdminAuth();

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const handleSetPassword = (password: string) => {
    setPassword(password);
  };

  const handleLogin = async (username: string, password: string) => {
    return await login(username, password);
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    const success = await changePassword(currentPasswordInput, newPasswordInput);
    setIsChangingPassword(false);
    
    if (success) {
      setShowChangePassword(false);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        isPasswordSet={isPasswordSet}
        onLogin={handleLogin}
        onSetPassword={handleSetPassword}
      />
    );
  }

  // Define all possible navigation items
  const allNavItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard, roles: ['admin', 'moderator', 'editor'] },
    { id: "news" as Tab, label: "News", icon: Newspaper, roles: ['admin', 'moderator', 'editor'] },
    { id: "pages" as Tab, label: "Pages", icon: Layout, roles: ['admin', 'editor'] },
    { id: "classes" as Tab, label: "Classes", icon: Users, roles: ['admin'] },
    { id: "weapons" as Tab, label: "Weapons", icon: Crosshair, roles: ['admin', 'moderator'] },
    { id: "maps" as Tab, label: "Maps", icon: Map, roles: ['admin', 'moderator'] },
    { id: "devices" as Tab, label: "Devices", icon: Cpu, roles: ['admin'] },
    { id: "gamemodes" as Tab, label: "Game Modes", icon: Gamepad2, roles: ['admin'] },
    { id: "media" as Tab, label: "Media", icon: Image, roles: ['admin', 'moderator'] },
    { id: "features" as Tab, label: "Features", icon: Shield, roles: ['admin'] },
    { id: "faq" as Tab, label: "FAQ", icon: HelpCircle, roles: ['admin'] },
    { id: "roadmap" as Tab, label: "Roadmap", icon: Map, roles: ['admin'] },
    { id: "users" as Tab, label: "Users", icon: UserCog, roles: ['admin'] },
    { id: "settings" as Tab, label: "Settings", icon: Settings, roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role || ''));

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border flex justify-between items-center">
        <button 
          onClick={() => handleTabChange("dashboard")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
        >
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-heading text-xl text-primary">Admin Panel</span>
        </button>
        {/* Mobile Close Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {user && (
        <div className="px-6 py-2 text-xs text-muted-foreground border-b border-border/50">
          Logged in as: <span className="font-semibold text-primary">{user.username}</span> ({user.role})
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        <div className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">Content</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-card">
        <AnimatePresence>
          {showChangePassword && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4 space-y-2 bg-background/50 p-3 rounded-md border border-border"
            >
              <Input
                type="password"
                placeholder="Current Password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="h-8 text-xs"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 h-7 text-xs" 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "..." : "Update"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs" 
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPasswordInput("");
                    setNewPasswordInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {!showChangePassword && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowChangePassword(true)}
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-border flex justify-between items-center bg-card">
        <button 
          onClick={() => handleTabChange("dashboard")} 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
        >
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-heading text-xl text-primary">Admin Panel</span>
        </button>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex w-64 bg-card border-r border-border flex-col fixed h-full z-10"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-[calc(100vh-65px)] md:min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading text-foreground capitalize">
                {activeTab === 'gamemodes' ? 'Game Modes' : activeTab}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Manage your {activeTab === 'gamemodes' ? 'game modes' : activeTab} content and settings
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && <DashboardTab onNavigate={(tab) => handleTabChange(tab as Tab)} userRole={user?.role} />}
            {activeTab === "news" && <NewsTab />}
            {activeTab === "pages" && <PageBuilderTab />}
            {activeTab === "classes" && <ClassesTab />}
            {activeTab === "weapons" && <WeaponsTab />}
            {activeTab === "maps" && <MapsTab />}
            {activeTab === "devices" && <DevicesTab />}
            {activeTab === "gamemodes" && <GameModesTab />}
            {activeTab === "media" && <MediaTab />}
            {activeTab === "features" && <FeaturesTab />}
            {activeTab === "faq" && <FAQTab />}
            {activeTab === "roadmap" && <RoadMapTab />}
            {activeTab === "settings" && <SettingsPanel />}
            {activeTab === "users" && <UsersTab />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
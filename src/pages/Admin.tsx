import { useState } from "react";
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
  Home
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { FAQTab } from "@/components/admin/tabs/FAQTab";
import { PrivacyTab } from "@/components/admin/tabs/PrivacyTab";
import { TermsTab } from "@/components/admin/tabs/TermsTab";

type Tab = "dashboard" | "news" | "classes" | "media" | "faq" | "features" | "privacy" | "terms" | "weapons" | "maps" | "devices" | "gamemodes" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");

  const {
    isAuthenticated,
    isPasswordSet,
    isLoading,
    setPassword,
    login,
    logout,
    changePassword,
  } = useAdminAuth();

  const handleSetPassword = (password: string) => {
    setPassword(password);
  };

  const handleLogin = (password: string) => {
    login(password);
  };

  const handleChangePassword = () => {
    if (changePassword(currentPasswordInput, newPasswordInput)) {
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

  const navItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "news" as Tab, label: "News", icon: Newspaper },
    { id: "classes" as Tab, label: "Classes", icon: Users },
    { id: "weapons" as Tab, label: "Weapons", icon: Crosshair },
    { id: "maps" as Tab, label: "Maps", icon: Map },
    { id: "devices" as Tab, label: "Devices", icon: Cpu },
    { id: "gamemodes" as Tab, label: "Game Modes", icon: Gamepad2 },
    { id: "media" as Tab, label: "Media", icon: Image },
    { id: "features" as Tab, label: "Features", icon: Shield },
    { id: "faq" as Tab, label: "FAQ", icon: HelpCircle },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  const legalItems = [
    { id: "privacy" as Tab, label: "Privacy Policy", icon: FileText },
    { id: "terms" as Tab, label: "Terms of Service", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-10"
      >
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-heading text-xl text-primary">Admin Panel</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">Content</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

          <div className="text-xs font-semibold text-muted-foreground uppercase px-3 mt-6 mb-2">Legal</div>
          {legalItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
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
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-heading text-foreground capitalize">
                {activeTab === 'gamemodes' ? 'Game Modes' : activeTab}
              </h1>
              <p className="text-muted-foreground">
                Manage your {activeTab === 'gamemodes' ? 'game modes' : activeTab} content and settings
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {showChangePassword && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 bg-card border border-border rounded-lg p-6 overflow-hidden"
              >
                <h3 className="text-lg font-heading mb-4">Change Admin Password</h3>
                <div className="flex gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Current Password</label>
                    <Input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">New Password</label>
                    <Input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleChangePassword}>Update Password</Button>
                  <Button variant="ghost" onClick={() => setShowChangePassword(false)}>Cancel</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Area */}
          <div className="bg-background rounded-xl min-h-[500px]">
            {activeTab === "dashboard" && <DashboardTab onNavigate={setActiveTab} />}
            {activeTab === "news" && <NewsTab />}
            {activeTab === "classes" && <ClassesTab />}
            {activeTab === "weapons" && <WeaponsTab />}
            {activeTab === "maps" && <MapsTab />}
            {activeTab === "devices" && <DevicesTab />}
            {activeTab === "gamemodes" && <GameModesTab />}
            {activeTab === "media" && <MediaTab />}
            {activeTab === "features" && <FeaturesTab />}
            {activeTab === "faq" && <FAQTab />}
            {activeTab === "settings" && <SettingsPanel />}
            {activeTab === "privacy" && <PrivacyTab />}
            {activeTab === "terms" && <TermsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

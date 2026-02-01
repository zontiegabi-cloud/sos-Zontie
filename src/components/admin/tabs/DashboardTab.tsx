import { motion } from "framer-motion";
import { 
  Newspaper, 
  Users, 
  Image, 
  HelpCircle, 
  Shield, 
  FileText,
  Crosshair,
  Map,
  Cpu,
  Gamepad2,
  RefreshCw
} from "lucide-react";
import { useContent } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DashboardTab({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const { 
    news, 
    classes, 
    media, 
    faq, 
    features, 
    weapons, 
    maps, 
    gameDevices: devices, 
    gameModes,
    reset
  } = useContent();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all content to defaults? This cannot be undone.")) {
      reset();
      toast.success("Content reset to defaults");
    }
  };

  const stats = [
    { label: "News Articles", count: news.length, icon: Newspaper, tab: "news", color: "text-blue-500" },
    { label: "Classes", count: classes.length, icon: Users, tab: "classes", color: "text-green-500" },
    { label: "Weapons", count: weapons.length, icon: Crosshair, tab: "weapons", color: "text-red-500" },
    { label: "Maps", count: maps.length, icon: Map, tab: "maps", color: "text-yellow-500" },
    { label: "Devices", count: devices.length, icon: Cpu, tab: "devices", color: "text-purple-500" },
    { label: "Game Modes", count: gameModes.length, icon: Gamepad2, tab: "gamemodes", color: "text-orange-500" },
    { label: "Media Items", count: media.length, icon: Image, tab: "media", color: "text-pink-500" },
    { label: "Features", count: features.length, icon: Shield, tab: "features", color: "text-indigo-500" },
    { label: "FAQs", count: faq.length, icon: HelpCircle, tab: "faq", color: "text-cyan-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-heading text-primary">Dashboard Overview</h2>
           <p className="text-muted-foreground">Welcome to the admin control panel.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="text-destructive hover:text-destructive">
           <RefreshCw className="w-4 h-4 mr-2" />
           Reset Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => onNavigate(stat.tab)}
          >
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click to manage
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             <div 
               className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center text-center gap-2"
               onClick={() => onNavigate("news")}
             >
               <Newspaper className="h-6 w-6 text-primary" />
               <span className="text-sm font-medium">Post News</span>
             </div>
             <div 
               className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center text-center gap-2"
               onClick={() => onNavigate("settings")}
             >
               <FileText className="h-6 w-6 text-primary" />
               <span className="text-sm font-medium">Site Settings</span>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-heading">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Admin Access</span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full font-bold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Content Storage</span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full font-bold">Local</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Login</span>
              <span className="text-sm text-foreground">Just now</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

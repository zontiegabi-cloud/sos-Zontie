import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Facebook, 
  Youtube, 
  ExternalLink,
  Twitter,
  Instagram,
  Twitch,
  Gamepad2,
  Globe,
  LogOut,
  User as UserIcon,
  Image as ImageIcon,
  Key,
  Lock,
  Eye,
  EyeOff,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/config";

// Map platform names to icons
const PlatformIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  instagram: Instagram,
  twitch: Twitch,
  discord: Gamepad2,
  steam: Gamepad2,
  other: Globe,
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsernameOrEmail, setAuthUsernameOrEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authRegisterEmail, setAuthRegisterEmail] = useState("");
  const [authRegisterUsername, setAuthRegisterUsername] = useState("");
  const [authRegisterPassword, setAuthRegisterPassword] = useState("");
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { branding, socialLinks, navbar } = settings;
  const { user: currentUser, logout, changePassword, updateProfile, login, register } = useAdminAuth();

  const sortedNavItems = navbar
    ? navbar.filter(item => item.enabled !== false).sort((a, b) => a.order - b.order)
    : [];

  // Find Steam link for the CTA button
  const steamLink = socialLinks.find(link => link.platform === 'steam' && link.enabled);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

  const handleSaveProfile = async () => {
    await updateProfile({
      newUsername: profileUsername || undefined,
      displayName: profileDisplayName,
      avatarUrl: profileAvatarUrl || null,
    });
    setIsProfileDialogOpen(false);
  };

  const handleChangePassword = async () => {
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const resetAuthForm = () => {
    setAuthError("");
    setAuthUsernameOrEmail("");
    setAuthPassword("");
    setAuthRegisterEmail("");
    setAuthRegisterUsername("");
    setAuthRegisterPassword("");
    setAuthShowPassword(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        if (authUsernameOrEmail.includes("@") && !isValidEmail(authUsernameOrEmail)) {
          setAuthError("Please enter a valid email address");
          setAuthLoading(false);
          return;
        }
        const success = await login(authUsernameOrEmail, authPassword);
        if (!success) {
          setAuthError("Invalid username or password");
        } else {
          setIsAuthDialogOpen(false);
          resetAuthForm();
        }
      } else {
        if (!authRegisterEmail || !authRegisterPassword) {
          setAuthError("Email and password are required");
          setAuthLoading(false);
          return;
        }
        if (!isValidEmail(authRegisterEmail)) {
          setAuthError("Please enter a valid email address");
          setAuthLoading(false);
          return;
        }
        const success = await register(authRegisterEmail, authRegisterPassword, authRegisterUsername || undefined);
        if (!success) {
          setAuthError("Registration failed");
        } else {
          setIsAuthDialogOpen(false);
          resetAuthForm();
        }
      }
    } catch {
      setAuthError("An error occurred");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Steam auth payload passed back via query param (?steam_auth=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamAuth = params.get('steam_auth');
    if (steamAuth) {
      try {
        const data = JSON.parse(decodeURIComponent(steamAuth));
        localStorage.setItem('sos_admin_token', data.token);
        localStorage.setItem(
          'sos_admin_user',
          JSON.stringify({
            username: data.username,
            role: data.role,
            displayName: data.displayName || data.username,
            avatarUrl: data.avatarUrl || null,
          })
        );
      } catch (e) {
        console.error('Failed to apply Steam auth payload', e);
      } finally {
        const url = new URL(window.location.href);
        url.searchParams.delete('steam_auth');
        window.history.replaceState({}, '', url.toString());
        window.location.replace('/');
      }
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-darker/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {branding.logoUrl && (
              <img 
                src={branding.logoUrl} 
                alt={branding.siteName} 
                className="h-10 lg:h-12 w-auto object-contain" 
              />
            )}
            <div className="relative">
              <span className="font-display text-2xl lg:text-3xl tracking-wider text-primary text-glow-primary uppercase">
                {branding.siteName.split(' ')[0]}
              </span>
              <span className="font-display text-2xl lg:text-3xl tracking-wider text-foreground ml-2 uppercase">
                {branding.siteName.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {sortedNavItems.map((link) => (
              link.isExternal ? (
                <a
                  key={link.id}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-sm tracking-wide uppercase transition-all duration-300 hover:text-primary text-muted-foreground flex items-center gap-1"
                >
                  {link.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`font-heading text-sm tracking-wide uppercase transition-all duration-300 hover:text-primary ${
                    location.pathname === link.path
                      ? "text-primary text-glow-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Right Side - User/Login + Social + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20">
                    {currentUser.avatarUrl && currentUser.avatarUrl.startsWith("preset:")
                      ? (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border border-primary/50 ${
                            currentUser.avatarUrl === "preset:green" ? "bg-emerald-600" :
                            currentUser.avatarUrl === "preset:purple" ? "bg-purple-600" :
                            currentUser.avatarUrl === "preset:orange" ? "bg-orange-600" :
                            currentUser.avatarUrl === "preset:red" ? "bg-red-600" :
                            "bg-primary"
                          }`}
                        >
                          <Gamepad2 className="w-3 h-3 text-white" />
                        </div>
                      )
                      : currentUser.avatarUrl
                        ? (
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.displayName || currentUser.username}
                            className="w-6 h-6 rounded-full object-cover border border-primary/50"
                          />
                        )
                        : (
                          <Gamepad2 className="w-4 h-4" />
                        )}
                    <span>{currentUser.displayName || currentUser.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Logged in as</span>
                    <span className="font-medium">{currentUser.displayName || currentUser.username}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(currentUser.role === "admin" || currentUser.role === "moderator") && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/admin");
                      }}
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      setProfileDisplayName(currentUser.displayName || "");
                      setProfileUsername(currentUser.username);
                      setProfileAvatarUrl(currentUser.avatarUrl || "");
                      setIsProfileDialogOpen(true);
                    }}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setIsPasswordDialogOpen(true);
                    }}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change password
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAuthMode("login");
                  setIsAuthDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Login</span>
                </div>
              </Button>
            )}

            {socialLinks.filter(link => link.enabled && link.platform !== 'steam').slice(0, 3).map((link) => {
              const Icon = PlatformIcons[link.platform] || Globe;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
            
            {steamLink && (
              <Button
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading uppercase tracking-wide glow-accent"
              >
                <a
                  href={steamLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span>{steamLink.label || "Steam Page"}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface-darker border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {sortedNavItems.map((link) => (
                link.isExternal ? (
                  <a
                    key={link.id}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-lg tracking-wide uppercase text-muted-foreground flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={`font-heading text-lg tracking-wide uppercase ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              
              <div className="border-t border-border pt-4 mt-2 space-y-4">
                 {currentUser ? (
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium w-full justify-center">
                         {currentUser.avatarUrl && currentUser.avatarUrl.startsWith("preset:")
                           ? (
                             <div
                               className={`w-7 h-7 rounded-full flex items-center justify-center border border-primary/50 ${
                                 currentUser.avatarUrl === "preset:green" ? "bg-emerald-600" :
                                 currentUser.avatarUrl === "preset:purple" ? "bg-purple-600" :
                                 currentUser.avatarUrl === "preset:orange" ? "bg-orange-600" :
                                 currentUser.avatarUrl === "preset:red" ? "bg-red-600" :
                                 "bg-primary"
                               }`}
                             >
                               <Gamepad2 className="w-4 h-4 text-white" />
                             </div>
                           )
                           : currentUser.avatarUrl
                             ? (
                               <img
                                 src={currentUser.avatarUrl}
                                 alt={currentUser.displayName || currentUser.username}
                                 className="w-7 h-7 rounded-full object-cover border border-primary/50"
                               />
                             )
                             : (
                               <Gamepad2 className="w-5 h-5" />
                             )}
                         <span>{currentUser.displayName || currentUser.username}</span>
                       </button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuLabel className="flex flex-col">
                         <span className="text-xs text-muted-foreground">Logged in as</span>
                         <span className="font-medium">{currentUser.displayName || currentUser.username}</span>
                       </DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       {(currentUser.role === "admin" || currentUser.role === "moderator") && (
                         <DropdownMenuItem
                           onClick={() => {
                             navigate("/admin");
                           }}
                         >
                           <Gamepad2 className="w-4 h-4 mr-2" />
                           Dashboard
                         </DropdownMenuItem>
                       )}
                       <DropdownMenuItem
                         onClick={() => {
                           setProfileDisplayName(currentUser.displayName || "");
                           setProfileUsername(currentUser.username);
                           setProfileAvatarUrl(currentUser.avatarUrl || "");
                           setIsProfileDialogOpen(true);
                         }}
                       >
                         <UserIcon className="w-4 h-4 mr-2" />
                         Account settings
                       </DropdownMenuItem>
                       <DropdownMenuItem
                         onClick={() => {
                           setCurrentPassword("");
                           setNewPassword("");
                           setIsPasswordDialogOpen(true);
                         }}
                       >
                         <Key className="w-4 h-4 mr-2" />
                         Change password
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem
                         onClick={() => {
                           logout();
                           window.location.href = "/";
                         }}
                       >
                         <LogOut className="w-4 h-4 mr-2" />
                         Log out
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setAuthMode("login");
                      setIsAuthDialogOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 w-full">
                      <Gamepad2 className="w-4 h-4" />
                      <span>Login</span>
                    </div>
                  </Button>
                 )}
                 
                 <div className="flex items-center gap-4 mb-4">
                    {socialLinks.filter(link => link.enabled && link.platform !== 'steam').map((link) => {
                      const Icon = PlatformIcons[link.platform] || Globe;
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-secondary rounded text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                 </div>
                 
                 {steamLink && (
                   <Button
                     asChild
                     className="bg-accent hover:bg-accent/90 text-accent-foreground font-heading uppercase tracking-wide w-full"
                   >
                     <a
                       href={steamLink.url}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2"
                     >
                       <span>{steamLink.label || "Steam Page"}</span>
                       <ExternalLink className="w-4 h-4" />
                     </a>
                   </Button>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isAuthDialogOpen} onOpenChange={(open) => {
        setIsAuthDialogOpen(open);
        if (!open) {
          resetAuthForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === "login" ? "Sign in" : "Create account"}</DialogTitle>
            <DialogDescription>
              {authMode === "login"
                ? "Use your username or email to sign in."
                : "Create a new account with your email and password."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "login" ? (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Username or email</label>
                  <div className="relative">
                    <Input
                      value={authUsernameOrEmail}
                      onChange={(e) => setAuthUsernameOrEmail(e.target.value)}
                      placeholder="Your username or email"
                      className="pl-8"
                    />
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type={authShowPassword ? "text" : "password"}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="pl-8 pr-10"
                    />
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setAuthShowPassword(!authShowPassword)}
                    >
                      {authShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={authRegisterEmail}
                      onChange={(e) => setAuthRegisterEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-8"
                    />
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Username (optional)</label>
                  <div className="relative">
                    <Input
                      value={authRegisterUsername}
                      onChange={(e) => setAuthRegisterUsername(e.target.value)}
                      placeholder="Pick a username"
                      className="pl-8"
                    />
                    <UserIcon className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      type={authShowPassword ? "text" : "password"}
                      value={authRegisterPassword}
                      onChange={(e) => setAuthRegisterPassword(e.target.value)}
                      className="pl-8 pr-10"
                    />
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setAuthShowPassword(!authShowPassword)}
                    >
                      {authShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {authError && (
              <p className="text-sm text-destructive text-center">{authError}</p>
            )}

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={authLoading}>
                {authMode === "login" ? "Login" : "Create account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => {
                  const origin = window.location.origin;
                  window.location.href = `${API_BASE_URL}/auth/steam/start?redirect=${encodeURIComponent(origin)}`;
                }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Login with Steam</span>
              </Button>
            </div>
          </form>
          <div className="pt-2 text-center text-xs text-muted-foreground">
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setAuthError("");
              }}
            >
              {authMode === "login"
                ? "No account yet? Create one"
                : "Already have an account? Login instead"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account settings</DialogTitle>
            <DialogDescription>
              Update your public name and avatar. Username is used to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Display name</label>
              <Input
                value={profileDisplayName}
                onChange={(e) => setProfileDisplayName(e.target.value)}
                placeholder="How your name appears"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={profileUsername}
                onChange={(e) => setProfileUsername(e.target.value)}
                placeholder="Login username"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="w-4 h-4" />
                <span>Avatar</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    profileAvatarUrl === "preset:green"
                      ? "border-primary ring-2 ring-primary/60"
                      : "border-border"
                  } bg-emerald-600`}
                  onClick={() => setProfileAvatarUrl("preset:green")}
                >
                  <Gamepad2 className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    profileAvatarUrl === "preset:purple"
                      ? "border-primary ring-2 ring-primary/60"
                      : "border-border"
                  } bg-purple-600`}
                  onClick={() => setProfileAvatarUrl("preset:purple")}
                >
                  <Gamepad2 className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    profileAvatarUrl === "preset:orange"
                      ? "border-primary ring-2 ring-primary/60"
                      : "border-border"
                  } bg-orange-600`}
                  onClick={() => setProfileAvatarUrl("preset:orange")}
                >
                  <Gamepad2 className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    profileAvatarUrl === "preset:red"
                      ? "border-primary ring-2 ring-primary/60"
                      : "border-border"
                  } bg-red-600`}
                  onClick={() => setProfileAvatarUrl("preset:red")}
                >
                  <Gamepad2 className="w-4 h-4 text-white" />
                </button>
              </div>
              <Input
                value={profileAvatarUrl.startsWith("preset:") ? "" : profileAvatarUrl}
                onChange={(e) => setProfileAvatarUrl(e.target.value)}
                placeholder="Custom avatar image URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Current password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">New password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Update password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

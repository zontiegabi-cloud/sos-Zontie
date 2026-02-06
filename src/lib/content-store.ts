// Content store using localStorage for persistence
import { API_BASE_URL } from "@/config";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  content: string;
  image: string;
  thumbnail?: string;
  bgImage?: string;
  tag: string;
  likes?: number;
  dislikes?: number;
  createdAt?: string;
}

export interface ClassDevice {
  name: string;
  icon: string;
}

export interface ClassItem {
  id: string;
  name: string;
  role: string;
  description: string;
  details: string[];
  image: string;
  icon: string;
  color: string;
  devices?: ClassDevice[];
  devicesUsedTitle?: string;
  createdAt?: string;
}

export interface MediaItem {
  id: string;
  type: "image" | "gif" | "video";
  title: string;
  src: string;
  category: string;
  description?: string;
  thumbnail?: string;
  createdAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
}

export interface PageContent {
  title: string;
  lastUpdated: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export interface Device {
  name: string;
  details: string;
  icon?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  devices: Device[];
  devicesSectionTitle?: string;
  createdAt?: string;
}

// ========== Game Content Interfaces ==========

export interface WeaponAttachment {
  id: string;
  name: string;
  type: "optic" | "barrel" | "grip" | "magazine" | "stock" | "accessory";
  description: string;
  image?: string;
}

export interface WeaponStats {
  damage: number; // 0-100
  accuracy: number; // 0-100
  range: number; // 0-100
  fireRate: number; // 0-100
  mobility: number; // 0-100
  control: number; // 0-100
}

export interface WeaponItem {
  id: string;
  name: string;
  category: "assault" | "smg" | "lmg" | "sniper" | "shotgun" | "pistol" | "melee";
  description: string;
  image: string;
  stats: WeaponStats;
  attachments: WeaponAttachment[];
  createdAt?: string;
}

export interface MapMediaItem {
  type: "image" | "video";
  url: string;
  title?: string;
}

export interface MapItem {
  id: string;
  name: string;
  description: string;
  size: "small" | "medium" | "large";
  environment: string; // e.g., "Urban", "Desert", "Forest"
  image: string;
  media: MapMediaItem[];
  createdAt?: string;
}

export interface GameDeviceItem {
  id: string;
  name: string;
  description: string;
  details: string;
  image: string;
  media: MapMediaItem[];
  classRestriction?: string; // Which class can use it, if any
  createdAt?: string;
}

export interface GameModeItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  rules: string[];
  image: string;
  media: MapMediaItem[];
  playerCount?: string;
  roundTime?: string;
  createdAt?: string;
}

export interface RoadmapTask {
  id: string;
  text: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface RoadmapItem {
  id: string;
  phase: string;
  title: string;
  date: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  description?: string;
  image?: string;
  category?: string;
  tasks: RoadmapTask[];
  order: number;
  createdAt?: string;
}

// ========== Site Settings Interfaces ==========

export interface BackgroundSettings {
  type: 'color' | 'gradient' | 'image' | 'video';
  color?: string; // HSL values like "220 15% 6%"
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  image?: string; // For backward compatibility and newer code
  imageUrl?: string; // For older code
  videoUrl?: string; // For video backgrounds
  opacity?: number; // 0-1
  imageOverlayOpacity?: number; // 0-100
  textureEnabled?: boolean;
  textureOpacity?: number; // 0-100
  // Video settings
  muted?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  parallax?: boolean;
}

export interface SectionBackground {
  hero: BackgroundSettings;
  news: BackgroundSettings;
  features: BackgroundSettings;
  classes: BackgroundSettings;
  cta: BackgroundSettings;
  footer: BackgroundSettings;
}

export interface BrandingSettings {
  siteName: string;
  siteTagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  copyrightText: string;
  poweredByText?: string;
}

export interface SocialLink {
  id: string;
  platform: 'discord' | 'twitter' | 'facebook' | 'youtube' | 'twitch' | 'instagram' | 'steam' | 'reddit' | 'tiktok' | 'other';
  url: string;
  label: string;
  enabled: boolean;
}

export interface SEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  ogImage?: string;
  twitterHandle?: string;
}

export interface HomepageSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface ThemeSettings {
  fonts: {
    display: string; // For h1, h2, h3
    heading: string; // For h4, h5, h6
    body: string;    // For body text
  };
  colors: {
    primary: string;        // HSL values
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
}

export interface HeroButton {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'glow' | 'glass' | 'soft' | 'outline-glow' | 'neo';
  icon?: string;
  width?: string;
  height?: string;
  fontSize?: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  backgroundImage: string;
  overlayOpacity: number;
  buttons: HeroButton[];
  // Styling
  titleColor?: string;
  titleFontSize?: string; // e.g., "text-5xl"
  titleFontWeight?: string; // e.g., "font-bold"
  titleAlignment?: 'left' | 'center' | 'right';
  titleTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
}

export interface CTASettings {
  title: string;
  description: string;
  buttons: HeroButton[];
}

export interface NewsSectionSettings {
  title: string;
  description: string;
  columns: number;
  maxItems: number;
  showDate: boolean;
  showTag: boolean;
  showImage: boolean;
  // Styling
  titleColor?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleAlignment?: 'left' | 'center' | 'right';
  titleTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
}

export interface CustomSection {
  id: string;
  type: 'rich-text' | 'hero' | 'cta' | 'features' | 'html' | 'dynamic-content';
  name: string;
  content: {
    title?: string;
    subtitle?: string;
    description?: string; // HTML allowed
    buttons?: HeroButton[];
    image?: string;
    html?: string; // For raw HTML sections
    [key: string]: any;
  };
  settings: {
    paddingTop: string; 
    paddingBottom: string;
    paddingLeft?: string;
    paddingRight?: string;
    containerWidth: 'default' | 'full' | 'narrow';
    minHeight?: string; // e.g. "100vh", "600px"
    background: BackgroundSettings;
    textColor?: string;
    id?: string;
    showInNav?: boolean;
    navLabel?: string;
    className?: string;
    titleStyle?: 'default' | 'glow' | 'outline' | 'shadow';
    titleColor?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    titleLineHeight?: string;
    titleLetterSpacing?: string;
    titlePaddingTop?: string;
    titlePaddingBottom?: string;
    titlePaddingLeft?: string;
    titlePaddingRight?: string;
    titleMarginTop?: string;
    titleMarginBottom?: string;
    titleMarginLeft?: string;
    titleMarginRight?: string;
    titleWrapperMarginTop?: string;
    titleWrapperMarginBottom?: string;
    titleTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
    titleFontFamily?: string;
    titleDecorationType?: 'none' | 'icon' | 'image' | 'line-icon-line' | 'line-image-line';
    titleDecorationIcon?: string;
    titleDecorationImage?: string;
    titleDecorationPosition?: 'top' | 'bottom' | 'left' | 'right';
    titleDecorationColor?: string;
    titleDecorationSize?: string;
    titleDecorationAlignment?: 'start' | 'center' | 'end';
    titleDecorationOpacity?: number;
    titleDecorationPaddingTop?: string;
    titleDecorationPaddingBottom?: string;
    titleDecorationPaddingLeft?: string;
    titleDecorationPaddingRight?: string;
    titleDecorationMarginTop?: string;
    titleDecorationMarginBottom?: string;
    titleDecorationMarginLeft?: string;
    titleDecorationMarginRight?: string;
    subtitleColor?: string;
    subtitleFontSize?: string;
    subtitleFontWeight?: string;
    subtitleLineHeight?: string;
    subtitleLetterSpacing?: string;
    subtitlePaddingTop?: string;
    subtitlePaddingBottom?: string;
    subtitlePaddingLeft?: string;
    subtitlePaddingRight?: string;
    subtitleMarginTop?: string;
    subtitleMarginBottom?: string;
    subtitleMarginLeft?: string;
    subtitleMarginRight?: string;
    subtitleTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
    subtitleFontFamily?: string;
    bodyFontSize?: string;
    bodyFontWeight?: string;
    bodyLineHeight?: string;
    bodyLetterSpacing?: string;
    bodyFontFamily?: string;
    overlayOpacity?: number;
    scrollIndicator?: {
      enabled: boolean;
      style: 'bounce' | 'pulse' | 'static';
      color?: string; // e.g. "text-primary", "text-white"
      icon: 'chevron-down' | 'arrow-down' | 'mouse';
      text?: string;
      opacity?: number; // 0-1
      position?: {
        bottom?: string; // e.g. "2rem"
        align?: 'left' | 'center' | 'right';
      };
      paddingTop?: string;
      paddingBottom?: string;
      paddingLeft?: string;
      paddingRight?: string;
    };
    textAlign?: 'left' | 'center' | 'right';
    sourceTextAlign?: 'left' | 'center' | 'right';
    customCss?: string;
    customFontName?: string;
    customFontUrl?: string;
    animation?: {
      type: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom';
      duration?: number;
      delay?: number;
    };
  };
  dynamicSources?: DynamicContentSource[];
}

export interface DynamicContentSource {
  type: 'news' | 'media' | 'classes' | 'weapons' | 'maps' | 'features' | 'gameDevices' | 'faq' | 'gameModes' | 'gamemodetab' | 'roadmap';
  displayMode: 'grid' | 'list' | 'carousel' | 'featured' | 'cards' | 'spotlight' | 'masonry' | 'accordion' | 'timeline' | 'showcase';
  cardStyle?: 'default' | 'minimal' | 'overlay' | 'glass' | 'magazine' | 'compact' | 'tech' | 'corporate' | 'featured';
  count: number;
  fetchAll?: boolean;
  title?: string;
  ids?: string[]; // For manual selection
  category?: string; // For filtering by category
  gridColumns?: number; // 1, 2, 3, 4
}

export interface NavbarItem {
  id: string;
  name: string;
  path: string;
  isExternal: boolean;
  order: number;
  enabled: boolean;
}

export interface SiteSettings {
  branding: BrandingSettings;
  hero: HeroSettings;
  cta: CTASettings;
  newsSection: NewsSectionSettings;
  backgrounds: SectionBackground;
  navbar: NavbarItem[];
  socialLinks: SocialLink[];
  seo: SEOSettings;
  homepageSections: HomepageSection[];
  customSections: Record<string, CustomSection>;
  theme: ThemeSettings;
  deletedPageSlugs?: string[];
}

export interface SiteContent {
  news: NewsItem[];
  classes: ClassItem[];
  media: MediaItem[];
  faq: FAQItem[];
  features: FeatureItem[];
  // Game content
  weapons: WeaponItem[];
  maps: MapItem[];
  gameDevices: GameDeviceItem[];
  gameModes?: GameModeItem[];
  roadmap?: RoadmapItem[];
  pages: Page[];
  // Site settings
  settings: SiteSettings;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  sections: CustomSection[];
  seo?: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  settings?: {
    showGameContentNav?: boolean;
    [key: string]: any;
  };
}

// Default pages data
const defaultPages: Page[] = [
  {
    id: "home",
    slug: "home",
    title: "Home",
    status: "published",
    sections: [
      {
        id: "hero",
        type: "hero",
        name: "Main Hero",
        content: {
          title: '<span class="text-primary text-glow-primary">SHADOWS</span><br/><span class="text-foreground">OF SOLDIERS</span>',
          subtitle: "Pick Your Role. Shape the Battlefield.",
          buttons: [
            { text: "Wishlist on Steam", url: "https://store.steampowered.com/app/2713480/Shadows_of_Soldiers/", variant: "primary" },
            { text: "Join Discord", url: "https://discord.gg/shadowsofsoldiers", variant: "outline" }
          ]
        },
        settings: {
          paddingTop: "0",
          paddingBottom: "0",
          containerWidth: "default",
          minHeight: "100vh",
          textAlign: "center",
          titleStyle: "default",
          titleFontSize: "text-5xl sm:text-7xl lg:text-9xl",
          titleFontWeight: "font-display",
          titleTransform: "uppercase",
          overlayOpacity: 60,
          background: { type: "image", image: "/images/hero-bg.jpg", opacity: 0.6 }
        }
      },
      {
        id: "news",
        type: "dynamic-content",
        name: "Latest News",
        content: {
          title: "LATEST NEWS",
          description: "Stay updated with the latest developments and announcements",
          dynamicSources: [
            { type: "news", count: 3, displayMode: "grid", gridColumns: 3 }
          ]
        },
        settings: {
          paddingTop: "5rem",
          paddingBottom: "5rem",
          containerWidth: "default",
          textAlign: "center",
          background: { type: "color", color: "transparent" }
        }
      },
      {
        id: "features",
        type: "dynamic-content",
        name: "Game Features",
        content: {
          title: "GAME FEATURES",
          subtitle: "What makes it unique",
          description: "<p>Explore the key features of our game.</p>",
          dynamicSources: [
            { type: "features", count: 6, displayMode: "grid", gridColumns: 3 }
          ]
        },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          textAlign: "center",
          background: { type: "color", color: "transparent" }
        }
      },
      {
        id: "classes",
        type: "dynamic-content",
        name: "Classes",
        content: {
          title: "CHOOSE YOUR CLASS",
          subtitle: "Find your playstyle",
          dynamicSources: [
            { type: "classes", count: 4, displayMode: "grid", gridColumns: 4 }
          ]
        },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          textAlign: "center",
          background: { type: "color", color: "transparent" }
        }
      },
      {
        id: "cta",
        type: "cta",
        name: "Call to Action",
        content: {
          title: "JOIN THE FIGHT",
          subtitle: "Ready to deploy?",
          description: "<p>Join thousands of players online now.</p>",
          buttons: [{ text: "Download Now", url: "#", variant: "primary" }]
        },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "narrow",
          textAlign: "center",
          background: { type: "color", color: "transparent" }
        }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "news",
    slug: "news",
    title: "News",
    status: "published",
    sections: [
      {
        id: "news-hero",
        type: "hero",
        name: "News Hero",
        content: { 
          title: "LATEST NEWS", 
          subtitle: "Updates from the battlefield" 
        },
        settings: {
          paddingTop: "8rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          textAlign: "center"
        }
      },
      {
        id: "news-list",
        type: "dynamic-content",
        name: "News List",
        content: {},
        settings: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" }
        },
        dynamicSources: [
          { type: "news", displayMode: "grid", count: 12, gridColumns: 3 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "media",
    slug: "media",
    title: "Media",
    status: "published",
    sections: [
      {
        id: "media-hero",
        type: "hero",
        name: "Media Hero",
        content: { 
          title: "MEDIA GALLERY", 
          subtitle: "Screenshots and videos" 
        },
        settings: {
          paddingTop: "8rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          textAlign: "center"
        }
      },
      {
        id: "media-list",
        type: "dynamic-content",
        name: "Media List",
        content: {},
        settings: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" }
        },
        dynamicSources: [
          { type: "media", displayMode: "masonry", count: 20 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "faq",
    slug: "faq",
    title: "FAQ",
    status: "published",
    sections: [
      {
        id: "faq-hero",
        type: "hero",
        name: "FAQ Hero",
        content: { 
          title: "FAQ", 
          subtitle: "Frequently Asked Questions" 
        },
        settings: {
          paddingTop: "8rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          textAlign: "center"
        }
      },
      {
        id: "faq-list",
        type: "dynamic-content",
        name: "FAQ List",
        content: {},
        settings: {
          paddingTop: "2rem",
          paddingBottom: "6rem",
          containerWidth: "narrow",
          background: { type: "color", color: "transparent" }
        },
        dynamicSources: [
          { type: "faq", displayMode: "accordion", count: 50 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "privacy",
    slug: "privacy",
    title: "Privacy Policy",
    status: "published",
    sections: [
      {
        id: "privacy-content",
        type: "rich-text",
        name: "Privacy Content",
        content: { 
          title: "Privacy Policy",
          description: `<h2>1. Introduction</h2>
<p>Welcome to Shadows of Soldiers. We respect your privacy and are committed to protecting your personal data.</p>
<h2>2. Information We Collect</h2>
<p>We may collect identity data, contact data, technical data, and usage data.</p>
<h2>3. How We Use Your Information</h2>
<p>We use your personal data to provide services, notify you of changes, and allow participation in playtests.</p>
<h2>4. Data Security</h2>
<p>We have implemented appropriate security measures to prevent unauthorized access.</p>
<h2>5. Your Rights</h2>
<p>You have rights to access, correct, and request deletion of your personal data.</p>
<h2>6. Contact Us</h2>
<p>Contact us through our social media channels or Discord community.</p>`
        },
        settings: {
          paddingTop: "8rem",
          paddingBottom: "6rem",
          containerWidth: "narrow",
          background: { type: "color", color: "transparent" }
        }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "terms",
    slug: "terms",
    title: "Terms of Service",
    status: "published",
    sections: [
      {
        id: "terms-content",
        type: "rich-text",
        name: "Terms Content",
        content: { 
          title: "Terms of Service",
          description: `<h2>1. Agreement to Terms</h2>
<p>By accessing our services, you agree to be bound by these Terms and Conditions.</p>
<h2>2. Intellectual Property</h2>
<p>All game content and materials are protected by copyright and trademark laws.</p>
<h2>3. User Conduct</h2>
<p>You agree not to violate laws, harass others, or engage in hacking activities.</p>
<h2>4. Playtest Participation</h2>
<p>Playtest content is confidential and may not be shared without permission.</p>
<h2>5. Disclaimer of Warranties</h2>
<p>Our services are provided 'as is' without warranties.</p>
<h2>6. Contact</h2>
<p>Contact us through our official social media channels or Discord.</p>`
        },
        settings: {
          paddingTop: "8rem",
          paddingBottom: "6rem",
          containerWidth: "narrow",
          background: { type: "color", color: "transparent" }
        }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "game-content",
    slug: "game-content",
    title: "Game Content",
    status: "published",
    sections: [
      {
        id: "game-hero",
        type: "hero",
        name: "Game Hero",
        content: { 
          title: "GAME CONTENT", 
          subtitle: "Weapons, Maps, and more" 
        },
        settings: {
          paddingTop: "8rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          textAlign: "center"
        }
      },
      {
        id: "weapons-section",
        type: "dynamic-content",
        name: "Weapons",
        content: { title: "Weapons" },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          showInNav: true,
          navLabel: "Weapons"
        },
        dynamicSources: [
          { type: "weapons", displayMode: "grid", count: 20, gridColumns: 3 }
        ]
      },
      {
        id: "maps-section",
        type: "dynamic-content",
        name: "Maps",
        content: { title: "Maps" },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          showInNav: true,
          navLabel: "Maps"
        },
        dynamicSources: [
          { type: "maps", displayMode: "grid", count: 20, gridColumns: 2 }
        ]
      },
      {
        id: "devices-section",
        type: "dynamic-content",
        name: "Devices",
        content: { title: "Devices" },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          showInNav: true,
          navLabel: "Devices"
        },
        dynamicSources: [
          { type: "gameDevices", displayMode: "grid", count: 20, gridColumns: 3 }
        ]
      },
      {
        id: "modes-section",
        type: "dynamic-content",
        name: "Game Modes",
        content: { title: "Game Modes" },
        settings: {
          paddingTop: "4rem",
          paddingBottom: "4rem",
          containerWidth: "default",
          background: { type: "color", color: "transparent" },
          showInNav: true,
          navLabel: "Game Modes"
        },
        dynamicSources: [
          { type: "gameModes", displayMode: "grid", count: 20, gridColumns: 3 }
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

];



const STORAGE_KEY = 'sos-content';

// Default news data
const defaultNews: NewsItem[] = [
  {
    id: "1",
    title: "Shadows of Soldiers on Unreal Engine 5",
    date: "August 2024",
    description: "We are building on Unreal Engine 5, allowing us to create stunning visuals and realistic gameplay mechanics.",
    content: `We are thrilled to announce that Shadows of Soldiers is being developed on Unreal Engine 5, Epic Games' latest and most powerful game engine.

## Why Unreal Engine 5?

Unreal Engine 5 brings revolutionary features that allow us to create the most immersive tactical shooter experience possible:

- **Nanite Virtualized Geometry**: This technology allows us to render incredibly detailed environments and characters without sacrificing performance.

- **Lumen Global Illumination**: Real-time lighting that reacts dynamically to the environment.

- **Enhanced Physics**: More realistic destruction, particle effects, and environmental interactions.

## What This Means for Players

With UE5, we're able to deliver:
- Photorealistic environments
- Smooth 60+ FPS gameplay on modern hardware
- Large-scale maps with no loading screens
- Dynamic weather and time-of-day systems`,
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    tag: "Development",
  },
  {
    id: "2",
    title: "Playtest Sign-ups Open",
    date: "Coming Soon",
    description: "Sign up to be part of our exclusive playtests and help shape the future of Shadows of Soldiers.",
    content: `We're opening up playtest sign-ups for dedicated players who want to help shape the future of Shadows of Soldiers.

## How to Sign Up

1. Join our Discord community
2. Fill out the playtest application form
3. Wait for your invitation email

## What to Expect

Selected playtesters will get access to:
- Early builds of the game
- Direct communication with developers
- Exclusive in-game rewards for launch`,
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    tag: "Community",
  },
  {
    id: "3",
    title: "Advanced Cover System",
    date: "In Development",
    description: "Our cover system rewards tactical positioning and smart movement throughout the battlefield.",
    content: `One of the core pillars of Shadows of Soldiers is our advanced cover system, designed to reward tactical thinking and smart positioning.

## Context-Sensitive Cover

Our system automatically detects:
- Low walls for crouching cover
- High walls for standing cover
- Corners for leaning and peeking
- Windows for shooting positions

## Dynamic Interactions

While in cover, players can:
- Blind fire over or around cover
- Quickly peek and snap back
- Vault over low cover for aggressive pushes`,
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    tag: "Features",
  },
];

// Default classes data
const defaultClasses: ClassItem[] = [
  {
    id: "1",
    name: "JUGGERNAUT",
    role: "Tank",
    description: "Heavy armor and suppressive firepower. Lead the charge and absorb enemy fire while your team advances.",
    details: [
      "Maximum armor protection",
      "Heavy weapons specialist",
      "Suppressive fire capabilities",
      "Team shield abilities"
    ],
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    icon: "Crosshair",
    color: "from-red-500/20 to-transparent",
    devices: [
      { name: "Heavy Armor", icon: "Shield" },
      { name: "LMG", icon: "Target" }
    ],
  },
  {
    id: "2",
    name: "COMMANDER",
    role: "Support",
    description: "Tactical leadership and team support. Coordinate strikes and provide crucial battlefield advantages.",
    details: [
      "Team coordination",
      "Tactical strikes",
      "Support abilities",
      "Battlefield control"
    ],
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    icon: "Shield",
    color: "from-yellow-500/20 to-transparent",
    devices: [
      { name: "Tactical Radio", icon: "Zap" },
      { name: "Binoculars", icon: "Eye" }
    ],
  },
  {
    id: "3",
    name: "SHADOW",
    role: "Recon",
    description: "Speed and stealth. Flank enemies, gather intel, and strike from unexpected angles.",
    details: [
      "Enhanced mobility",
      "Stealth capabilities",
      "Intel gathering",
      "Flanking maneuvers"
    ],
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    icon: "Eye",
    color: "from-blue-500/20 to-transparent",
    devices: [
      { name: "Sniper Rifle", icon: "Crosshair" },
      { name: "Silencer", icon: "Target" }
    ],
  },
];

// Default media data
const defaultMedia: MediaItem[] = [
  { id: "1", type: "gif", title: "Shelter Environment", src: "https://www.shadowsofsoldiers.com/assets/shelter.gif", category: "Gameplay", description: "Explore the immersive shelter environments in Shadows of Soldiers." },
  { id: "2", type: "gif", title: "Cover System", src: "https://www.shadowsofsoldiers.com/assets/cover.gif", category: "Gameplay", description: "Our advanced cover system rewards tactical positioning." },
  { id: "3", type: "gif", title: "Weapon Customization", src: "https://www.shadowsofsoldiers.com/assets/weaponcustomise.gif", category: "Features", description: "Deep weapon customization with realistic attachments." },
  { id: "4", type: "image", title: "Juggernaut Class", src: "https://www.shadowsofsoldiers.com/assets/webp/juggernaut.webp", category: "Classes", description: "Heavy armor and suppressive firepower." },
  { id: "5", type: "image", title: "Shadow Class", src: "https://www.shadowsofsoldiers.com/assets/webp/shadow.webp", category: "Classes", description: "Speed and stealth for flanking enemies." },
  { id: "6", type: "image", title: "Commander Class", src: "https://www.shadowsofsoldiers.com/assets/webp/commander.webp", category: "Classes", description: "Tactical leadership and team support." },
  { id: "7", type: "image", title: "Unreal Engine 5", src: "https://www.shadowsofsoldiers.com/assets/webp/new-ue5-image.webp", category: "Development", description: "Built on Unreal Engine 5 for stunning visuals." },
  { id: "8", type: "image", title: "Abilities System", src: "https://www.shadowsofsoldiers.com/assets/webp/abilities.webp", category: "Features", description: "Unique abilities for each class." },
];

// Default FAQ data
const defaultFAQ: FAQItem[] = [
  { id: "1", question: "What is Shadows of Soldiers?", answer: "Shadows of Soldiers is a tactical 5v5 shooter built on Unreal Engine 5. It features class-based gameplay with unique abilities, an advanced cover system, and deep weapon customization." },
  { id: "2", question: "What platforms will the game be available on?", answer: "Shadows of Soldiers will initially launch on PC via Steam. Console versions may be considered after the PC release based on community demand." },
  { id: "3", question: "When will the game be released?", answer: "We're currently in active development. Sign up for playtests and join our Discord to stay updated on release dates." },
  { id: "4", question: "How can I participate in playtests?", answer: "Join our Discord community to be notified about upcoming playtest opportunities." },
  { id: "5", question: "What are the different classes?", answer: "There are three classes: Juggernaut (Tank), Shadow (Recon), and Commander (Support). Each class has unique abilities." },
  { id: "6", question: "Will there be weapon customization?", answer: "Yes! Shadows of Soldiers features deep weapon customization with realistic attachments and modifications." },
  { id: "7", question: "Is there a cover system?", answer: "Absolutely. Our advanced cover system rewards tactical positioning and smart movement." },
  { id: "8", question: "How can I support the game?", answer: "Wishlist on Steam, join our Discord, and follow us on social media!" },
];

// Default Roadmap data
const defaultRoadmap: RoadmapItem[] = [
  {
    id: "1",
    phase: "Prototype",
    title: "Prototype",
    date: "Q4 2024",
    status: "completed",
    description: "The internal prototyping phase of Shadows of Soldiers fundamental mechanics and systems.",
    tasks: [
      { id: "1", text: "Basic weapon mechanics", status: "completed" },
      { id: "2", text: "Basic movement system", status: "completed" },
      { id: "3", text: "Basic health and armor system", status: "completed" },
      { id: "4", text: "Prototype of the class system", status: "completed" }
    ],
    order: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    phase: "Pre-Alpha",
    title: "Pre-Alpha",
    date: "Q1 2025",
    status: "in-progress",
    description: "The first small version designed to demonstrate technical potential.",
    tasks: [
      { id: "5", text: "Advanced destruction system", status: "completed" },
      { id: "6", text: "New weapon types", status: "completed" },
      { id: "7", text: "Network services and Matchmaking", status: "completed" },
      { id: "8", text: "Weapon Customization System", status: "in-progress" },
      { id: "9", text: "Class gadgets implementation", status: "pending" }
    ],
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    phase: "Alpha",
    title: "Alpha",
    date: "Q4 2026",
    status: "planned",
    description: "Move to dedicated servers and run the game 24/7.",
    tasks: [
      { id: "10", text: "Tactical movement v1.0", status: "pending" },
      { id: "11", text: "Interactive world", status: "pending" },
      { id: "12", text: "Further graphics improvements", status: "pending" }
    ],
    order: 2,
    createdAt: new Date().toISOString()
  }
];

// Default features data
const defaultFeatures: FeatureItem[] = [
  {
    id: "1",
    title: "Abilities",
    description: "Each class has unique abilities that can turn the tide of battle when used strategically.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/shelter.gif",
    icon: "Crosshair",
    devices: [
      { name: "Tactical Shield", details: "Deployable cover that provides protection and allows team movement" },
      { name: "Combat Stim", details: "Temporary boost to speed and reaction time for critical moments" },
      { name: "Recon Drone", details: "Scout ahead and mark enemies for your team" },
      { name: "Med Kit", details: "Advanced healing system that restores health over time" }
    ],
  },
  {
    id: "2",
    title: "Cover System",
    description: "Advanced cover mechanics reward tactical positioning and smart movement.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/cover-1-1.gif",
    icon: "Shield",
    devices: [
      { name: "Dynamic Cover", details: "Interactive cover that can be destroyed or repositioned" },
      { name: "Peek System", details: "Lean and peek around corners with realistic body positioning" },
      { name: "Cover Indicators", details: "Visual feedback showing effective cover positions" },
      { name: "Vault Mechanics", details: "Smooth vaulting over obstacles and through windows" }
    ],
  },
  {
    id: "3",
    title: "Weapon Customization",
    description: "Deep weapon customization with realistic attachments and modifications.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/weapon_custimization.gif",
    icon: "Wrench",
    devices: [
      { name: "Optics & Scopes", details: "Multiple sight options from red dots to long-range scopes" },
      { name: "Barrel Attachments", details: "Suppressors, compensators, and extended barrels" },
      { name: "Grip Systems", details: "Foregrips and stocks that affect recoil and handling" },
      { name: "Magazine Mods", details: "Extended magazines and specialized ammunition types" },
      { name: "Rail Accessories", details: "Flashlights, lasers, and tactical equipment" }
    ],
  },
  {
    id: "4",
    title: "Tactical Gameplay",
    description: "Every move matters. Every shot counts. Every victory is earned.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/weapon_custimization.gif",
    icon: "Target",
    devices: [
      { name: "Realistic Ballistics", details: "Bullet drop, wind resistance, and material penetration" },
      { name: "Stamina System", details: "Manage your energy for sprinting, aiming, and combat" },
      { name: "Sound Design", details: "3D positional audio for tactical awareness" },
      { name: "Team Coordination", details: "Advanced communication tools and team markers" }
    ],
  },
];

// Default weapons data
const defaultWeapons: WeaponItem[] = [
  {
    id: "1",
    name: "AR-15 Tactical",
    category: "assault",
    description: "A versatile assault rifle with balanced stats, perfect for medium-range engagements.",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800",
    stats: { damage: 65, accuracy: 70, range: 75, fireRate: 70, mobility: 60, control: 65 },
    attachments: [
      { id: "1a", name: "Red Dot Sight", type: "optic", description: "Fast target acquisition for close-medium range" },
      { id: "1b", name: "Suppressor", type: "barrel", description: "Reduces sound and muzzle flash" },
      { id: "1c", name: "Vertical Grip", type: "grip", description: "Improves vertical recoil control" },
      { id: "1d", name: "Extended Magazine", type: "magazine", description: "Increases ammo capacity to 40 rounds" },
    ],
  },
  {
    id: "2",
    name: "SMG-X9",
    category: "smg",
    description: "High fire rate submachine gun ideal for close-quarters combat.",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800",
    stats: { damage: 45, accuracy: 55, range: 40, fireRate: 90, mobility: 85, control: 50 },
    attachments: [
      { id: "2a", name: "Holographic Sight", type: "optic", description: "Clear sight picture for fast shooting" },
      { id: "2b", name: "Compensator", type: "barrel", description: "Reduces horizontal recoil" },
    ],
  },
  {
    id: "3",
    name: "Tactical Sniper",
    category: "sniper",
    description: "Precision bolt-action rifle for long-range eliminations.",
    image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800",
    stats: { damage: 95, accuracy: 90, range: 100, fireRate: 20, mobility: 35, control: 75 },
    attachments: [
      { id: "3a", name: "8x Scope", type: "optic", description: "High magnification for long-range shots" },
      { id: "3b", name: "Bipod", type: "accessory", description: "Increased stability when prone" },
    ],
  },
];

// Default maps data
const defaultMaps: MapItem[] = [
  {
    id: "1",
    name: "Industrial Complex",
    description: "A sprawling abandoned factory with multiple entry points and vertical gameplay opportunities.",
    size: "large",
    environment: "Urban Industrial",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800", title: "Overview" },
    ],
  },
  {
    id: "2",
    name: "Desert Outpost",
    description: "A remote military base in the desert with long sightlines and strategic positions.",
    size: "medium",
    environment: "Desert",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    media: [],
  },
];

// Default game devices data (6 devices)
const defaultGameDevices: GameDeviceItem[] = [
  {
    id: "1",
    name: "Tactical Shield",
    description: "Deployable ballistic shield providing mobile cover.",
    details: "The Tactical Shield can be deployed in 2 seconds and provides full frontal protection. It has 500 HP and can be picked up and redeployed.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    media: [],
    classRestriction: "Juggernaut",
  },
  {
    id: "2",
    name: "Recon Drone",
    description: "Remote-controlled drone for scouting enemy positions.",
    details: "Can be deployed to scout ahead and mark enemies. Has a 60-second battery life and can be destroyed by enemy fire.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800",
    media: [],
    classRestriction: "Shadow",
  },
  {
    id: "3",
    name: "Med Kit",
    description: "Advanced medical supplies for healing teammates.",
    details: "Heals 50 HP over 5 seconds. Can be used on self or teammates within 3 meters.",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800",
    media: [],
    classRestriction: "Commander",
  },
  {
    id: "4",
    name: "Flash Grenade",
    description: "Non-lethal grenade that blinds and deafens enemies.",
    details: "2-second fuse time. Affects enemies within 10 meters. Full effect lasts 3 seconds.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    media: [],
  },
  {
    id: "5",
    name: "Smoke Grenade",
    description: "Creates a smoke screen for tactical concealment.",
    details: "Smoke lasts 15 seconds and covers a 10-meter radius. Blocks thermal imaging.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    media: [],
  },
  {
    id: "6",
    name: "C4 Explosive",
    description: "Remote detonation explosive for strategic destruction.",
    details: "Can be placed on surfaces and detonated remotely. 200 damage within 5 meters.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    media: [],
  },
];

// Default game modes data
const defaultGameModes: GameModeItem[] = [
  {
    id: "1",
    name: "Team Deathmatch",
    shortName: "TDM",
    description: "Classic team-based combat where the first team to reach the score limit wins.",
    rules: [
      "Two teams of 5 players compete",
      "First team to 50 kills wins",
      "Respawn time: 5 seconds",
      "Match time limit: 10 minutes"
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    media: [],
    playerCount: "5v5",
    roundTime: "10 minutes",
  },
  {
    id: "2",
    name: "Quick Capture",
    shortName: "QC",
    description: "Objective-based mode where teams compete to capture and hold strategic points.",
    rules: [
      "Three capture points on the map",
      "Earn points while holding positions",
      "First team to 200 points wins",
      "Capturing takes 10 seconds"
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    media: [],
    playerCount: "5v5",
    roundTime: "12 minutes",
  },
];

// Default site settings
const defaultSettings: SiteSettings = {
  branding: {
    siteName: "Shadows of Soldiers",
    siteTagline: "Pick Your Role. Shape the Battlefield.",
    logoUrl: "",
    faviconUrl: "",
    copyrightText: "© 2024 Shadows of Soldiers. All rights reserved.",
    poweredByText: "Powered by Unreal Engine 5",
  },
  hero: {
    title: "SHADOWS<br/>OF SOLDIERS",
    subtitle: "Pick Your Role. Shape the Battlefield.",
    backgroundImage: "https://www.shadowsofsoldiers.com/wp-content/uploads/2020/08/ZA1JOmc-scaled.jpg",
    overlayOpacity: 60,
    buttons: [
      { text: "Wishlist on Steam", url: "https://store.steampowered.com/app/2713480/Shadows_of_Soldiers/", variant: "primary", icon: "ExternalLink" },
      { text: "Join Discord", url: "https://discord.gg/shadowsofsoldiers", variant: "outline" }
    ]
  },
  cta: {
    title: "READY TO <span class=\"text-accent text-glow-accent\">JUMP INTO BATTLE?</span>",
    description: "Join thousands of players waiting for the next generation of tactical shooters. Wishlist now and be the first to know when we launch.",
    buttons: [
      { text: "Wishlist on Steam", url: "https://store.steampowered.com/app/2713480/Shadows_of_Soldiers/", variant: "primary", icon: "ExternalLink" },
      { text: "Join Our Discord", url: "https://discord.gg/shadowsofsoldiers", variant: "outline", icon: "MessageCircle" }
    ]
  },
  newsSection: {
    title: "Latest Intel",
    description: "Stay updated with the latest news and development progress.",
    columns: 3,
    maxItems: 3,
    showDate: true,
    showTag: true,
    showImage: true
  },
  backgrounds: {
    hero: {
      type: "image",
      imageUrl: "https://www.shadowsofsoldiers.com/wp-content/uploads/2020/08/ZA1JOmc-scaled.jpg",
      imageOverlayOpacity: 60,
      textureEnabled: false,
      textureOpacity: 3,
    },
    news: {
      type: "color",
      color: "220 15% 6%",
      textureEnabled: true,
      textureOpacity: 3,
    },
    features: {
      type: "gradient",
      gradientFrom: "220 15% 8%",
      gradientTo: "220 15% 4%",
      gradientDirection: "to-b",
      textureEnabled: true,
      textureOpacity: 3,
    },
    classes: {
      type: "color",
      color: "220 15% 6%",
      textureEnabled: true,
      textureOpacity: 3,
    },
    cta: {
      type: "gradient",
      gradientFrom: "220 15% 8%",
      gradientTo: "220 15% 4%",
      gradientDirection: "to-b",
      textureEnabled: false,
      textureOpacity: 3,
    },
    footer: {
      type: "color",
      color: "220 15% 4%",
      textureEnabled: false,
      textureOpacity: 3,
    },
  },
  navbar: [
    { id: "1", name: "Home", path: "/", isExternal: false, order: 0, enabled: true },
    { id: "2", name: "Game Content", path: "/game-content", isExternal: false, order: 1, enabled: true },
    { id: "3", name: "Media", path: "/media", isExternal: false, order: 2, enabled: true },
    { id: "4", name: "News", path: "/news", isExternal: false, order: 3, enabled: true },
    { id: "5", name: "FAQ", path: "/faq", isExternal: false, order: 4, enabled: true },
  ],
  socialLinks: [
    { id: "1", platform: "discord", url: "https://discord.gg/shadowsofsoldiers", label: "Discord", enabled: true },
    { id: "2", platform: "steam", url: "https://store.steampowered.com/app/2713480/Shadows_of_Soldiers/", label: "Steam", enabled: true },
    { id: "3", platform: "facebook", url: "https://www.facebook.com/shadowsofsoldiers", label: "Facebook", enabled: true },
    { id: "4", platform: "youtube", url: "https://www.youtube.com/@shadowsofsoldiers", label: "YouTube", enabled: true },
    { id: "5", platform: "twitter", url: "", label: "Twitter/X", enabled: false },
    { id: "6", platform: "instagram", url: "", label: "Instagram", enabled: false },
    { id: "7", platform: "twitch", url: "", label: "Twitch", enabled: false },
    { id: "8", platform: "reddit", url: "", label: "Reddit", enabled: false },
  ],
  seo: {
    defaultTitle: "Shadows of Soldiers - Tactical 5v5 Shooter",
    defaultDescription: "A tactical 5v5 shooter built on Unreal Engine 5 where every move matters, every shot counts, and every victory is earned.",
    defaultKeywords: ["tactical shooter", "5v5", "unreal engine 5", "fps", "multiplayer", "shadows of soldiers"],
    ogImage: "",
    twitterHandle: "",
  },
  homepageSections: [
    { id: "hero", name: "Hero Section", enabled: true, order: 0 },
    { id: "news", name: "News Section", enabled: true, order: 1 },
    { id: "features", name: "Features Section", enabled: true, order: 2 },
    { id: "classes", name: "Classes Section", enabled: true, order: 3 },
    { id: "cta", name: "CTA Section", enabled: true, order: 4 },
  ],
  customSections: {},
  theme: {
    fonts: {
      display: "Bebas Neue",
      heading: "Oswald",
      body: "Inter",
    },
    colors: {
      primary: "191 76% 32%",
      primaryForeground: "220 15% 6%",
      accent: "8 85% 55%",
      accentForeground: "0 0% 100%",
      background: "220 15% 6%",
      foreground: "40 10% 90%",
      muted: "220 10% 15%",
      mutedForeground: "220 10% 60%",
      border: "220 10% 20%",
    },
  },
  deletedPageSlugs: [],
};

const LOCAL_LAST_SAVED_KEY = 'zontie_local_last_saved';
const SERVER_LAST_SYNCED_KEY = 'zontie_server_last_synced';

function mergePages(storedPages: Page[], defaults: Page[], deletedSlugs: string[] = []): Page[] {
  // 1. Deduplicate stored pages by ID to prevent React key warnings
  const uniqueById = new Map<string, Page>();
  storedPages.forEach(p => uniqueById.set(p.id, p));

  // 2. Deduplicate by Slug to prevent logical duplicates (e.g. multiple "game-content" pages)
  const uniqueBySlug = new Map<string, Page>();
  uniqueById.forEach(p => {
    if (!uniqueBySlug.has(p.slug)) {
      uniqueBySlug.set(p.slug, p);
    } else {
      console.warn(`Duplicate page slug found: ${p.slug}. Removing duplicate with ID ${p.id}.`);
    }
  });

  // Start with clean, unique stored pages
  const merged = Array.from(uniqueBySlug.values());
  const storedSlugs = new Set(merged.map(p => p.slug));
  const storedIds = new Set(merged.map(p => p.id));

  defaults.forEach(defaultPage => {
    // Only merge default page if:
    // 1. It's not already in stored pages (by Slug OR ID)
    // 2. It hasn't been explicitly deleted (checked via deletedSlugs)
    const slugExists = storedSlugs.has(defaultPage.slug);
    const idExists = storedIds.has(defaultPage.id);
    const isDeleted = deletedSlugs.includes(defaultPage.slug);

    if (!slugExists && !idExists && !isDeleted) {
      merged.push(defaultPage);
      // Update check sets to prevent subsequent duplicates from defaults
      storedSlugs.add(defaultPage.slug);
      storedIds.add(defaultPage.id);
    } else if (slugExists) {
      // If page exists but has no sections (corrupted/empty), restore default sections
      const existingIndex = merged.findIndex(p => p.slug === defaultPage.slug);
      if (existingIndex !== -1 && (!merged[existingIndex].sections || merged[existingIndex].sections.length === 0)) {
        console.warn(`Restoring empty sections for page: ${defaultPage.slug}`);
        merged[existingIndex] = {
          ...merged[existingIndex],
          sections: defaultPage.sections
        };
      }
    }
  });
  
  return merged;
}

const defaultContent: SiteContent = {
  news: defaultNews,
  classes: defaultClasses,
  media: defaultMedia,
  faq: defaultFAQ,
  features: defaultFeatures,
  weapons: defaultWeapons,
  maps: defaultMaps,
  gameDevices: defaultGameDevices,
  gameModes: defaultGameModes,
  roadmap: defaultRoadmap,
  pages: defaultPages,
  settings: defaultSettings,
};

export function getContent(): SiteContent {
  if (typeof window === 'undefined') {
    return defaultContent;
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultContent;
  }
  
  try {
    const parsed = JSON.parse(stored);
    
    // Migration: Migrate Home Page from Settings to Pages if missing
    let pages = parsed.pages || [];
    const hasHomePage = pages.some((p: any) => p.slug === 'home');
    
    if (!hasHomePage && parsed.settings && parsed.settings.homepageSections) {
      const homeSections = (parsed.settings.homepageSections as HomepageSection[])
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order)
        .map(s => {
          const custom = parsed.settings.customSections?.[s.id];
          if (custom) return custom;
          
          // Find default section from defaultPages 'home'
          const defaultHome = defaultPages.find(p => p.slug === 'home');
          return defaultHome?.sections.find(ds => ds.id === s.id);
        })
        .filter(Boolean) as CustomSection[];

      if (homeSections.length > 0) {
        pages.push({
          id: "home",
          slug: "home",
          title: "Home",
          status: "published",
          sections: homeSections,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return {
      news: parsed.news ?? defaultNews,
      classes: parsed.classes ?? defaultClasses,
      media: parsed.media ?? defaultMedia,
      faq: parsed.faq ?? defaultFAQ,
      features: parsed.features ?? defaultFeatures,
      weapons: parsed.weapons ?? defaultWeapons,
      maps: parsed.maps ?? defaultMaps,
      gameDevices: parsed.gameDevices ?? defaultGameDevices,
      gameModes: parsed.gameModes ?? defaultGameModes,
      roadmap: parsed.roadmap ?? defaultRoadmap,
      pages: mergePages(pages, defaultPages, parsed.settings?.deletedPageSlugs || []),
      settings: parsed.settings ? {
        ...defaultSettings,
        ...parsed.settings,
        // Ensure critical sections exist by merging with defaults
        branding: { ...defaultSettings.branding, ...(parsed.settings.branding || {}) },
        hero: { ...defaultSettings.hero, ...(parsed.settings.hero || {}) },
        cta: { ...defaultSettings.cta, ...(parsed.settings.cta || {}) },
        newsSection: { ...defaultSettings.newsSection, ...(parsed.settings.newsSection || {}) },
        backgrounds: { ...defaultSettings.backgrounds, ...(parsed.settings.backgrounds || {}) },
        socialLinks: parsed.settings.socialLinks || defaultSettings.socialLinks,
        seo: { ...defaultSettings.seo, ...(parsed.settings.seo || {}) },
        theme: { ...defaultSettings.theme, ...(parsed.settings.theme || {}) },
        homepageSections: parsed.settings.homepageSections || defaultSettings.homepageSections,
        navbar: parsed.settings.navbar || defaultSettings.navbar,
      } : defaultSettings,
    };
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: SiteContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  localStorage.setItem(LOCAL_LAST_SAVED_KEY, Date.now().toString());
}

function isDefaultContent(content: SiteContent): boolean {
  // Simple heuristic: check if key arrays match default lengths and IDs
  if (!content) return true;
  
  const newsMatch = content.news.length === defaultNews.length && content.news[0]?.id === defaultNews[0]?.id;
  const classesMatch = content.classes.length === defaultClasses.length && content.classes[0]?.id === defaultClasses[0]?.id;
  const featuresMatch = content.features.length === defaultFeatures.length && content.features[0]?.id === defaultFeatures[0]?.id;
  const roadmapMatch = (content.roadmap || []).length === defaultRoadmap.length && (content.roadmap || [])[0]?.id === defaultRoadmap[0]?.id;
  const navbarMatch = JSON.stringify(content.settings.navbar) === JSON.stringify(defaultSettings.navbar);
  
  return newsMatch && classesMatch && featuresMatch && roadmapMatch && navbarMatch;
}

// Async data fetching with fallback to localStorage
export async function getData(): Promise<SiteContent> {
  // Attempt to fetch from API first, then fall back to localStorage
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const rawServerData = await response.json();
    
    // Ensure server data has all required fields by merging with defaultContent
    // This handles cases where the server file has an older schema (e.g. missing 'pages')
    const deletedSlugs = rawServerData.settings?.deletedPageSlugs || [];
    const serverData: SiteContent = {
      ...defaultContent,
      ...rawServerData,
      // Explicitly ensure arrays are defined
      news: rawServerData.news ?? [],
      classes: rawServerData.classes ?? [],
      media: rawServerData.media ?? [],
      faq: rawServerData.faq ?? [],
      features: rawServerData.features ?? [],
      weapons: rawServerData.weapons ?? [],
      maps: rawServerData.maps ?? [],
      gameDevices: rawServerData.gameDevices ?? [],
      gameModes: rawServerData.gameModes ?? [],
      roadmap: rawServerData.roadmap ?? defaultRoadmap,
      pages: mergePages(rawServerData.pages || [], defaultPages, deletedSlugs),
      // Explicitly merge settings to ensure new fields like navbar aren't lost if server is old
      settings: {
        ...defaultContent.settings,
        ...(rawServerData.settings || {}),
        // Preserve local navbar if server doesn't provide it (migration strategy)
        navbar: rawServerData.settings?.navbar ?? getContent().settings.navbar ?? defaultContent.settings.navbar
      },
    };
    
    // Check for "Local-First" Persistence Strategy
    // If server returns default data (e.g. after restart) but we have local changes,
    // we should PRESERVE the local changes and sync them back to the server.
    const localData = getContent();
    const serverIsDefault = isDefaultContent(serverData);
    const localIsDefault = isDefaultContent(localData);

    if (serverIsDefault && !localIsDefault) {
      console.warn('Server returned default data but local has changes. Preserving local data and syncing to server.');
      // Background sync to server
      saveData(localData).catch(err => console.error('Failed to sync local data to server:', err));
      return localData;
    }

    // Check for "Unsynced Local Changes" Persistence Strategy
    const localLastSaved = parseInt(localStorage.getItem(LOCAL_LAST_SAVED_KEY) || '0');
    const serverLastSynced = parseInt(localStorage.getItem(SERVER_LAST_SYNCED_KEY) || '0');

    // If we have local changes that haven't been successfully synced to the server yet
    // (and the server data isn't "default" which is handled above)
    if (localLastSaved > serverLastSynced && !localIsDefault) {
       console.warn('Local changes detected that were not synced to server. Preserving local data and syncing to server.');
       saveData(localData).catch(err => console.error('Failed to sync local data to server:', err));
       return localData;
    }

    // Otherwise, server data is authoritative (or both are default)
    saveContent(serverData);
    // Update sync timestamps since we just pulled fresh data from server
    localStorage.setItem(SERVER_LAST_SYNCED_KEY, Date.now().toString());
    
    return serverData;
  } catch (error) {
    console.warn('Failed to fetch from API, falling back to localStorage', error);
    return getContent();
  }
}

// Async data saving
export async function saveData(content: SiteContent): Promise<SiteContent | undefined> {
  // Deduplicate pages to prevent errors and ensure clean state
  // 1. By ID
  const uniqueById = new Map<string, Page>();
  if (content.pages) {
    content.pages.forEach(p => uniqueById.set(p.id, p));
  }

  // 2. By Slug (keep first encountered)
  const uniqueBySlug = new Map<string, Page>();
  uniqueById.forEach(p => {
    if (!uniqueBySlug.has(p.slug)) {
      uniqueBySlug.set(p.slug, p);
    }
  });

  const cleanContent = {
    ...content,
    settings: {
      ...content.settings,
      // Ensure navbar is included (critical for persistence)
      navbar: content.settings.navbar || defaultSettings.navbar
    },
    pages: Array.from(uniqueBySlug.values())
  };

  // Always save to local storage first for immediate feedback
  saveContent(cleanContent);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanContent),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to save to server: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      // Merge back any fields that the server might have dropped (if it's an older backend)
      // specifically roadmap and navbar which are new features
      const mergedData = {
        ...result.data,
        roadmap: result.data.roadmap ?? cleanContent.roadmap,
        settings: {
          ...(result.data.settings || cleanContent.settings),
          navbar: result.data.settings?.navbar ?? cleanContent.settings.navbar
        }
      };

      // Update local storage with server response (contains clean IDs)
      saveContent(mergedData);
      // Update server sync timestamp to match local last saved (since we just saved)
      localStorage.setItem(SERVER_LAST_SYNCED_KEY, localStorage.getItem(LOCAL_LAST_SAVED_KEY) || Date.now().toString());
      return mergedData;
    }
  } catch (error) {
    console.error('Failed to save to server:', error);
    // We rely on local storage (already saved at start of function)
  }
  return undefined;
}

export function getNewsById(id: string): NewsItem | undefined {
  const content = getContent();
  return content.news.find(item => item.id === id);
}

export function resetToDefaults(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getDefaultSettings(): SiteSettings {
  return defaultSettings;
}

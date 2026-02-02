// Content store using localStorage for persistence
import { API_BASE_URL } from "@/config";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  content: string;
  image: string;
  tag: string;
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
}

export interface MediaItem {
  id: string;
  type: "image" | "gif" | "video";
  title: string;
  src: string;
  category: string;
  description?: string;
  thumbnail?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
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
}

export interface GameDeviceItem {
  id: string;
  name: string;
  description: string;
  details: string;
  image: string;
  media: MapMediaItem[];
  classRestriction?: string; // Which class can use it, if any
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
}

// ========== Site Settings Interfaces ==========

export interface BackgroundSettings {
  type: 'color' | 'gradient' | 'image';
  color?: string; // HSL values like "220 15% 6%"
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'to-t' | 'to-b' | 'to-l' | 'to-r' | 'to-tl' | 'to-tr' | 'to-bl' | 'to-br';
  imageUrl?: string;
  imageOverlayOpacity?: number; // 0-100
  textureEnabled?: boolean;
  textureOpacity?: number; // 0-100
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

export interface SiteSettings {
  branding: BrandingSettings;
  backgrounds: SectionBackground;
  socialLinks: SocialLink[];
  seo: SEOSettings;
  homepageSections: HomepageSection[];
  theme: ThemeSettings;
}

export interface SiteContent {
  news: NewsItem[];
  classes: ClassItem[];
  media: MediaItem[];
  faq: FAQItem[];
  features: FeatureItem[];
  privacy: PageContent;
  terms: PageContent;
  // Game content
  weapons: WeaponItem[];
  maps: MapItem[];
  gameDevices: GameDeviceItem[];
  gameModes: GameModeItem[];
  // Site settings
  settings: SiteSettings;
}

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

// Default privacy policy
const defaultPrivacy: PageContent = {
  title: "Privacy Policy",
  lastUpdated: "August 2024",
  sections: [
    { heading: "1. Introduction", content: "Welcome to Shadows of Soldiers. We respect your privacy and are committed to protecting your personal data." },
    { heading: "2. Information We Collect", content: "We may collect identity data, contact data, technical data, and usage data." },
    { heading: "3. How We Use Your Information", content: "We use your personal data to provide services, notify you of changes, and allow participation in playtests." },
    { heading: "4. Data Security", content: "We have implemented appropriate security measures to prevent unauthorized access." },
    { heading: "5. Your Rights", content: "You have rights to access, correct, and request deletion of your personal data." },
    { heading: "6. Contact Us", content: "Contact us through our social media channels or Discord community." },
  ],
};

// Default terms
const defaultTerms: PageContent = {
  title: "Terms & Conditions",
  lastUpdated: "August 2024",
  sections: [
    { heading: "1. Agreement to Terms", content: "By accessing our services, you agree to be bound by these Terms and Conditions." },
    { heading: "2. Intellectual Property", content: "All game content and materials are protected by copyright and trademark laws." },
    { heading: "3. User Conduct", content: "You agree not to violate laws, harass others, or engage in hacking activities." },
    { heading: "4. Playtest Participation", content: "Playtest content is confidential and may not be shared without permission." },
    { heading: "5. Disclaimer of Warranties", content: "Our services are provided 'as is' without warranties." },
    { heading: "6. Contact", content: "Contact us through our official social media channels or Discord." },
  ],
};

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
};

export function getContent(): SiteContent {
  const defaultContent: SiteContent = {
    news: defaultNews,
    classes: defaultClasses,
    media: defaultMedia,
    faq: defaultFAQ,
    features: defaultFeatures,
    privacy: defaultPrivacy,
    terms: defaultTerms,
    weapons: defaultWeapons,
    maps: defaultMaps,
    gameDevices: defaultGameDevices,
    gameModes: defaultGameModes,
    settings: defaultSettings,
  };

  if (typeof window === 'undefined') {
    return defaultContent;
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return defaultContent;
  }
  
  try {
    const parsed = JSON.parse(stored);
    return {
      news: parsed.news || defaultNews,
      classes: parsed.classes || defaultClasses,
      media: parsed.media || defaultMedia,
      faq: parsed.faq || defaultFAQ,
      features: parsed.features || defaultFeatures,
      privacy: parsed.privacy || defaultPrivacy,
      terms: parsed.terms || defaultTerms,
      weapons: parsed.weapons || defaultWeapons,
      maps: parsed.maps || defaultMaps,
      gameDevices: parsed.gameDevices || defaultGameDevices,
      gameModes: parsed.gameModes || defaultGameModes,
      settings: parsed.settings || defaultSettings,
    };
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: SiteContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

// Async data fetching with fallback to localStorage
export async function getData(): Promise<SiteContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Update local storage to keep it in sync
    saveContent(data);
    return data;
  } catch (error) {
    console.warn('Failed to fetch from API, falling back to localStorage', error);
    return getContent();
  }
}

// Async data saving
export async function saveData(content: SiteContent): Promise<SiteContent | undefined> {
  // Always save to local storage first for immediate feedback
  saveContent(content);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save to server');
    }

    const result = await response.json();
    if (result.success && result.data) {
      // Update local storage with server response (contains clean IDs)
      saveContent(result.data);
      return result.data;
    }
  } catch (error) {
    console.error('Failed to save to server:', error);
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

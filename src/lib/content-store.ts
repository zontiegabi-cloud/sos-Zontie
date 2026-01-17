// Content store using localStorage for persistence

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
  icon: string; // Icon name like "Crosshair", "Shield", etc.
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
  devices?: ClassDevice[]; // Optional devices/equipment used by this class
  devicesUsedTitle?: string; // Custom title for devices section (e.g., "Equipment", "Abilities", "Components", etc.)
}

export interface MediaItem {
  id: string;
  type: "image" | "gif" | "video";
  title: string;
  src: string;
  category: string;
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
  icon?: string; // Optional icon name for the device
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string; // Icon name like "Crosshair", "Shield", etc.
  devices: Device[];
  devicesSectionTitle?: string; // Custom title for devices section (e.g., "Devices & Features", "Abilities", "Components", etc.)
}

export interface SiteContent {
  news: NewsItem[];
  classes: ClassItem[];
  media: MediaItem[];
  faq: FAQItem[];
  features: FeatureItem[];
  privacy: PageContent;
  terms: PageContent;
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
  { id: "1", type: "gif", title: "Shelter Environment", src: "https://www.shadowsofsoldiers.com/assets/shelter.gif", category: "Gameplay" },
  { id: "2", type: "gif", title: "Cover System", src: "https://www.shadowsofsoldiers.com/assets/cover.gif", category: "Gameplay" },
  { id: "3", type: "gif", title: "Weapon Customization", src: "https://www.shadowsofsoldiers.com/assets/weaponcustomise.gif", category: "Features" },
  { id: "4", type: "image", title: "Juggernaut Class", src: "https://www.shadowsofsoldiers.com/assets/webp/juggernaut.webp", category: "Classes" },
  { id: "5", type: "image", title: "Shadow Class", src: "https://www.shadowsofsoldiers.com/assets/webp/shadow.webp", category: "Classes" },
  { id: "6", type: "image", title: "Commander Class", src: "https://www.shadowsofsoldiers.com/assets/webp/commander.webp", category: "Classes" },
  { id: "7", type: "image", title: "Unreal Engine 5", src: "https://www.shadowsofsoldiers.com/assets/webp/new-ue5-image.webp", category: "Development" },
  { id: "8", type: "image", title: "Abilities System", src: "https://www.shadowsofsoldiers.com/assets/webp/abilities.webp", category: "Features" },
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
      {
        name: "Tactical Shield",
        details: "Deployable cover that provides protection and allows team movement"
      },
      {
        name: "Combat Stim",
        details: "Temporary boost to speed and reaction time for critical moments"
      },
      {
        name: "Recon Drone",
        details: "Scout ahead and mark enemies for your team"
      },
      {
        name: "Med Kit",
        details: "Advanced healing system that restores health over time"
      }
    ],
  },
  {
    id: "2",
    title: "Cover System",
    description: "Advanced cover mechanics reward tactical positioning and smart movement.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/cover-1-1.gif",
    icon: "Shield",
    devices: [
      {
        name: "Dynamic Cover",
        details: "Interactive cover that can be destroyed or repositioned"
      },
      {
        name: "Peek System",
        details: "Lean and peek around corners with realistic body positioning"
      },
      {
        name: "Cover Indicators",
        details: "Visual feedback showing effective cover positions"
      },
      {
        name: "Vault Mechanics",
        details: "Smooth vaulting over obstacles and through windows"
      }
    ],
  },
  {
    id: "3",
    title: "Weapon Customization",
    description: "Deep weapon customization with realistic attachments and modifications.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/weapon_custimization.gif",
    icon: "Wrench",
    devices: [
      {
        name: "Optics & Scopes",
        details: "Multiple sight options from red dots to long-range scopes"
      },
      {
        name: "Barrel Attachments",
        details: "Suppressors, compensators, and extended barrels"
      },
      {
        name: "Grip Systems",
        details: "Foregrips and stocks that affect recoil and handling"
      },
      {
        name: "Magazine Mods",
        details: "Extended magazines and specialized ammunition types"
      },
      {
        name: "Rail Accessories",
        details: "Flashlights, lasers, and tactical equipment"
      }
    ],
  },
  {
    id: "4",
    title: "Tactical Gameplay",
    description: "Every move matters. Every shot counts. Every victory is earned.",
    image: "https://www.shadowsofsoldiers.com/wp-content/uploads/2025/06/weapon_custimization.gif",
    icon: "Target",
    devices: [
      {
        name: "Realistic Ballistics",
        details: "Bullet drop, wind resistance, and material penetration"
      },
      {
        name: "Stamina System",
        details: "Manage your energy for sprinting, aiming, and combat"
      },
      {
        name: "Sound Design",
        details: "3D positional audio for tactical awareness"
      },
      {
        name: "Team Coordination",
        details: "Advanced communication tools and team markers"
      }
    ],
  },
];

// Default privacy policy
const defaultPrivacy: PageContent = {
  title: "Privacy Policy",
  lastUpdated: "August 2024",
  sections: [
    { heading: "1. Introduction", content: "Welcome to Shadows of Soldiers. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights." },
    { heading: "2. Information We Collect", content: "We may collect, use, store and transfer different kinds of personal data about you:\n- Identity Data: first name, last name, username\n- Contact Data: email address\n- Technical Data: IP address, browser type, operating system\n- Usage Data: information about how you use our website and services" },
    { heading: "3. How We Use Your Information", content: "We use your personal data for:\n- To provide and maintain our services\n- To notify you about changes to our services\n- To allow you to participate in playtests and community events\n- To provide customer support\n- To send newsletters and marketing communications (with your consent)" },
    { heading: "4. Data Security", content: "We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way." },
    { heading: "5. Your Rights", content: "Under certain circumstances, you have rights including:\n- The right to access your personal data\n- The right to correct inaccurate personal data\n- The right to request deletion of your personal data\n- The right to withdraw consent" },
    { heading: "6. Contact Us", content: "If you have any questions about this privacy policy or our privacy practices, please contact us through our social media channels or Discord community." },
  ],
};

// Default terms
const defaultTerms: PageContent = {
  title: "Terms & Conditions",
  lastUpdated: "August 2024",
  sections: [
    { heading: "1. Agreement to Terms", content: "By accessing or using the Shadows of Soldiers website and services, you agree to be bound by these Terms and Conditions." },
    { heading: "2. Intellectual Property", content: "The Shadows of Soldiers name, logo, game content, website design, and all related materials are protected by copyright, trademark, and other intellectual property laws." },
    { heading: "3. User Conduct", content: "When using our services, you agree not to:\n- Violate any applicable laws or regulations\n- Harass, abuse, or harm other users\n- Distribute malware or engage in hacking activities\n- Attempt to gain unauthorized access to our systems" },
    { heading: "4. Playtest Participation", content: "Participation in playtests is subject to additional terms. Playtest content is confidential and may not be shared, streamed, or recorded without explicit permission." },
    { heading: "5. Disclaimer of Warranties", content: "Our services are provided 'as is' without warranties of any kind, either express or implied." },
    { heading: "6. Limitation of Liability", content: "In no event shall Shadows of Soldiers be liable for any indirect, incidental, special, or consequential damages." },
    { heading: "7. Changes to Terms", content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting." },
    { heading: "8. Contact", content: "For any questions regarding these Terms and Conditions, please reach out through our official social media channels or Discord community." },
  ],
};

export function getContent(): SiteContent {
  if (typeof window === 'undefined') {
    return { news: defaultNews, classes: defaultClasses, media: defaultMedia, faq: defaultFAQ, features: defaultFeatures, privacy: defaultPrivacy, terms: defaultTerms };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { news: defaultNews, classes: defaultClasses, media: defaultMedia, faq: defaultFAQ, features: defaultFeatures, privacy: defaultPrivacy, terms: defaultTerms };
  }
  
  try {
    const parsed = JSON.parse(stored);
    // Merge with defaults for backward compatibility
    return {
      news: parsed.news || defaultNews,
      classes: parsed.classes || defaultClasses,
      media: parsed.media || defaultMedia,
      faq: parsed.faq || defaultFAQ,
      features: parsed.features || defaultFeatures,
      privacy: parsed.privacy || defaultPrivacy,
      terms: parsed.terms || defaultTerms,
    };
  } catch {
    return { news: defaultNews, classes: defaultClasses, media: defaultMedia, faq: defaultFAQ, features: defaultFeatures, privacy: defaultPrivacy, terms: defaultTerms };
  }
}

export function saveContent(content: SiteContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function getNewsById(id: string): NewsItem | undefined {
  const content = getContent();
  return content.news.find(item => item.id === id);
}

export function resetToDefaults(): void {
  localStorage.removeItem(STORAGE_KEY);
}

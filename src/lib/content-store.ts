// Content store using localStorage for persistence

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  content: string; // Full article content
  image: string;
  tag: string;
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
}

export interface SiteContent {
  news: NewsItem[];
  classes: ClassItem[];
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

- **Nanite Virtualized Geometry**: This technology allows us to render incredibly detailed environments and characters without sacrificing performance. Every rock, every piece of debris, every surface in our maps is rendered with unprecedented detail.

- **Lumen Global Illumination**: Real-time lighting that reacts dynamically to the environment. Watch as explosions light up dark corridors, or see the sun filtering through windows during a breach.

- **Enhanced Physics**: More realistic destruction, particle effects, and environmental interactions make every firefight feel intense and authentic.

## What This Means for Players

With UE5, we're able to deliver:
- Photorealistic environments
- Smooth 60+ FPS gameplay on modern hardware
- Large-scale maps with no loading screens
- Dynamic weather and time-of-day systems

Stay tuned for more development updates as we continue to push the boundaries of what's possible in tactical shooters.`,
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
- Exclusive in-game rewards for launch
- The ability to influence game development

## Requirements

- A gaming PC that meets minimum requirements
- Willingness to provide detailed feedback
- Ability to dedicate time to testing sessions
- Signing an NDA

We're looking for players of all skill levels, from tactical shooter veterans to newcomers. Your feedback is invaluable to us!`,
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
- Vault over low cover for aggressive pushes
- Transition smoothly between cover points

## Destruction System

Cover isn't permanent. Depending on the material:
- Wooden barriers can be destroyed
- Metal provides longer protection
- Concrete may chip and degrade over time

This creates dynamic firefights where positions that were safe can become death traps.

## Tactical Depth

The cover system integrates with:
- Suppression mechanics
- Team movement coordination
- Objective control strategies

Master the cover system, and you'll have a significant advantage on the battlefield.`,
    image: "https://images.steamusercontent.com/ugc/2513653416277255363/1D5BD6B48037C68F14ECD347F996F14924A53A71/?imw=1024&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    tag: "Features",
  },
];

// Default classes data
const defaultClasses: ClassItem[] = [
  {
    id: "1",
    name: "Assault",
    role: "Frontline Fighter",
    description: "Masters of direct combat with high mobility and powerful close-range weaponry. Lead the charge and break through enemy lines.",
    details: [
      "High-powered assault rifles and SMGs",
      "Flash and frag grenades",
      "Enhanced mobility and sprint speed",
      "Breaching charges for entry",
    ],
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1401200/4bb828b2c37ea3557c09e389a3c1008d7a6dd17c/capsule_616x353.jpg?t=1768486624",
    icon: "Crosshair",
    color: "from-red-500/20 to-transparent",
  },
  {
    id: "2",
    name: "Support",
    role: "Heavy Suppression",
    description: "Provides sustained firepower with LMGs and supply capabilities. Keep enemies pinned while your team maneuvers.",
    details: [
      "Light machine guns and heavy weapons",
      "Ammo resupply capabilities",
      "Suppression fire bonuses",
      "Deployable bipod for accuracy",
    ],
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1401200/4bb828b2c37ea3557c09e389a3c1008d7a6dd17c/capsule_616x353.jpg?t=1768486624",
    icon: "Shield",
    color: "from-yellow-500/20 to-transparent",
  },
  {
    id: "3",
    name: "Recon",
    role: "Intelligence Gatherer",
    description: "Expert scouts with long-range precision and reconnaissance tools. Spot enemies and eliminate high-value targets.",
    details: [
      "Sniper rifles and DMRs",
      "Motion sensors and cameras",
      "Ghillie suit camouflage",
      "Laser designator for support",
    ],
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1401200/4bb828b2c37ea3557c09e389a3c1008d7a6dd17c/capsule_616x353.jpg?t=1768486624",
    icon: "Eye",
    color: "from-blue-500/20 to-transparent",
  },
  {
    id: "4",
    name: "Medic",
    role: "Combat Healer",
    description: "Keep your squad in the fight with healing abilities and revival capabilities. Essential for sustained operations.",
    details: [
      "Medical kits and defibrillators",
      "Smoke grenades for cover",
      "Faster revive speeds",
      "Health regeneration aura",
    ],
    image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1401200/4bb828b2c37ea3557c09e389a3c1008d7a6dd17c/capsule_616x353.jpg?t=1768486624",
    icon: "Heart",
    color: "from-green-500/20 to-transparent",
  },
];

export function getContent(): SiteContent {
  if (typeof window === 'undefined') {
    return { news: defaultNews, classes: defaultClasses };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { news: defaultNews, classes: defaultClasses };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return { news: defaultNews, classes: defaultClasses };
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

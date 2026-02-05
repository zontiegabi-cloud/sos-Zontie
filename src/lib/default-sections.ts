import { CustomSection } from "./content-store";

export const DEFAULT_SECTIONS: Record<string, CustomSection> = {
  hero: {
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
  news: {
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
  features: {
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
  classes: {
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
  cta: {
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
};

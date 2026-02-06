import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteSettings, getContent, saveContent, saveData, getDefaultSettings, ThemeSettings } from "@/lib/content-store";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateBranding: (branding: Partial<SiteSettings['branding']>) => Promise<void>;
  updateBackground: (section: keyof SiteSettings['backgrounds'], bg: Partial<SiteSettings['backgrounds'][keyof SiteSettings['backgrounds']]>) => Promise<void>;
  updateSocialLinks: (links: SiteSettings['socialLinks']) => Promise<void>;
  updateNavbar: (navbar: SiteSettings['navbar']) => Promise<void>;
  updateSEO: (seo: Partial<SiteSettings['seo']>) => Promise<void>;
  updateNewsSection: (newsSection: Partial<SiteSettings['newsSection']>) => Promise<void>;
  updateHomepageSections: (sections: SiteSettings['homepageSections']) => Promise<void>;
  updateCustomSections: (sections: Record<string, import("@/lib/content-store").CustomSection>) => Promise<void>;
  addCustomSection: (section: import("@/lib/content-store").CustomSection) => Promise<void>;
  removeCustomSection: (id: string) => Promise<void>;
  updateTheme: (theme: Partial<ThemeSettings>) => Promise<void>;
  updateThemeFonts: (fonts: Partial<ThemeSettings['fonts']>) => Promise<void>;
  updateThemeColors: (colors: Partial<ThemeSettings['colors']>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const content = getContent();
    setSettings(content.settings);
    setIsLoading(false);
  }, []);

  const saveSettings = useCallback(async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    const content = getContent();
    // Save to database (and local storage via saveData)
    await saveData({ ...content, settings: newSettings });
  }, []);

  const updateSettings = useCallback(async (partial: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...partial };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateBranding = useCallback(async (branding: Partial<SiteSettings['branding']>) => {
    const newSettings = {
      ...settings,
      branding: { ...settings.branding, ...branding },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateBackground = useCallback(async (
    section: keyof SiteSettings['backgrounds'],
    bg: Partial<SiteSettings['backgrounds'][keyof SiteSettings['backgrounds']]>
  ) => {
    const newSettings = {
      ...settings,
      backgrounds: {
        ...settings.backgrounds,
        [section]: { ...settings.backgrounds[section], ...bg },
      },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateSocialLinks = useCallback(async (links: SiteSettings['socialLinks']) => {
    const newSettings = { ...settings, socialLinks: links };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateNavbar = useCallback(async (navbar: SiteSettings['navbar']) => {
    const newSettings = { ...settings, navbar };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateSEO = useCallback(async (seo: Partial<SiteSettings['seo']>) => {
    const newSettings = {
      ...settings,
      seo: { ...settings.seo, ...seo },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateNewsSection = useCallback(async (newsSection: Partial<SiteSettings['newsSection']>) => {
    const newSettings = {
      ...settings,
      newsSection: { ...settings.newsSection, ...newsSection },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateHomepageSections = useCallback(async (sections: SiteSettings['homepageSections']) => {
    const newSettings = { ...settings, homepageSections: sections };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateCustomSections = useCallback(async (sections: Record<string, import("@/lib/content-store").CustomSection>) => {
    const newSettings = { ...settings, customSections: sections };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const addCustomSection = useCallback(async (section: import("@/lib/content-store").CustomSection) => {
    const newSettings = {
      ...settings,
      customSections: { ...settings.customSections, [section.id]: section },
      homepageSections: [
        ...settings.homepageSections,
        { id: section.id, name: section.name, enabled: true, order: settings.homepageSections.length }
      ]
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const removeCustomSection = useCallback(async (id: string) => {
    const { [id]: removed, ...remainingCustomSections } = settings.customSections;
    const newSettings = {
      ...settings,
      customSections: remainingCustomSections,
      homepageSections: settings.homepageSections.filter(s => s.id !== id)
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateTheme = useCallback(async (theme: Partial<ThemeSettings>) => {
    const newSettings = {
      ...settings,
      theme: { ...settings.theme, ...theme },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateThemeFonts = useCallback(async (fonts: Partial<ThemeSettings['fonts']>) => {
    const newSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        fonts: { ...settings.theme.fonts, ...fonts },
      },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateThemeColors = useCallback(async (colors: Partial<ThemeSettings['colors']>) => {
    const newSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        colors: { ...settings.theme.colors, ...colors },
      },
    };
    await saveSettings(newSettings);
  }, [settings, saveSettings]);

  const resetSettings = useCallback(async () => {
    await saveSettings(getDefaultSettings());
  }, [saveSettings]);

  // Apply SEO and Favicon settings
  useEffect(() => {
    // Update Title
    if (settings.seo.defaultTitle) {
      document.title = settings.seo.defaultTitle;
    } else if (settings.branding.siteName) {
      document.title = settings.branding.siteName;
    }

    // Update Favicon
    if (settings.branding.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.branding.faviconUrl;
    }

    // Update Meta Description
    if (settings.seo.defaultDescription) {
      let meta = document.querySelector("meta[name='description']") as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = settings.seo.defaultDescription;
    }
    
    // Update OG Image
    if (settings.seo.ogImage) {
        let meta = document.querySelector("meta[property='og:image']") as HTMLMetaElement;
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            document.head.appendChild(meta);
        }
        meta.content = settings.seo.ogImage;
    }

  }, [settings.branding, settings.seo]);

  // Apply theme CSS variables dynamically
  useEffect(() => {
    if (!settings.theme) return;
    const root = document.documentElement;
    const { colors, fonts } = settings.theme;

    // Apply colors
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--glow-primary', colors.primary);
    root.style.setProperty('--glow-accent', colors.accent);

    // Apply fonts
    root.style.setProperty('--font-display', fonts.display);
    root.style.setProperty('--font-heading', fonts.heading);
    root.style.setProperty('--font-body', fonts.body);

    // Update font-family in body
    document.body.style.fontFamily = `'${fonts.body}', sans-serif`;
  }, [settings.theme]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateBranding,
        updateBackground,
        updateSocialLinks,
        updateNavbar,
        updateSEO,
        updateNewsSection,
        updateHomepageSections,
        updateCustomSections,
        addCustomSection,
        removeCustomSection,
        updateTheme,
        updateThemeFonts,
        updateThemeColors,
        resetSettings,
        isLoading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}


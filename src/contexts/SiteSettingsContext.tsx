import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SiteSettings, getContent, saveContent, getDefaultSettings, ThemeSettings } from "@/lib/content-store";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  updateBranding: (branding: Partial<SiteSettings['branding']>) => void;
  updateBackground: (section: keyof SiteSettings['backgrounds'], bg: Partial<SiteSettings['backgrounds'][keyof SiteSettings['backgrounds']]>) => void;
  updateSocialLinks: (links: SiteSettings['socialLinks']) => void;
  updateSEO: (seo: Partial<SiteSettings['seo']>) => void;
  updateHomepageSections: (sections: SiteSettings['homepageSections']) => void;
  updateTheme: (theme: Partial<ThemeSettings>) => void;
  updateThemeFonts: (fonts: Partial<ThemeSettings['fonts']>) => void;
  updateThemeColors: (colors: Partial<ThemeSettings['colors']>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(getDefaultSettings());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const content = getContent();
    setSettings(content.settings);
    setIsLoading(false);
  }, []);

  const saveSettings = useCallback((newSettings: SiteSettings) => {
    setSettings(newSettings);
    const content = getContent();
    saveContent({ ...content, settings: newSettings });
  }, []);

  const updateSettings = useCallback((partial: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...partial };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateBranding = useCallback((branding: Partial<SiteSettings['branding']>) => {
    const newSettings = {
      ...settings,
      branding: { ...settings.branding, ...branding },
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateBackground = useCallback((
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
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateSocialLinks = useCallback((links: SiteSettings['socialLinks']) => {
    const newSettings = { ...settings, socialLinks: links };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateSEO = useCallback((seo: Partial<SiteSettings['seo']>) => {
    const newSettings = {
      ...settings,
      seo: { ...settings.seo, ...seo },
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateHomepageSections = useCallback((sections: SiteSettings['homepageSections']) => {
    const newSettings = { ...settings, homepageSections: sections };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateTheme = useCallback((theme: Partial<ThemeSettings>) => {
    const newSettings = {
      ...settings,
      theme: { ...settings.theme, ...theme },
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateThemeFonts = useCallback((fonts: Partial<ThemeSettings['fonts']>) => {
    const newSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        fonts: { ...settings.theme.fonts, ...fonts },
      },
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const updateThemeColors = useCallback((colors: Partial<ThemeSettings['colors']>) => {
    const newSettings = {
      ...settings,
      theme: {
        ...settings.theme,
        colors: { ...settings.theme.colors, ...colors },
      },
    };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  const resetSettings = useCallback(() => {
    saveSettings(getDefaultSettings());
  }, [saveSettings]);

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
        updateSEO,
        updateHomepageSections,
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

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
import { useContext } from "react";
import { SiteSettingsContext } from "@/contexts/SiteSettingsContext";

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}

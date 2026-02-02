import { BackgroundSettings } from "@/lib/content-store";

export const gradientMap: Record<string, string> = {
  "to-t": "to top",
  "to-b": "to bottom",
  "to-l": "to left",
  "to-r": "to right",
  "to-tl": "to top left",
  "to-tr": "to top right",
  "to-bl": "to bottom left",
  "to-br": "to bottom right",
};

export function getGradientDirection(dir?: string): string {
  if (!dir) return "to bottom";
  // Check exact map match first
  if (gradientMap[dir]) return gradientMap[dir];
  // Check if it's already valid (contains space and starts with 'to ') or fallback
  if (dir.startsWith("to ") && dir.includes(" ")) return dir;
  // Legacy fallback (risky but keeps existing logic if needed, though map covers most)
  return dir.replace("to-", "to ") || "to bottom";
}

export function getBackgroundStyle(bg: BackgroundSettings) {
  if (!bg) return {};

  if (bg.type === 'image' && bg.imageUrl) {
    return {
      backgroundImage: `url('${bg.imageUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  if (bg.type === 'color') {
    return {
      backgroundColor: `hsl(${bg.color || '220 15% 6%'})`,
    };
  }

  if (bg.type === 'gradient') {
    const dir = getGradientDirection(bg.gradientDirection);
    const from = bg.gradientFrom || '220 15% 8%';
    const to = bg.gradientTo || '220 15% 4%';
    return {
      background: `linear-gradient(${dir}, hsl(${from}), hsl(${to}))`,
    };
  }

  return {};
}

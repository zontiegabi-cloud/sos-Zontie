import React from "react";
import { BackgroundSettings } from "@/lib/content-store";

interface DynamicBackgroundProps {
  background: BackgroundSettings;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function DynamicBackground({
  background,
  children,
  className = "",
  as: Component = "section",
}: DynamicBackgroundProps) {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.type === 'image' && background.imageUrl) {
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }

    if (background.type === 'gradient') {
      const direction = background.gradientDirection?.replace('to-', 'to ') || 'to bottom';
      const from = background.gradientFrom || '220 15% 8%';
      const to = background.gradientTo || '220 15% 4%';
      return {
        background: `linear-gradient(${direction}, hsl(${from}), hsl(${to}))`,
      };
    }

    // Solid color
    const color = background.color || '220 15% 6%';
    return {
      backgroundColor: `hsl(${color})`,
    };
  };

  const getOverlayStyle = (): React.CSSProperties => {
    if (background.type === 'image' && background.imageUrl) {
      return {
        background: `linear-gradient(to bottom, hsl(var(--background) / 0.2), hsl(var(--background) / ${(background.imageOverlayOpacity || 60) / 100}), hsl(var(--background)))`,
      };
    }
    return {};
  };

  const showOverlay = background.type === 'image' && background.imageUrl;
  const showTexture = background.textureEnabled;

  return (
    <Component className={`relative ${className}`} style={getBackgroundStyle()}>
      {/* Dark overlay for images */}
      {showOverlay && (
        <div className="absolute inset-0" style={getOverlayStyle()} />
      )}

      {/* Texture overlay */}
      {showTexture && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: (background.textureOpacity || 3) / 100,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
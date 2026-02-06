import { useState, useEffect, useRef } from "react";
import { CustomSection, HeroButton, DynamicContentSource, BackgroundSettings } from "@/lib/content-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DynamicContentBlock } from "@/components/home/DynamicContentBlock";
import { 
  ExternalLink, 
  ChevronDown, 
  ArrowDown, 
  Mouse,
  ArrowRight, 
  Check, 
  ChevronRight,
  Zap,
  Star,
  Crown,
  Swords,
  Skull,
  Crosshair,
  Shield,
  Trophy,
  Flame,
  Gamepad2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Target,
  Ghost,
  Rocket,
  Bomb,
  Map,
  Flag,
  Medal,
  Heart,
  Bell,
  User,
  AlertTriangle,
  Info,
  HelpCircle,
  Calendar,
  Diamond,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Droplet,
  Anchor,
  Feather,
  Lock,
  Unlock
} from "lucide-react";

interface CustomSectionRendererProps {
  section: CustomSection;
}

const decorationIcons: Record<string, any> = {
  zap: Zap,
  star: Star,
  crown: Crown,
  swords: Swords,
  skull: Skull,
  crosshair: Crosshair,
  shield: Shield,
  trophy: Trophy,
  flame: Flame,
  gamepad: Gamepad2,
  'arrow-right': ArrowRight,
  'chevron-right': ChevronRight,
  check: Check,
  'external-link': ExternalLink,
  mouse: Mouse,
  'arrow-down': ArrowDown,
  'chevron-down': ChevronDown,
  target: Target,
  ghost: Ghost,
  rocket: Rocket,
  bomb: Bomb,
  map: Map,
  flag: Flag,
  medal: Medal,
  heart: Heart,
  bell: Bell,
  user: User,
  'alert-triangle': AlertTriangle,
  info: Info,
  'help-circle': HelpCircle,
  calendar: Calendar,
  diamond: Diamond,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  snowflake: Snowflake,
  droplet: Droplet,
  anchor: Anchor,
  feather: Feather,
  lock: Lock,
  unlock: Unlock
};

interface VideoBackgroundProps {
  settings: any;
  isMuted: boolean;
  isPlaying: boolean;
  volume: number;
  videoDims: { w: string; h: string } | null;
}

function YoutubeBackground({ settings, isMuted, isPlaying, volume, videoDims }: VideoBackgroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const background = settings.background || {};
  const youtubeId = getYoutubeId(background.videoUrl || '');

  // Handle mute/unmute
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    }
  }, [isMuted]);

  // Handle volume change
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [volume]
      }), '*');
    }
  }, [volume]);

  // Handle play/pause
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    }
  }, [isPlaying]);

  if (!youtubeId) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: videoDims?.w || '100%', height: videoDims?.h || '100%' }}>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${background.autoplay !== false ? 1 : 0}&mute=${background.muted !== false ? 1 : 0}&controls=0&loop=${background.loop !== false ? 1 : 0}&playlist=${youtubeId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&enablejsapi=1`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}

function NativeVideoBackground({ settings, isMuted, isPlaying, volume }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const background = settings.background || {};

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented or play failed:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      src={background.videoUrl}
      className="w-full h-full object-cover"
      autoPlay={background.autoplay !== false}
      muted={isMuted} // Initial state
      loop={background.loop !== false}
      playsInline
    />
  );
}

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export function CustomSectionRenderer({ section }: CustomSectionRendererProps) {
  const { type, content } = section;
  // Type assertion to ensure TypeScript knows this object matches the expected shape
  const settings = section.settings || {} as CustomSection['settings'];
  
  // Background Style
  const background = settings.background || { type: 'color', color: 'transparent', opacity: 1 };
  
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: background.type === 'color' ? background.color : undefined,
    backgroundImage: background.type === 'image' && background.image 
      ? `url('${background.image}')` 
      : background.type === 'gradient'
        ? `linear-gradient(${background.gradientDirection || 'to bottom'}, ${background.gradientFrom || '#000000'}, ${background.gradientTo || '#000000'})`
        : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Overlay opacity
  // For hero sections, we might want to use the specific overlayOpacity setting if available,
  // falling back to background opacity or default.
  const overlayOpacity = settings.overlayOpacity !== undefined 
    ? settings.overlayOpacity / 100 
    : (background.type === 'image' ? (background.opacity ?? 0.5) : 0);

  const textureOpacity = (background.textureOpacity ?? 10) / 100;

  // Container Classes
  const containerClasses = cn(
    "mx-auto px-4 relative z-10",
    {
      "container": settings.containerWidth === 'default',
      "max-w-3xl": settings.containerWidth === 'narrow',
      "w-full": settings.containerWidth === 'full',
    }
  );

  // Section Styles
  const sectionStyle: React.CSSProperties = {
    paddingTop: settings.paddingTop,
    paddingBottom: settings.paddingBottom,
    paddingLeft: settings.paddingLeft,
    paddingRight: settings.paddingRight,
    color: settings.textColor,
    minHeight: settings.minHeight,
    display: settings.minHeight ? 'flex' : 'block',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  // Custom CSS Injection
  if (settings.customCss) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
        <SectionContent 
          section={section} 
          sectionStyle={sectionStyle} 
          backgroundStyle={backgroundStyle} 
          overlayOpacity={overlayOpacity} 
          textureOpacity={textureOpacity}
          containerClasses={containerClasses} 
        />
      </>
    );
  }

  return (
    <SectionContent 
      section={section} 
      sectionStyle={sectionStyle} 
      backgroundStyle={backgroundStyle} 
      overlayOpacity={overlayOpacity} 
      textureOpacity={textureOpacity}
      containerClasses={containerClasses} 
    />
  );
}

interface SectionContentProps {
  section: CustomSection;
  sectionStyle: React.CSSProperties;
  backgroundStyle: React.CSSProperties;
  overlayOpacity: number;
  textureOpacity: number;
  containerClasses: string;
}

function SectionContent({ section, sectionStyle, backgroundStyle, overlayOpacity, textureOpacity, containerClasses }: SectionContentProps) {
  const { content, type } = section;
  const settings = section.settings || {} as CustomSection['settings'];
  const background = settings.background || { type: 'color', color: 'transparent', opacity: 1 };
  const animation = settings.animation || { type: 'none', duration: 0.5, delay: 0 };
  const isAnimated = animation.type && animation.type !== 'none';

  // Inject custom font if URL is provided
  useEffect(() => {
    if (settings.customFontUrl) {
      const linkId = `custom-font-${section.id}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = settings.customFontUrl;
        document.head.appendChild(link);
      }
      return () => {
        // Optional: remove font on cleanup? 
        // Might be better to keep it if other sections use it, 
        // but for now we'll leave it or maybe check if others need it.
        // Actually, removing it might cause flash of unstyled text if user navigates back and forth quickly.
        // Let's keep it simple and just add it.
      };
    }
  }, [settings.customFontUrl, section.id]);
  
  // Video Mute State
  const [isMuted, setIsMuted] = useState(background.muted !== false);
  // Video Play State
  const [isPlaying, setIsPlaying] = useState(true);
  // Video Volume State (0-100)
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    setIsMuted(background.muted !== false);
  }, [background.muted]);

  // Video Cover Logic
  const containerRef = useRef<HTMLElement>(null);
  const [videoDims, setVideoDims] = useState<{w: string, h: string} | null>(null);

  useEffect(() => {
    if (background.type !== 'video' || !background.videoUrl) return;
    const container = containerRef.current;
    if (!container) return;

    const updateDims = () => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;

      const targetRatio = 16 / 9;
      const containerRatio = cw / ch;

      if (containerRatio > targetRatio) {
        // Container is wider. Width = 100%, Height = Width / Ratio
        setVideoDims({ w: `${cw}px`, h: `${cw / targetRatio}px` });
      } else {
        // Container is taller. Height = 100%, Width = Height * Ratio
        setVideoDims({ w: `${ch * targetRatio}px`, h: `${ch}px` });
      }
    };

    const observer = new ResizeObserver(updateDims);
    observer.observe(container);
    updateDims();

    return () => observer.disconnect();
  }, [background.type, background.videoUrl]);

  // Text Alignment Classes (applied to children instead of container to prevent leakage)
  const alignmentClasses = cn({
    "text-left": settings.textAlign === 'left',
    "text-center": settings.textAlign === 'center',
    "text-right": settings.textAlign === 'right',
  });

  // Helper to determine if a value is a Tailwind class or raw CSS
  const isTailwindClass = (val?: string) => val?.startsWith('text-') || val?.includes(' ');
  
  // Helper to render title decoration
  const renderDecoration = (position: 'top' | 'bottom' | 'left' | 'right') => {
    const currentPos = settings.titleDecorationPosition || 'top';
    if (currentPos !== position) return null;
    if (!settings.titleDecorationType || settings.titleDecorationType === 'none') return null;

    const colorStyle = { 
      color: settings.titleDecorationColor || settings.titleColor || 'currentColor',
      paddingTop: settings.titleDecorationPaddingTop,
      paddingBottom: settings.titleDecorationPaddingBottom,
      paddingLeft: settings.titleDecorationPaddingLeft,
      paddingRight: settings.titleDecorationPaddingRight,
      marginTop: settings.titleDecorationMarginTop,
      marginBottom: settings.titleDecorationMarginBottom,
      marginLeft: settings.titleDecorationMarginLeft,
      marginRight: settings.titleDecorationMarginRight
    };
    const Icon = decorationIcons[settings.titleDecorationIcon || 'zap'] || Zap;

    let decorationContent = null;
    
    // Size handling
    const sizeStyle = settings.titleDecorationSize ? { width: settings.titleDecorationSize, height: settings.titleDecorationSize } : {};
    const imageStyle = settings.titleDecorationSize ? { height: settings.titleDecorationSize, width: 'auto' } : {};

    if (settings.titleDecorationType === 'icon') {
      decorationContent = <Icon className={!settings.titleDecorationSize ? "w-8 h-8" : ""} style={sizeStyle} />;
    } else if (settings.titleDecorationType === 'image' && settings.titleDecorationImage) {
      decorationContent = <img src={settings.titleDecorationImage} alt="decoration" className={!settings.titleDecorationSize ? "h-10 w-auto object-contain" : "object-contain"} style={imageStyle} />;
    } else if (settings.titleDecorationType === 'line-icon-line') {
      decorationContent = (
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-12 bg-current opacity-70" />
          <Icon className={!settings.titleDecorationSize ? "w-6 h-6" : ""} style={sizeStyle} />
          <div className="h-[2px] w-12 bg-current opacity-70" />
        </div>
      );
    }

    if (!decorationContent) return null;

    if (position === 'left' || position === 'right') {
      return (
        <div className="inline-flex items-center justify-center shrink-0" style={colorStyle}>
          {decorationContent}
        </div>
      );
    }

    return (
      <div 
        className={cn("flex w-full", {
          "justify-start": settings.textAlign === 'left',
          "justify-center": settings.textAlign === 'center' || !settings.textAlign,
          "justify-end": settings.textAlign === 'right',
          "mb-4": position === 'top',
          "mt-4": position === 'bottom'
        })}
        style={colorStyle}
      >
        {decorationContent}
      </div>
    );
  };
  
  // Title Size
  const titleFontSizeClass = !settings.titleFontSize 
    ? "text-3xl md:text-4xl" 
    : (isTailwindClass(settings.titleFontSize) ? settings.titleFontSize : "");
  const titleFontSizeStyle = (!settings.titleFontSize || isTailwindClass(settings.titleFontSize)) 
    ? {} 
    : { fontSize: settings.titleFontSize };

  // Subtitle Size
  const subtitleFontSizeClass = !settings.subtitleFontSize 
    ? "text-xl" 
    : (isTailwindClass(settings.subtitleFontSize) ? settings.subtitleFontSize : "");
  const subtitleFontSizeStyle = (!settings.subtitleFontSize || isTailwindClass(settings.subtitleFontSize)) 
    ? {} 
    : { fontSize: settings.subtitleFontSize };

  // Title Style Classes
  const getTitleClasses = () => {
    switch (settings.titleStyle) {
      case 'glow': return "text-glow-primary";
      case 'shadow': return "drop-shadow-lg";
      case 'outline': return "stroke-text";
      default: return "";
    }
  };

  const scrollToContent = () => {
    const currentSection = document.getElementById(section.id);
    const nextSection = currentSection?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const ScrollIcon = () => {
    const iconName = settings.scrollIndicator?.icon || 'chevron-down';
    switch (iconName) {
      case 'arrow-down': return <ArrowDown className="w-8 h-8" />;
      case 'mouse': return <Mouse className="w-8 h-8" />;
      default: return <ChevronDown className="w-8 h-8" />;
    }
  };

  const getAnimationVariants = (type: string) => {
    switch (type) {
      case 'fade': return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
      case 'slide-up': return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
      case 'slide-down': return { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } };
      case 'slide-left': return { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
      case 'slide-right': return { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
      case 'zoom': return { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } };
      default: return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
    }
  };

  const ContentWrapper = isAnimated ? motion.div : 'div';
  const animationProps = isAnimated ? {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-50px" },
    transition: { duration: animation.duration || 0.5, delay: animation.delay || 0, ease: "easeOut" },
    variants: getAnimationVariants(animation.type)
  } : {};

  // Button helper functions from HeroSection
  const getButtonVariant = (variant: string) => {
    switch (variant) {
      case 'secondary': return "secondary";
      case 'outline': return "outline";
      case 'ghost': return "ghost";
      case 'destructive': return "destructive";
      case 'link': return "link";
      case 'glow': return "glow";
      case 'glass': return "glass";
      case 'soft': return "soft";
      case 'outline-glow': return "outline-glow";
      case 'neo': return "neo";
      default: return "default"; // maps to primary/default
    }
  };

  const getButtonClasses = (variant: string) => {
    const baseClasses = "font-heading text-lg uppercase tracking-wide px-8 py-6";
    switch (variant) {
      case 'secondary': 
        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
      case 'outline':
        return `${baseClasses} border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
      case 'ghost':
        return `${baseClasses} hover:bg-accent hover:text-accent-foreground`;
      case 'primary': // Legacy explicit primary
      case 'default':
        return `${baseClasses} bg-accent hover:bg-accent/90 text-accent-foreground glow-accent`;
      default:
        // For new variants, return base layout but respect Button component colors
        return baseClasses;
    }
  };

  return (
    <section 
      ref={containerRef}
      id={section.id} 
      className="relative overflow-hidden" 
      style={sectionStyle}
    >
      {/* Background Layer */}
      {background.type === 'video' && background.videoUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          {getYoutubeId(background.videoUrl) ? (
            <YoutubeBackground settings={settings} isMuted={isMuted} isPlaying={isPlaying} volume={volume} videoDims={videoDims} />
          ) : (
            <NativeVideoBackground settings={settings} isMuted={isMuted} isPlaying={isPlaying} volume={volume} videoDims={videoDims} />
          )}
        </div>
      ) : (
        <div className="absolute inset-0" style={backgroundStyle} />
      )}
      
      {/* Texture Overlay */}
      {background.textureEnabled && (
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ 
            opacity: textureOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }} 
        />
      )}

      {/* Overlay Layer - High Fidelity for Hero */}
      {type === 'hero' ? (
        <>
          <div 
            className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" 
            style={{ opacity: overlayOpacity }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-60" />
        </>
      ) : (
        /* Standard Overlay for other types */
        overlayOpacity > 0 && (
          <div 
            className="absolute inset-0 bg-background" 
            style={{ opacity: overlayOpacity }} // Corrected logic: direct opacity usage
          />
        )
      )}

      {/* Mute & Play Toggle Buttons */}
      {background.type === 'video' && background.videoUrl && (
        <div className="absolute inset-0 z-30 pointer-events-none h-full w-full">
          <div className="sticky top-[calc(100vh-6rem)] w-full flex justify-end px-8 gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm border border-white/10"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 pointer-events-auto p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm border border-white/10 group">
              <button
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseInt(e.target.value);
                  setVolume(newVolume);
                  if (newVolume > 0 && isMuted) setIsMuted(false);
                  if (newVolume === 0 && !isMuted) setIsMuted(true);
                }}
                className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Layer */}
      <ContentWrapper className={containerClasses} {...(animationProps as Record<string, unknown>)}>
        
        {/* Render based on type */}
        {type === 'html' ? (
          <div dangerouslySetInnerHTML={{ __html: content.html || '' }} />
        ) : (
          <div className="space-y-6">
            {/* Header Content */}
            {(content.title || content.subtitle) && (
              <div className={cn("space-y-2 mb-8", alignmentClasses)}>
                {renderDecoration('top')}
                <div 
                  className={cn("flex flex-wrap items-center gap-x-4", {
                    "justify-start": settings.textAlign === 'left',
                    "justify-center": settings.textAlign === 'center' || !settings.textAlign,
                    "justify-end": settings.textAlign === 'right',
                  })}
                  style={{
                    marginTop: settings.titleWrapperMarginTop,
                    marginBottom: settings.titleWrapperMarginBottom
                  }}
                >
                  {renderDecoration('left')}
                  {content.title && (
                    <h2 
                      className={cn(
                        settings.titleFontWeight || "font-heading font-bold",
                        titleFontSizeClass,
                        "tracking-tight",
                        {
                          "uppercase": settings.titleTransform === 'uppercase',
                          "capitalize": settings.titleTransform === 'capitalize',
                          "lowercase": settings.titleTransform === 'lowercase',
                          "normal-case": settings.titleTransform === 'none',
                        },
                        getTitleClasses()
                      )}
                      style={{ 
                        color: settings.titleColor, 
                        ...titleFontSizeStyle,
                        fontFamily: settings.titleFontFamily,
                        lineHeight: settings.titleLineHeight,
                        letterSpacing: settings.titleLetterSpacing,
                        paddingTop: settings.titlePaddingTop,
                        paddingBottom: settings.titlePaddingBottom,
                        paddingLeft: settings.titlePaddingLeft,
                        paddingRight: settings.titlePaddingRight,
                        marginTop: settings.titleMarginTop,
                        marginBottom: settings.titleMarginBottom ?? 0,
                        marginLeft: settings.titleMarginLeft,
                        marginRight: settings.titleMarginRight
                      }}
                      dangerouslySetInnerHTML={{ __html: content.title }}
                    />
                  )}
                  {renderDecoration('right')}
                </div>
                {content.subtitle && (
                  <p 
                    className={cn(
                      "font-heading tracking-wide whitespace-pre-line",
                      subtitleFontSizeClass,
                      settings.subtitleFontWeight || "font-normal",
                      {
                        "uppercase": settings.subtitleTransform === 'uppercase',
                        "capitalize": settings.subtitleTransform === 'capitalize',
                        "lowercase": settings.subtitleTransform === 'lowercase',
                        "normal-case": settings.subtitleTransform === 'none',
                      }
                    )}
                    style={{ 
                      color: settings.subtitleColor || 'hsl(var(--muted-foreground))',
                      ...subtitleFontSizeStyle,
                      fontFamily: settings.subtitleFontFamily,
                      lineHeight: settings.subtitleLineHeight,
                      letterSpacing: settings.subtitleLetterSpacing,
                      paddingTop: settings.subtitlePaddingTop,
                      paddingBottom: settings.subtitlePaddingBottom,
                      paddingLeft: settings.subtitlePaddingLeft,
                      paddingRight: settings.subtitlePaddingRight,
                      marginTop: settings.subtitleMarginTop,
                      marginBottom: settings.subtitleMarginBottom,
                      marginLeft: settings.subtitleMarginLeft,
                      marginRight: settings.subtitleMarginRight
                    }}
                  >
                    {content.subtitle}
                  </p>
                )}
                {renderDecoration('bottom')}
              </div>
            )}

            {/* Main Body */}
            {content.description && (
              <div 
                className={cn("prose prose-invert max-w-none", alignmentClasses)}
                style={{
                  fontSize: settings.bodyFontSize,
                  fontWeight: settings.bodyFontWeight,
                  fontFamily: settings.bodyFontFamily,
                  lineHeight: settings.bodyLineHeight,
                  letterSpacing: settings.bodyLetterSpacing,
                  color: settings.textColor
                }}
                dangerouslySetInnerHTML={{ __html: content.description }} 
              />
            )}

            {/* Dynamic Content Blocks */}
            {type === 'dynamic-content' && content.dynamicSources && content.dynamicSources.map((source: DynamicContentSource, idx: number) => (
              <DynamicContentBlock key={idx} source={source} alignment={section.settings.sourceTextAlign || 'left'} />
            ))}

            {/* Media (Hero/CTA/Features) - Only show inline image if NOT using background image for hero */}
            {content.image && type !== 'hero' && (
               <div className={cn("my-8 rounded-lg overflow-hidden shadow-xl border border-border/20", alignmentClasses)}>
                 <img src={content.image} alt={content.title || 'Section Image'} className="w-full h-auto" />
               </div>
            )}

            {/* Buttons */}
            {content.buttons && content.buttons.length > 0 && (
              <div className={cn("flex flex-wrap gap-4 pt-4", {
                "justify-start": section.settings.textAlign === 'left',
                "justify-center": section.settings.textAlign === 'center',
                "justify-end": section.settings.textAlign === 'right',
              })}>
                {content.buttons.map((btn: HeroButton, idx: number) => (
                  <Button 
                    key={idx} 
                    variant={getButtonVariant(btn.variant) as any}
                    asChild
                    className={getButtonClasses(btn.variant)}
                    style={{
                      width: btn.width,
                      minWidth: btn.width ? 'fit-content' : undefined,
                      height: btn.height,
                      fontSize: btn.fontSize
                    }}
                  >
                    <a 
                      href={btn.url}
                      target={btn.url.startsWith('http') ? "_blank" : undefined}
                      rel={btn.url.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 w-full justify-center"
                    >
                      <span>{btn.text}</span>
                      {(() => {
                        if (btn.icon) {
                           const Icon = decorationIcons[btn.icon.toLowerCase()];
                           return Icon ? <Icon className="w-5 h-5" /> : null;
                        }
                        return btn.url.startsWith('http') ? <ExternalLink className="w-5 h-5" /> : null;
                      })()}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </ContentWrapper>

      {/* Scroll Indicator */}
      {settings.scrollIndicator?.enabled && (
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: settings.scrollIndicator.opacity ?? 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ 
            bottom: settings.scrollIndicator.position?.bottom || '2rem',
            paddingTop: settings.scrollIndicator.paddingTop,
            paddingBottom: settings.scrollIndicator.paddingBottom,
            paddingLeft: settings.scrollIndicator.paddingLeft,
            paddingRight: settings.scrollIndicator.paddingRight,
          }}
          className={cn(
            "absolute transition-colors z-20 flex flex-col items-center gap-2",
            {
              "left-1/2 -translate-x-1/2": (settings.scrollIndicator.position?.align || 'center') === 'center',
              "left-8": settings.scrollIndicator.position?.align === 'left',
              "right-8": settings.scrollIndicator.position?.align === 'right',
            },
            settings.scrollIndicator.color || "text-muted-foreground hover:text-primary",
            {
              "animate-bounce": settings.scrollIndicator.style === 'bounce',
              "animate-pulse": settings.scrollIndicator.style === 'pulse',
            }
          )}
        >
          {settings.scrollIndicator.text && (
            <span className="text-sm font-medium tracking-widest uppercase mb-1">
              {settings.scrollIndicator.text}
            </span>
          )}
          <ScrollIcon />
        </motion.button>
      )}
    </section>
  );
}

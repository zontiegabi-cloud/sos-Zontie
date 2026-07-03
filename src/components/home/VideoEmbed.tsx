import { cn } from '@/lib/utils';

export type SupportedVideoPlatform = 'youtube' | 'twitch' | 'vimeo' | 'file';

export interface VideoEmbedProps {
  url: string;
  type?: SupportedVideoPlatform | 'auto';
  className?: string;
  aspectRatio?: number; // Default is 16/9
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

interface ParsedVideoUrl {
  id?: string;
  type: SupportedVideoPlatform | null;
  twitchKind?: "channel" | "video" | "clip";
}

const DIRECT_VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v|m3u8|mpg|mpeg|avi|mkv)(?:$|[?#])/i;

function toAbsoluteUrl(url: string): URL | null {
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return new URL(url, base);
  } catch {
    return null;
  }
}

function isYoutubeUrl(url: string): boolean {
  const normalizedUrl = url.toLowerCase();
  return (
    normalizedUrl.includes('youtube.com') ||
    normalizedUrl.includes('youtu.be') ||
    normalizedUrl.includes('youtube-nocookie.com')
  );
}

function isTwitchUrl(url: string): boolean {
  const normalizedUrl = url.toLowerCase();
  return normalizedUrl.includes('twitch.tv') || normalizedUrl.includes('clips.twitch.tv');
}

function isVimeoUrl(url: string): boolean {
  return url.toLowerCase().includes('vimeo.com');
}

function buildYoutubeParams(
  url: URL,
  {
    autoPlay,
    muted,
    loop,
    controls,
    playlistId,
  }: {
    autoPlay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
    playlistId?: string;
  }
): string {
  url.searchParams.set('autoplay', autoPlay ? '1' : '0');
  url.searchParams.set('mute', muted ? '1' : '0');
  url.searchParams.set('playsinline', '1');
  url.searchParams.set('rel', '0');
  url.searchParams.set('modestbranding', '1');
  url.searchParams.set('controls', controls ? '1' : '0');

  if (loop) {
    url.searchParams.set('loop', '1');
    if (playlistId) {
      url.searchParams.set('playlist', playlistId);
    }
  } else {
    url.searchParams.delete('loop');
    if (playlistId) {
      url.searchParams.delete('playlist');
    }
  }

  return url.toString();
}

function normalizeYoutubeUrl(
  rawUrl: string,
  options: {
    autoPlay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  }
): string | null {
  const parsedUrl = toAbsoluteUrl(rawUrl);
  if (!parsedUrl) return null;

  const hostname = parsedUrl.hostname.toLowerCase();
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  if (hostname.includes('youtube.com') || hostname.includes('youtube-nocookie.com')) {
    if (segments[0]?.toLowerCase() === 'embed') {
      const playlistId = segments[1] && segments[1] !== 'live_stream' ? segments[1] : undefined;
      return buildYoutubeParams(parsedUrl, { ...options, playlistId });
    }
  }

  const videoId = parseYoutubeId(rawUrl);
  if (!videoId) return null;

  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  return buildYoutubeParams(embedUrl, { ...options, playlistId: videoId });
}

function normalizeTwitchUrl(rawUrl: string, autoPlay: boolean): string | null {
  const parsedUrl = toAbsoluteUrl(rawUrl);
  const parent = typeof window !== 'undefined' ? window.location.hostname || 'localhost' : 'localhost';

  if (
    parsedUrl &&
    (parsedUrl.hostname.toLowerCase().includes('player.twitch.tv') ||
      parsedUrl.hostname.toLowerCase().includes('clips.twitch.tv'))
  ) {
    parsedUrl.searchParams.set('parent', parent);
    parsedUrl.searchParams.set('autoplay', autoPlay ? 'true' : 'false');
    return parsedUrl.toString();
  }

  const parsed = parseTwitchId(rawUrl);
  if (!parsed) return null;

  if (parsed.kind === "video") {
    return `https://player.twitch.tv/?parent=${parent}&video=v${parsed.id}&autoplay=${autoPlay ? 'true' : 'false'}`;
  }
  if (parsed.kind === "clip") {
    return `https://clips.twitch.tv/embed?clip=${parsed.id}&parent=${parent}&autoplay=${autoPlay ? 'true' : 'false'}`;
  }

  return `https://player.twitch.tv/?parent=${parent}&channel=${parsed.id}&autoplay=${autoPlay ? 'true' : 'false'}`;
}

function normalizeVimeoUrl(
  rawUrl: string,
  {
    autoPlay,
    muted,
    loop,
    controls,
  }: {
    autoPlay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
  }
): string | null {
  const parsedUrl = toAbsoluteUrl(rawUrl);

  if (parsedUrl?.hostname.toLowerCase().includes('player.vimeo.com')) {
    parsedUrl.searchParams.set('autoplay', autoPlay ? '1' : '0');
    parsedUrl.searchParams.set('muted', muted ? '1' : '0');
    parsedUrl.searchParams.set('loop', loop ? '1' : '0');
    parsedUrl.searchParams.set('controls', controls ? '1' : '0');
    return parsedUrl.toString();
  }

  const videoId = parseVimeoId(rawUrl);
  if (!videoId) return null;

  const playerUrl = new URL(`https://player.vimeo.com/video/${videoId}`);
  playerUrl.searchParams.set('autoplay', autoPlay ? '1' : '0');
  playerUrl.searchParams.set('muted', muted ? '1' : '0');
  playerUrl.searchParams.set('loop', loop ? '1' : '0');
  playerUrl.searchParams.set('controls', controls ? '1' : '0');
  return playerUrl.toString();
}

export function isSupportedVideoUrl(url?: string): boolean {
  if (!url) return false;
  return isYoutubeUrl(url) || isTwitchUrl(url) || isVimeoUrl(url) || isDirectVideoFile(url);
}

function parseYoutubeId(url: string): string | null {
  const parsedUrl = toAbsoluteUrl(url);
  if (parsedUrl) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const segments = parsedUrl.pathname.split('/').filter(Boolean);

    if (hostname.includes('youtu.be')) {
      return segments[0] || null;
    }

    const queryVideoId = parsedUrl.searchParams.get('v');
    if (queryVideoId) {
      return queryVideoId;
    }

    const embedIndex = segments.findIndex((segment) =>
      ['embed', 'shorts', 'live'].includes(segment.toLowerCase())
    );
    if (embedIndex >= 0) {
      return segments[embedIndex + 1] || null;
    }
  }

  const patterns = [
    /youtu\.be\/([^&?/]+)/i,
    /youtube\.com\/watch\?.*v=([^&?/]+)/i,
    /youtube\.com\/embed\/([^&?/]+)/i,
    /youtube\.com\/shorts\/([^&?/]+)/i,
    /youtube\.com\/live\/([^&?/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

type TwitchParsed = {
  kind: "channel" | "video" | "clip";
  id: string;
};

function parseTwitchId(url: string): TwitchParsed | null {
  const parsedUrl = toAbsoluteUrl(url);
  if (parsedUrl) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const segments = parsedUrl.pathname.split('/').filter(Boolean);

    if (hostname.includes('clips.twitch.tv') && segments[0]) {
      return { kind: "clip", id: segments[0] };
    }

    const queryClip = parsedUrl.searchParams.get('clip');
    if (queryClip) {
      return { kind: "clip", id: queryClip };
    }

    const queryVideo = parsedUrl.searchParams.get('video');
    if (queryVideo) {
      return { kind: "video", id: queryVideo.replace(/^v/i, '') };
    }

    if (segments[0]?.toLowerCase() === 'videos' && segments[1]) {
      return { kind: "video", id: segments[1] };
    }

    if (segments[1]?.toLowerCase() === 'clip' && segments[2]) {
      return { kind: "clip", id: segments[2] };
    }

    if (segments[0] && segments[0].toLowerCase() !== 'videos') {
      return { kind: "channel", id: segments[0] };
    }
  }

  const clipMatch = url.match(/clips\.twitch\.tv\/([^/?#]+)/i) || url.match(/twitch\.tv\/[^/]+\/clip\/([^/?#]+)/i);
  if (clipMatch?.[1]) {
    return { kind: "clip", id: clipMatch[1] };
  }

  const videoPathMatch = url.match(/twitch\.tv\/videos\/(\d+)/i);
  if (videoPathMatch?.[1]) {
    return { kind: "video", id: videoPathMatch[1] };
  }

  const videoMatch = url.match(/[?&]video=(\d+)/i);
  if (videoMatch?.[1]) {
    return { kind: "video", id: videoMatch[1] };
  }

  const channelMatch = url.match(/twitch\.tv\/([^/?#]+)/i);
  if (channelMatch?.[1] && channelMatch[1].toLowerCase() !== "videos") {
    return { kind: "channel", id: channelMatch[1] };
  }

  return null;
}

// Extract video ID from Vimeo URLs
function parseVimeoId(url: string): string | null {
  const parsedUrl = toAbsoluteUrl(url);
  if (parsedUrl) {
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    const numericSegment = segments.find((segment) => /^\d+$/.test(segment));
    if (numericSegment) {
      return numericSegment;
    }
  }

  const match = url.match(/vimeo\.com\/(?:video\/)?([^\/?]+)/i);
  return match ? match[1] : null;
}

function isDirectVideoFile(url: string): boolean {
  if (/^data:video\//i.test(url) || /^blob:/i.test(url)) {
    return true;
  }

  const parsedUrl = toAbsoluteUrl(url);
  if (parsedUrl?.pathname && DIRECT_VIDEO_FILE_PATTERN.test(parsedUrl.pathname)) {
    return true;
  }

  return DIRECT_VIDEO_FILE_PATTERN.test(url);
}

export function detectSupportedVideoPlatform(
  url?: string,
  type?: VideoEmbedProps['type']
): SupportedVideoPlatform | null {
  if (!url) return null;

  if (type && ['youtube', 'twitch', 'vimeo', 'file'].includes(type)) {
    const platform = type as SupportedVideoPlatform;
    return platform;
  }

  if (isYoutubeUrl(url)) return 'youtube';
  if (isTwitchUrl(url)) return 'twitch';
  if (isVimeoUrl(url)) return 'vimeo';
  if (isDirectVideoFile(url)) return 'file';
  return null;
}

function parseVideoUrl(url: string, type?: string): ParsedVideoUrl {
  const detectedType = detectSupportedVideoPlatform(url, type as VideoEmbedProps['type']);

  let id: string | null = null;
  let twitchKind: "channel" | "video" | "clip" | undefined;
  
  if (detectedType) {
    switch (detectedType) {
      case 'youtube':
        id = parseYoutubeId(url);
        break;
      case 'twitch':
        {
          const twitch = parseTwitchId(url);
          id = twitch?.id || null;
          twitchKind = twitch?.kind;
        }
        break;
      case 'vimeo':
        id = parseVimeoId(url);
        break;
      case 'file':
        id = url;
        break;
    }
  }

  return { type: detectedType, id, twitchKind };
}

export default function VideoEmbed({
  url,
  type = 'auto',
  className,
  aspectRatio = 16/9,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
}: VideoEmbedProps) {
  const parsed = parseVideoUrl(url, type);
  
  if (!parsed.id || !parsed.type) {
    return (
      <div className={cn("p-4 text-red-500 bg-red-50 rounded-md", className)}>
        Invalid or unsupported video URL detected. Please check the URL.
      </div>
    );
  }

  const getEmbedUrl = (): string => {
    switch (parsed.type) {
      case 'youtube':
        return (
          normalizeYoutubeUrl(url, {
            autoPlay,
            muted,
            loop,
            controls,
          }) || ''
        );
      case 'twitch':
        return normalizeTwitchUrl(url, autoPlay) || '';
      case 'vimeo':
        return (
          normalizeVimeoUrl(url, {
            autoPlay,
            muted,
            loop,
            controls,
          }) || ''
        );
      case 'file':
        return parsed.id || url;
    }
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className={cn("p-4 text-red-500 bg-red-50 rounded-md", className)}>
        Invalid or unsupported video URL detected. Please check the URL.
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full rounded-lg overflow-hidden", className)}
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      {parsed.type === 'file' ? (
        <video
          src={embedUrl}
          className={cn(
            "w-full h-full border-0 bg-black",
            controls ? "object-contain" : "object-cover"
          )}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload="metadata"
        />
      ) : parsed.type === 'twitch' ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="w-full h-full border-0"
          title="Embedded video player"
        />
      ) : (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full border-0"
          title="Embedded video player"
        />
      )}
    </div>
  );
}

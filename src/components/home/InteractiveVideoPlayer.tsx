import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import VideoEmbed, { detectSupportedVideoPlatform } from "./VideoEmbed";

interface InteractiveVideoPlayerProps {
  url: string;
  className?: string;
  aspectRatio?: number;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function InteractiveVideoPlayer({
  url,
  className,
  aspectRatio = 16 / 9,
}: InteractiveVideoPlayerProps) {
  const platform = useMemo(() => detectSupportedVideoPlatform(url), [url]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(false);
    setCurrentTime(0);
    setDuration(0);
  }, [url]);

  if (platform !== "file") {
    return (
      <VideoEmbed
        url={url}
        className={className}
        aspectRatio={aspectRatio}
        controls
      />
    );
  }

  const syncPlayerState = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsPlaying(!video.paused && !video.ended);
    setIsMuted(video.muted);
    setCurrentTime(video.currentTime || 0);
    setDuration(video.duration || 0);
  };

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      try {
        await video.play();
      } catch {
        return;
      }
    } else {
      video.pause();
    }

    syncPlayerState();
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    syncPlayerState();
  };

  const handleRestart = async () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    try {
      await video.play();
    } catch {
      syncPlayerState();
      return;
    }
    syncPlayerState();
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="space-y-3">
      <div
        className={className}
        style={{ aspectRatio: `${aspectRatio}` }}
      >
        <video
          ref={videoRef}
          src={url}
          className="h-full w-full rounded-none bg-black object-contain"
          controls
          playsInline
          preload="metadata"
          onPlay={syncPlayerState}
          onPause={syncPlayerState}
          onVolumeChange={syncPlayerState}
          onLoadedMetadata={syncPlayerState}
          onTimeUpdate={syncPlayerState}
          onEnded={syncPlayerState}
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleTogglePlay}>
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleToggleMute}>
              {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              {isMuted ? "Unmute" : "Mute"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={handleSeek}
          className="mt-3 h-2 w-full cursor-pointer accent-primary"
          aria-label="Video timeline"
        />
      </div>
    </div>
  );
}

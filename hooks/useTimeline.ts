"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseTimelineOptions {
  duration: number;
  loop?: boolean;
  autoPlay?: boolean;
}

interface UseTimelineReturn {
  currentTime: number;
  progress: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  restart: () => void;
}

export function useTimeline({
  duration,
  loop = true,
  autoPlay = false,
}: UseTimelineOptions): UseTimelineReturn {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const timeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);

  const tick = useCallback(
    (now: number) => {
      const last = lastFrameRef.current ?? now;
      const delta = Math.min(now - last, 50); // cap at 50ms to avoid jumps
      lastFrameRef.current = now;

      timeRef.current += delta;

      if (timeRef.current >= duration) {
        if (loop) {
          timeRef.current = 0;
        } else {
          timeRef.current = duration;
          setIsPlaying(false);
          setCurrentTime(duration);
          rafRef.current = null;
          return;
        }
      }

      // Sync to React state every other frame (~30fps render updates)
      frameCountRef.current++;
      if (frameCountRef.current % 2 === 0) {
        setCurrentTime(timeRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [duration, loop]
  );

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrameRef.current = null;
      return;
    }

    lastFrameRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, tick]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);

  const seek = useCallback(
    (time: number) => {
      const clamped = Math.max(0, Math.min(time, duration));
      timeRef.current = clamped;
      setCurrentTime(clamped);
    },
    [duration]
  );

  const restart = useCallback(() => {
    timeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  return {
    currentTime,
    progress: duration > 0 ? currentTime / duration : 0,
    isPlaying,
    play,
    pause,
    toggle,
    seek,
    restart,
  };
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Track } from "@/lib/music.functions";
import { registerPlay } from "@/lib/music.functions";
import { logPlay } from "@/lib/library.functions";
import { supabase } from "@/integrations/supabase/client";

type Repeat = "off" | "all" | "one";

type PlayerState = {
  queue: Track[];
  index: number;
  current: Track | null;
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: Repeat;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track) => void;
  addToQueue: (track: Track) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

/** Acesso ao player global de música. */
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer precisa estar dentro de PlayerProvider");
  return ctx;
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  seekTo: (s: number, allow: boolean) => void;
  setVolume: (v: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement | string, opts: unknown) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<Repeat>("off");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytRef = useRef<YTPlayer | null>(null);
  const ytHostRef = useRef<HTMLDivElement | null>(null);
  const loggedRef = useRef<string | null>(null);

  const current = queue[index] ?? null;
  const usesYouTube = Boolean(current && !current.audio_url && current.youtube_id);

  /* Carrega a faixa atual no motor adequado. */
  useEffect(() => {
    if (!current) return;
    setProgress(0);
    setDuration(current.duration_seconds || 0);

    if (current.audio_url) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = current.audio_url;
        audio.volume = volume / 100;
        void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
      return;
    }

    if (!current.youtube_id) return;
    let cancelled = false;
    void loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player || !ytHostRef.current) return;
      if (ytRef.current) {
        ytRef.current.loadVideoById(current.youtube_id);
        ytRef.current.setVolume(volume);
        setPlaying(true);
        return;
      }
      ytRef.current = new window.YT.Player(ytHostRef.current, {
        videoId: current.youtube_id,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.setVolume(volume);
            e.target.playVideo();
            setPlaying(true);
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 1) setPlaying(true);
            if (e.data === 2) setPlaying(false);
            if (e.data === 0) nextRef.current();
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  /* Registra a reprodução (contador global + histórico do usuário). */
  useEffect(() => {
    if (!current || loggedRef.current === current.id) return;
    loggedRef.current = current.id;
    void registerPlay({ data: { id: current.id } }).catch(() => undefined);
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void logPlay({ data: { trackId: current.id } }).catch(() => undefined);
    });
  }, [current]);

  /* Relógio de progresso. */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (usesYouTube && ytRef.current) {
        setProgress(ytRef.current.getCurrentTime() || 0);
        const d = ytRef.current.getDuration() || 0;
        if (d) setDuration(d);
      } else if (audioRef.current && !audioRef.current.paused) {
        setProgress(audioRef.current.currentTime);
        if (audioRef.current.duration) setDuration(audioRef.current.duration);
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [usesYouTube]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (repeat === "one") return i;
      if (shuffle && queue.length > 1) {
        let n = i;
        while (n === i) n = Math.floor(Math.random() * queue.length);
        return n;
      }
      if (i + 1 < queue.length) return i + 1;
      return repeat === "all" ? 0 : i;
    });
  }, [queue.length, repeat, shuffle]);

  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  const value = useMemo<PlayerState>(
    () => ({
      queue,
      index,
      current,
      playing,
      progress,
      duration,
      volume,
      shuffle,
      repeat,
      playQueue: (tracks, startIndex = 0) => {
        if (!tracks.length) return;
        setQueue(tracks);
        setIndex(Math.max(0, Math.min(startIndex, tracks.length - 1)));
      },
      playTrack: (track) => {
        setQueue([track]);
        setIndex(0);
      },
      addToQueue: (track) => setQueue((q) => (q.some((t) => t.id === track.id) ? q : [...q, track])),
      toggle: () => {
        if (usesYouTube && ytRef.current) {
          if (playing) ytRef.current.pauseVideo();
          else ytRef.current.playVideo();
        } else if (audioRef.current) {
          if (playing) audioRef.current.pause();
          else void audioRef.current.play();
        }
        setPlaying((p) => !p);
      },
      next,
      prev: () => {
        if (progress > 5) {
          if (usesYouTube && ytRef.current) ytRef.current.seekTo(0, true);
          else if (audioRef.current) audioRef.current.currentTime = 0;
          return;
        }
        setIndex((i) => (i > 0 ? i - 1 : i));
      },
      seek: (seconds) => {
        if (usesYouTube && ytRef.current) ytRef.current.seekTo(seconds, true);
        else if (audioRef.current) audioRef.current.currentTime = seconds;
        setProgress(seconds);
      },
      setVolume: (v) => {
        setVolumeState(v);
        if (ytRef.current) ytRef.current.setVolume(v);
        if (audioRef.current) audioRef.current.volume = v / 100;
      },
      toggleShuffle: () => setShuffle((s) => !s),
      cycleRepeat: () => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    }),
    [queue, index, current, playing, progress, duration, volume, shuffle, repeat, next, usesYouTube],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onEnded={() => nextRef.current()}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="hidden"
      />
      <div className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0">
        <div ref={ytHostRef} />
      </div>
    </PlayerContext.Provider>
  );
}

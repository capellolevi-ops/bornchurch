import { Link } from "@tanstack/react-router";
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { usePlayer } from "./PlayerProvider";

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Player fixo no rodapé, presente em todas as páginas. */
export function PlayerBar() {
  const p = usePlayer();
  if (!p.current) return null;

  const cover = p.current.cover_url ?? p.current.music_albums?.cover_url ?? null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 lg:px-8">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(1, p.duration)}
            value={Math.min(p.progress, p.duration || 1)}
            onChange={(e) => p.seek(Number(e.target.value))}
            aria-label="Progresso da música"
            className="h-1 w-full cursor-pointer accent-gold"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {cover ? (
              <img src={cover} alt="" className="h-11 w-11 rounded-lg object-cover" />
            ) : (
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-card text-xs text-gold">
                ♪
              </div>
            )}
            <div className="min-w-0">
              <Link
                to="/musica/faixa/$slug"
                params={{ slug: p.current.slug }}
                className="block truncate text-sm font-medium text-foreground hover:text-gold"
              >
                {p.current.title}
              </Link>
              <p className="truncate text-xs text-muted-foreground">
                {p.current.music_artists?.name ?? "Born Church"} ·{" "}
                {formatTime(p.progress)} / {formatTime(p.duration)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Aleatório"
              onClick={p.toggleShuffle}
              className={cn("hidden rounded-full p-2 sm:block", p.shuffle ? "text-gold" : "text-muted-foreground")}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Anterior"
              onClick={p.prev}
              className="rounded-full p-2 text-foreground hover:text-gold"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={p.playing ? "Pausar" : "Tocar"}
              onClick={p.toggle}
              className="grid h-11 w-11 place-items-center rounded-full bg-gold text-background"
            >
              {p.playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label="Próxima"
              onClick={p.next}
              className="rounded-full p-2 text-foreground hover:text-gold"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Repetir"
              onClick={p.cycleRepeat}
              className={cn("hidden rounded-full p-2 sm:block", p.repeat !== "off" ? "text-gold" : "text-muted-foreground")}
            >
              {p.repeat === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </button>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <input
              type="range"
              min={0}
              max={100}
              value={p.volume}
              onChange={(e) => p.setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1 w-24 cursor-pointer accent-gold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Heart, ListPlus, Play } from "lucide-react";
import { toast } from "sonner";

import type { Album, Artist, Playlist, Track } from "@/lib/music.functions";
import { toggleSave } from "@/lib/library.functions";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

import { usePlayer } from "./PlayerProvider";
import { formatTime } from "./PlayerBar";

export function coverOf(track: Track) {
  return track.cover_url ?? track.music_albums?.cover_url ?? null;
}

/** Moldura padrão de capa (usa iniciais quando não há imagem). */
export function Cover({
  src,
  alt,
  className,
  rounded = "rounded-xl",
}: {
  src: string | null;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", rounded, className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "grid h-full w-full place-items-center bg-card font-display text-xl text-gold",
        rounded,
        className,
      )}
    >
      {alt.slice(0, 1).toUpperCase()}
    </div>
  );
}

/** Lista de faixas com botão de tocar e favoritar. */
export function TrackList({ tracks, numbered = false }: { tracks: Track[]; numbered?: boolean }) {
  const player = usePlayer();
  const { user } = useSession();

  if (!tracks.length) {
    return <EmptyState title="Nada por aqui ainda" hint="Novas músicas aparecem assim que forem publicadas." />;
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
      {tracks.map((track, i) => (
        <li
          key={track.id}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-card",
            player.current?.id === track.id && "bg-card",
          )}
        >
          <button
            type="button"
            aria-label={`Tocar ${track.title}`}
            onClick={() => player.playQueue(tracks, i)}
            className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg"
          >
            <Cover src={coverOf(track)} alt={track.title} rounded="rounded-lg" />
            <span className="absolute inset-0 grid place-items-center bg-background/60 opacity-0 transition-opacity hover:opacity-100">
              <Play className="h-4 w-4 text-gold" />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            <Link
              to="/musica/faixa/$slug"
              params={{ slug: track.slug }}
              className={cn(
                "block truncate text-sm font-medium text-foreground hover:text-gold",
                player.current?.id === track.id && "text-gold",
              )}
            >
              {numbered ? `${i + 1}. ` : ""}
              {track.title}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {track.music_artists?.name ?? "Born Church"}
              {track.music_albums?.title ? ` · ${track.music_albums.title}` : ""}
            </p>
          </div>

          <span className="hidden text-xs text-muted-foreground sm:block">
            {formatTime(track.duration_seconds)}
          </span>

          <button
            type="button"
            aria-label="Favoritar"
            onClick={async () => {
              if (!user) {
                toast.info("Entre na sua conta para favoritar músicas.");
                return;
              }
              try {
                await toggleSave({ data: { kind: "track", id: track.id, on: true } });
                toast.success("Adicionada às suas favoritas");
              } catch {
                toast.error("Não foi possível favoritar agora.");
              }
            }}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <Heart className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Adicionar à fila"
            onClick={() => {
              player.addToQueue(track);
              toast.success("Adicionada à fila");
            }}
            className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:text-gold sm:block"
          >
            <ListPlus className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

type CardItem = { title: string; subtitle?: string; cover: string | null; to: string; params: Record<string, string> };

/** Grade de cartões (artistas, álbuns, playlists). */
export function CardGrid({ items }: { items: CardItem[] }) {
  if (!items.length) return <EmptyState title="Nada por aqui ainda" />;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => (
        <Link
          key={`${item.to}-${Object.values(item.params).join()}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          to={item.to as any}
          params={item.params}
          className="group rounded-2xl border border-border bg-card/40 p-3 transition-colors hover:border-gold"
        >
          <div className="aspect-square overflow-hidden rounded-xl">
            <Cover src={item.cover} alt={item.title} />
          </div>
          <p className="mt-3 truncate text-sm font-medium text-foreground group-hover:text-gold">{item.title}</p>
          {item.subtitle ? (
            <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

export function artistCards(artists: Artist[]): CardItem[] {
  return artists.map((a) => ({
    title: a.name,
    subtitle: "Artista",
    cover: a.photo_url,
    to: "/musica/artista/$slug",
    params: { slug: a.slug },
  }));
}

export function albumCards(albums: Album[]): CardItem[] {
  return albums.map((a) => ({
    title: a.title,
    subtitle: a.music_artists?.name ?? (a.year ? String(a.year) : "Álbum"),
    cover: a.cover_url,
    to: "/musica/album/$slug",
    params: { slug: a.slug },
  }));
}

export function playlistCards(playlists: Playlist[]): CardItem[] {
  return playlists.map((p) => ({
    title: p.title,
    subtitle: p.description || "Playlist",
    cover: p.cover_url,
    to: "/musica/playlist/$slug",
    params: { slug: p.slug },
  }));
}

/** Título de seção com espaçamento padrão. */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
      <p className="font-display text-lg text-foreground">{title}</p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-card/60" />
      ))}
    </div>
  );
}

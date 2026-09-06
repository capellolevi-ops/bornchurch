import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { getAlbum } from "@/lib/music.functions";
import { Cover, Section, TrackList } from "@/components/music/MusicUI";
import { usePlayer } from "@/components/music/PlayerProvider";

export const Route = createFileRoute("/musica/album/$slug")({
  loader: async ({ params }) => {
    const data = await getAlbum({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Álbum indisponível — Born Music" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.album;
    const desc = a.description || `Ouça o álbum ${a.title} na Born Music.`;
    return {
      meta: [
        { title: `${a.title} — Born Music` },
        { name: "description", content: desc },
        { property: "og:title", content: `${a.title} — Born Music` },
        { property: "og:description", content: desc },
      ],
    };
  },
  errorComponent: () => <p className="text-sm text-muted-foreground">Não foi possível abrir este álbum.</p>,
  notFoundComponent: () => <p className="text-sm text-muted-foreground">Álbum não encontrado.</p>,
  component: AlbumPage,
});

function AlbumPage() {
  const { album, tracks } = Route.useLoaderData();
  const player = usePlayer();

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="h-44 w-44 shrink-0 overflow-hidden rounded-2xl">
          <Cover src={album.cover_url} alt={album.title} rounded="rounded-2xl" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Álbum{album.year ? ` · ${album.year}` : ""}</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{album.title}</h1>
          {album.music_artists ? (
            <Link
              to="/musica/artista/$slug"
              params={{ slug: album.music_artists.slug }}
              className="mt-1 inline-block text-sm text-muted-foreground hover:text-gold"
            >
              {album.music_artists.name}
            </Link>
          ) : null}
          {album.description ? (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{album.description}</p>
          ) : null}
          {tracks.length ? (
            <button
              type="button"
              onClick={() => player.playQueue(tracks, 0)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" /> Tocar álbum
            </button>
          ) : null}
        </div>
      </header>

      <Section title="Faixas">
        <TrackList tracks={tracks} numbered />
      </Section>
    </div>
  );
}

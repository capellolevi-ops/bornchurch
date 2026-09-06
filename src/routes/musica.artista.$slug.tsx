import { createFileRoute, notFound } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { getArtist } from "@/lib/music.functions";
import { CardGrid, Cover, Section, TrackList, albumCards } from "@/components/music/MusicUI";
import { usePlayer } from "@/components/music/PlayerProvider";

export const Route = createFileRoute("/musica/artista/$slug")({
  loader: async ({ params }) => {
    const data = await getArtist({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Artista indisponível — Born Music" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.artist;
    const desc = a.bio || `Ouça as músicas de ${a.name} na Born Music.`;
    return {
      meta: [
        { title: `${a.name} — Born Music` },
        { name: "description", content: desc },
        { property: "og:title", content: `${a.name} — Born Music` },
        { property: "og:description", content: desc },
      ],
    };
  },
  errorComponent: () => <p className="text-sm text-muted-foreground">Não foi possível abrir este artista.</p>,
  notFoundComponent: () => <p className="text-sm text-muted-foreground">Artista não encontrado.</p>,
  component: ArtistPage,
});

function ArtistPage() {
  const { artist, tracks, albums } = Route.useLoaderData();
  const player = usePlayer();

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="h-44 w-44 shrink-0 overflow-hidden rounded-full">
          <Cover src={artist.photo_url} alt={artist.name} rounded="rounded-full" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Artista</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{artist.name}</h1>
          {artist.bio ? <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{artist.bio}</p> : null}
          {tracks.length ? (
            <button
              type="button"
              onClick={() => player.playQueue(tracks, 0)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" /> Tocar tudo
            </button>
          ) : null}
        </div>
      </header>

      <Section title="Músicas">
        <TrackList tracks={tracks} />
      </Section>

      {albums.length ? (
        <Section title="Álbuns">
          <CardGrid items={albumCards(albums)} />
        </Section>
      ) : null}
    </div>
  );
}

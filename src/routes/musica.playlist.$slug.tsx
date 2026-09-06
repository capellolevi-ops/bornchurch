import { createFileRoute, notFound } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { getPlaylist } from "@/lib/music.functions";
import { Cover, Section, TrackList } from "@/components/music/MusicUI";
import { usePlayer } from "@/components/music/PlayerProvider";
import { ShareButton } from "@/components/site/ShareButton";

export const Route = createFileRoute("/musica/playlist/$slug")({
  loader: async ({ params }) => {
    const data = await getPlaylist({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Playlist indisponível — Born Music" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.playlist;
    const desc = p.description || `Ouça a playlist ${p.title} na Born Music.`;
    return {
      meta: [
        { title: `${p.title} — Born Music` },
        { name: "description", content: desc },
        { property: "og:title", content: `${p.title} — Born Music` },
        { property: "og:description", content: desc },
      ],
    };
  },
  errorComponent: () => <p className="text-sm text-muted-foreground">Não foi possível abrir esta playlist.</p>,
  notFoundComponent: () => <p className="text-sm text-muted-foreground">Playlist não encontrada.</p>,
  component: PlaylistPage,
});

function PlaylistPage() {
  const { playlist, tracks } = Route.useLoaderData();
  const player = usePlayer();

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="h-44 w-44 shrink-0 overflow-hidden rounded-2xl">
          <Cover src={playlist.cover_url} alt={playlist.title} rounded="rounded-2xl" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Playlist</p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{playlist.title}</h1>
          {playlist.description ? (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{playlist.description}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">{tracks.length} faixas</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {tracks.length ? (
              <button
                type="button"
                onClick={() => player.playQueue(tracks, 0)}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <Play className="h-4 w-4" /> Tocar
              </button>
            ) : null}
            <ShareButton title={playlist.title} />
          </div>
        </div>
      </header>

      <Section title="Faixas">
        <TrackList tracks={tracks} numbered />
      </Section>
    </div>
  );
}

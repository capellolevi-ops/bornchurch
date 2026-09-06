import { createFileRoute, notFound } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { getTrack } from "@/lib/music.functions";
import { Cover, Section, TrackList, coverOf } from "@/components/music/MusicUI";
import { usePlayer } from "@/components/music/PlayerProvider";
import { ShareButton } from "@/components/site/ShareButton";

export const Route = createFileRoute("/musica/faixa/$slug")({
  loader: async ({ params }) => {
    const data = await getTrack({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Música indisponível — Born Music" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.track;
    const desc = t.description || `Ouça ${t.title} na Born Music, a plataforma de louvor da Born Church.`;
    return {
      meta: [
        { title: `${t.title} — Born Music` },
        { name: "description", content: desc },
        { property: "og:title", content: `${t.title} — Born Music` },
        { property: "og:description", content: desc },
      ],
    };
  },
  errorComponent: () => <p className="text-sm text-muted-foreground">Não foi possível abrir esta música.</p>,
  notFoundComponent: () => <p className="text-sm text-muted-foreground">Música não encontrada.</p>,
  component: TrackPage,
});

function TrackPage() {
  const { track, related } = Route.useLoaderData();
  const player = usePlayer();

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="h-44 w-44 shrink-0 overflow-hidden rounded-2xl">
          <Cover src={coverOf(track)} alt={track.title} rounded="rounded-2xl" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
            {track.kind === "song" ? "Música" : "Mensagem"}
          </p>
          <h1 className="mt-2 font-display text-4xl text-foreground">{track.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {track.music_artists?.name ?? "Born Church"}
            {track.music_albums?.title ? ` · ${track.music_albums.title}` : ""}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => player.playQueue([track, ...related], 0)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Play className="h-4 w-4" /> Tocar
            </button>
            <ShareButton title={track.title} />
          </div>
        </div>
      </header>

      {track.description ? (
        <Section title="Sobre">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{track.description}</p>
        </Section>
      ) : null}

      {track.lyrics ? (
        <Section title="Letra">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{track.lyrics}</p>
        </Section>
      ) : null}

      {track.credits ? (
        <Section title="Créditos">
          <p className="whitespace-pre-line text-sm text-muted-foreground">{track.credits}</p>
        </Section>
      ) : null}

      <Section title="Você também pode gostar">
        <TrackList tracks={related} />
      </Section>
    </div>
  );
}

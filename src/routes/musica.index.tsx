import { createFileRoute } from "@tanstack/react-router";

import { getMusicHome } from "@/lib/music.functions";
import {
  CardGrid,
  Section,
  TrackList,
  albumCards,
  artistCards,
  playlistCards,
} from "@/components/music/MusicUI";

export const Route = createFileRoute("/musica/")({
  loader: () => getMusicHome(),
  head: () => ({
    meta: [
      { title: "Born Music — Música e mensagens da Born Church" },
      {
        name: "description",
        content:
          "Ouça louvores, álbuns, playlists e mensagens da Born Church em um player que acompanha você por todo o site.",
      },
      { property: "og:title", content: "Born Music — Música da Born Church" },
      {
        property: "og:description",
        content: "Louvores, álbuns, playlists e mensagens da Born Church para ouvir online.",
      },
    ],
  }),
  errorComponent: () => <p className="text-sm text-muted-foreground">Não foi possível carregar a música agora.</p>,
  notFoundComponent: () => <p className="text-sm text-muted-foreground">Conteúdo não encontrado.</p>,
  component: MusicHome,
});

function MusicHome() {
  const data = Route.useLoaderData();

  return (
    <div className="space-y-12">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Born Music</p>
        <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
          Louvor que acompanha o seu dia
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Toque músicas, álbuns e mensagens sem parar — o player continua tocando enquanto você navega pelo site.
        </p>
      </header>

      <Section title="Mais tocadas">
        <TrackList tracks={data.popular} />
      </Section>

      <Section title="Lançamentos">
        <TrackList tracks={data.releases} />
      </Section>

      <Section title="Playlists">
        <CardGrid items={playlistCards(data.playlists)} />
      </Section>

      <Section title="Álbuns">
        <CardGrid items={albumCards(data.albums)} />
      </Section>

      <Section title="Artistas">
        <CardGrid items={artistCards(data.artists)} />
      </Section>

      <Section title="Mensagens e podcasts">
        <TrackList tracks={data.sermons} />
      </Section>
    </div>
  );
}

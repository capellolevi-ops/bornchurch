import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";

import { searchMusic } from "@/lib/music.functions";
import {
  CardGrid,
  Section,
  SkeletonRows,
  TrackList,
  albumCards,
  artistCards,
  playlistCards,
} from "@/components/music/MusicUI";

export const Route = createFileRoute("/musica/busca")({
  head: () => ({
    meta: [
      { title: "Buscar música — Born Music" },
      { name: "description", content: "Encontre músicas, artistas, álbuns e playlists da Born Church." },
      { property: "og:title", content: "Buscar música — Born Music" },
      { property: "og:description", content: "Encontre músicas, artistas, álbuns e playlists da Born Church." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [term, setTerm] = useState("");
  const query = useQuery({
    queryKey: ["music-search", term],
    queryFn: () => searchMusic({ data: { q: term } }),
    enabled: term.trim().length >= 2,
  });

  const data = query.data;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl text-foreground">Buscar</h1>
        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3">
          <Search className="h-4 w-4 text-gold" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Música, artista, álbum ou playlist"
            aria-label="Buscar música"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {term.trim().length < 2 ? (
        <p className="text-sm text-muted-foreground">Digite pelo menos duas letras para buscar.</p>
      ) : query.isLoading ? (
        <SkeletonRows />
      ) : data ? (
        <div className="space-y-10">
          {data.tracks.length ? (
            <Section title="Músicas">
              <TrackList tracks={data.tracks} />
            </Section>
          ) : null}
          {data.artists.length ? (
            <Section title="Artistas">
              <CardGrid items={artistCards(data.artists)} />
            </Section>
          ) : null}
          {data.albums.length ? (
            <Section title="Álbuns">
              <CardGrid items={albumCards(data.albums)} />
            </Section>
          ) : null}
          {data.playlists.length ? (
            <Section title="Playlists">
              <CardGrid items={playlistCards(data.playlists)} />
            </Section>
          ) : null}
          {!data.tracks.length && !data.artists.length && !data.albums.length && !data.playlists.length ? (
            <p className="text-sm text-muted-foreground">Nada encontrado para “{term}”.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

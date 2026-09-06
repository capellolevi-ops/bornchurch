import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createPlaylist, deletePlaylist, getMyLibrary } from "@/lib/library.functions";
import {
  CardGrid,
  EmptyState,
  Section,
  SkeletonRows,
  TrackList,
  albumCards,
  artistCards,
  playlistCards,
} from "@/components/music/MusicUI";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/musica/biblioteca")({
  head: () => ({
    meta: [
      { title: "Sua biblioteca — Born Music" },
      { name: "description", content: "Suas playlists, artistas, álbuns e histórico de reprodução na Born Music." },
      { property: "og:title", content: "Sua biblioteca — Born Music" },
      { property: "og:description", content: "Suas playlists, artistas, álbuns e histórico na Born Music." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { user, loading } = useSession();
  const fetchLibrary = useServerFn(getMyLibrary);
  const create = useServerFn(createPlaylist);
  const remove = useServerFn(deletePlaylist);
  const qc = useQueryClient();
  const [title, setTitle] = useState("");

  const library = useQuery({
    queryKey: ["my-library"],
    queryFn: () => fetchLibrary(),
    enabled: Boolean(user),
  });

  if (loading) return <SkeletonRows />;

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-4xl text-foreground">Sua biblioteca</h1>
        <EmptyState
          title="Entre para guardar suas músicas"
          hint="Com uma conta você salva favoritas, cria playlists e acompanha seu histórico."
        />
        <Link
          to="/entrar"
          className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-background"
        >
          Entrar ou criar conta
        </Link>
      </div>
    );
  }

  const data = library.data;

  return (
    <div className="space-y-12">
      <h1 className="font-display text-4xl text-foreground">Sua biblioteca</h1>

      <Section title="Suas playlists">
        <form
          className="flex flex-wrap gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!title.trim()) return;
            try {
              await create({ data: { title } });
              setTitle("");
              toast.success("Playlist criada");
              void qc.invalidateQueries({ queryKey: ["my-library"] });
            } catch {
              toast.error("Não foi possível criar a playlist.");
            }
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome da nova playlist"
            aria-label="Nome da nova playlist"
            className="min-w-[220px] flex-1 rounded-full border border-border bg-card/40 px-5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Criar
          </button>
        </form>

        {library.isLoading ? (
          <SkeletonRows count={3} />
        ) : data?.playlists.length ? (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/40">
            {data.playlists.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <Link
                  to="/musica/playlist/$slug"
                  params={{ slug: p.slug }}
                  className="min-w-0 truncate text-sm text-foreground hover:text-gold"
                >
                  {p.title}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.is_public ? "pública" : "privada"}
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label={`Excluir ${p.title}`}
                  onClick={async () => {
                    await remove({ data: { id: p.id } });
                    toast.success("Playlist excluída");
                    void qc.invalidateQueries({ queryKey: ["my-library"] });
                  }}
                  className="rounded-full p-2 text-muted-foreground hover:text-gold"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Você ainda não tem playlists" hint="Crie a primeira acima." />
        )}
      </Section>

      <Section title="Ouvidas recentemente">
        {library.isLoading ? <SkeletonRows /> : <TrackList tracks={data?.history ?? []} />}
      </Section>

      <Section title="Artistas que você segue">
        <CardGrid items={artistCards(data?.artists ?? [])} />
      </Section>

      <Section title="Álbuns salvos">
        <CardGrid items={albumCards(data?.albums ?? [])} />
      </Section>

      <Section title="Playlists públicas salvas">
        <CardGrid items={playlistCards([])} />
      </Section>
    </div>
  );
}

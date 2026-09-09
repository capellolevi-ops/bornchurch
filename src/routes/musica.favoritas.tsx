import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getMyLibrary } from "@/lib/library.functions";
import { EmptyState, SkeletonRows, TrackList } from "@/components/music/MusicUI";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/musica/favoritas")({
  head: () => ({
    meta: [
      { title: "Músicas favoritas — Born Music" },
      { name: "description", content: "As músicas que você marcou como favoritas na Born Music." },
      { property: "og:title", content: "Músicas favoritas — Born Music" },
      { property: "og:description", content: "As músicas que você marcou como favoritas na Born Music." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user, loading } = useSession();
  const fetchLibrary = useServerFn(getMyLibrary);

  const library = useQuery({
    queryKey: ["my-library"],
    queryFn: () => fetchLibrary(),
    enabled: Boolean(user),
  });

  if (loading) return <SkeletonRows />;

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-4xl text-foreground">Favoritas</h1>
        <EmptyState
          title="Entre para ver suas favoritas"
          hint="Com uma conta você guarda as músicas que mais gosta."
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

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-foreground">Favoritas</h1>
      {library.isLoading ? (
        <SkeletonRows />
      ) : (
        <TrackList tracks={library.data?.favorites ?? []} numbered />
      )}
    </div>
  );
}

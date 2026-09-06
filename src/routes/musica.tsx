import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Heart, Home, Library, Search } from "lucide-react";

export const Route = createFileRoute("/musica")({
  component: MusicLayout,
});

const links = [
  { to: "/musica", label: "Início", icon: Home, exact: true },
  { to: "/musica/busca", label: "Buscar", icon: Search, exact: false },
  { to: "/musica/biblioteca", label: "Biblioteca", icon: Library, exact: false },
  { to: "/musica/favoritas", label: "Favoritas", icon: Heart, exact: false },
] as const;

function MusicLayout() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-40 pt-28 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 hidden text-[11px] uppercase tracking-[0.3em] text-gold lg:block">
            Born Music
          </p>
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.exact }}
                activeProps={{ className: "border-gold text-gold" }}
                className="flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-gold hover:text-foreground lg:rounded-xl"
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

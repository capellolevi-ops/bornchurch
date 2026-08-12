import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, HeartHandshake, Inbox, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { StatusBadge } from "@/components/admin/ui";
import { adminDashboard } from "@/lib/admin.functions";

type Stats = Awaited<ReturnType<typeof adminDashboard>>;

/** Visão geral com resumo das atividades recentes. */
export function DashboardPanel({ onNavigate }: { onNavigate: (id: string) => void }) {
  const loadFn = useServerFn(adminDashboard);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    void loadFn().then(setStats);
  }, [loadFn]);

  if (!stats) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  const cards = [
    {
      id: "submissions",
      label: "Envios aguardando análise",
      value: stats.pendingSubmissions,
      icon: Inbox,
    },
    { id: "submissions", label: "Total de envios", value: stats.totalSubmissions, icon: ShieldCheck },
    {
      id: "prayers",
      label: "Pedidos de oração pendentes",
      value: stats.pendingPrayers,
      icon: HeartHandshake,
    },
    {
      id: "prayers",
      label: "Pedidos públicos para moderar",
      value: stats.publicPendingPrayers,
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <button
            key={`${card.id}-${i}`}
            type="button"
            onClick={() => onNavigate(card.id)}
            className="card-lux text-left transition-colors hover:border-gold"
          >
            <card.icon className="h-5 w-5 text-gold" />
            <p className="mt-4 font-display text-4xl text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </button>
        ))}
      </div>

      <section className="card-lux">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold">
          <CalendarClock className="h-4 w-4" /> Próximos eventos
        </p>
        {stats.upcomingEvents.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhum evento futuro cadastrado.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {stats.upcomingEvents.map((e) => (
              <li key={e.id} className="rounded-xl border border-border bg-background/50 px-4 py-3">
                <p className="text-sm text-foreground">{e.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(e.starts_at).toLocaleString("pt-BR")} • {e.location}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-lux">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Atividade recente</p>
        {stats.recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Nenhum envio ainda.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {stats.recent.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-foreground">
                    {r.name || "Sem nome"} — {r.form_label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

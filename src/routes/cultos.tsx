import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { JoinButton } from "@/components/site/JoinButton";
import { services, siteConfig } from "@/config/site";
import { getServiceTimes } from "@/lib/content.functions";

export const Route = createFileRoute("/cultos")({
  head: () => ({
    meta: [
      { title: "Cultos e Horários — Born Church" },
      {
        name: "description",
        content:
          "Horários dos cultos da Born Church: domingos, quartas-feiras e eventos especiais. Venha adorar conosco.",
      },
      { property: "og:title", content: "Cultos e Horários — Born Church" },
      { property: "og:description", content: "Domingos, quartas-feiras e eventos especiais." },
      { property: "og:url", content: "/cultos" },
    ],
    links: [{ rel: "canonical", href: "/cultos" }],
  }),
  loader: async () => {
    try {
      return { serviceTimes: await getServiceTimes() };
    } catch {
      return { serviceTimes: [] };
    }
  },
  errorComponent: () => (
    <PageHeader
      eyebrow="Agenda"
      title="Nossos Cultos"
      description="Não foi possível carregar os horários agora. Tente novamente em instantes."
    />
  ),
  component: Cultos,
});

function Cultos() {
  const { serviceTimes } = Route.useLoaderData();
  const list: Array<{ day: string; title: string; times: string[]; description: string }> =
    serviceTimes.length > 0
      ? serviceTimes
      : services.map((s) => ({ ...s, times: [...s.times] }));

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Nossos Cultos"
        description="Reserve um tempo para estar conosco. Todos são bem-vindos, em qualquer horário."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {list.map((s, i) => (
            <Reveal key={`${s.day}-${s.title}`} delay={i * 0.1}>
              <article className="card-lux h-full">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">{s.day}</p>
                <h2 className="mt-4 font-display text-2xl text-foreground">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.times.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
                <JoinButton serviceName={s.title} />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-16 max-w-6xl">
          <div className="card-lux flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h2 className="font-display text-xl text-foreground">Onde nos encontrar</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {siteConfig.contact.address}
                </p>
              </div>
            </div>
            <Link to="/contato" className="btn-outline">
              Ver no mapa
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

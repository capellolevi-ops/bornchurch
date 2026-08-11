import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { ShareButton } from "@/components/site/ShareButton";
import { galleryPhotos } from "@/config/photos";
import { ministries } from "@/config/site";

export const Route = createFileRoute("/ministerios")({
  head: () => ({
    meta: [
      { title: "Ministérios — Born Church" },
      {
        name: "description",
        content:
          "Conheça os ministérios da Born Church: jovens, crianças, louvor, mídia e acolhimento. Encontre o seu lugar para servir.",
      },
      { property: "og:title", content: "Ministérios — Born Church" },
      {
        property: "og:description",
        content: "Jovens, crianças, louvor, mídia e acolhimento.",
      },
      { property: "og:url", content: "/ministerios" },
    ],
    links: [{ rel: "canonical", href: "/ministerios" }],
  }),
  component: Ministerios,
});

function Ministerios() {
  return (
    <>
      <PageHeader
        eyebrow="Mapa da igreja"
        title="Ministérios"
        description="Cada pessoa tem um lugar. Descubra onde a sua história encontra o propósito de Deus."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m, i) => {
            const photo = galleryPhotos[i % galleryPhotos.length]!;
            return (
              <Reveal key={m.id} delay={i * 0.08}>
                <article className="card-lux group h-full overflow-hidden p-0">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">{m.when}</p>
                    <h2 className="mt-3 font-display text-2xl text-foreground">{m.name}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {m.summary}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-16 flex max-w-6xl flex-col items-center gap-4 text-center">
          <p className="text-base text-muted-foreground">
            Quer fazer parte de um destes times?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/servir" className="btn-gold">
              Quero servir
            </Link>
            <ShareButton title="Ministérios — Born Church" />
          </div>
        </Reveal>
      </section>
    </>
  );
}

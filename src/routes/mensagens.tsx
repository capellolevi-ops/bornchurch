import { createFileRoute } from "@tanstack/react-router";
import { PlayCircle, Youtube } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { sermons, siteConfig } from "@/config/site";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Mensagens e Pregações — Born Church" },
      {
        name: "description",
        content:
          "Assista às mensagens e pregações da Born Church. Vídeos do nosso canal no YouTube com ensino bíblico para a sua semana.",
      },
      { property: "og:title", content: "Mensagens e Pregações — Born Church" },
      { property: "og:description", content: "Vídeos e pregações da Born Church." },
      { property: "og:url", content: "/mensagens" },
    ],
    links: [{ rel: "canonical", href: "/mensagens" }],
  }),
  component: Mensagens,
});

function Mensagens() {
  return (
    <>
      <PageHeader
        eyebrow="Palavra"
        title="Mensagens"
        description="Reveja as pregações e seja edificado onde estiver."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sermons.map((video, i) => (
            <Reveal key={video.title} delay={i * 0.1}>
              <article className="card-lux h-full p-0">
                <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-secondary">
                  {video.id ? (
                    // Basta preencher o ID do vídeo em src/config/site.ts
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <PlayCircle className="h-8 w-8 text-gold" />
                      <span className="text-xs uppercase tracking-[0.25em]">Em breve</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-display text-xl text-foreground">{video.title}</h2>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <a
            href={siteConfig.social.youtube}
            target="_blank"
            rel="noreferrer"
            className="btn-gold inline-flex items-center gap-2"
          >
            <Youtube className="h-5 w-5" /> Assistir no YouTube
          </a>
        </Reveal>
      </section>
    </>
  );
}

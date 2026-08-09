import { createFileRoute } from "@tanstack/react-router";
import { Youtube } from "lucide-react";

import photo1 from "@/assets/FB_IMG_1786286659387.jpg.asset.json";
import photo2 from "@/assets/FB_IMG_1786286673368.jpg.asset.json";
import photo3 from "@/assets/FB_IMG_1786286722389.jpg.asset.json";
import photo4 from "@/assets/FB_IMG_1786286732843.jpg.asset.json";
import photo5 from "@/assets/FB_IMG_1786286769771.jpg.asset.json";
import photo6 from "@/assets/FB_IMG_1786286772066.jpg.asset.json";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { sermons, siteConfig } from "@/config/site";

/** Fotos reais dos cultos usadas como capa das mensagens */
const covers = [
  { src: photo1.url, alt: "Arte da Série Detox da Born Church" },
  { src: photo5.url, alt: "Ministração de louvor durante o culto" },
  { src: photo3.url, alt: "Momento de oração e imposição de mãos" },
  { src: photo4.url, alt: "Pastor ministrando a Palavra no culto" },
  { src: photo6.url, alt: "Momento de adoração no culto" },
  { src: photo2.url, alt: "Pessoa em oração durante o culto" },
];


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

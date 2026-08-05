import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import aboutImg from "@/assets/about-church.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Born Church — Missão, Visão e Valores" },
      {
        name: "description",
        content:
          "Conheça a história, a missão, a visão e os valores da Born Church, uma igreja evangélica contemporânea que existe para levar pessoas a conhecerem Jesus.",
      },
      { property: "og:title", content: "Sobre a Born Church" },
      { property: "og:description", content: "Missão, visão e valores da Born Church." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: Sobre,
});

const pillars = [
  {
    title: "Missão",
    text: "Levar pessoas a conhecerem Jesus, formando discípulos que amam a Deus e servem ao próximo.",
  },
  {
    title: "Visão",
    text: "Ser uma igreja relevante em nossa cidade, onde cada geração encontra fé, propósito e família.",
  },
  {
    title: "Valores",
    text: "Palavra, oração, acolhimento, generosidade, excelência no servir e unidade no Espírito.",
  },
];

function Sobre() {
  return (
    <>
      <PageHeader
        eyebrow="Quem somos"
        title="Sobre a Born Church"
        description="Somos uma comunidade evangélica que crê que toda vida pode recomeçar em Cristo."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={aboutImg}
              alt="Interior da Born Church"
              width={1280}
              height={960}
              loading="lazy"
              className="w-full rounded-2xl border border-border object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">Nossa história</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              A Born Church nasceu do desejo de ver pessoas experimentando um novo começo. O que
              começou com um pequeno grupo reunido em oração cresceu em uma comunidade viva, com
              cultos inspiradores, discipulado e ações sociais que alcançam a cidade.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Cremos na Bíblia como Palavra de Deus, no poder do Espírito Santo e na igreja como
              família. Aqui, não importa de onde você veio — importa para onde Deus quer te levar.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <article className="card-lux h-full">
                <h2 className="font-display text-2xl text-gold">{p.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Clock, HeartHandshake, Sparkles } from "lucide-react";

import heroImg from "@/assets/hero-worship.jpg";
import aboutImg from "@/assets/about-church.jpg";
import { Reveal } from "@/components/site/Reveal";
import { services, siteConfig } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Born Church — Um lugar para nascer de novo" },
      {
        name: "description",
        content:
          "Bem-vindo à Born Church. Um lugar para nascer de novo, crescer na fé e viver o propósito de Deus. Conheça nossos cultos e planeje sua visita.",
      },
      { property: "og:title", content: "Born Church — Um lugar para nascer de novo" },
      {
        property: "og:description",
        content: "Cultos, mensagens e comunhão na Born Church. Planeje sua visita.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Church",
          name: "Born Church",
          slogan: siteConfig.tagline,
          address: siteConfig.contact.address,
          email: siteConfig.contact.email,
          telephone: siteConfig.contact.whatsapp,
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero com imagem de um momento de adoração */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-24">
        <img
          src={heroImg}
          alt="Congregação em momento de adoração na Born Church"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-veil" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-3xl py-20 text-center"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.5em] text-gold">Born Church</p>
          <h1 className="font-display text-4xl leading-[1.08] text-foreground sm:text-6xl lg:text-7xl">
            Bem-vindo à <span className="text-gold">Born Church</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Um lugar para nascer de novo, crescer na fé e viver o propósito de Deus.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/sobre" className="btn-gold w-full sm:w-auto">
              Conheça a Igreja
            </Link>
            <Link to="/novo-aqui" className="btn-outline w-full sm:w-auto">
              Planeje sua Visita
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Pilares */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Nascer de novo",
              text: "Um encontro real com Jesus transforma toda a história de uma vida.",
            },
            {
              icon: HeartHandshake,
              title: "Crescer juntos",
              text: "Comunhão, discipulado e famílias caminhando lado a lado na fé.",
            },
            {
              icon: Clock,
              title: "Viver o propósito",
              text: "Cada pessoa foi criada com um chamado para servir e impactar.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <article className="card-lux h-full">
                <item.icon className="h-6 w-6 text-gold" />
                <h2 className="mt-5 font-display text-2xl text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sobre resumido */}
      <section className="border-y border-border bg-secondary/30 px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={aboutImg}
              alt="Auditório da Born Church"
              width={1280}
              height={960}
              loading="lazy"
              className="w-full rounded-2xl border border-border object-cover"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Sobre nós</p>
            <h2 className="mt-4 font-display text-3xl text-foreground sm:text-5xl">
              Uma igreja para todas as gerações
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              A Born Church é uma comunidade evangélica contemporânea que crê no poder do evangelho
              para renovar vidas. Aqui você encontra acolhimento, ensino bíblico e um ambiente onde
              a sua fé pode crescer.
            </p>
            <Link to="/sobre" className="mt-8 inline-flex items-center gap-2 text-sm text-gold">
              Nossa missão, visão e valores <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Cultos */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Cultos</p>
            <h2 className="mt-4 font-display text-3xl text-foreground sm:text-5xl">
              Venha adorar conosco
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.day} delay={i * 0.1}>
                <article className="card-lux h-full">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">{s.day}</p>
                  <h3 className="mt-4 font-display text-2xl text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.times.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="border-t border-border px-6 py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-foreground sm:text-5xl">
            É a sua primeira vez?
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Será uma alegria receber você. Conte com alguém da nossa equipe para te acolher desde a
            porta de entrada.
          </p>
          <Link to="/novo-aqui" className="btn-gold mt-9 inline-flex">
            Planeje sua Visita
          </Link>
        </Reveal>
      </section>
    </>
  );
}

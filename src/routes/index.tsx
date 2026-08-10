import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Clock, HeartHandshake, Sparkles } from "lucide-react";

import { Countdown } from "@/components/site/Countdown";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { JoinButton } from "@/components/site/JoinButton";
import { PhotoGallery } from "@/components/site/PhotoGallery";
import { Reveal } from "@/components/site/Reveal";
import { VerseOfDay } from "@/components/site/VerseOfDay";
import { photos } from "@/config/photos";
import { ministries, services, siteConfig } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Born Church — O novo começa agora" },
      {
        name: "description",
        content:
          "Bem-vindo à Born Church, em Pinhais. O novo começa agora: um lugar para nascer de novo, crescer na fé e viver o propósito de Deus. Conheça nossos cultos.",
      },
      { property: "og:title", content: "Born Church — O novo começa agora" },
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
          telephone: siteConfig.contact.phone,
          sameAs: [siteConfig.social.youtube, siteConfig.social.instagram],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[94vh] items-center justify-center overflow-hidden px-6 pt-24">
        <HeroSlideshow />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_60%)]" />

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
          <motion.p
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-7 inline-block rounded-full border border-gold/50 bg-background/40 px-6 py-2 font-display text-xl tracking-wide text-gold backdrop-blur-sm sm:text-2xl"
          >
            {siteConfig.highlight}
          </motion.p>
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

      {/* Contagem regressiva */}
      <section className="px-6 pt-16">
        <Reveal className="mx-auto max-w-6xl">
          <Countdown />
        </Reveal>
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
              src={photos.celebracao.src}
              alt={photos.celebracao.alt}
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

      {/* Versículo do dia */}
      <section className="px-6 py-24">
        <Reveal className="mx-auto max-w-4xl">
          <VerseOfDay />
        </Reveal>
      </section>

      {/* Cultos */}
      <section className="border-y border-border bg-secondary/20 px-6 py-24">
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
                <article className="card-lux flex h-full flex-col">
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
                  <div className="mt-auto">
                    <JoinButton serviceName={s.title} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Nossa comunidade</p>
            <h2 className="mt-4 font-display text-3xl text-foreground sm:text-5xl">
              Momentos que contam a nossa história
            </h2>
          </Reveal>
          <div className="mt-12">
            <PhotoGallery />
          </div>
        </div>
      </section>

      {/* Ministérios */}
      <section className="border-y border-border bg-secondary/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Ministérios</p>
            <h2 className="mt-4 font-display text-3xl text-foreground sm:text-5xl">
              Encontre o seu lugar
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.06}>
                <article className="card-lux h-full">
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">{m.when}</p>
                  <h3 className="mt-3 font-display text-xl text-foreground">{m.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.summary}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link to="/ministerios" className="btn-outline">
              Ver todos os ministérios
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Chamada final */}
      <section className="px-6 py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-foreground sm:text-5xl">
            É a sua primeira vez?
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Será uma alegria receber você. Conte com alguém da nossa equipe para te acolher desde a
            porta de entrada.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/novo-aqui" className="btn-gold">
              Planeje sua Visita
            </Link>
            <Link to="/proximo-passo" className="btn-outline">
              Qual é o meu próximo passo?
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

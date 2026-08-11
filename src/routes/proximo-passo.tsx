import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { ShareButton } from "@/components/site/ShareButton";

export const Route = createFileRoute("/proximo-passo")({
  head: () => ({
    meta: [
      { title: "Qual é o próximo passo? — Born Church" },
      {
        name: "description",
        content:
          "Responda 3 perguntas rápidas e descubra o seu próximo passo na Born Church: célula, batismo, discipulado ou servir em um ministério.",
      },
      { property: "og:title", content: "Qual é o próximo passo? — Born Church" },
      {
        property: "og:description",
        content: "Um quiz rápido para te ajudar a crescer na fé.",
      },
      { property: "og:url", content: "/proximo-passo" },
    ],
    links: [{ rel: "canonical", href: "/proximo-passo" }],
  }),
  component: ProximoPasso,
});

type ResultKey = "visita" | "batismo" | "celula" | "servir";

const results: Record<
  ResultKey,
  { title: string; text: string; cta: { label: string; to: string } }
> = {
  visita: {
    title: "Seu próximo passo é: Visitar a Born Church",
    text: "O melhor começo é estar presente. Avise que você vem e nossa equipe de acolhimento vai te receber pessoalmente na porta.",
    cta: { label: "Planejar minha visita", to: "/novo-aqui" },
  },
  batismo: {
    title: "Seu próximo passo é: O Batismo",
    text: "Você já entregou sua vida a Jesus — o batismo é o momento público de declarar essa nova vida. Conte-nos e vamos te preparar com carinho.",
    cta: { label: "Quero me batizar", to: "/conte-nos" },
  },
  celula: {
    title: "Seu próximo passo é: Uma Célula / Discipulado",
    text: "A fé cresce em comunidade. Um pequeno grupo é onde você é conhecido pelo nome, cuidado e desafiado a crescer.",
    cta: { label: "Quero entrar em um grupo", to: "/conte-nos" },
  },
  servir: {
    title: "Seu próximo passo é: Servir em um ministério",
    text: "Você já está firme na caminhada. É hora de usar os seus dons — louvor, mídia, acolhimento, kids e muito mais.",
    cta: { label: "Quero servir", to: "/servir" },
  },
};

const questions = [
  {
    q: "Como está a sua relação com a Born Church hoje?",
    options: [
      { label: "Nunca vim a um culto", key: "visita" as ResultKey },
      { label: "Já visitei algumas vezes", key: "celula" as ResultKey },
      { label: "Sou membro e frequento sempre", key: "servir" as ResultKey },
    ],
  },
  {
    q: "E a sua caminhada com Jesus?",
    options: [
      { label: "Ainda estou conhecendo", key: "visita" as ResultKey },
      { label: "Entreguei minha vida, mas não me batizei", key: "batismo" as ResultKey },
      { label: "Sou batizado e caminho com Ele", key: "servir" as ResultKey },
    ],
  },
  {
    q: "O que você mais deseja agora?",
    options: [
      { label: "Fazer amigos e ser cuidado de perto", key: "celula" as ResultKey },
      { label: "Declarar minha fé publicamente", key: "batismo" as ResultKey },
      { label: "Usar meus dons para servir pessoas", key: "servir" as ResultKey },
    ],
  },
];

function ProximoPasso() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ResultKey[]>([]);

  const finished = step >= questions.length;
  const result = finished ? results[mostFrequent(answers)] : null;

  function choose(key: ResultKey) {
    setAnswers((prev) => [...prev, key]);
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
  }

  return (
    <>
      <PageHeader
        eyebrow="Quiz"
        title="Qual é o próximo passo?"
        description="Três perguntas rápidas para te ajudar a descobrir onde Deus quer te levar agora."
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          {!finished ? (
            <Reveal>
              <div className="card-gold">
                <div className="mb-8 flex items-center gap-3">
                  {questions.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                        i <= step ? "bg-gold" : "bg-foreground/15"
                      }`}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">
                      Pergunta {step + 1} de {questions.length}
                    </p>
                    <h2 className="mt-4 font-display text-2xl text-foreground sm:text-3xl">
                      {questions[step]!.q}
                    </h2>
                    <div className="mt-8 grid gap-3">
                      {questions[step]!.options.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={() => choose(o.key)}
                          className="rounded-2xl border border-border bg-card/60 px-5 py-4 text-left text-sm text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-card"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStep((s) => s - 1);
                      setAnswers((a) => a.slice(0, -1));
                    }}
                    className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Voltar
                  </button>
                ) : null}
              </div>
            </Reveal>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card-gold text-center"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-gold">Seu resultado</p>
              <h2 className="mt-5 font-display text-3xl text-foreground sm:text-4xl">
                {result!.title}
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {result!.text}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link to={result!.cta.to} className="btn-gold">
                  {result!.cta.label}
                </Link>
                <ShareButton title="Descobri meu próximo passo na Born Church" />
                <button type="button" onClick={restart} className="btn-outline">
                  <RotateCcw className="h-4 w-4" /> Refazer
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

function mostFrequent(list: ResultKey[]): ResultKey {
  const counts = new Map<ResultKey, number>();
  for (const item of list) counts.set(item, (counts.get(item) ?? 0) + 1);
  let best: ResultKey = "visita";
  let bestCount = -1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }
  return best;
}

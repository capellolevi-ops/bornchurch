import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, HeartHandshake } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/ofertas")({
  head: () => ({
    meta: [
      { title: "Ofertas e Dízimos — Born Church" },
      {
        name: "description",
        content:
          "Contribua com a Born Church por PIX. Sua generosidade nos ajuda a anunciar o Evangelho, servir pessoas e expandir o Reino de Deus.",
      },
      { property: "og:title", content: "Ofertas e Dízimos — Born Church" },
      { property: "og:description", content: "Contribua por PIX com a Born Church." },
      { property: "og:url", content: "/ofertas" },
    ],
    links: [{ rel: "canonical", href: "/ofertas" }],
  }),
  component: Ofertas,
});

function Ofertas() {
  const [copied, setCopied] = useState(false);

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(siteConfig.pix.key);
      setCopied(true);
      toast.success("Chave PIX copiada!", { description: siteConfig.pix.key });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Não foi possível copiar. Copie manualmente a chave.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Generosidade"
        title="Ofertas e Dízimos"
        description="Sua generosidade nos ajuda a anunciar o Evangelho, servir pessoas e expandir o Reino de Deus."
      />

      <section className="px-6 py-20">
        <Reveal className="mx-auto max-w-xl">
          <div className="card-gold text-center">
            <HeartHandshake className="mx-auto h-8 w-8 text-gold" />
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-gold">
              {siteConfig.pix.label}
            </p>
            <p className="mt-4 font-display text-2xl tracking-wide text-foreground sm:text-3xl">
              {siteConfig.pix.key}
            </p>
            <button type="button" onClick={copyPix} className="btn-gold mt-8 inline-flex gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Chave copiada" : "Copiar Chave PIX"}
            </button>
            {copied ? (
              <p className="mt-4 text-sm text-gold">Chave PIX copiada com sucesso!</p>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            “Cada um contribua segundo propôs no seu coração; não com tristeza ou por necessidade;
            porque Deus ama ao que dá com alegria.” — 2 Coríntios 9:7
          </p>
        </Reveal>
      </section>
    </>
  );
}

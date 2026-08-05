import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Field, fieldClass } from "@/components/site/Field";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Born Church" },
      {
        name: "description",
        content:
          "Fale com a Born Church: endereço, WhatsApp, e-mail e mapa. Envie sua mensagem pelo formulário de contato.",
      },
      { property: "og:title", content: "Contato — Born Church" },
      { property: "og:description", content: "Endereço, WhatsApp, e-mail e mapa da Born Church." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: Contato,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  mensagem: z.string().trim().min(10, "Escreva sua mensagem").max(2000),
});

function Contato() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const err = (k: string) => errors[k];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    form.reset();
    toast.success("Mensagem enviada!", { description: "Retornaremos o mais breve possível." });
  }

  return (
    <>
      <PageHeader
        eyebrow="Estamos por perto"
        title="Contato"
        description="Fale com a nossa equipe. Teremos prazer em responder você."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <Reveal className="space-y-6">
            <ul className="space-y-5">
              <li className="card-lux flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <h2 className="font-display text-lg text-foreground">Endereço</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </li>
              <li className="card-lux flex gap-4">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <h2 className="font-display text-lg text-foreground">WhatsApp</h2>
                  <a
                    href={siteConfig.contact.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm text-muted-foreground hover:text-gold"
                  >
                    {siteConfig.contact.whatsapp}
                  </a>
                </div>
              </li>
              <li className="card-lux flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <h2 className="font-display text-lg text-foreground">E-mail</h2>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-1 block truncate text-sm text-muted-foreground hover:text-gold"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </li>
            </ul>

            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Localização da Born Church no Google Maps"
                src={siteConfig.contact.mapsEmbed}
                loading="lazy"
                className="h-72 w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="card-lux grid gap-5">
              <Field label="Nome" htmlFor="c-nome" error={err("nome")}>
                <input id="c-nome" name="nome" className={fieldClass} placeholder="Seu nome" />
              </Field>
              <Field label="E-mail" htmlFor="c-email" error={err("email")}>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  className={fieldClass}
                  placeholder="voce@email.com"
                />
              </Field>
              <Field label="Mensagem" htmlFor="c-mensagem" error={err("mensagem")}>
                <textarea
                  id="c-mensagem"
                  name="mensagem"
                  rows={7}
                  className={fieldClass}
                  placeholder="Como podemos ajudar?"
                />
              </Field>
              <button type="submit" className="btn-gold mt-2 w-full">
                Enviar
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

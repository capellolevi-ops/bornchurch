import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Heart } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Field, fieldClass } from "@/components/site/Field";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getPublicPrayers, prayFor, submitPrayer } from "@/lib/public.functions";

export const Route = createFileRoute("/oracao")({
  head: () => ({
    meta: [
      { title: "Pedidos de Oração — Born Church" },
      {
        name: "description",
        content:
          "Envie seu pedido de oração (privado ou público) e interceda pelos pedidos da comunidade Born Church.",
      },
      { property: "og:title", content: "Pedidos de Oração — Born Church" },
      {
        property: "og:description",
        content: "Envie seu pedido e ore pelos pedidos da nossa comunidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/oracao" },
    ],
    links: [{ rel: "canonical", href: "/oracao" }],
  }),
  loader: async () => {
    try {
      return { prayers: await getPublicPrayers() };
    } catch {
      return { prayers: [] };
    }
  },
  errorComponent: () => (
    <PageHeader
      eyebrow="Intercessão"
      title="Pedidos de Oração"
      description="Não foi possível carregar os pedidos agora. Tente novamente em instantes."
    />
  ),
  component: Oracao,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().max(20).optional(),
  email: z.string().trim().max(255).optional(),
  mensagem: z.string().trim().min(10, "Escreva seu pedido").max(2000),
});

function Oracao() {
  const { prayers } = Route.useLoaderData();
  const send = useServerFn(submitPrayer);
  const pray = useServerFn(prayFor);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [prayed, setPrayed] = useState<string[]>([]);
  const err = (k: string) => errors[k];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
    setSending(true);
    try {
      await send({
        data: {
          name: result.data.nome,
          phone: result.data.telefone ?? "",
          email: result.data.email ?? "",
          message: result.data.mensagem,
          visibility,
        },
      });
      form.reset();
      toast.success("Pedido enviado!", {
        description:
          visibility === "public"
            ? "Nossa equipe vai revisar antes de publicar. Estaremos orando por você."
            : "Somente a equipe pastoral verá seu pedido. Estaremos orando por você.",
      });
    } catch {
      toast.error("Não foi possível enviar agora. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  async function handlePray(id: string) {
    if (prayed.includes(id)) return;
    setPrayed((p) => [...p, id]);
    try {
      const res = await pray({ data: { id } });
      setCounts((c) => ({ ...c, [id]: res.count }));
      toast.success("Obrigado por orar ❤️");
    } catch {
      /* ignora */
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Intercessão"
        title="Pedidos de Oração"
        description="Envie seu pedido — de forma privada ou pública — e junte-se a nós orando pelos pedidos da comunidade."
      />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={handleSubmit} noValidate className="card-lux grid gap-5">
              <Field label="Nome" htmlFor="p-nome" error={err("nome")}>
                <input id="p-nome" name="nome" className={fieldClass} placeholder="Seu nome" />
              </Field>
              <Field label="Telefone (opcional)" htmlFor="p-telefone">
                <input
                  id="p-telefone"
                  name="telefone"
                  inputMode="tel"
                  className={fieldClass}
                  placeholder="(00) 00000-0000"
                />
              </Field>
              <Field label="E-mail (opcional)" htmlFor="p-email">
                <input
                  id="p-email"
                  name="email"
                  type="email"
                  className={fieldClass}
                  placeholder="voce@email.com"
                />
              </Field>
              <Field label="Seu pedido" htmlFor="p-mensagem" error={err("mensagem")}>
                <textarea
                  id="p-mensagem"
                  name="mensagem"
                  rows={6}
                  className={fieldClass}
                  placeholder="Como podemos orar por você?"
                />
              </Field>

              <fieldset>
                <legend className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Visibilidade
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { id: "private", label: "Privado", hint: "Só a equipe pastoral vê" },
                      { id: "public", label: "Público", hint: "Aparece após aprovação" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setVisibility(opt.id)}
                      aria-pressed={visibility === opt.id}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        visibility === opt.id
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                      }`}
                    >
                      <span className="block">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <button type="submit" disabled={sending} className="btn-gold mt-2 w-full">
                {sending ? "Enviando..." : "Enviar pedido"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4">
            <h2 className="font-display text-2xl text-foreground">Pedidos da comunidade</h2>
            {prayers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ainda não há pedidos públicos. Seja o primeiro a compartilhar.
              </p>
            ) : (
              prayers.map((p) => (
                <article key={p.id} className="card-lux">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">
                    {p.name || "Anônimo"}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {p.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => handlePray(p.id)}
                    disabled={prayed.includes(p.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10 disabled:opacity-60"
                  >
                    <Heart className="h-4 w-4" />
                    Estou orando ({counts[p.id] ?? p.prayer_count})
                  </button>
                </article>
              ))
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}

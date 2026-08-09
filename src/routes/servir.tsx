import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Field, fieldClass } from "@/components/site/Field";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { serveAreas } from "@/config/site";

export const Route = createFileRoute("/servir")({
  head: () => ({
    meta: [
      { title: "Quero Servir — Born Church" },
      {
        name: "description",
        content:
          "Inscreva-se para servir na Born Church: mídia, louvor, boas-vindas ou limpeza. Escolha a área e a função que combinam com você.",
      },
      { property: "og:title", content: "Quero Servir — Born Church" },
      {
        property: "og:description",
        content: "Sirva na mídia, no louvor, nas boas-vindas ou na limpeza da Born Church.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/servir" },
    ],
    links: [{ rel: "canonical", href: "/servir" }],
  }),
  component: Servir,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Informe um telefone válido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  area: z.string().min(1, "Escolha uma área"),
  funcao: z.string().min(1, "Escolha uma função"),
  experiencia: z.string().trim().max(1000).optional(),
});

function Servir() {
  const [areaId, setAreaId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const err = (k: string) => errors[k];

  const area = serveAreas.find((a) => a.id === areaId);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = schema.safeParse({
      ...Object.fromEntries(new FormData(form)),
      area: areaId,
      funcao: role,
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    form.reset();
    setAreaId("");
    setRole("");
    toast.success("Inscrição enviada!", {
      description: "Que alegria! Nossa equipe vai entrar em contato com você.",
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Faça parte"
        title="Quero Servir"
        description="Cada dom tem um lugar. Escolha a área onde deseja servir e a função que mais combina com você."
      />

      <section className="px-6 py-20">
        <Reveal className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} noValidate className="card-lux grid gap-6">
            <Field label="Nome" htmlFor="nome" error={err("nome")}>
              <input id="nome" name="nome" className={fieldClass} placeholder="Seu nome completo" />
            </Field>
            <Field label="Telefone" htmlFor="telefone" error={err("telefone")}>
              <input
                id="telefone"
                name="telefone"
                inputMode="tel"
                className={fieldClass}
                placeholder="(00) 00000-0000"
              />
            </Field>
            <Field label="E-mail" htmlFor="email" error={err("email")}>
              <input
                id="email"
                name="email"
                type="email"
                className={fieldClass}
                placeholder="voce@email.com"
              />
            </Field>

            <fieldset>
              <legend className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Onde você quer servir?
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {serveAreas.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setAreaId(a.id);
                      setRole("");
                    }}
                    aria-pressed={areaId === a.id}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      areaId === a.id
                        ? "border-gold bg-gold/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              {err("area") ? <p className="mt-2 text-sm text-destructive">{err("area")}</p> : null}
            </fieldset>

            {area ? (
              <fieldset>
                <legend className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Em {area.label}, o que você quer fazer?
                </legend>
                <div className="grid gap-2">
                  {area.roles.map((r) => (
                    <label
                      key={r}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${
                        role === r
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="funcao-radio"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        className="accent-gold"
                      />
                      {r}
                    </label>
                  ))}
                </div>
                {err("funcao") ? (
                  <p className="mt-2 text-sm text-destructive">{err("funcao")}</p>
                ) : null}
              </fieldset>
            ) : null}

            <Field label="Já tem experiência nessa área? (opcional)" htmlFor="experiencia">
              <textarea
                id="experiencia"
                name="experiencia"
                rows={4}
                className={fieldClass}
                placeholder="Conte um pouco da sua experiência ou disponibilidade."
              />
            </Field>

            <button type="submit" className="btn-gold mt-2 w-full">
              Quero Servir
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

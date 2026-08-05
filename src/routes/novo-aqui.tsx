import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Field, fieldClass } from "@/components/site/Field";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/novo-aqui")({
  head: () => ({
    meta: [
      { title: "Você é novo aqui? Planeje sua visita — Born Church" },
      {
        name: "description",
        content:
          "Primeira vez na Born Church? Planeje sua visita e nossa equipe preparará uma recepção especial para você e sua família.",
      },
      { property: "og:title", content: "Você é novo aqui? — Born Church" },
      { property: "og:description", content: "Planeje sua visita à Born Church." },
      { property: "og:url", content: "/novo-aqui" },
    ],
    links: [{ rel: "canonical", href: "/novo-aqui" }],
  }),
  component: NovoAqui,
});

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Informe um telefone válido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(100),
  sozinho: z.string().min(1, "Selecione uma opção"),
  pessoas: z.string().min(1, "Informe quantas pessoas"),
  origem: z.string().trim().min(2, "Conte como nos conheceu").max(200),
  oracao: z.string().trim().max(1000).optional(),
});

function NovoAqui() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const err = (k: string) => errors[k];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = schema.safeParse(data);

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    form.reset();
    toast.success("Visita planejada!", {
      description: "Que alegria! Vamos entrar em contato para receber você.",
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Primeira vez"
        title="Você é novo aqui?"
        description="Será uma alegria receber você na Born Church. Queremos conhecer sua história e ajudá-lo a encontrar um lugar onde possa crescer espiritualmente."
      />

      <section className="px-6 py-20">
        <Reveal className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} noValidate className="card-lux grid gap-5">
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
            <Field label="Cidade" htmlFor="cidade" error={err("cidade")}>
              <input id="cidade" name="cidade" className={fieldClass} placeholder="Sua cidade" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Vai visitar sozinho?" htmlFor="sozinho" error={err("sozinho")}>
                <select id="sozinho" name="sozinho" defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  <option value="sim">Sim, vou sozinho(a)</option>
                  <option value="nao">Não, vou acompanhado(a)</option>
                </select>
              </Field>
              <Field label="Quantas pessoas irão?" htmlFor="pessoas" error={err("pessoas")}>
                <input
                  id="pessoas"
                  name="pessoas"
                  type="number"
                  min={1}
                  max={50}
                  defaultValue={1}
                  className={fieldClass}
                />
              </Field>
            </div>
            <Field label="Como conheceu a igreja?" htmlFor="origem" error={err("origem")}>
              <input
                id="origem"
                name="origem"
                className={fieldClass}
                placeholder="Instagram, um amigo, YouTube..."
              />
            </Field>
            <Field label="Pedido de oração (opcional)" htmlFor="oracao">
              <textarea
                id="oracao"
                name="oracao"
                rows={4}
                className={fieldClass}
                placeholder="Como podemos orar por você?"
              />
            </Field>
            <button type="submit" className="btn-gold mt-2 w-full">
              Quero Planejar Minha Visita
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

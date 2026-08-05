import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Field, fieldClass } from "@/components/site/Field";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/conte-nos")({
  head: () => ({
    meta: [
      { title: "Conte-nos sua história — Born Church" },
      {
        name: "description",
        content:
          "Compartilhe sua história, pedido de oração ou testemunho com a equipe pastoral da Born Church.",
      },
      { property: "og:title", content: "Conte-nos sua história — Born Church" },
      { property: "og:description", content: "História, pedido de oração ou testemunho." },
      { property: "og:url", content: "/conte-nos" },
    ],
    links: [{ rel: "canonical", href: "/conte-nos" }],
  }),
  component: ConteNos,
});

// Validação dos campos
const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Informe um telefone válido").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  assunto: z.string().trim().min(2, "Informe o assunto").max(120),
  mensagem: z.string().trim().min(10, "Conte um pouco mais").max(2000),
});

function ConteNos() {
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
    toast.success("Mensagem enviada!", {
      description: "Obrigado por compartilhar. Nossa equipe vai retornar em breve.",
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Fale conosco"
        title="Conte-nos"
        description="Sua história, seu pedido de oração ou seu testemunho. Estamos prontos para ouvir você."
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
            <Field label="Assunto" htmlFor="assunto" error={err("assunto")}>
              <input
                id="assunto"
                name="assunto"
                className={fieldClass}
                placeholder="Oração, testemunho, dúvida..."
              />
            </Field>
            <Field
              label="Conte-nos sua história, pedido de oração ou testemunho"
              htmlFor="mensagem"
              error={err("mensagem")}
            >
              <textarea
                id="mensagem"
                name="mensagem"
                rows={6}
                className={fieldClass}
                placeholder="Escreva aqui..."
              />
            </Field>
            <button type="submit" className="btn-gold mt-2 w-full">
              Enviar
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

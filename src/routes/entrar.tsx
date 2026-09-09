import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Born Church" },
      {
        name: "description",
        content:
          "Crie sua conta na Born Church para salvar músicas favoritas, montar playlists e acompanhar seu histórico.",
      },
      { property: "og:title", content: "Entrar — Born Church" },
      {
        property: "og:description",
        content: "Acesse sua conta da Born Church para usar a Born Music.",
      },
    ],
  }),
  component: SignInPage,
});

const inputClass =
  "w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold";

function SignInPage() {
  const navigate = useNavigate();
  const { user } = useSession();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/musica/biblioteca", replace: true });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (!data.session) setSent(true);
        else toast.success("Conta criada!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível continuar.");
    }
    setBusy(false);
  }

  async function withGoogle() {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch {
      toast.error("Não foi possível entrar com o Google.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-32 pt-28 lg:px-8">
      <PageHeader
        eyebrow="Sua conta"
        title={mode === "in" ? "Entrar" : "Criar conta"}
        description="Salve músicas favoritas, monte playlists e acompanhe seu histórico na Born Music."
      />

      {sent ? (
        <div className="mt-8 rounded-2xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
          Enviamos um e-mail de confirmação para <strong className="text-foreground">{email}</strong>. Clique no
          link da mensagem para ativar sua conta.
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={withGoogle}
            className="mt-8 w-full rounded-xl border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold"
          >
            Continuar com o Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="grid gap-3">
            {mode === "up" ? (
              <input
                className={inputClass}
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            ) : null}
            <input
              className={inputClass}
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              className={inputClass}
              type="password"
              required
              minLength={6}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-gold px-6 py-3 text-sm font-medium text-background disabled:opacity-60"
            >
              {busy ? "Aguarde…" : mode === "in" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode((m) => (m === "in" ? "up" : "in"))}
            className="mt-5 w-full text-sm text-muted-foreground transition-colors hover:text-gold"
          >
            {mode === "in" ? "Ainda não tem conta? Criar agora" : "Já tem conta? Entrar"}
          </button>
        </>
      )}
    </div>
  );
}

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/** Cliente público (chave publicável) — respeita as políticas de acesso. */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type ContentValue = Record<string, string | number | boolean | null>;
export type SiteContent = Record<string, ContentValue>;

export type PublicEvent = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  image_url: string | null;
  link: string;
};

export type PublicPhoto = {
  id: string;
  url: string;
  title: string;
  description: string;
};

export type PublicBanner = {
  id: string;
  text: string;
  image_url: string | null;
  button_label: string;
  link: string;
};

export type PublicPrayer = {
  id: string;
  name: string;
  message: string;
  prayer_count: number;
  created_at: string;
};

/** Textos, destaques e configurações editáveis pelo painel. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("site_content").select("key, value");
  const out: SiteContent = {};
  for (const row of data ?? []) {
    out[row.key] = (row.value ?? {}) as ContentValue;
  }
  return out;
});

/** Próximos eventos publicados (somente futuros). */
export const getUpcomingEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("events")
    .select("id, title, description, starts_at, location, image_url, link")
    .eq("published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(12);
  return (data ?? []) as PublicEvent[];
});

/** Fotos da galeria marcadas para aparecer no site. */
export const getGalleryPhotos = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("gallery_photos")
    .select("id, url, title, description")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .limit(24);
  return (data ?? []) as PublicPhoto[];
});

/** Banners de aviso ativos e dentro do período configurado. */
export const getActiveBanners = createServerFn({ method: "GET" }).handler(async () => {
  const now = new Date().toISOString();
  const { data } = await publicClient()
    .from("banners")
    .select("id, text, image_url, button_label, link, starts_at, ends_at")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(5);
  return (data ?? [])
    .filter((b) => (!b.starts_at || b.starts_at <= now) && (!b.ends_at || b.ends_at >= now))
    .map(({ id, text, image_url, button_label, link }) => ({
      id,
      text,
      image_url,
      button_label,
      link,
    })) as PublicBanner[];
});

/** Envio de qualquer formulário do site. */
export const submitForm = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      formKey: string;
      formLabel: string;
      name: string;
      phone?: string;
      email?: string;
      message?: string;
      needsReview?: boolean;
      payload?: Record<string, string>;
    }) => data,
  )
  .handler(async ({ data }) => {
    const clean = (v: string | undefined, max: number) => (v ?? "").toString().trim().slice(0, max);
    const { error } = await publicClient()
      .from("submissions")
      .insert({
        form_key: clean(data.formKey, 60) || "desconhecido",
        form_label: clean(data.formLabel, 120),
        name: clean(data.name, 120),
        phone: clean(data.phone, 30),
        email: clean(data.email, 255),
        message: clean(data.message, 3000),
        needs_review: data.needsReview !== false,
        payload: (data.payload ?? {}) as never,
      });
    if (error) throw new Error("Não foi possível enviar agora. Tente novamente.");
    return { ok: true as const };
  });

/** Envio de pedido de oração (privado ou público, sempre com moderação). */
export const submitPrayer = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      name: string;
      phone?: string;
      email?: string;
      message: string;
      visibility: "private" | "public";
    }) => data,
  )
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("prayer_requests").insert({
      name: (data.name ?? "").trim().slice(0, 120),
      phone: (data.phone ?? "").trim().slice(0, 30),
      email: (data.email ?? "").trim().slice(0, 255),
      message: (data.message ?? "").trim().slice(0, 3000),
      visibility: data.visibility === "public" ? "public" : "private",
      status: "pending",
    });
    if (error) throw new Error("Não foi possível enviar o pedido agora.");
    return { ok: true as const };
  });

/** Pedidos públicos já aprovados pela equipe (sem dados pessoais). */
export const getPublicPrayers = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("prayer_requests")
    .select("id, name, message, prayer_count, created_at")
    .eq("visibility", "public")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(60);
  return (data ?? []) as PublicPrayer[];
});

/** "Estou orando por este pedido" — incrementa o contador. */
export const prayFor = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: count } = await supabaseAdmin.rpc("increment_prayer_count", { _id: data.id });
    return { count: Number(count ?? 0) };
  });
